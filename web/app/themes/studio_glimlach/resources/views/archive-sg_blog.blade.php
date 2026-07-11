@extends('layouts.app')

@section('content')
  <header class="blog-hero">
    <div class="eyebrow">Ons dagboek</div>
    <h1 class="h-1" style="margin-top: 12px;">
      Verhalen uit <br />
      <span class="script">de studio</span>
    </h1>
    <p class="body-lg" style="max-width: 580px; margin: 20px auto 0;">
      Shoot-verhalen, persoonlijke stukken en kleine dingen die we onderweg meemaken.
    </p>
    <div class="blog-filters">
      <a href="{{ get_post_type_archive_link('sg_blog') }}" class="blog-filter {{ !is_tax('sg_blog_category') ? 'active' : '' }}">Alles</a>
      @php
        $categories = get_terms(['taxonomy' => 'sg_blog_category', 'hide_empty' => true]);
      @endphp
      @foreach($categories as $category)
        <a href="{{ get_term_link($category) }}" class="blog-filter {{ is_tax('sg_blog_category', $category->term_id) ? 'active' : '' }}">{{ $category->name }}</a>
      @endforeach
    </div>
  </header>

  <div class="shell">
    <div class="blog-archive reveal">
      @if (!have_posts())
        <div style="grid-column: 1 / -1; text-align: center;">Geen verhalen gevonden.</div>
      @endif

      @while(have_posts()) @php(the_post())
        @include('partials.blog-card')
      @endwhile
    </div>
    
    <div style="text-align: center; margin-bottom: 80px;">
      {!! get_the_posts_navigation() !!}
    </div>
  </div>
@endsection
