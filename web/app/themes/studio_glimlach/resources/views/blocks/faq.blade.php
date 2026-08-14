@php
  $bg = $attributes->backgroundColor ?? '#F2E9DE';
  $fg = $attributes->textColor       ?? '#000000';
  $faqs = $attributes->faqs ?? [
    ['q' => 'Hoe lang duurt een fotoshoot?', 'a' => 'Een shoot duurt gemiddeld 60 tot 90 minuten.'],
    ['q' => 'Wat moeten we aantrekken?', 'a' => 'Zachte, effen kleuren in aardetinten werken het mooist.']
  ];
@endphp
<section class="section {{ $attributes->className ?? '' }}" style="background-color: {{ $bg }}; color: {{ $fg }};">
  <div class="shell">
  <div class="section-head reveal" style="justify-items: center;">
    <div class="section-num">N°06</div>
    <h2 class="section-title h-1" style="text-align: center;">{!! $attributes->heading ?? 'Veelgestelde <span class="italic">vragen</span>' !!}</h2>
    <div class="eyebrow">{{ $attributes->eyebrow ?? 'Alles op een rij' }}</div>
  </div>
  <div class="faq reveal">
    @foreach($faqs as $index => $faq)
      <div class="faq-item">
        <button class="faq-q" style="color: {{ $fg }};" onclick="this.parentElement.classList.toggle('open')">
          <span>{{ $faq['q'] }}</span>
          <span class="faq-q-plus"></span>
        </button>
        <div class="faq-a"><div class="faq-a-inner">{{ $faq['a'] }}</div></div>
      </div>
    @endforeach
  </div>
  </div>
</section>

