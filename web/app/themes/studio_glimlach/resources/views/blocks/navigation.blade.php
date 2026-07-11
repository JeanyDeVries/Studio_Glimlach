@php
  $navItems = $attributes->navItems ?? [];
  $logoId   = $attributes->logoId ?? null;
  $logoUrl  = $attributes->logoUrl ?? null;
  $ctaText  = $attributes->ctaText ?? 'Plan afspraak';
  $ctaUrl   = $attributes->ctaUrl ?? '';
  $ctaIsBooking = $attributes->ctaIsBooking ?? true;
@endphp

<header class="sg-nav {{ $attributes->className ?? '' }}">
  <div class="sg-nav-inner">

    {{-- Logo --}}
    <a class="sg-nav-logo" href="{{ home_url('/') }}">
      @if($logoId)
        {!! wp_get_attachment_image($logoId, 'medium', false, ['alt' => get_bloginfo('name')]) !!}
      @elseif($logoUrl)
        <img src="{{ $logoUrl }}" alt="{{ get_bloginfo('name') }}" />
      @else
        <span class="sg-nav-logo-text script">{{ get_bloginfo('name') }}</span>
      @endif
    </a>

    {{-- Navigation links --}}
    <nav class="sg-nav-links" aria-label="Hoofdnavigatie">
      <ul class="sg-nav-list">
        @foreach($navItems as $item)
          <li>
            <a href="{{ $item['url'] ?? '#' }}"
               @if(!empty($item['newTab'])) target="_blank" rel="noopener" @endif>
              {{ $item['label'] ?? '' }}
            </a>
          </li>
        @endforeach
      </ul>

      {{-- CTA Button --}}
      @if($ctaIsBooking)
        <button class="btn sg-nav-cta" onclick="document.dispatchEvent(new CustomEvent('openBookingModal'))">
          {{ $ctaText }}
        </button>
      @elseif($ctaUrl)
        <a class="btn sg-nav-cta" href="{{ $ctaUrl }}">{{ $ctaText }}</a>
      @endif
    </nav>

    {{-- Mobile hamburger --}}
    <button class="sg-nav-hamburger" id="sg-nav-toggle" aria-label="Menu openen" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>
