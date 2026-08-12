@php
  $bg = $attributes->backgroundColor ?? '#F2E9DE';
  $fg = $attributes->textColor       ?? '#000000';
@endphp
<section id="portfolio" class="section shell {{ $attributes->className ?? '' }}" style="background-color: {{ $bg }}; color: {{ $fg }}; padding-top: 0;">
  <div class="section-head reveal">
    <div class="section-num">N°03</div>
    <h2 class="section-title h-1">{!! $attributes->heading ?? 'Recent <span class="italic" style="font-weight: 300;">werk</span>' !!}</h2>
    <div class="eyebrow">{{ $attributes->eyebrow ?? 'Portfolio · 2025–2026' }}</div>
  </div>

  <div class="portfolio reveal">
    @php
      $images = $attributes->images ?? [];
      $count  = max(1, min(12, intval($attributes->numberOfImages ?? 6)));
      $tones  = ['clay', 'sage', 'warm', 'cream', 'muted', 'sand', 'deep', 'sage', 'clay', 'sage', 'warm', 'cream'];
    @endphp

    @for ($i = 0; $i < $count; $i++)
      <div class="p{{ $i + 1 }} portfolio-cell">
        @if(isset($images[$i]) && !empty($images[$i]['id']))
          {!! wp_get_attachment_image($images[$i]['id'], 'large', false, ['style' => 'width:100%; height:auto; display:block;']) !!}
        @else
          <div class="ph" style="background:var(--{{ $tones[$i] ?? 'clay' }}); width:100%; aspect-ratio: {{ ($i % 2 === 0) ? '3/4' : '4/3' }};"></div>
        @endif
      </div>
    @endfor
  </div>

  <div class="portfolio-foot">
    <a href="{{ $attributes->buttonUrl ?? '#' }}" class="btn-ghost btn">{{ $attributes->buttonText ?? 'Bekijk het hele portfolio' }}</a>
  </div>
</section>

<div class="divider-script reveal">— een glimlach zegt alles —</div>
