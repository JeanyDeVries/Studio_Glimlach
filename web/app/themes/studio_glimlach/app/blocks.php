<?php

namespace App;

add_action('init', function () {
    $blocks = [
        'navigation',
        'opening',
        'about',
        'portfolio',
        'testimonials',
        'blog-preview',
        'faq',
        'instagram',
        'cta',
        'appointment'
    ];

    foreach ($blocks as $block) {
        register_block_type("sg/{$block}", [
            'api_version' => 3,
            'render_callback' => function ($attributes, $content) use ($block) {
                // Return rendered Blade view
                return \Roots\view("blocks.{$block}", [
                    'attributes' => (object) $attributes,
                    'content' => $content
                ])->render();
            }
        ]);
    }
});

add_filter('allowed_block_types_all', function ($allowed_blocks, $editor_context) {
    return [
        'sg/navigation',
        'sg/opening',
        'sg/about',
        'sg/portfolio',
        'sg/testimonials',
        'sg/blog-preview',
        'sg/faq',
        'sg/instagram',
        'sg/cta',
        'sg/appointment'
    ];
}, 10, 2);
