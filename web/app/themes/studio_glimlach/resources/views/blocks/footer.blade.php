@php
  /* ── Colors ──────────────────────────────────────────────────── */
  $bg = $attributes->backgroundColor ?? '#1a1612';
  $fg = $attributes->textColor       ?? '#e8e0d5';

  /* ── Studio identity ──────────────────────────────────────────── */
  $studioName   = $attributes->studioName   ?? 'Studio';
  $scriptName   = $attributes->scriptName   ?? 'Glimlach';
  $tagline      = $attributes->tagline      ?? "Fotografie voor jonge gezinnen, pasgeboren baby's en koppels. Almere en omgeving.";

  /* ── Contact ─────────────────────────────────────────────────── */
  $email        = $attributes->email        ?? 'hallo@studioglimlach.nl';
  $phone        = $attributes->phone        ?? '+31 6 12 34 56 78';

  /* ── Location ────────────────────────────────────────────────── */
  $street       = $attributes->street       ?? '';
  $zip          = $attributes->zip          ?? '';
  $city         = $attributes->city         ?? 'Almere';
  $country      = $attributes->country      ?? 'NL';

  /* ── Navigation ──────────────────────────────────────────────── */
  $navItems = $attributes->navItems ?? [
    ['label' => 'Home',      'url' => '/'],
    ['label' => 'Over ons',  'url' => '#over'],
    ['label' => 'Portfolio', 'url' => '#portfolio'],
    ['label' => 'Blog',      'url' => '/blog'],
    ['label' => 'Contact',   'url' => 'mailto:hallo@studioglimlach.nl'],
  ];

  /* ── Socials ─────────────────────────────────────────────────── */
  $socials = $attributes->socials ?? [
    ['platform' => 'instagram', 'label' => 'Instagram', 'handle' => '@studio.glimlach', 'url' => 'https://www.instagram.com/studio.glimlach'],
    ['platform' => 'tiktok',    'label' => 'TikTok',    'handle' => '@studioglimlach',   'url' => 'https://www.tiktok.com/@studioglimlach'],
  ];

  /* ── Copy bar ────────────────────────────────────────────────── */
  $kvk          = $attributes->kvk          ?? 'KvK 89234123';
  $copyTagline  = $attributes->copyTagline  ?? 'Gemaakt met liefde in Almere';

  /* ── Social SVG icons ────────────────────────────────────────── */
  $icons = [
    'instagram' => '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>',
    'tiktok'    => '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.79a4.85 4.85 0 01-1.02-.1z"/></svg>',
    'facebook'  => '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>',
    'pinterest' => '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>',
  ];
@endphp

<footer class="footer {{ $attributes->className ?? '' }}" style="background-color: {{ $bg }}; color: {{ $fg }};">
  <div class="footer-grid">

    {{-- Column 1: Studio identity --}}
    <div>
      <div class="footer-logo-text">{{ $studioName }} <span class="script">{{ $scriptName }}</span></div>
      <p class="footer-tagline">{{ $tagline }}</p>
    </div>

    {{-- Column 2: Navigation --}}
    <div>
      <h4>Menu</h4>
      <ul>
        @foreach($navItems as $item)
          <li><a href="{{ $item['url'] ?? '#' }}"{{ isset($item['newTab']) && $item['newTab'] ? ' target="_blank" rel="noopener noreferrer"' : '' }}>{{ $item['label'] ?? '' }}</a></li>
        @endforeach
      </ul>
    </div>

    {{-- Column 3: Contact + Location --}}
    <div>
      <h4>Contact</h4>
      <ul>
        @if($email)
          <li><a href="mailto:{{ $email }}">{{ $email }}</a></li>
        @endif
        @if($phone)
          <li><a href="tel:{{ preg_replace('/\s+/', '', $phone) }}">{{ $phone }}</a></li>
        @endif
      </ul>

      @if($street || $city)
        <h4 style="margin-top: 28px;">Locatie</h4>
        <ul>
          @if($street)
            <li>{{ $street }}</li>
          @endif
          @if($zip || $city)
            <li>{{ trim($zip . ' ' . $city) }}</li>
          @endif
          @if($city && $country)
            <li>{{ $city }} · {{ $country }}</li>
          @endif
        </ul>
      @endif
    </div>

    {{-- Column 4: Socials --}}
    <div>
      <h4>Volg ons</h4>
      <div class="footer-socials">
        @foreach($socials as $social)
          @php
            $platform = $social['platform'] ?? 'instagram';
            $icon = $icons[$platform] ?? $icons['instagram'];
          @endphp
          <a
            href="{{ $social['url'] ?? '#' }}"
            target="_blank"
            rel="noopener noreferrer"
            class="footer-social-item"
            data-platform="{{ $platform }}"
            aria-label="{{ $social['label'] ?? $platform }}"
          >
            <span class="footer-social-icon">{!! $icon !!}</span>
            <span class="footer-social-info">
              <span class="footer-social-label">{{ $social['label'] ?? $platform }}</span>
              <span class="footer-social-handle">{{ $social['handle'] ?? '' }}</span>
            </span>
          </a>
        @endforeach
      </div>
    </div>

  </div>

  <div class="footer-copy">
    <div>© {{ date('Y') }} {{ $studioName }} {{ $scriptName }}@if($kvk) · {{ $kvk }}@endif</div>
    <div>{{ $copyTagline }}</div>
  </div>
</footer>
