<?php

/**
 * Theme setup.
 */

namespace App;

use Illuminate\Support\Facades\Vite;

/**
 * Inject styles into the block editor.
 *
 * @return array
 */
add_filter('block_editor_settings_all', function ($settings) {
    $style = Vite::asset('resources/css/editor.css');

    $settings['styles'][] = [
        'css' => "@import url('{$style}')",
    ];

    return $settings;
});

/**
 * Inject scripts into the block editor.
 *
 * @return void
 */
add_action('enqueue_block_editor_assets', function () {
    if (Vite::isRunningHot()) {
        // In dev mode, Vite outputs a <script type="module"> which is naturally deferred
        add_action('admin_head', function () {
            echo Vite::withEntryPoints(['resources/js/editor.js'])->toHtml();
        });
        return;
    }

    // In production, enqueue as a proper WP footer script so it runs
    // AFTER wp-blocks, wp-element, etc. are already loaded.
    $dependencies = (array) json_decode(Vite::content('editor.deps.json'));

    wp_enqueue_script(
        'sg-editor',
        Vite::asset('resources/js/editor.js'),
        $dependencies,
        null,
        true // in_footer = true
    );
});

/**
 * Use the generated theme.json file.
 *
 * @return string
 */
add_filter('theme_file_path', function ($path, $file) {
    return $file === 'theme.json'
        ? public_path('build/assets/theme.json')
        : $path;
}, 10, 2);

/**
 * Disable on-demand block asset loading.
 *
 * @link https://core.trac.wordpress.org/ticket/61965
 */
add_filter('should_load_separate_core_block_assets', '__return_false');

/**
 * Register the initial theme setup.
 *
 * @return void
 */
add_action('after_setup_theme', function () {
    /**
     * Disable full-site editing support.
     *
     * @link https://wptavern.com/gutenberg-10-5-embeds-pdfs-adds-verse-block-color-options-and-introduces-new-patterns
     */
    remove_theme_support('block-templates');

    /**
     * Register the navigation menus.
     *
     * @link https://developer.wordpress.org/reference/functions/register_nav_menus/
     */
    register_nav_menus([
        'primary_navigation' => __('Primary Navigation', 'sage'),
    ]);

    /**
     * Disable the default block patterns.
     *
     * @link https://developer.wordpress.org/block-editor/developers/themes/theme-support/#disabling-the-default-block-patterns
     */
    remove_theme_support('core-block-patterns');

    /**
     * Enable plugins to manage the document title.
     *
     * @link https://developer.wordpress.org/reference/functions/add_theme_support/#title-tag
     */
    add_theme_support('title-tag');

    /**
     * Enable post thumbnail support.
     *
     * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
     */
    add_theme_support('post-thumbnails');

    /**
     * Enable responsive embed support.
     *
     * @link https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-support/#responsive-embedded-content
     */
    add_theme_support('responsive-embeds');

    /**
     * Enable HTML5 markup support.
     *
     * @link https://developer.wordpress.org/reference/functions/add_theme_support/#html5
     */
    add_theme_support('html5', [
        'caption',
        'comment-form',
        'comment-list',
        'gallery',
        'search-form',
        'script',
        'style',
    ]);

    /**
     * Enable selective refresh for widgets in customizer.
     *
     * @link https://developer.wordpress.org/reference/functions/add_theme_support/#customize-selective-refresh-widgets
     */
    add_theme_support('customize-selective-refresh-widgets');
}, 20);

/**
 * Register the theme sidebars.
 *
 * @return void
 */
add_action('widgets_init', function () {
    $config = [
        'before_widget' => '<section class="widget %1$s %2$s">',
        'after_widget' => '</section>',
        'before_title' => '<h3>',
        'after_title' => '</h3>',
    ];

    register_sidebar([
        'name' => __('Primary', 'sage'),
        'id' => 'sidebar-primary',
    ] + $config);

    register_sidebar([
        'name' => __('Footer', 'sage'),
        'id' => 'sidebar-footer',
    ] + $config);
});

/**
 * Register Custom Post Types and Taxonomies.
 */
