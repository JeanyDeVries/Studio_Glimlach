@php
  $terms = get_the_terms(get_the_ID(), 'sg_blog_category');
  $category = $terms && !is_wp_error($terms) ? $terms[0]->name : 'Persoonlijk';
  $tone = get_post_meta(get_the_ID(), '_sg_tone', true) ?: 'clay';
  // Resolve featured image: try large, fall back to full
  $thumbId  = get_post_thumbnail_id(get_the_ID());
  $thumbUrl = $thumbId
                ? (wp_get_attachment_image_url($thumbId, 'large') ?: wp_get_attachment_image_url($thumbId, 'full'))
                : '';
@endphp
<article class="blog-card reveal" onclick="window.location.href='{{ get_permalink() }}'">
  <div class="blog-card-media">
    @if($thumbUrl)
      <img src="{{ $thumbUrl }}" alt="{{ esc_attr(get_the_title()) }}" style="width:100%; height:100%; object-fit:cover; display:block;" />
    @else
      <div class="ph" style="background:var(--{{ $tone }}); width:100%; height:100%;">
        <div class="ph-label">{{ strtolower(get_the_title()) }}</div>
      </div>
    @endif
  </div>
  <div class="blog-card-meta">{{ $category }} · {{ get_the_date() }}</div>
  <h3>{{ get_the_title() }}</h3>
  <p>{{ get_the_excerpt() }}</p>
</article>

