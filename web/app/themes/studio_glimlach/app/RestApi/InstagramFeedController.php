<?php

namespace App\RestApi;

use WP_REST_Request;
use WP_REST_Response;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Instagram Graph API Feed
 * ─────────────────────────────────────────────────────────────────────────────
 * • Fetches the latest posts from any connected Instagram account
 *   (personal, creator, or business — all work with Instagram Login)
 * • Caches results for 24 h using the WordPress Transients API
 * • Auto-refreshes the long-lived token when it is within 7 days of expiry
 * • Exposes GET /wp-json/sg/v1/instagram-feed (for JS use if ever needed)
 *
 * One-time setup:
 *   1. Create a Meta App at developers.facebook.com
 *   2. Add the "Instagram API with Instagram Login" product (any account type)
 *   3. Link your Instagram account and generate a long-lived user access token
 *   4. Paste the token in WP Admin → Settings → SG Socials
 */

// ─── Constants ───────────────────────────────────────────────────────────────

define('SG_IG_OPTION_TOKEN',        'sg_instagram_access_token');
define('SG_IG_OPTION_TOKEN_EXPIRY', 'sg_instagram_token_expiry');
define('SG_IG_OPTION_USER_ID',      'sg_instagram_user_id');
define('SG_IG_TRANSIENT_FEED',      'sg_instagram_feed');
define('SG_IG_TRANSIENT_TTL',       DAY_IN_SECONDS);       // 24 h cache
define('SG_IG_TOKEN_REFRESH_DAYS',  7);                    // refresh if < 7 days left
define('SG_IG_API_BASE',            'https://graph.instagram.com/v21.0');

// ─── REST Endpoints ───────────────────────────────────────────────────────────

add_action('rest_api_init', function () {
    // Public: let JS fetch the cached feed if needed
    register_rest_route('sg/v1', '/instagram-feed', [
        'methods'             => 'GET',
        'callback'            => __NAMESPACE__ . '\\rest_get_instagram_feed',
        'permission_callback' => '__return_true',
    ]);

    // Admin only: force a cache refresh
    register_rest_route('sg/v1', '/instagram-feed/refresh', [
        'methods'             => 'POST',
        'callback'            => __NAMESPACE__ . '\\rest_refresh_instagram_feed',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        },
    ]);
});

function rest_get_instagram_feed(WP_REST_Request $request): WP_REST_Response
{
    $limit = (int) ($request->get_param('limit') ?? 4);
    $feed  = sg_get_instagram_feed($limit);

    if (is_wp_error($feed)) {
        return new WP_REST_Response(['error' => $feed->get_error_message()], 502);
    }

    return new WP_REST_Response($feed, 200);
}

function rest_refresh_instagram_feed(WP_REST_Request $request): WP_REST_Response
{
    delete_transient(SG_IG_TRANSIENT_FEED);
    $feed = sg_get_instagram_feed(12, true);

    if (is_wp_error($feed)) {
        return new WP_REST_Response(['error' => $feed->get_error_message()], 502);
    }

    return new WP_REST_Response([
        'success' => true,
        'count'   => count($feed),
        'items'   => $feed,
    ], 200);
}

// ─── Core Feed Function ───────────────────────────────────────────────────────

/**
 * Get the cached Instagram feed, fetching from the API if the cache is stale.
 *
 * @param  int  $limit   Number of posts to return (max 12).
 * @param  bool $force   Skip the cache and always fetch fresh.
 * @return array|\WP_Error
 */
function sg_get_instagram_feed(int $limit = 4, bool $force = false)
{
    if (!$force) {
        $cached = get_transient(SG_IG_TRANSIENT_FEED);
        if (false !== $cached) {
            return array_slice($cached, 0, $limit);
        }
    }

    $token = get_option(SG_IG_OPTION_TOKEN, '');
    if (empty($token)) {
        return new \WP_Error('no_token', 'No Instagram access token configured.');
    }

    // Refresh the token if it is close to expiry
    sg_maybe_refresh_instagram_token($token);

    // Re-read in case it was just refreshed
    $token = get_option(SG_IG_OPTION_TOKEN, $token);

    // Fetch up to 12 IMAGE/VIDEO posts (cache all, slice on demand)
    $url = add_query_arg([
        'fields'       => 'id,media_type,media_url,thumbnail_url,permalink,timestamp',
        'limit'        => 12,
        'access_token' => $token,
    ], SG_IG_API_BASE . '/me/media');

    $response = wp_remote_get($url, ['timeout' => 15]);

    if (is_wp_error($response)) {
        return $response;
    }

    $code = wp_remote_retrieve_response_code($response);
    $body = json_decode(wp_remote_retrieve_body($response), true);

    if ($code !== 200 || empty($body['data'])) {
        $msg = $body['error']['message'] ?? "API returned HTTP $code";
        return new \WP_Error('api_error', $msg);
    }

    // Normalise: use thumbnail for video, skip items with no image URL
    $posts = [];
    foreach ($body['data'] as $item) {
        $type     = $item['media_type'] ?? '';
        $imageUrl = $item['media_url'] ?? '';

        if ($type === 'VIDEO') {
            $imageUrl = $item['thumbnail_url'] ?? $imageUrl;
        }

        if (empty($imageUrl)) continue;

        $posts[] = [
            'id'        => $item['id'],
            'url'       => $item['permalink'] ?? '#',
            'image_url' => $imageUrl,
            'timestamp' => $item['timestamp'] ?? '',
            'type'      => $type,
        ];
    }

    // Cache for 24 h
    set_transient(SG_IG_TRANSIENT_FEED, $posts, SG_IG_TRANSIENT_TTL);

    return array_slice($posts, 0, $limit);
}

