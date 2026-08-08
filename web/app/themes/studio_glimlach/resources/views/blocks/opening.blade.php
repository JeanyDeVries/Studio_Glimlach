@php
  $bg = $attributes->backgroundColor ?? 'transparent';
  $fg = $attributes->textColor       ?? '#ffffff';
@endphp
<section class="opening {{ $attributes->className ?? '' }}" style="color: {{ $fg }};">
  @if(!empty($attributes->imageId))
    {!! wp_get_attachment_image($attributes->imageId, 'full', false, ['class' => 'opening-bg', 'alt' => '']) !!}
  @else
    <div class="opening-bg ph" style="background: {{ $bg }};"></div>
  @endif
  <div class="opening-scrim"></div>
  <div class="opening-inner">
    <div class="opening-top"></div>
    <h1 class="opening-title h-display" style="color: {{ $fg }};">
      {!! $attributes->heading ?? 'Kleine handjes, <br />gekke snoetjes <span class="script italic">&amp; echte</span> <br />lach.' !!}
    </h1>
    <div class="opening-foot">
      <p class="body-lg" style="color: {{ $fg }}; max-width: 420px; margin: 0;">
        {{ $attributes->subtext ?? 'Geen stijve houdingen, geen "moeten". Wel ruimte voor rommel, gekkigheid en die ene echte glimlach.' }}
      </p>
      <button class="btn btn-opening" onclick="document.dispatchEvent(new CustomEvent('openBookingModal'))">
        {{ $attributes->buttonText ?? 'Plan je shoot →' }}
      </button>
    </div>
  </div>
  <button class="opening-scroll-arrow" id="opening-scroll-btn" aria-label="Scroll naar beneden">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </button>
</section>
