@php
  $bg      = $attributes->backgroundColor ?? '#F2E9DE';
  $fg      = $attributes->textColor       ?? '#000000';
  $eyebrow = $attributes->eyebrow         ?? 'Jouw shoot';
  $subtext = $attributes->subtext         ?? 'Plan een shoot en wij zorgen voor de rest. Van voorbereiding tot eindresultaat — helemaal op maat.';
  $btnText = $attributes->buttonText      ?? 'Plan je shoot';
@endphp

<section
  class="cf-section section {{ $attributes->className ?? '' }}"
  style="background-color: {{ $bg }}; color: {{ $fg }};"
>
  <div class="shell">
    <div class="eyebrow cf-eyebrow reveal">{{ $eyebrow }}</div>

    <h2 class="cf-title reveal">
      Laat ons <span class="cf-script">jullie verhaal</span> vastleggen
    </h2>

    <p class="cf-sub reveal">{{ $subtext }}</p>

    <div class="reveal">
      <button
        class="btn"
        style="border-color: {{ $fg }}; background: {{ $fg }}; color: {{ $bg }};"
        onclick="document.dispatchEvent(new CustomEvent('openBookingModal'))"
      >{{ $btnText }}</button>
    </div>
  </div>
</section>