// ─── Token Refresh ────────────────────────────────────────────────────────────

/**
 * If the stored token expires within SG_IG_TOKEN_REFRESH_DAYS days,
 * request a refreshed long-lived token from Meta and update the stored value.
 */
function sg_maybe_refresh_instagram_token(string $token): void
{
    $expiry = (int) get_option(SG_IG_OPTION_TOKEN_EXPIRY, 0);
    $cutoff = time() + (SG_IG_TOKEN_REFRESH_DAYS * DAY_IN_SECONDS);

    if ($expiry > $cutoff) {
        return; // Token has plenty of time left
    }

    $url = add_query_arg([
        'grant_type'   => 'ig_refresh_token',
        'access_token' => $token,
    ], 'https://graph.instagram.com/refresh_access_token');

    $response = wp_remote_get($url, ['timeout' => 10]);

    if (is_wp_error($response)) return;

    $code = wp_remote_retrieve_response_code($response);
    $body = json_decode(wp_remote_retrieve_body($response), true);

    if ($code === 200 && !empty($body['access_token'])) {
        $expires_in = (int) ($body['expires_in'] ?? (60 * DAY_IN_SECONDS));
        update_option(SG_IG_OPTION_TOKEN,        $body['access_token']);
        update_option(SG_IG_OPTION_TOKEN_EXPIRY, time() + $expires_in);
    }
}

// ─── Admin Settings Page ──────────────────────────────────────────────────────

add_action('admin_menu', function () {
    add_options_page(
        'Studio Glimlach Socials',
        'SG Socials',
        'manage_options',
        'sg-socials-settings',
        __NAMESPACE__ . '\\render_socials_settings_page'
    );
});

add_action('admin_init', function () {
    register_setting('sg_socials_settings', SG_IG_OPTION_TOKEN, [
        'sanitize_callback' => 'sanitize_text_field',
    ]);
});