add_action('init', function () {
    register_post_type('sg_blog', [
        'labels' => [
            'name' => __('Blog Posts', 'sage'),
            'singular_name' => __('Blog Post', 'sage'),
        ],
        'public' => true,
        'has_archive' => true,
        'rewrite' => ['slug' => 'blog'],
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'author'],
        'show_in_rest' => true,
    ]);

    register_taxonomy('sg_blog_category', 'sg_blog', [
        'labels' => [
            'name' => __('Blog Categories', 'sage'),
            'singular_name' => __('Blog Category', 'sage'),
        ],
        'public' => true,
        'hierarchical' => true,
        'show_in_rest' => true,
    ]);

    // Blog Map — tags pages so they appear in "Verder lezen" sections.
    // Create a term (e.g. "blogposts") and assign it to any page you want
    // to show as a "read more" suggestion in the blog-post block.
    register_taxonomy('sg_blog_folder', 'page', [
        'labels' => [
            'name'                       => __('Blog Mappen', 'sage'),
            'singular_name'              => __('Blog Map', 'sage'),
            'add_new_item'               => __('Nieuwe map toevoegen', 'sage'),
            'new_item_name'              => __('Mapnaam', 'sage'),
            'search_items'               => __('Mappen zoeken', 'sage'),
            'all_items'                  => __('Alle mappen', 'sage'),
            'edit_item'                  => __('Map bewerken', 'sage'),
            'update_item'                => __('Map bijwerken', 'sage'),
            'add_or_remove_items'        => __('Toevoegen of verwijderen', 'sage'),
            'choose_from_most_used'      => __('Meest gebruikt', 'sage'),
        ],
        'public'            => false,
        'show_ui'           => true,
        'show_in_rest'      => true,    // makes it appear in Gutenberg sidebar
        'hierarchical'      => true,    // true = checkboxes in editor, false = tag input
        'show_in_nav_menus' => false,
        'show_admin_column' => true,    // shows the column in Pages list
        'rewrite'           => false,
    ]);


    register_post_type('sg_testimonial', [
        'labels' => [
            'name' => __('Testimonials', 'sage'),
            'singular_name' => __('Testimonial', 'sage'),
        ],
        'public' => false,
        'show_ui' => true,
        'supports' => ['title', 'editor', 'custom-fields'],
        'show_in_rest' => true,
    ]);

    register_post_type('sg_appointment', [
        'labels' => [
            'name' => __('Appointments', 'sage'),
            'singular_name' => __('Appointment', 'sage'),
        ],
        'public' => false,
        'show_ui' => true,
        'supports' => ['title'],
        'show_in_rest' => false,
    ]);
});

/**
 * Helper: find the URL of the page using the sg/blog-archive block.
 * Falls back to the native CPT archive URL.
 */
function sg_get_blog_archive_url(): string {
    // Check transient cache first (1 hour) to avoid repeated DB queries
    $cached = get_transient('sg_blog_archive_url');
    if ($cached) return $cached;

    $pages = get_posts([
        'post_type'      => 'page',
        'posts_per_page' => 1,
        'post_status'    => 'publish',
        's'              => 'sg/blog-archive',
    ]);

    if ($pages) {
        $url = get_permalink($pages[0]->ID);
    } else {
        // Fallback: search post content directly
        global $wpdb;
        $page_id = $wpdb->get_var(
            "SELECT ID FROM {$wpdb->posts}
             WHERE post_status = 'publish'
             AND post_type = 'page'
             AND post_content LIKE '%sg/blog-archive%'
             LIMIT 1"
        );
        $url = $page_id ? get_permalink($page_id) : get_post_type_archive_link('sg_blog');
    }

    set_transient('sg_blog_archive_url', $url, HOUR_IN_SECONDS);
    return $url ?: get_post_type_archive_link('sg_blog');
}

/**
 * Redirect the native CPT archive (/blog/) to the custom block page.
 * This prevents the broken-logo legacy header from appearing.
 */
add_action('template_redirect', function () {
    if (!is_post_type_archive('sg_blog')) return;

    global $wpdb;
    $page_id = $wpdb->get_var(
        "SELECT ID FROM {$wpdb->posts}
         WHERE post_status = 'publish'
         AND post_type = 'page'
         AND post_content LIKE '%sg/blog-archive%'
         LIMIT 1"
    );

    if ($page_id) {
        wp_redirect(get_permalink($page_id), 301);
        exit;
    }
});

/**
 * Clear the blog archive URL cache whenever a page is saved,
 * so the redirect stays current if the slug or page changes.
 */
add_action('save_post_page', function () {
    delete_transient('sg_blog_archive_url');
});
