{{--
  Footer section — rendered site-wide from layouts/app.blade.php.
  If the current page has an sg/footer block it is already output via
  the block render callback.  When no footer block is present (e.g. blog
  archive, 404) we render the default footer here so the site never has
  a bare bottom.
--}}
@if(!has_block('sg/footer'))
  @php
    // Default values – match the sg/footer block's attribute defaults so
    // the fallback footer looks identical to the block-rendered one.
    $attributes = (object)[
      'studioName'  => 'Studio',
      'scriptName'  => 'Glimlach',
      'tagline'     => "Fotografie voor jonge gezinnen, pasgeboren baby's en koppels. Almere en omgeving.",
      'email'       => 'hallo@studioglimlach.nl',
      'phone'       => '+31 6 12 34 56 78',
      'street'      => '',
      'zip'         => '',
      'city'        => 'Almere',
      'country'     => 'NL',
      'kvk'         => 'KvK 89234123',
      'copyTagline' => 'Gemaakt met liefde in Almere',
      'navItems'    => [
        ['label' => 'Home',      'url' => '/'],
        ['label' => 'Over ons',  'url' => '#over'],
        ['label' => 'Portfolio', 'url' => '#portfolio'],
        ['label' => 'Blog',      'url' => '/blog'],
        ['label' => 'Contact',   'url' => 'mailto:hallo@studioglimlach.nl'],
      ],
      'socials' => [
        ['platform' => 'instagram', 'label' => 'Instagram', 'handle' => '@studio.glimlach', 'url' => 'https://www.instagram.com/studio.glimlach'],
        ['platform' => 'tiktok',    'label' => 'TikTok',    'handle' => '@studioglimlach',   'url' => 'https://www.tiktok.com/@studioglimlach'],
      ],
    ];
  @endphp
  @include('blocks.footer', ['attributes' => $attributes])
@endif
