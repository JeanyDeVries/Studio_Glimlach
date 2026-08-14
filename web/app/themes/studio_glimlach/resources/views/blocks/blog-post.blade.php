@php
  $bg         = $attributes->backgroundColor    ?? '#F2E9DE';
  $fg         = $attributes->textColor          ?? '#000000';
  $backUrl    = $attributes->backUrl            ?? '/blog';
  $backLabel  = $attributes->backLabel          ?? '← Terug naar blog';
  $category   = $attributes->category          ?? '';
  $date       = $attributes->date              ?? '';
  $title      = $attributes->title             ?? '';
  $excerpt    = $attributes->excerpt           ?? '';
  $featId     = $attributes->featureImageId    ?? null;
  $featUrl    = $attributes->featureImageUrl   ?? '';
  $gallery    = $attributes->galleryImages     ?? [];

  // Verder lezen: try new taxonomy slug first, fall back to old parent slug
  $folderSlug = $attributes->relatedFolderSlug ?? $attributes->relatedParentSlug ?? '';

  // Content blocks: support new contentBlocks + backwards-compat with old paragraphs
  $rawBlocks = $attributes->contentBlocks ?? null;
  if (empty($rawBlocks) && !empty($attributes->paragraphs)) {
    $rawBlocks = array_map(fn($p) => ['type' => 'paragraph', 'text' => $p['text'] ?? ''], (array)$attributes->paragraphs);
  }
  $contentBlocks = (array)($rawBlocks ?? []);

  // Gallery
  $hasGallery = count(array_filter((array)$gallery, fn($g) => !empty($g['id']) || !empty($g['url']))) > 0;

  // "Verder lezen" — pages tagged with the given sg_blog_folder taxonomy term
  $relatedPages = [];
  if (!empty($folderSlug)) {
    $candidates = get_posts([
      'post_type'      => 'page',
      'post_status'    => 'publish',
      'posts_per_page' => 10,
      'orderby'        => 'rand',
      'tax_query'      => [[
        'taxonomy' => 'sg_blog_folder',
        'field'    => 'slug',
        'terms'    => $folderSlug,
      ]],
    ]);
    // Exclude current page
    $currentId  = is_singular() ? get_queried_object_id() : 0;
    $candidates = array_filter($candidates, fn($p) => $p->ID !== $currentId);
    $relatedPages = array_slice(array_values($candidates), 0, 3);
  }

  /**
   * Helper: extract the feature image from a page's sg/blog-post block attributes.
   * Blog pages store their hero image in block attributes, not as a WP post thumbnail.
   */
  if (!function_exists('sg_extract_blog_feature_image')) {
    function sg_extract_blog_feature_image(int $postId): string {
      $content = get_post_field('post_content', $postId);
      // Match the sg/blog-post block comment and pull out its JSON attributes
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
      // Final fallback: WP featured image
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

<div
  class="blog-post-block {{ $attributes->className ?? '' }}"
  style="background-color: {{ $bg }}; color: {{ $fg }};"
>

  {{-- ── Hero ── --}}
  <div class="shell">
    <div class="bp-hero reveal">
      <a href="{{ $backUrl }}" class="bp-back">{{ $backLabel }}</a>

      <div class="bp-meta eyebrow">
        @if($category){{ $category }}@endif
        @if($category && $date) · @endif
        @if($date){{ $date }}@endif
      </div>

      <h1 class="bp-title h-1">{!! $title !!}</h1>

      @if($excerpt)
        <p class="bp-excerpt body-lg">{!! $excerpt !!}</p>
      @endif
    </div>
  </div>

  {{-- ── Feature image ── --}}
  <div class="bp-feature reveal">
    @if($featId)
      {!! wp_get_attachment_image($featId, 'full', false, [
        'style' => 'width:100%; height:100%; object-fit:cover;',
        'alt'   => strip_tags($title),
      ]) !!}
    @elseif($featUrl)
      <img src="{{ $featUrl }}" alt="{{ strip_tags($title) }}" style="width:100%; height:100%; object-fit:cover;" />
    @else
      <div class="ph bp-feature-placeholder">
        <div class="ph-label">{{ strtolower($category ?: 'foto') }}</div>
      </div>
    @endif
  </div>

  {{-- ── Body — mixed paragraphs, quotes & images ── --}}
  <div class="shell">
    <article class="bp-body reveal">

      @php $paraIndex = 0; @endphp

      @foreach($contentBlocks as $block)
        @php $type = $block['type'] ?? 'paragraph'; @endphp

        @if($type === 'quote')
          {{-- Pull quote in terracotta script font --}}
          <blockquote class="bp-pull">
            {!! nl2br(e($block['text'] ?? '')) !!}
          </blockquote>

        @elseif($type === 'image')
          {{-- Inline image — breaks slightly wider than text column --}}
          <figure class="bp-inline-img">
            @php $imgId = $block['imageId'] ?? null; $imgUrl = $block['imageUrl'] ?? ''; @endphp
            @if($imgId)
              {!! wp_get_attachment_image($imgId, 'large', false, [
                'style' => 'width:100%; height:auto; display:block;',
              ]) !!}
            @elseif($imgUrl)
              <img src="{{ $imgUrl }}" style="width:100%; height:auto; display:block;" />
            @endif
            @if(!empty($block['caption']))
              <figcaption class="bp-inline-caption">{{ $block['caption'] }}</figcaption>
            @endif
          </figure>

        @else
          {{-- Regular paragraph, drop-cap on the very first paragraph --}}
          <p @class(['bp-drop-cap' => $paraIndex === 0])>
            {!! nl2br(e($block['text'] ?? '')) !!}
          </p>
          @php $paraIndex++; @endphp
        @endif

      @endforeach

    </article>

    {{-- ── Gallery (after body) ── --}}
    @if($hasGallery)
      <div class="bp-gallery reveal">
        @foreach($gallery as $img)
          @if(!empty($img['id']) || !empty($img['url']))
            <div class="bp-gallery-item">
              @if(!empty($img['id']))
                {!! wp_get_attachment_image($img['id'], 'large', false, [
                  'style' => 'width:100%; height:100%; object-fit:cover;',
                ]) !!}
              @else
                <img src="{{ $img['url'] }}" style="width:100%; height:100%; object-fit:cover;" />
              @endif
            </div>
          @endif
        @endforeach
      </div>
    @endif

    {{-- ── Footer back link ── --}}
    <div class="bp-footer reveal">
      <a href="{{ $backUrl }}" class="btn-link">{{ $backLabel }}</a>
    </div>

  </div>

  {{-- ── Verder lezen ── --}}
  @if(!empty($relatedPages))
    <section class="bp-related">
      <div class="shell">
        <div class="bp-related-head reveal">
          <div class="eyebrow">Meer lezen</div>
          <h2 class="h-2">Verder <span class="script" style="color: var(--terracotta);">lezen</span></h2>
        </div>
        <div class="bp-related-grid reveal">
          @foreach($relatedPages as $rp)
            @php
              // Extract hero image from block attrs (sg/blog-post stores it there, not as WP thumbnail)
              $rThumb   = sg_extract_blog_feature_image($rp->ID);
              $rTitle   = get_the_title($rp->ID);
              $rExcerpt = get_the_excerpt($rp->ID) ?: wp_trim_words(strip_tags(get_post_field('post_content', $rp->ID)), 18);
              $rUrl     = get_permalink($rp->ID);
              $rDate    = get_the_date('j F Y', $rp->ID);
              // Try to pull category from sg_blog_folder terms
              $rTerms   = get_the_terms($rp->ID, 'sg_blog_folder');
              $rCat     = ($rTerms && !is_wp_error($rTerms)) ? $rTerms[0]->name : '';
            @endphp
            <a href="{{ $rUrl }}" class="bp-related-card">
              <div class="bp-related-img">
                @if($rThumb)
                  <img src="{{ $rThumb }}" alt="{{ esc_attr($rTitle) }}" style="width:100%; height:100%; object-fit:cover; display:block;" />
                @else
                  <div class="ph" style="width:100%;height:100%;background:var(--clay);">
                    <div class="ph-label">{{ strtolower($rTitle) }}</div>
                  </div>
                @endif
              </div>
              <div class="bp-related-info">
                <div class="eyebrow" style="margin-bottom: 10px;">
                  @if($rCat){{ $rCat }} · @endif{{ $rDate }}
                </div>
                <h3 class="bp-related-title">{{ $rTitle }}</h3>
                @if($rExcerpt)
                  <p class="bp-related-excerpt">{{ $rExcerpt }}</p>
                @endif
                <span class="bp-related-link">Lees artikel →</span>
              </div>
            </a>
          @endforeach
        </div>
      </div>
    </section>
  @endif

</div>
