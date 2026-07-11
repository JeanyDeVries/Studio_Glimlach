<section class="opening {{ $attributes->className ?? '' }}">
  @if(!empty($attributes->imageId))
    {!! wp_get_attachment_image($attributes->imageId, 'full', false, ['class' => 'opening-bg', 'style' => 'object-fit:cover;']) !!}
  @else
    <div class="opening-bg ph" style="background:var(--{{ $attributes->imageTone ?? 'clay' }});">
      <div class="ph-label">opening beeld · vervang door echte foto</div>
    </div>
  @endif

  <div class="opening-scrim"></div>
  <div class="opening-inner">
    <div class="opening-top">
      <div class="eyebrow" style="color: #fff; opacity: 0.9;">Studio — Almere & omgeving</div>
    </div>

    <h1 class="opening-title h-display">
      {!! $attributes->heading ?? 'Kleine handjes, <br />gekke snoetjes <span class="script italic">&amp; echte</span> <br />lach.' !!}
    </h1>

    <div class="opening-foot">
      <div class="body-lg" style="max-width: 460px; color: #fff; font-style: italic;">
        {!! $attributes->subtext ?? 'Geen stijve houdingen, geen "moeten". Wel ruimte voor rommel, gekkigheid en die ene echte glimlach.' !!}
      </div>
      <button class="btn btn-opening" onclick="document.dispatchEvent(new CustomEvent('openBookingModal'))">{{ $attributes->buttonText ?? 'Plan je shoot →' }}</button>
    </div>
  </div>

  {{-- Scroll-down arrow --}}
  <button class="opening-scroll-arrow" id="opening-scroll-btn" aria-label="Scroll naar beneden">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5v14M5 13l7 7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</section>
