@extends('layouts.app')

@section('content')
  @while(have_posts()) @php(the_post())
    @php
      $terms    = get_the_terms(get_the_ID(), 'sg_blog_category');
      $category = $terms && !is_wp_error($terms) ? $terms[0]->name : 'Persoonlijk';
      // Use the helper to find the custom block-based blog page URL.
      $backUrl  = function_exists('sg_get_blog_archive_url')
                    ? sg_get_blog_archive_url()
                    : (get_post_type_archive_link('sg_blog') ?: '/blog');
    @endphp

    <div
      class="blog-post-block"
      style="background-color: var(--sand); color: var(--ink);"
    >

      {{-- ── Hero ── --}}
      <div class="shell">
        <div class="bp-hero reveal">
          <a href="{{ $backUrl }}" class="bp-back">← Terug naar blog</a>
          <div class="bp-meta eyebrow">{{ $category }} · {{ get_the_date() }}</div>
          <h1 class="bp-title h-1">{{ get_the_title() }}</h1>
          @if(has_excerpt())
            <p class="bp-excerpt body-lg">{{ get_the_excerpt() }}</p>
          @endif
        </div>
      </div>

      {{-- ── Feature image ── --}}
      <div class="bp-feature reveal">
        @if(has_post_thumbnail())
          {!! get_the_post_thumbnail(get_the_ID(), 'full', ['style' => 'width:100%; height:100%; object-fit:cover;']) !!}
        @else
          <div class="bp-feature-placeholder ph">
            <div class="ph-label">{{ strtolower($category) }}</div>
          </div>
        @endif
      </div>

      {{-- ── Body ── --}}
      <div class="shell">
        <article class="bp-body reveal">
          @php(the_content())
        </article>

        <div class="bp-footer reveal">
          <a href="{{ $backUrl }}" class="btn-link">← Terug naar blog</a>
        </div>
      </div>

    </div>

    {{-- ── Related posts ── --}}
    @php
      $related = new WP_Query([
        'post_type'      => 'sg_blog',
        'posts_per_page' => 3,
        'post__not_in'   => [get_the_ID()],
      ]);
    @endphp
    @if($related->have_posts())
      <section class="section shell" style="border-top: 1px solid var(--line);">
        <div class="section-head reveal">
          <div class="section-num">Meer</div>
          <h2 class="section-title h-2">Verder lezen</h2>
          <a href="{{ $backUrl }}" class="btn-link">Alle berichten</a>
        </div>
        <div class="blog-preview reveal">
          @while($related->have_posts()) @php($related->the_post())
            @include('partials.blog-card')
          @endwhile
          @php(wp_reset_postdata())
        </div>
      </section>
    @endif

  @endwhile
@endsection
