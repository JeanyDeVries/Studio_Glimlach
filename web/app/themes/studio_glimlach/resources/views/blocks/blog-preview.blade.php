@php
  $bg           = $attributes->backgroundColor ?? '#F2E9DE';
  $fg           = $attributes->textColor       ?? '#000000';
  $sectionNum   = $attributes->sectionNum      ?? '';
  $eyebrow      = $attributes->eyebrow         ?? 'Verse verhalen';
  $heading      = $attributes->heading         ?? 'Uit ons dagboek';
  $blogUrl      = $attributes->blogUrl         ?? '/blog';
  $blogLabel    = $attributes->blogLinkLabel   ?? 'Naar het blog';
  $folderSlug   = $attributes->folderSlug      ?? '';
  $count        = max(1, (int)($attributes->numberOfPosts ?? 3));

  // ── Fetch posts ──────────────────────────────────────────────────────────
  // If a Blog Map slug is given, pull tagged pages; otherwise fall back to sg_blog CPT.
  if (!empty($folderSlug)) {
    $posts = get_posts([
      'post_type'      => 'page',
      'post_status'    => 'publish',
      'posts_per_page' => $count,
      'orderby'        => 'rand',
      'tax_query'      => [[
        'taxonomy' => 'sg_blog_folder',
        'field'    => 'slug',
        'terms'    => $folderSlug,
      ]],
    ]);
    $source = 'page';
  } else {
    $posts = get_posts([
      'post_type'      => 'sg_blog',
      'post_status'    => 'publish',
      'posts_per_page' => $count,
    ]);
    $source = 'sg_blog';
  }

  /**
   * Extract the feature image URL from a page using the sg/blog-post block.
   * Those pages store their hero image in block attributes, not as a WP thumbnail.
   */
  if (!function_exists('sg_extract_blog_feature_image')) {
    function sg_extract_blog_feature_image(int $postId): string {
      $content = get_post_field('post_content', $postId);
      if (preg_match('/<!--\s*wp:sg\/blog-post\s+(\{.*?\})\s*\/-->/s', $content, $m)
        || preg_match('/<!--\s*wp:sg\/blog-post\s+(\{.*?\})\s*-->/s', $content, $m)) {
        $attrs = json_decode($m[1], true);
        if (!empty($attrs['featureImageId'])) {
          $url = wp_get_attachment_image_url((int)$attrs['featureImageId'], 'large')
               ?: wp_get_attachment_image_url((int)$attrs['featureImageId'], 'full');
          if ($url) return $url;
        }
        if (!empty($attrs['featureImageUrl'])) {
          return $attrs['featureImageUrl'];
        }
      }
      // Fallback: WP featured image
      $thumbId = get_post_thumbnail_id($postId);
      if ($thumbId) {
        return wp_get_attachment_image_url($thumbId, 'large')
             ?: wp_get_attachment_image_url($thumbId, 'full')
             ?: '';
      }
      return '';
    }
  }
@endphp

<section
  class="bsp-section section {{ $attributes->className ?? '' }}"
  style="background-color: {{ $bg }}; color: {{ $fg }};"
>
<div class="shell">

  {{-- ── Section header ── --}}
  <div class="section-head reveal">
    <div class="section-num">
      @if($sectionNum){{ $sectionNum }}@else&nbsp;@endif
    </div>
    <div>
      @if($eyebrow)
        <div class="eyebrow" style="margin-bottom: 12px;">{{ $eyebrow }}</div>
      @endif
      <h2 class="section-title h-2">{!! $heading !!}</h2>
    </div>
    <a href="{{ $blogUrl }}" class="btn-link">{{ $blogLabel }}</a>
  </div>

  {{-- ── Cards grid ── --}}
  @if(!empty($posts))
    <div class="bsp-grid reveal">
      @foreach($posts as $p)
        @php
          // For pages (sg_blog_folder source): extract image from sg/blog-post block attributes.
          // For sg_blog CPT: use the WordPress featured image.
          if ($source === 'page') {
            $pThumb = sg_extract_blog_feature_image($p->ID);
          } else {
            $pThumbId = get_post_thumbnail_id($p->ID);
            $pThumb   = $pThumbId
                          ? (wp_get_attachment_image_url($pThumbId, 'large') ?: wp_get_attachment_image_url($pThumbId, 'full'))
                          : '';
          }
          $pTitle   = get_the_title($p->ID);
          $pUrl     = get_permalink($p->ID);
          $pDate    = get_the_date('j F Y', $p->ID);
          $pExcerpt = get_the_excerpt($p->ID)
                      ?: wp_trim_words(strip_tags(get_post_field('post_content', $p->ID)), 20);

          // Category: sg_blog_category for CPT, sg_blog_folder for pages
          if ($source === 'sg_blog') {
            $pTerms = get_the_terms($p->ID, 'sg_blog_category');
          } else {
            $pTerms = get_the_terms($p->ID, 'sg_blog_folder');
          }
          $pCat = ($pTerms && !is_wp_error($pTerms)) ? $pTerms[0]->name : '';
        @endphp

        <a href="{{ $pUrl }}" class="bsp-card">
          <div class="bsp-card-img">
            @if($pThumb)
              <img src="{{ $pThumb }}" alt="{{ esc_attr($pTitle) }}" style="width:100%; height:100%; object-fit:cover; display:block;" />
            @else
              <div class="ph" style="width:100%; height:100%; background: var(--clay);">
                <div class="ph-label">{{ strtolower($pTitle) }}</div>
              </div>
            @endif
          </div>
          <div class="bsp-card-body">
            <div class="bsp-card-meta eyebrow">
              @if($pCat){{ $pCat }} · @endif{{ $pDate }}
            </div>
            <h3 class="bsp-card-title">{{ $pTitle }}</h3>
            @if($pExcerpt)
              <p class="bsp-card-excerpt">{{ $pExcerpt }}</p>
            @endif
            <span class="bsp-card-link btn-link">Lees meer →</span>
          </div>
        </a>

      @endforeach
    </div>
  @else
    <p style="color: var(--mute); text-align: center; padding: 40px 0;">
      @if($folderSlug)
        Geen pagina's gevonden met Blog Map "{{ $folderSlug }}".
      @else
        Geen blogberichten gevonden.
      @endif
    </p>
  @endif

</div>
</section>

