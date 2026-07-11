@extends('layouts.app')

@section('content')
  @while(have_posts()) @php(the_post())
    @php
      $terms = get_the_terms(get_the_ID(), 'sg_blog_category');
      $category = $terms && !is_wp_error($terms) ? $terms[0]->name : 'Persoonlijk';
    @endphp
    
    <div class="shell">
      <div class="single-hero reveal">
        <a href="{{ get_post_type_archive_link('sg_blog') }}" class="btn-link" style="margin-bottom: 32px; display: inline-block;">← Terug naar blog</a>
        <div class="eyebrow" style="margin-bottom: 16px;">{{ $category }} · {{ get_the_date() }}</div>
        <h1 class="h-1">{{ get_the_title() }}</h1>
        @if(has_excerpt())
          <p class="body-lg" style="margin-top: 20px;">{{ get_the_excerpt() }}</p>
        @endif
      </div>

      <div class="single-feature reveal">
        @if(has_post_thumbnail())
          {!! get_the_post_thumbnail(get_the_ID(), 'full', ['style' => 'width:100%; height:100%; object-fit:cover;']) !!}
        @else
          <div class="ph" style="background:var(--clay); width:100%; height:100%;"></div>
        @endif
      </div>

      <article class="single-body reveal">
        @php(the_content())
      </article>
      
    </div>

    @php
      $related = new WP_Query([
        'post_type' => 'sg_blog',
        'posts_per_page' => 3,
        'post__not_in' => [get_the_ID()],
      ]);
    @endphp
    @if($related->have_posts())
      <section class="section shell" style="border-top: 1px solid var(--line); margin-top: 80px;">
        <div class="section-head reveal">
          <div class="section-num">Meer</div>
          <h2 class="section-title h-2">Verder lezen</h2>
          <a href="{{ get_post_type_archive_link('sg_blog') }}" class="btn-link">Alle berichten</a>
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
