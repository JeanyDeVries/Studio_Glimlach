function Blog({ setPage, setSinglePost }) {
  const [filter, setFilter] = React.useState("alles");
  const posts = [
    { id: 1, tag: "Gezin", cat: "shoots", date: "12 Maart 2026", title: "De ochtend bij familie Van Eyk", excerpt: "Pannenkoeken, een kat die overal tussendoor loopt, en drie kinderen die niet stil konden zitten.", tone: "clay" },
    { id: 2, tag: "Persoonlijk", cat: "persoonlijk", date: "28 Februari 2026", title: "Waarom we Studio Glimlach zijn begonnen", excerpt: "Van schoonzussen naar zakenpartners. Over vriendschap en dat ene besluit op een regenachtige dinsdag.", tone: "sage" },
    { id: 3, tag: "Newborn", cat: "shoots", date: "14 Februari 2026", title: "Olivier, acht dagen oud", excerpt: "Zijn grote broer was vooral bezig met zijn dinosaurus — maar die blik tussen hen tweeën.", tone: "warm" },
    { id: 4, tag: "Achter de schermen", cat: "persoonlijk", date: "30 Januari 2026", title: "Wat er in onze cameratas zit", excerpt: "Onze favoriete lenzen, waarom we (bijna) alles analoog doen en het ene snoepje dat altijd werkt.", tone: "cream" },
    { id: 5, tag: "Gezin", cat: "shoots", date: "18 Januari 2026", title: "Winter in het Amelisweerd", excerpt: "Bevroren gras, rode wangen en chocolademelk na afloop. Een ochtend met familie De Rooij.", tone: "muted" },
    { id: 6, tag: "Persoonlijk", cat: "persoonlijk", date: "05 Januari 2026", title: "Terugblik op 2025", excerpt: "Honderdvierenveertig gezinnen, duizenden echte lachjes en een paar tranen. Ons jaar in woorden.", tone: "deep" },
    { id: 7, tag: "Newborn", cat: "shoots", date: "22 December 2025", title: "Welkom Fien", excerpt: "Zeven pond, een bos donker haar en ouders die nog niet bijkwamen van het geluk.", tone: "sand" },
    { id: 8, tag: "Koppel", cat: "shoots", date: "08 December 2025", title: "Jules & Wouter — zwangerschap", excerpt: "Een shoot in de duinen, vier weken voor hun eerste kindje arriveerde.", tone: "clay" },
    { id: 9, tag: "Tips", cat: "persoonlijk", date: "14 November 2025", title: "Kleren kiezen voor je shoot (zonder stress)", excerpt: "Onze eenvoudige formule voor kleding die mooi staat, comfortabel is en tijdloos oogt.", tone: "sage" },
  ];
  const filtered = filter === "alles" ? posts : posts.filter(p => p.cat === filter);

  return (
    <main>
      <header className="blog-hero">
        <div className="eyebrow">Ons dagboek</div>
        <h1 className="h-1" style={{ marginTop: 12 }}>
          Verhalen uit <br />
          <span className="script">de studio</span>
        </h1>
        <p className="body-lg" style={{ maxWidth: 580, margin: "20px auto 0" }}>
          Shoot-verhalen, persoonlijke stukken en kleine dingen die we onderweg meemaken.
        </p>
        <div className="blog-filters">
          {[
            { k: "alles", l: "Alles" },
            { k: "shoots", l: "Shoot verhalen" },
            { k: "persoonlijk", l: "Persoonlijk" },
          ].map(f => (
            <button key={f.k} className={"blog-filter " + (filter === f.k ? "active" : "")} onClick={() => setFilter(f.k)}>{f.l}</button>
          ))}
        </div>
      </header>

      <div className="shell">
        <div className="blog-archive">
          {filtered.map(p => (
            <article key={p.id} className="blog-card" onClick={() => { setSinglePost(p); setPage("single"); }}>
              <div className="blog-card-media"><Placeholder tone={p.tone} label={p.title.toLowerCase()} /></div>
              <div className="blog-card-meta">{p.tag} · {p.date}</div>
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

function BlogSingle({ post, setPage, setSinglePost }) {
  React.useEffect(() => { window.scrollTo(0, 0); }, [post]);
  const p = post || { id: 1, tag: "Gezin", date: "12 Maart 2026", title: "De ochtend bij familie Van Eyk", tone: "clay" };

  const related = [
    { id: 10, tag: "Newborn", date: "14 Februari 2026", title: "Olivier, acht dagen oud", tone: "warm" },
    { id: 11, tag: "Gezin", date: "18 Januari 2026", title: "Winter in het Amelisweerd", tone: "sage" },
    { id: 12, tag: "Persoonlijk", date: "05 Januari 2026", title: "Terugblik op 2025", tone: "deep" },
  ];

  return (
    <main>
      <div className="shell">
        <div className="single-hero">
          <button className="btn-link" onClick={() => setPage("blog")} style={{ marginBottom: 32 }}>← Terug naar blog</button>
          <div className="eyebrow" style={{ marginBottom: 16 }}>{p.tag} · {p.date}</div>
          <h1 className="h-1">{p.title}</h1>
          <p className="body-lg" style={{ marginTop: 20 }}>Een donderdagochtend, drie kinderen onder de zes en een keuken die al ruikt naar pannenkoeken als wij aanbellen.</p>
        </div>

        <Placeholder className="single-feature" tone={p.tone} label="openingsbeeld · keuken" corner="01 / 47" />

        <article className="single-body">
          <p>De deur gaat open en er staat meteen een dreumes in een pyjama met dinosaurussen op me te kijken. Achter hem komt Eline aan, baby op de heup, een klodder beslag in haar haar. "Sorry voor de chaos," zegt ze. Ik moet lachen, want dit is precies waar we voor komen.</p>
          <p>Bij een thuis-shoot hoef je niets op te ruimen. We fotograferen de keuken zoals hij is, de bank met de kussens scheef, de was die nog gevouwen moet worden. Want dát is jullie leven nu, en over vijf jaar zijn het juist die details die je terug wil zien.</p>

          <div className="single-pull">dat is jullie leven nu — <br/>en straks wil je het terug zien</div>

          <p>Thijs, de middelste, is verlegen. We beginnen niet meteen met fotograferen. Eerst laat Merel hem de camera zien, dan haar telefoon, dan mag hij een foto van zijn moeder maken. Binnen tien minuten rent hij door de gang en trekt zijn broer mee het bed op. Wij filmen gewoon mee.</p>
          <p>De baby, Bram, is zes maanden. Hij lacht naar alles en iedereen. Vader komt thuis van een vroege dienst en ploft op de bank — Bram klautert meteen naar hem toe. Dit zijn de beelden die we het mooist vinden. Geen pose, geen "kijk eens lief". Gewoon een vader die thuiskomt, en een kind dat blij is.</p>
        </article>

        <div className="single-gallery">
          <Placeholder tone="cream" label="keuken · pannenkoeken" />
          <Placeholder tone="sage" label="thijs in de gang" />
          <Placeholder tone="clay" label="bram · op bank" />
        </div>

        <article className="single-body">
          <p>We eindigden buiten, in de tuin, terwijl de zon door de appelboom viel. Thijs vond een slak en was meteen de helft van de shoot vergeten. Eline en haar man keken naar hun kinderen, en naar elkaar. Dat zijn de laatste drie foto's geworden.</p>
          <p>Dankjewel Eline, Mark, Thijs, Sep en Bram — voor jullie vertrouwen, jullie pannenkoeken en jullie chaos. Het was een van onze favoriete ochtenden dit jaar.</p>
          <p style={{ marginTop: 40 }}><span className="script" style={{ fontSize: 40, color: "var(--terracotta)" }}>Met liefs,</span><br/><span className="script" style={{ fontSize: 40, color: "var(--terracotta)" }}>Merel</span></p>
        </article>
      </div>

      <section className="section shell" style={{ borderTop: "1px solid var(--line)", marginTop: 80 }}>
        <div className="section-head">
          <div className="section-num">Meer</div>
          <h2 className="section-title h-2">Verder lezen</h2>
          <button className="btn-link" onClick={() => setPage("blog")}>Alle berichten</button>
        </div>
        <div className="blog-preview">
          {related.map(r => (
            <article key={r.id} className="blog-card" onClick={() => { setSinglePost(r); setPage("single"); }}>
              <div className="blog-card-media"><Placeholder tone={r.tone} label={r.title.toLowerCase()} /></div>
              <div className="blog-card-meta">{r.tag} · {r.date}</div>
              <h3>{r.title}</h3>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

window.Blog = Blog;
window.BlogSingle = BlogSingle;
