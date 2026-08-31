@php
  $bg      = $attributes->backgroundColor ?? '#CDD4B2';
  $fg      = $attributes->textColor       ?? '#000000';
  $reviews = $attributes->reviews         ?? [];
  $num     = $attributes->sectionNum      ?? '';
  $heading = $attributes->heading         ?? 'In hun woorden';
  $eyebrow = $attributes->eyebrow         ?? 'Klanten';
@endphp
<section class="client-reviews {{ $attributes->className ?? '' }}" style="background-color: {{ $bg }}; color: {{ $fg }};">
  <div class="shell" style="padding: 0;">
    <div class="section-head reveal" style="border-color: rgba(0,0,0,0.15);">
      @if($num)
        <div class="section-num">{{ $num }}</div>
      @endif
      <h2 class="section-title h-1">{!! $heading !!}</h2>
      <div class="eyebrow">{{ $eyebrow }}</div>
    </div>

    @if(!empty($reviews))
      <div class="cr-grid reveal">
        @foreach($reviews as $review)
          <div class="cr-card">
            @if(!empty($review['stars']))
              <div class="cr-stars" aria-label="{{ $review['stars'] }} sterren">
                @for($s = 0; $s < 5; $s++)
                  <span class="cr-star {{ $s < $review['stars'] ? 'cr-star--filled' : 'cr-star--empty' }}">★</span>
                @endfor
              </div>
            @endif
            <div class="cr-quote">{!! $review['quote'] ?? '' !!}</div>
            <div class="cr-byline">
              <span class="cr-name">{{ $review['name'] ?? '' }}</span>
              @if(!empty($review['tag']))
                <span class="cr-tag">{{ $review['tag'] }}</span>
              @endif
            </div>
          </div>
        @endforeach
      </div>
    @else
      <div class="cr-grid reveal">
        <div class="cr-card">
          <div class="cr-stars" aria-label="5 sterren">
            <span class="cr-star cr-star--filled">★</span>
            <span class="cr-star cr-star--filled">★</span>
            <span class="cr-star cr-star--filled">★</span>
            <span class="cr-star cr-star--filled">★</span>
            <span class="cr-star cr-star--filled">★</span>
          </div>
          <div class="cr-quote">Voeg reviews toe via het blok in de editor.</div>
          <div class="cr-byline">
            <span class="cr-name">Voorbeeld Klant</span>
            <span class="cr-tag">Newborn shoot</span>
          </div>
        </div>
      </div>
    @endif
  </div>
</section>
