@php
  $bg         = $attributes->backgroundColor ?? '#F2E9DE';
  $fg         = $attributes->textColor       ?? '#000000';
  $heading    = $attributes->heading  ?? 'Ons <span class="italic" style="font-weight:300;">portfolio</span>';
  $eyebrow    = $attributes->eyebrow  ?? 'Alle shoots · 2024–2026';
  $ctaText    = $attributes->ctaText  ?? 'Wil je ook zulke herinneringen vastleggen?';
  $tones      = ['clay','sage','warm','cream','muted','sand','deep'];

  // Primary data structure: shoots = [{name, images:[{id,url}]}]
  $shoots = $attributes->shoots ?? [];

  // Backward-compat: if old flat images attr exists but no shoots, wrap them
  if (empty($shoots)) {
    $legacyImages = $attributes->images ?? [];
    if (!empty($legacyImages)) {
      $shoots = [['name' => '', 'images' => $legacyImages]];
    }
  }

  $hasCategories = count($shoots) > 1;
  $hasImages     = !empty($shoots) && collect($shoots)->sum(fn($s) => count($s['images'] ?? [])) > 0;
@endphp

<section
  class="pf-full {{ $attributes->className ?? '' }}"
  style="background-color: {{ $bg }}; color: {{ $fg }};"
>

  {{-- ── Header ── --}}
  <div class="shell">
    <div class="section-head reveal">
      <div class="section-num">{{ $attributes->sectionNum ?? 'N°03' }}</div>
      <h1 class="section-title h-1">{!! $heading !!}</h1>
      <div class="eyebrow">{{ $eyebrow }}</div>
    </div>

    {{-- ── Category filter pills (only when multiple shoots have names) ── --}}
    @if($hasCategories)
      <div class="pf-filters reveal">
        <button class="pf-filter active" data-filter="all">Alles</button>
        @foreach($shoots as $shoot)
          @if(!empty($shoot['name']))
            <button
              class="pf-filter"
              data-filter="{{ sanitize_title($shoot['name']) }}"
            >{{ $shoot['name'] }}</button>
          @endif
        @endforeach
      </div>
    @endif
  </div>

  {{-- ── Per-shoot masonry grids ── --}}
  @if($hasImages)
    @foreach($shoots as $si => $shoot)
      @php
        $shootImages = $shoot['images'] ?? [];
        $shootSlug   = sanitize_title($shoot['name'] ?? '');
        $shootLabel  = $shoot['name'] ?? '';
      @endphp
      <div
        class="shell pf-shoot-block reveal"
        data-shoot="{{ $shootSlug }}"
      >
        @if($shootLabel && $hasCategories)
          <div class="pf-shoot-label eyebrow">{{ $shootLabel }}</div>
        @endif

        <div class="portfolio pf-shoot-grid">
          @foreach($shootImages as $ii => $img)
            <div class="portfolio-cell">
              @if(!empty($img['id']))
                {!! wp_get_attachment_image($img['id'], 'large', false, [
                  'style'   => 'width:100%; height:auto; display:block;',
                  'loading' => 'lazy',
                ]) !!}
              @else
                <div class="ph" style="background:var(--{{ $tones[($si + $ii) % count($tones)] }}); width:100%; aspect-ratio:{{ ($ii % 3 === 1) ? '4/3' : '3/4' }};"></div>
              @endif
            </div>
          @endforeach
        </div>
      </div>
    @endforeach

  @else
    {{-- No images configured yet — show placeholder grid --}}
    <div class="shell">
      <div class="portfolio reveal">
        @for($p = 0; $p < 6; $p++)
          <div class="portfolio-cell">
            <div class="ph" style="background:var(--{{ $tones[$p % count($tones)] }}); width:100%; aspect-ratio:{{ ($p % 3 === 1) ? '4/3' : '3/4' }};"></div>
          </div>
        @endfor
      </div>
    </div>
  @endif

  {{-- ── Bottom CTA ── --}}
  <div class="shell">
    <div class="pf-full-cta reveal">
      <p class="pf-full-cta-text">{{ $ctaText }}</p>
      <button
        class="btn"
        onclick="document.dispatchEvent(new CustomEvent('openBookingModal'))"
      >Plan afspraak</button>
    </div>
  </div>

</section>

{{-- Filter JS — only injected when multiple categories exist --}}
@if($hasCategories)
<script>
(function () {
  var filters = document.querySelectorAll('.pf-filters .pf-filter');
  var blocks  = document.querySelectorAll('.pf-shoot-block');

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      blocks.forEach(function (block) {
        block.style.display =
          (filter === 'all' || block.getAttribute('data-shoot') === filter) ? '' : 'none';
      });
    });
  });
})();
</script>
@endif
