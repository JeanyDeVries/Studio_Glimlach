@php
  $shootTypes = $attributes->shootTypes ?? [
    ['id' => 'newborn', 'label' => 'Newborn', 'sub' => '0 – 2 weken'],
    ['id' => 'baby', 'label' => 'Baby & sitter', 'sub' => '3 – 12 maanden'],
    ['id' => 'gezin', 'label' => 'Gezinsshoot', 'sub' => 'Alle leeftijden'],
    ['id' => 'verjaardag', 'label' => 'Eerste verjaardag', 'sub' => '11 – 14 maanden'],
    ['id' => 'zwanger', 'label' => 'Zwangerschap', 'sub' => 'Vanaf 30 weken'],
    ['id' => 'koppel', 'label' => 'Koppel', 'sub' => 'Met z\'n tweeën']
  ];
@endphp
<div id="booking-modal-container">
  <div class="modal-overlay" id="booking-modal-overlay" style="display: none;">
    <div class="modal" id="booking-modal-content" onclick="event.stopPropagation()">
      <button class="modal-close" onclick="document.dispatchEvent(new CustomEvent('closeBookingModal'))">×</button>
      <div id="booking-app" data-shoot-types="{{ esc_attr(json_encode($shootTypes)) }}" data-success-msg="{{ esc_attr($attributes->successMessage ?? 'Je hoort binnen 24 uur van ons met een bevestiging.') }}">
        <!-- Handled by app.js -->
      </div>
    </div>
  </div>
</div>
<!-- Fallback or editor notice -->
@if(is_admin())
  <div style="padding: 20px; background: #f0f0f0; border: 1px dashed #ccc;">
    <p><strong>Appointment Modal Block</strong></p>
    <p>This block adds the "Plan je shoot" modal to the page. It is hidden on the front-end until triggered.</p>
  </div>
@endif
