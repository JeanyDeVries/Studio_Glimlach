@php
  $bg = $attributes->backgroundColor ?? '#F2E9DE';
  $fg = $attributes->textColor       ?? '#000000';
  $images = $attributes->images ?? [];
  $tones = ['clay', 'sage', 'warm', 'cream', 'muted', 'deep'];
@endphp
<section class="section shell {{ $attributes->className ?? '' }}" style="background-color: {{ $bg }}; color: {{ $fg }};">
  <div class="insta-head reveal">
    <div class="eyebrow">{{ $attributes->eyebrow ?? 'Volg ons dagelijks' }}</div>
    <a href="{{ $attributes->handleUrl ?? '#' }}" target="_blank" class="insta-handle">{{ $attributes->handleText ?? '@studio.glimlach' }}</a>
  </div>
  <div class="insta-grid reveal">
    @for ($i = 0; $i < 6; $i++)
      <div class="insta-item">
        @if(isset($images[$i]) && !empty($images[$i]['id']))
          {!! wp_get_attachment_image($images[$i]['id'], 'large', false, ['style' => 'width:100%; height:100%; object-fit:cover;']) !!}
        @else
          <div class="ph" style="background:var(--{{ $tones[$i] ?? 'clay' }}); width:100%; height:100%;">
            <div class="ph-label">Instagram {{ $i + 1 }}</div>
          </div>
        @endif
      </div>
    @endfor
  </div>
</section>
