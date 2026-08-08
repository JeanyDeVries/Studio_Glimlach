@php
  $bg = $attributes->backgroundColor ?? '#F2E9DE';
  $fg = $attributes->textColor       ?? '#000000';
  $blog_posts = new WP_Query([
    'post_type' => 'sg_blog',
    'posts_per_page' => $attributes->numberOfPosts ?? 3,
  ]);
@endphp
<section class="section shell {{ $attributes->className ?? '' }}" style="background-color: {{ $bg }}; color: {{ $fg }};">
  <div class="section-head reveal">
    <div class="section-num">N°05</div>
    <h2 class="section-title h-1">{!! $attributes->heading ?? 'Uit ons <span class="script" style="color: var(--terracotta); font-size: 0.9em;">dagboek</span>' !!}</h2>
    <a href="{{ get_post_type_archive_link('sg_blog') }}" class="btn-link">Naar het blog</a>
  </div>
  <div class="blog-preview">
    @if($blog_posts->have_posts())
      @while($blog_posts->have_posts()) @php($blog_posts->the_post())
        @include('partials.blog-card')
      @endwhile
      @php(wp_reset_postdata())
    @else
      <p>Geen blogposts gevonden.</p>
    @endif
  </div>
</section>
