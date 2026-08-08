@php
  $bg = $attributes->backgroundColor ?? '#E1C5B0';
  $fg = $attributes->textColor       ?? '#000000';
@endphp
<section class="cta {{ $attributes->className ?? '' }}" style="background-color: {{ $bg }}; color: {{ $fg }};">
  <div class="eyebrow reveal" style="margin-bottom: 16px;">{{ $attributes->eyebrow ?? 'Afspraak maken' }}</div>
  <h2 class="h-1 reveal">{!! $attributes->heading ?? 'Laat ons <br /><span class="cta-script">jullie verhaal</span><br /> vastleggen' !!}</h2>
  <p class="cta-sub reveal">{{ $attributes->subtext ?? 'Plan een vrijblijvend kennismakingsgesprek, of boek direct een shoot. We kijken er naar uit.' }}</p>
  <div class="reveal" style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
    <button class="btn" style="border-color: {{ $fg }}; background: {{ $fg }}; color: {{ $bg }};" onclick="document.dispatchEvent(new CustomEvent('openBookingModal'))">{{ $attributes->primaryButtonText ?? 'Plan je shoot' }}</button>
    <a href="{{ $attributes->secondaryButtonUrl ?? 'mailto:hallo@studioglimlach.nl' }}" class="btn btn-ghost" style="border-color: {{ $fg }}; color: {{ $fg }};">{{ $attributes->secondaryButtonText ?? 'Stuur een mailtje' }}</a>
  </div>
</section>
