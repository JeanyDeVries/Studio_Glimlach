@php
  $faqs = $attributes->faqs ?? [
    ['q' => 'Hoe lang duurt een fotoshoot?', 'a' => 'Een shoot duurt gemiddeld 60 tot 90 minuten.'],
    ['q' => 'Wat moeten we aantrekken?', 'a' => 'Zachte, effen kleuren in aardetinten werken het mooist.']
  ];
@endphp
<section class="section shell {{ $attributes->className ?? '' }}">
  <div class="section-head reveal" style="justify-items: center;">
    <div class="section-num">N°06</div>
    <h2 class="section-title h-1" style="text-align: center;">{!! $attributes->heading ?? 'Veelgestelde <span class="italic">vragen</span>' !!}</h2>
    <div class="eyebrow">{{ $attributes->eyebrow ?? 'Alles op een rij' }}</div>
  </div>
  <div class="faq reveal">
    @foreach($faqs as $index => $faq)
      <div class="faq-item">
        <button class="faq-q" onclick="this.parentElement.classList.toggle('open')">
          <span>{{ $faq['q'] }}</span>
          <span class="faq-q-plus"></span>
        </button>
        <div class="faq-a"><div class="faq-a-inner">{{ $faq['a'] }}</div></div>
      </div>
    @endforeach
  </div>
</section>
