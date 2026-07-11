<header class="nav">
  <div class="nav-inner">
    <a class="nav-logo" href="{{ home_url('/') }}">
      <img src="{{ Vite::asset('resources/images/logo.webp') }}" alt="{!! $siteName !!}" />
    </a>

    <div class="nav-links">
      @if (has_nav_menu('primary_navigation'))
        <nav class="nav-primary" aria-label="{{ wp_get_nav_menu_name('primary_navigation') }}">
          {!! wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'nav-links-list', 'echo' => false]) !!}
        </nav>
      @endif
      <button class="btn" style="padding: 10px 18px; font-size: 11px;" onclick="document.dispatchEvent(new CustomEvent('openBookingModal'))">Plan afspraak</button>
    </div>
  </div>
</header>
