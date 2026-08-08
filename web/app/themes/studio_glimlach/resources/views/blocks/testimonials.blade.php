@php
  $bg = $attributes->backgroundColor ?? '#CDD4B2';
  $fg = $attributes->textColor       ?? '#000000';
  $testimonials = new WP_Query([
    'post_type' => 'sg_testimonial',
    'posts_per_page' => 3,
    'orderby' => 'menu_order',
    'order' => 'ASC'
  ]);
@endphp
<section class="testimonials {{ $attributes->className ?? '' }}" style="background-color: {{ $bg }}; color: {{ $fg }};">
  <div class="shell" style="padding: 0;">
    <div class="section-head reveal" style="border-color: rgba(0,0,0,0.15);">
      <div class="section-num">N°04</div>
      <h2 class="section-title h-1">{!! $attributes->heading ?? 'In hun woorden' !!}</h2>
      <div class="eyebrow">{{ $attributes->eyebrow ?? 'Klanten' }}</div>
    </div>
    <div class="testimonial-grid reveal">
      @if($testimonials->have_posts())
        @while($testimonials->have_posts()) @php($testimonials->the_post())
          <div class="testimonial">
            <div class="testimonial-quote">{!! get_the_content() !!}</div>
            <div class="testimonial-who">{{ get_the_title() }}</div>
          </div>
        @endwhile
        @php(wp_reset_postdata())
      @else
        <div class="testimonial">
          <p class="testimonial-quote">Voeg testimonials toe via de WordPress admin.</p>
          <div class="testimonial-who">Voorbeeld Klant</div>
        </div>
      @endif
    </div>
  </div>
</section>
