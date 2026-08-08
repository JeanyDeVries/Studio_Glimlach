<?php
/**
 * Creates the 4 shoot package detail pages with the sg/package-detail block.
 * Run with: php wp-cli.phar eval-file scripts/create-package-pages.php
 */

$pages = [
  [
    'title'  => 'Newborn shoot',
    'slug'   => 'newborn-shoot',
    'attrs'  => [
      'packageName'     => 'Newborn shoot',
      'subtitle'        => '0 – 2 weken oud',
      'price'           => '€ 295',
      'eyebrow'         => 'Fotoshoot pakket',
      'backgroundColor' => '#F2E9DE',
      'textColor'       => '#000000',
      'ctaText'         => 'Plan de newborn shoot',
      'description'     => '<p class="body-lg" style="margin-top:0">De eerste weken zijn zo bijzonder — en zo snel voorbij. Een newborn shoot legt die prille, kwetsbare fase vast op een manier die je later steeds opnieuw wilt bewaren.</p><p class="body">We komen bij jullie thuis, zodat je baby in een vertrouwde omgeving is. Geen strakke studio-sfeer, maar warme beelden met jullie persoonlijke touch: het wiegje, de kleine details, de eerste knuffels.</p><p class="body">We plannen de shoot in de eerste twee weken, wanneer baby het meest lekker slaapt en de mooiste poses mogelijk zijn. Alles gaat rustig, op het tempo van jullie kindje.</p>',
      'includes'        => '<ul><li>Shoot bij jullie thuis of in studio</li><li>1,5 uur de tijd — we nemen het rustig aan</li><li>15+ professioneel bewerkte foto\'s</li><li>Online privégalerij met downloadrecht (2 weken)</li><li>Gratis herplanning bij ziekte</li></ul>',
    ],
  ],
  [
    'title'  => 'Baby & sitter shoot',
    'slug'   => 'baby-sitter',
    'attrs'  => [
      'packageName'     => 'Baby & sitter shoot',
      'subtitle'        => '3 – 12 maanden oud',
      'price'           => '€ 245',
      'eyebrow'         => 'Fotoshoot pakket',
      'backgroundColor' => '#F2E9DE',
      'textColor'       => '#000000',
      'ctaText'         => 'Plan de baby shoot',
      'description'     => '<p class="body-lg" style="margin-top:0">Van die eerste grappige uitdrukkingen tot het trots rechtop zitten — de babytijd zit vol met kleine mijlpalen die je wilt bewaren.</p><p class="body">Deze shoot is perfect voor baby\'s van 3 maanden (lachen!) tot zo\'n 12 maanden (zittend, kruipen, misschien al staand). We fotograferen op een eenvoudige achtergrond zodat jouw kindje helemaal centraal staat.</p><p class="body">Kleding en accessoires mogen mee, maar hoeven niet. Wij zorgen voor een warme, speelse sfeer zodat die echte glimlach vanzelf komt.</p>',
      'includes'        => '<ul><li>Shoot in onze lichte studio</li><li>1 uur de tijd</li><li>12+ professioneel bewerkte foto\'s</li><li>Online privégalerij met downloadrecht (2 weken)</li><li>Kleine rekwisieten beschikbaar</li></ul>',
    ],
  ],
  [
    'title'  => 'Gezinsshoot',
    'slug'   => 'gezinsshoot',
    'attrs'  => [
      'packageName'     => 'Gezinsshoot',
      'subtitle'        => 'Alle leeftijden welkom',
      'price'           => '€ 275',
      'eyebrow'         => 'Fotoshoot pakket',
      'backgroundColor' => '#F2E9DE',
      'textColor'       => '#000000',
      'ctaText'         => 'Plan de gezinsshoot',
      'description'     => '<p class="body-lg" style="margin-top:0">Een gezinsfoto hoeft geen stijve pose te zijn. Wij zoeken naar de echte momenten — hoe jullie samen lachen, stoeien, of gewoon naast elkaar zitten.</p><p class="body">Of jullie nu buiten willen in het groen of juist thuis tussen de vertrouwde chaos — wij komen naar jullie toe. We werken met de kinderen, niet tegen ze, en dat merk je in het eindresultaat.</p><p class="body">Dit pakket is ideaal voor gezinnen van elke samenstelling en leeftijd. Van pasgeborene tot tiener: iedereen is welkom in beeld.</p>',
      'includes'        => '<ul><li>Shoot buiten of bij jullie thuis</li><li>1,5 uur de tijd</li><li>15+ professioneel bewerkte foto\'s</li><li>Online privégalerij met downloadrecht (2 weken)</li><li>Reiskosten binnen 15 km inbegrepen</li></ul>',
    ],
  ],
  [
    'title'  => 'Mini shoot',
    'slug'   => 'mini-shoot',
    'attrs'  => [
      'packageName'     => 'Mini shoot',
      'subtitle'        => 'Snel & intiem',
      'price'           => '€ 149',
      'eyebrow'         => 'Fotoshoot pakket',
      'backgroundColor' => '#F2E9DE',
      'textColor'       => '#000000',
      'ctaText'         => 'Plan de mini shoot',
      'description'     => '<p class="body-lg" style="margin-top:0">Soms wil je gewoon een paar mooie foto\'s — zonder grote productie. De mini shoot is compact, persoonlijk en betaalbaar.</p><p class="body">Perfect als verjaardagscadeau, voor een snel portret van je kleine voor het album, of gewoon omdat je even een leuke herinnering wilt vastleggen. In 30 minuten maken we samen de mooiste beelden.</p><p class="body">De mini shoot vindt altijd plaats in onze studio, zodat de tijd optimaal benut wordt. Simpel, snel en met een verrassend mooi resultaat.</p>',
      'includes'        => '<ul><li>Shoot in onze studio</li><li>30 minuten</li><li>6 professioneel bewerkte foto\'s</li><li>Online privégalerij met downloadrecht (2 weken)</li></ul>',
    ],
  ],
];

// Get the nav block content from the Home page so we reuse it
$home = get_page_by_path('home');
$nav_block = '';
if ($home) {
  foreach (parse_blocks($home->post_content) as $b) {
    if ($b['blockName'] === 'sg/navigation') {
      $nav_block = serialize_block($b);
      break;
    }
  }
}

foreach ($pages as $page) {
  // Check if page already exists
  $existing = get_page_by_path($page['slug']);
  if ($existing) {
    WP_CLI::log("⚠  Page '{$page['title']}' already exists (ID {$existing->ID}), skipping.");
    continue;
  }

  $detail_block = [
    'blockName'    => 'sg/package-detail',
    'attrs'        => $page['attrs'],
    'innerBlocks'  => [],
    'innerHTML'    => '',
    'innerContent' => [],
  ];

  $content = '';
  if ($nav_block) $content .= $nav_block . "\n";
  $content .= serialize_block($detail_block);

  $post_id = wp_insert_post([
    'post_title'   => $page['title'],
    'post_name'    => $page['slug'],
    'post_status'  => 'publish',
    'post_type'    => 'page',
    'post_content' => $content,
  ]);

  if (is_wp_error($post_id)) {
    WP_CLI::error("Failed to create '{$page['title']}': " . $post_id->get_error_message());
  } else {
    WP_CLI::success("Created '{$page['title']}' — ID {$post_id} — /{$page['slug']}");
  }
}

WP_CLI::success('All package pages processed.');
