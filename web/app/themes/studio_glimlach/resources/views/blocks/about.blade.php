@php
  $bg = $attributes->backgroundColor ?? '#F2E9DE';
  $fg = $attributes->textColor       ?? '#000000';
@endphp
<section id="over" class="section {{ $attributes->className ?? '' }}" style="background-color: {{ $bg }}; color: {{ $fg }};">
  <div class="shell">
  <div class="section-head reveal">
    <div class="section-num">N°02</div>
    <h2 class="section-title h-1">{!! $attributes->heading ?? 'Merel <span class="script" style="color: var(--terracotta); font-size: 0.8em;">&amp;</span> Jaimy' !!}</h2>
    <div class="eyebrow">{{ $attributes->eyebrow ?? 'Het verhaal' }}</div>
  </div>

  <div class="about reveal">
    <div class="about-media">
      @if(!empty($attributes->imageId))
        {!! wp_get_attachment_image($attributes->imageId, 'large', false, ['style' => 'width:100%; height:100%; object-fit:cover;']) !!}
      @else
        <div class="ph" style="background:var(--cream); width:100%; height:100%;"></div>
      @endif
    </div>
    
    <div class="about-copy">
      {!! $attributes->content ?? '
        <p class="body-lg" style="margin-top: 0">
          Wij zijn niet alleen vriendinnen, maar inmiddels ook schoonzussen — en we delen een grote liefde voor fotografie.
        </p>
        <p class="body">
          Samen worden we het meest blij van jonge kinderen en hun gezin. Die eerste weken waarin alles nog nieuw is. De peuterjaren, waarin niets stilstaat. De manier waarop broertjes en zusjes naar elkaar kijken als ze denken dat niemand het ziet.
        </p>
        <p class="body">
          Kinderen worden zó snel groot. Daarom vinden we het belangrijk om dit nu vast te leggen. Zodat je later steeds weer kunt terugbladeren naar die kleine handjes, die gekke snoetjes en die echte lach.
        </p>
      ' !!}
      <div class="about-signature">
        <span class="script">{{ $attributes->signature ?? 'Merel & Jaimy' }}</span>
      </div>
    </div>
  </div>
  </div>
</section>

