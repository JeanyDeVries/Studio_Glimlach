<section class="hero {{ $attributes->className ?? '' }}">
  @if(!empty($attributes->imageId))
    {!! wp_get_attachment_image($attributes->imageId, 'full', false, ['class' => 'hero-bg', 'style' => 'object-fit:cover;']) !!}
  @else
    <div class="hero-bg ph" style="background:var(--{{ $attributes->imageTone ?? 'clay' }});">
      <div class="ph-label">hero beeld · vervang door echte foto</div>
    </div>
  @endif
  
  <div class="hero-scrim"></div>
  <div class="hero-inner">
    <div class="hero-top">
      <div class="eyebrow" style="color: #fff; opacity: 0.9;">Studio — Almere & omgeving</div>
    </div>

    <h1 class="hero-title h-display">
      {!! $attributes->heading ?? 'Kleine handjes, <br />gekke snoetjes <span class="script italic">&amp; echte</span> <br />lach.' !!}
    </h1>

    <div class="hero-foot">
      <div class="body-lg" style="max-width: 460px; color: #fff; font-style: italic;">
        {!! $attributes->subtext ?? 'Geen stijve houdingen, geen "moeten". Wel ruimte voor rommel, gekkigheid en die ene echte glimlach.' !!}
      </div>
      <button class="btn btn-hero" onclick="document.dispatchEvent(new CustomEvent('openBookingModal'))">{{ $attributes->buttonText ?? 'Plan je shoot →' }}</button>
    </div>
  </div>
</section>
