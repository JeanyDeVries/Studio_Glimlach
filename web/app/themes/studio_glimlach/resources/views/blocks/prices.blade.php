@php
  $packages = $attributes->packages ?? [
    ['name' => 'Newborn shoot', 'sub' => '0 – 2 weken', 'price' => '€ 295', 'includes' => 'Thuis of in studio · 1,5 uur · 15+ bewerkte foto\'s'],
    ['name' => 'Baby & sitter', 'sub' => '3 – 12 maanden', 'price' => '€ 245', 'includes' => 'Studio · 1 uur · 12+ bewerkte foto\'s'],
    ['name' => 'Gezinsshoot', 'sub' => 'Alle leeftijden', 'price' => '€ 275', 'includes' => 'Buiten of thuis · 1,5 uur · 15+ bewerkte foto\'s'],
    ['name' => 'Mini shoot', 'sub' => 'Snel & intiem', 'price' => '€ 149', 'includes' => 'Studio · 30 min · 6 bewerkte foto\'s'],
  ];
@endphp
<section id="tarieven" class="section shell prices-section {{ $attributes->className ?? '' }}">
  <div class="section-head reveal">
    <div class="section-num">{{ $attributes->sectionNum ?? 'N°04' }}</div>
    <h2 class="section-title h-1">{!! $attributes->heading ?? 'Onze <span class="italic">tarieven</span>' !!}</h2>
    <div class="eyebrow">{{ $attributes->eyebrow ?? 'Transparante prijzen' }}</div>
  </div>

  <div class="prices-grid reveal">
    @foreach($packages as $i => $pkg)
      <div class="price-card">
        <div class="price-card-top">
          <div class="price-card-name h-3">{{ $pkg['name'] }}</div>
          <div class="price-card-sub eyebrow">{{ $pkg['sub'] }}</div>
        </div>
        <div class="price-card-amount">{{ $pkg['price'] }}</div>
        <div class="price-card-includes">{{ $pkg['includes'] }}</div>
        <div class="price-card-cta">
          <button class="btn-link open-booking">Plan een shoot →</button>
        </div>
      </div>
    @endforeach
  </div>

  @if(!empty($attributes->note))
    <p class="prices-note reveal">{{ $attributes->note }}</p>
  @else
    <p class="prices-note reveal">Alle prijzen zijn inclusief online galerij en twee weken recht op downloaden. Reiskosten buiten een straal van 15 km worden apart besproken.</p>
  @endif
</section>