function render_socials_settings_page(): void
{
    if (!current_user_can('manage_options')) return;

    $refresh_message = '';

    // Handle manual feed refresh
    if (isset($_POST['sg_refresh_feed']) && check_admin_referer('sg_refresh_feed_nonce')) {
        delete_transient(SG_IG_TRANSIENT_FEED);
        $feed = sg_get_instagram_feed(12, true);
        if (is_wp_error($feed)) {
            $refresh_message = '<div class="notice notice-error"><p>Fout bij ophalen: ' . esc_html($feed->get_error_message()) . '</p></div>';
        } else {
            $refresh_message = '<div class="notice notice-success"><p>' . count($feed) . ' berichten opgehaald en gecached voor 24 uur.</p></div>';
        }
    }

    // Handle token save
    if (isset($_POST['sg_save_token']) && check_admin_referer('sg_save_token_nonce')) {
        $new_token = sanitize_text_field($_POST[SG_IG_OPTION_TOKEN] ?? '');
        // Don't overwrite with the masked display value
        if (!empty($new_token) && !str_contains($new_token, '••••')) {
            update_option(SG_IG_OPTION_TOKEN, $new_token);
            delete_option(SG_IG_OPTION_TOKEN_EXPIRY);

            // Verify token & grab username
            $info_url  = add_query_arg([
                'fields'       => 'id,username',
                'access_token' => $new_token,
            ], SG_IG_API_BASE . '/me');
            $info_resp = wp_remote_get($info_url, ['timeout' => 10]);

            if (!is_wp_error($info_resp) && wp_remote_retrieve_response_code($info_resp) === 200) {
                $info = json_decode(wp_remote_retrieve_body($info_resp), true);
                update_option(SG_IG_OPTION_USER_ID,       $info['id'] ?? '');
                update_option(SG_IG_OPTION_TOKEN_EXPIRY,  time() + (60 * DAY_IN_SECONDS));
                delete_transient(SG_IG_TRANSIENT_FEED);
                $refresh_message .= '<div class="notice notice-success"><p>Token opgeslagen. Verbonden als: <strong>@' . esc_html($info['username'] ?? 'onbekend') . '</strong></p></div>';
            } else {
                $body_raw = wp_remote_retrieve_body($info_resp ?? []);
                $body_arr = json_decode($body_raw, true);
                $err      = $body_arr['error']['message'] ?? 'Ongeldig token of API-fout';
                $refresh_message .= '<div class="notice notice-error"><p>Token fout: ' . esc_html($err) . '</p></div>';
            }
        }
    }

    $token        = get_option(SG_IG_OPTION_TOKEN, '');
    $expiry       = (int) get_option(SG_IG_OPTION_TOKEN_EXPIRY, 0);
    $cached_feed  = get_transient(SG_IG_TRANSIENT_FEED);
    $expiry_label = $expiry ? date('d-m-Y', $expiry) : '—';
    $days_left    = $expiry ? max(0, (int) round(($expiry - time()) / DAY_IN_SECONDS)) : 0;

    ?>
    <div class="wrap">
        <h1>Studio Glimlach — Socials Instellingen</h1>

        <?php echo $refresh_message; ?>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:900px;margin-top:20px;">

            <!-- Token Card -->
            <div style="background:#fff;border:1px solid #ddd;border-radius:8px;padding:24px;">
                <h2 style="margin-top:0;">📸 Instagram Toegangstoken</h2>
                <p style="color:#666;font-size:13px;">
                    Plak hier je <strong>long-lived access token</strong> van het Meta Developer Portal.
                    Werkt met <strong>elk type Instagram account</strong> — ook een persoonlijk account.
                    Tokens zijn ~60 dagen geldig en worden automatisch vernieuwd.
                </p>

                <form method="post" action="">
                    <?php wp_nonce_field('sg_save_token_nonce'); ?>
                    <table class="form-table">
                        <tr>
                            <th scope="row"><label for="<?= SG_IG_OPTION_TOKEN ?>">Access Token</label></th>
                            <td>
                                <input
                                    type="text"
                                    id="<?= SG_IG_OPTION_TOKEN ?>"
                                    name="<?= SG_IG_OPTION_TOKEN ?>"
                                    value="<?= esc_attr($token ? substr($token, 0, 20) . '••••••••' : '') ?>"
                                    class="regular-text"
                                    placeholder="IGQVJxxxxxx..."
                                    autocomplete="off"
                                />
                                <p class="description">
                                    Token verloopt op: <strong><?= $expiry_label ?></strong>
                                    <?php if ($days_left > 0): ?>
                                        (nog <?= $days_left ?> dag<?= $days_left !== 1 ? 'en' : '' ?>)
                                    <?php endif; ?>
                                </p>
                            </td>
                        </tr>
                    </table>
                    <input type="hidden" name="sg_save_token" value="1" />
                    <?php submit_button('Token opslaan', 'primary', 'submit', false); ?>
                </form>
            </div>

            <!-- Status Card -->
            <div style="background:#fff;border:1px solid #ddd;border-radius:8px;padding:24px;">
                <h2 style="margin-top:0;">📊 Feed Status</h2>

                <?php if ($cached_feed !== false): ?>
                    <p>
                        <span style="color:#46b450;font-size:16px;">●</span>
                        Cache actief — <strong><?= count($cached_feed) ?></strong> berichten gecached
                    </p>
                    <p style="color:#666;font-size:13px;">
                        Cache verloopt automatisch na 24 uur. Gebruik de knop hieronder om handmatig te vernieuwen.
                    </p>
                <?php else: ?>
                    <p>
                        <span style="color:#dc3232;font-size:16px;">●</span>
                        Geen cache — berichten worden opgehaald bij het volgende paginabezoek.
                    </p>
                <?php endif; ?>

                <?php if (!empty($token)): ?>
                    <form method="post" action="" style="margin-top:16px;">
                        <?php wp_nonce_field('sg_refresh_feed_nonce'); ?>
                        <input type="hidden" name="sg_refresh_feed" value="1" />
                        <?php submit_button('Feed nu vernieuwen', 'secondary', 'submit', false); ?>
                    </form>
                <?php else: ?>
                    <p style="color:#dc3232;font-size:13px;">⚠ Stel eerst een access token in.</p>
                <?php endif; ?>

                <hr style="margin:20px 0;" />
                <h3 style="font-size:14px;margin-bottom:8px;">Instructies (eenmalig)</h3>
                <ol style="font-size:13px;color:#444;padding-left:16px;">
                    <li>Ga naar <a href="https://developers.facebook.com" target="_blank">developers.facebook.com</a></li>
                    <li>Maak een App aan → voeg <em>Instagram API with Instagram Login</em> toe</li>
                    <li>Koppel je Instagram account (persoonlijk, creator of business — alles werkt)</li>
                    <li>Genereer een <em>long-lived user access token</em></li>
                    <li>Plak het token hierboven en sla op</li>
                </ol>
            </div>

        </div>
    </div>
    <?php
}
