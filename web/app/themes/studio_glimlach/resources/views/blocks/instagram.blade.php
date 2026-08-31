@php
  $bg      = $attributes->backgroundColor ?? '#F2E9DE';
  $fg      = $attributes->textColor       ?? '#000000';
  $eyebrow = $attributes->eyebrow         ?? 'Volg ons';
  $heading = $attributes->heading         ?? 'Verbinden & ontdekken';
  $tones   = ['clay', 'sage', 'warm', 'cream', 'muted', 'deep'];
  $socials = $attributes->socials ?? [];

  // Platform config: icon SVG, brand colour, display name
  $platforms = [
    'instagram' => [
      'name'  => 'Instagram',
      'color' => '#E1306C',
      'icon'  => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>',
    ],
    'tiktok' => [
      'name'  => 'TikTok',
      'color' => '#000000',
      'icon'  => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.73a4.85 4.85 0 0 1-1.01-.04z"/></svg>',
    ],
    'facebook' => [
      'name'  => 'Facebook',
      'color' => '#1877F2',
      'icon'  => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
    ],
    'pinterest' => [
      'name'  => 'Pinterest',
      'color' => '#E60023',
      'icon'  => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>',
    ],
  ];
@endphp

<section class="section socials-section {{ $attributes->className ?? '' }}" style="background-color: {{ $bg }}; color: {{ $fg }};">
  <div class="shell">

    {{-- Section header --}}
    <div class="socials-header reveal">
      <div class="eyebrow">{{ $eyebrow }}</div>
      <h2 class="h-1 socials-heading">{!! $heading !!}</h2>
    </div>

    {{-- Cards row --}}
    @if(!empty($socials))
      <div class="socials-cards reveal">
        @foreach($socials as $social)
          @php
            $platform   = $social['platform']      ?? 'instagram';
            $cfg        = $platforms[$platform]    ?? $platforms['instagram'];
            $handle     = $social['handleText']    ?? '';
            $url        = $social['handleUrl']     ?? '#';
            $images     = $social['images']        ?? [];
            $imageCount = max(0, min(4, (int)($social['imageCount'] ?? 4)));
            $followers  = $social['followerCount'] ?? '';
            $ctaText    = $social['ctaText']       ?? 'Volgen';
            $cols       = $imageCount > 0 ? (($imageCount <= 2) ? $imageCount : 2) : 0;
            $rows       = $imageCount > 0 ? ceil($imageCount / 2) : 0;
          @endphp
          <div class="social-card">

            {{-- Card header --}}
            <div class="social-card-head">
              <div class="social-card-icon" style="color: {{ $cfg['color'] }}; background: {{ $cfg['color'] }}18;">
                {!! $cfg['icon'] !!}
              </div>
              <div class="social-card-meta">
                <div class="social-card-platform">{{ $cfg['name'] }}</div>
                <div class="social-card-handle">{{ $handle }}</div>
              </div>
              @if($followers)
                <div class="social-card-followers">
                  <div class="social-card-followers-num">{{ $followers }}</div>
                  <div class="social-card-followers-label">Volgers</div>
                </div>
              @endif
            </div>

            {{-- Image grid --}}
            @if($imageCount > 0)
              <div class="social-card-grid" style="grid-template-columns: repeat({{ $cols }}, 1fr);">
                @for($i = 0; $i < $imageCount; $i++)
                  <div class="social-card-img">
                    @if(isset($images[$i]) && !empty($images[$i]['id']))
                      {!! wp_get_attachment_image($images[$i]['id'], 'medium', false, ['style' => 'width:100%;height:100%;object-fit:cover;display:block;']) !!}
                    @elseif(isset($images[$i]) && !empty($images[$i]['url']))
                      <img src="{{ $images[$i]['url'] }}" alt="" style="width:100%;height:100%;object-fit:cover;" loading="lazy" />
                    @else
                      <div class="ph" style="background:var(--{{ $tones[$i % count($tones)] }});width:100%;height:100%;"></div>
                    @endif
                  </div>
                @endfor
              </div>
            @else
              <div class="social-card-no-images"></div>
            @endif

            {{-- CTA button --}}
            <div class="social-card-foot">
              <a href="{{ $url }}" target="_blank" rel="noopener" class="social-card-btn btn-ghost btn">
                {{ $ctaText }}
              </a>
            </div>

          </div>
        @endforeach
      </div>
    @else
      {{-- Fallback empty state --}}
      <div class="socials-cards reveal">
        <div class="social-card social-card--empty">
          <p style="color:var(--mute); font-size:13px; text-align:center; margin:0;">
            Voeg sociale kanalen toe via het blok in de editor.
          </p>
        </div>
      </div>
    @endif

  </div>
</section>
