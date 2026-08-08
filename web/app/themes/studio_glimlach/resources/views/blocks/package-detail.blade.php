@php
  $bg      = $attributes->backgroundColor ?? '#F2E9DE';
  $fg      = $attributes->textColor       ?? '#000000';
  $name    = $attributes->packageName ?? 'Fotoshoot pakket';
  $sub     = $attributes->subtitle    ?? '';
  $price   = $attributes->price       ?? '';
  $desc    = $attributes->description ?? '';
  $incl    = $attributes->includes    ?? '';
  $ctaText = $attributes->ctaText     ?? 'Plan deze shoot';
  $asideNote = $attributes->asideNote ?? 'Inclusief online galerij en twee weken recht op downloaden.';
  $asideFeatures = $attributes->asideFeatures ?? [
    'Professionele bewerking',
    'Online galerij',
    'Antwoord binnen 24u',
  ];
@endphp

<div class="pkg-detail {{ $attributes->className ?? '' }}" style="background-color: {{ $bg }}; color: {{ $fg }};">

  {{-- ── Editorial header: back link · title · subtitle · price ── --}}
  <div class="shell">
    <div class="pkg-editorial-hero">
      <a href="{{ get_home_url() }}#tarieven" class="btn-link pkg-back">← Terug naar pakketten</a>
      <h1 class="pkg-editorial-title">{{ $name }}</h1>
      @if($sub)
        <div class="eyebrow pkg-editorial-sub">{{ $sub }}</div>
      @endif
      @if($price)
        <div class="pkg-editorial-price">
          <span class="pkg-aside-price-label eyebrow">Pakketprijs</span>
          <span class="pkg-aside-price">{{ $price }}</span>
        </div>
      @endif
    </div>
  </div>

  {{-- ── Feature image — constrained width, keeps aspect ratio ── --}}
  <div class="shell">
    <div class="pkg-feature-image">
      @if(!empty($attributes->imageId))
        {!! wp_get_attachment_image($attributes->imageId, 'full', false, [
          'class' => 'pkg-feature-img',
          'alt'   => $name,
        ]) !!}
      @else
        <div class="pkg-feature-placeholder"></div>
      @endif
    </div>
  </div>

  {{-- ── Single-column body: full width ── --}}
  <div class="shell">
    <div class="pkg-body-main">
      @if($desc)
        <article class="pkg-body-text">
          {!! $desc !!}
        </article>
      @endif

      @if($incl)
        <div class="pkg-pull">✦ wat zit erin ✦</div>
        <div class="pkg-includes">
          <div class="pkg-includes-body">
            {!! $incl !!}
          </div>
        </div>
      @endif

      @if(!empty($asideFeatures))
        <div class="pkg-features-row">
          @foreach($asideFeatures as $feat)
            <span class="pkg-feature-tag">{{ $feat }}</span>
          @endforeach
        </div>
      @endif

      <div class="pkg-bottom-cta">
        <a href="{{ get_home_url() }}#tarieven" class="btn-link">← Alle pakketten</a>
        <button
          class="btn pkg-plan-btn"
          onclick="document.dispatchEvent(new CustomEvent('openBookingModal'))"
          aria-label="Plan een afspraak voor dit pakket"
        >Plan afspraak</button>
      </div>
    </div>
  </div>

</div>
