@php
  $bg         = $attributes->backgroundColor ?? '#F2E9DE';
  $fg         = $attributes->textColor       ?? '#000000';
  $eyebrow    = $attributes->eyebrow ?? 'Ons dagboek';
  $heading    = $attributes->heading ?? 'Verhalen uit <br /><span class="script" style="color: var(--terracotta);">de studio</span>';
  $subtext    = $attributes->subtext ?? 'Shoot-verhalen, persoonlijke stukken en kleine dingen die we onderweg meemaken.';
  $categories = $attributes->categories ?? [];

  // Flatten all posts into one list, tagging each with its categoryKey for filtering
  $allPosts = [];
  foreach ($categories as $cat) {
    foreach (($cat['posts'] ?? []) as $post) {
      $allPosts[] = array_merge($post, ['categoryKey' => $cat['key'] ?? '']);
    }
  }

  $hasCategories = count($categories) > 1;
@endphp

<div
  class="blog-archive-block {{ $attributes->className ?? '' }}"
  style="background-color: {{ $bg }}; color: {{ $fg }};"
>

  {{-- ── Hero header — mirrors the example site exactly ── --}}
  <header class="blog-hero">
    <div class="eyebrow">{{ $eyebrow }}</div>
    <h1 class="h-1">{!! $heading !!}</h1>
    @if($subtext)
      <p class="body-lg">{!! $subtext !!}</p>
    @endif

    {{-- ── Category filter pills ── --}}
    @if($hasCategories)
      <div class="blog-filters">
        <button class="blog-filter active" data-filter="all" id="blog-filter-all">Alles</button>
        @foreach($categories as $cat)
          @if(!empty($cat['key']))
            <button
              class="blog-filter"
              data-filter="{{ $cat['key'] }}"
              id="blog-filter-{{ $cat['key'] }}"
            >{{ $cat['label'] ?? $cat['key'] }}</button>
          @endif
        @endforeach
      </div>
    @endif
  </header>

  {{-- ── Post grid ── --}}
  <div class="shell">
    <div class="blog-archive reveal" id="blog-grid">
      @forelse($allPosts as $post)
        @php
          $postUrl  = !empty($post['url']) ? $post['url'] : '#';
          $hasImage = !empty($post['imageId']);
          $tone     = $post['tone'] ?? 'clay';
          $catKey   = $post['categoryKey'] ?? '';
          $tag      = $post['tag'] ?? '';
          $date     = $post['date'] ?? '';
        @endphp
        <article
          class="blog-card"
          data-cat="{{ $catKey }}"
          onclick="window.location.href='{{ $postUrl }}'"
          style="cursor: pointer;"
        >
          <div class="blog-card-media">
            @if($hasImage)
              {!! wp_get_attachment_image($post['imageId'], 'large', false, [
                'style' => 'width:100%; height:100%; object-fit:cover;',
              ]) !!}
            @else
              <div class="ph" style="background:var(--{{ $tone }}); width:100%; height:100%;">
                <div class="ph-label">{{ strtolower($post['title'] ?? '') }}</div>
              </div>
            @endif
          </div>
          <div class="blog-card-meta">{{ $tag }}{{ $tag && $date ? ' · ' : '' }}{{ $date }}</div>
          <h3>{{ $post['title'] ?? '' }}</h3>
          <p>{{ $post['excerpt'] ?? '' }}</p>
        </article>
      @empty
        <div style="grid-column: 1 / -1; text-align: center; padding: 80px 0; color: var(--mute);">
          <p>Nog geen berichten. Voeg categorieën en berichten toe via de blok-editor.</p>
        </div>
      @endforelse
    </div>
  </div>

</div>

{{-- ── Client-side category filter (no page reload) ── --}}
@if($hasCategories)
<script>
(function () {
  var filters = document.querySelectorAll('.blog-filters .blog-filter');
  var cards   = document.querySelectorAll('#blog-grid .blog-card');

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');
      cards.forEach(function (card) {
        card.style.display =
          (filter === 'all' || card.getAttribute('data-cat') === filter) ? '' : 'none';
      });
    });
  });
})();
</script>
@endif
