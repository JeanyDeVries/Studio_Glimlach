function Home({ onBook, setPage, setSinglePost }) {
  const [openFaq, setOpenFaq] = React.useState(0);

  // reveal on scroll
  React.useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const faqs = [
    { q: "Hoe lang duurt een fotoshoot?", a: "Een shoot duurt gemiddeld 60 tot 90 minuten. We nemen de tijd, want kinderen hebben soms even nodig om te wennen. Liever geen gehaast moment, maar ruimte voor echte reacties." },
    { q: "Wat moeten we aantrekken?", a: "Zachte, effen kleuren in aardetinten werken het mooist — denk aan crème, zand, olijf, roestbruin. Vermijd felle prints of logo's. Na het boeken sturen we een uitgebreide kledinggids met voorbeelden." },
    { q: "Waar vindt de shoot plaats?", a: "Op locatie bij jullie thuis, in de natuur (bos, strand, weilanden in de buurt van Almere), of in onze lichte studio. Bij het plannen kijken we samen wat het beste past bij de sfeer die jullie willen." },
    { q: "Wanneer krijgen we de foto's?", a: "Binnen drie weken ontvang je een persoonlijke online galerij waarin je alle foto's in hoge resolutie kunt downloaden en delen met familie." },
    { q: "Werken jullie ook met baby's die nog niet zitten?", a: "Zeker. Newborn-shoots plannen we het liefst in de eerste twee weken. Ook sitter-shoots (rond 6–9 maanden) en de eerste verjaardag zijn prachtige momenten om vast te leggen." },
  ];

  const posts = [
    { id: 1, tag: "Gezin · Almere", date: "12 Maart 2026", title: "De ochtend bij familie Van Eyk", excerpt: "Pannenkoeken bakken, een kat die overal tussendoor loopt en drie kinderen die niet stil konden zitten — precies waarom we van thuis-shoots houden.", tone: "clay" },
    { id: 2, tag: "Persoonlijk", date: "28 Februari 2026", title: "Waarom we Studio Glimlach zijn begonnen", excerpt: "Van schoonzussen naar zakenpartners. Over vriendschap, kinderen die groot worden, en dat ene besluit op een regenachtige dinsdag.", tone: "sage" },
    { id: 3, tag: "Newborn · Studio", date: "14 Februari 2026", title: "Olivier, acht dagen oud", excerpt: "Zijn grote broer was vooral bezig met zijn nieuwe dinosaurus, maar die ene blik tussen hen tweeën — dat is waarom we doen wat we doen.", tone: "warm" },
  ];

  return (
    <main>
      {/* HERO — full-bleed background */}
      <section className="hero">
        <Placeholder className="hero-bg" tone="clay" label="hero beeld · moeder en kind · gouden uur · vervang door echte foto" corner="Hero · 01" />
        <div className="hero-scrim" />
        <div className="hero-inner">
          <div className="hero-top">
            <div className="eyebrow" style={{ color: "#fff", opacity: 0.9 }}>Studio — Almere & omgeving</div>
          </div>

          <h1 className="hero-title h-display">
            Kleine handjes, <br />
            gekke snoetjes <span className="script italic">&amp; echte</span> <br />
            lach.
          </h1>

          <div className="hero-foot">
            <div className="body-lg" style={{ maxWidth: 460, color: "#fff", fontStyle: "italic" }}>
              Geen stijve houdingen, geen "moeten". Wel ruimte voor rommel, gekkigheid en die ene echte glimlach.
            </div>
            <button className="btn btn-hero" onClick={onBook}>Plan je shoot →</button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="over" className="section shell">
        <div className="section-head reveal">
          <div className="section-num">N°02</div>
          <h2 className="section-title h-1">Merel <span className="script" style={{ color: "var(--terracotta)", fontSize: "0.8em" }}>&</span> Jaimy</h2>
          <div className="eyebrow">Het verhaal</div>
        </div>

        <div className="about reveal">
          <Placeholder className="about-media" tone="cream" label="Merel & Jaimy · zelfportret" corner="Studio" />
          <div className="about-copy">
            <p className="body-lg" style={{ marginTop: 0 }}>
              Wij zijn niet alleen vriendinnen, maar inmiddels ook schoonzussen — en we delen een grote liefde voor fotografie.
            </p>
            <p className="body">
              Samen worden we het meest blij van jonge kinderen en hun gezin. Die eerste weken waarin alles nog nieuw is. De peuterjaren, waarin niets stilstaat. De manier waarop broertjes en zusjes naar elkaar kijken als ze denken dat niemand het ziet.
            </p>
            <p className="body">
              Kinderen worden zó snel groot. Daarom vinden we het belangrijk om dit nu vast te leggen. Zodat je later steeds weer kunt terugbladeren naar die kleine handjes, die gekke snoetjes en die echte lach.
            </p>
            <div className="about-signature">
              <span className="script">Merel &amp; Jaimy</span>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="section shell" style={{ paddingTop: 0 }}>
        <div className="section-head reveal">
          <div className="section-num">N°03</div>
          <h2 className="section-title h-1">Recent <span className="italic" style={{ fontWeight: 300 }}>werk</span></h2>
          <div className="eyebrow">Portfolio · 2025–2026</div>
        </div>

        <div className="portfolio reveal">
          <Placeholder className="p1" tone="clay" label="gezinsshoot · bos" />
          <Placeholder className="p2" tone="sage" label="newborn · studio" />
          <Placeholder className="p3" tone="warm" label="peuter · thuis" />
          <Placeholder className="p4" tone="cream" label="broertjes" />
          <Placeholder className="p5" tone="muted" label="gezin · strand" />
          <Placeholder className="p6" tone="sand" label="detail · voetjes" />
          <Placeholder className="p7" tone="deep" label="koppel zwanger" />
          <Placeholder className="p8" tone="sage" label="eerste verjaardag" />
        </div>

        <div className="portfolio-foot">
          <button className="btn-ghost btn">Bekijk het hele portfolio</button>
        </div>
      </section>

      <div className="divider-script reveal">— een glimlach zegt alles —</div>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="shell" style={{ padding: 0 }}>
          <div className="section-head reveal" style={{ borderColor: "rgba(0,0,0,0.15)" }}>
            <div className="section-num">N°04</div>
            <h2 className="section-title h-1">In hun woorden</h2>
            <div className="eyebrow">Klanten</div>
          </div>
          <div className="testimonial-grid reveal">
            <div className="testimonial">
              <p className="testimonial-quote">Merel en Jaimy hebben een manier om kinderen op hun gemak te stellen die bijna magisch is. Binnen tien minuten rende onze zoon al lachend door het veld — en die foto's zijn nu onze favorieten.</p>
              <div className="testimonial-who">Lotte &amp; Jeroen · Familieshoot</div>
            </div>
            <div className="testimonial">
              <p className="testimonial-quote">We twijfelden lang of we een newborn-shoot wilden. Ik ben zó blij dat we het hebben gedaan. De foto's zijn zacht, eerlijk en zo wij.</p>
              <div className="testimonial-who">Sanne · Newborn</div>
            </div>
            <div className="testimonial">
              <p className="testimonial-quote">Geen gekunstelde poses, gewoon onze kinderen zoals ze zijn. Precies wat we hoopten, en eigenlijk nog veel mooier.</p>
              <div className="testimonial-who">Familie De Wit · Thuis-shoot</div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="section shell">
        <div className="section-head reveal">
          <div className="section-num">N°05</div>
          <h2 className="section-title h-1">Uit ons <span className="script" style={{ color: "var(--terracotta)", fontSize: "0.9em" }}>dagboek</span></h2>
          <button className="btn-link" onClick={() => setPage("blog")}>Naar het blog</button>
        </div>
        <div className="blog-preview">
          {posts.map(p => (
            <article key={p.id} className="blog-card reveal" onClick={() => { setSinglePost(p); setPage("single"); }}>
              <div className="blog-card-media"><Placeholder tone={p.tone} label={p.title.toLowerCase()} /></div>
              <div className="blog-card-meta">{p.tag} · {p.date}</div>
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section shell">
        <div className="section-head reveal" style={{ justifyItems: "center" }}>
          <div className="section-num">N°06</div>
          <h2 className="section-title h-1" style={{ textAlign: "center" }}>Veelgestelde <span className="italic">vragen</span></h2>
          <div className="eyebrow">Alles op een rij</div>
        </div>
        <div className="faq reveal">
          {faqs.map((f, i) => (
            <div key={i} className={"faq-item " + (openFaq === i ? "open" : "")}>
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                <span>{f.q}</span>
                <span className="faq-q-plus" />
              </button>
              <div className="faq-a"><div className="faq-a-inner">{f.a}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="section shell">
        <div className="insta-head reveal">
          <div className="eyebrow">Volg ons dagelijks</div>
          <div className="insta-handle">@studio.glimlach</div>
        </div>
        <div className="insta-grid reveal">
          <Placeholder tone="clay" />
          <Placeholder tone="sage" />
          <Placeholder tone="warm" />
          <Placeholder tone="cream" />
          <Placeholder tone="muted" />
          <Placeholder tone="deep" />
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="eyebrow reveal" style={{ marginBottom: 16 }}>Afspraak maken</div>
        <h2 className="h-1 reveal">Laat ons <br /><span className="cta-script">jullie verhaal</span><br /> vastleggen</h2>
        <p className="cta-sub reveal">Plan een vrijblijvend kennismakingsgesprek, of boek direct een shoot. We kijken er naar uit.</p>
        <div className="reveal" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn" onClick={onBook}>Plan je shoot</button>
          <button className="btn btn-ghost">Stuur een mailtje</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-logo-text">Studio <span className="script">Glimlach</span></div>
            <p style={{ marginTop: 16, lineHeight: 1.7, color: "#c9c0b4", fontSize: 14, maxWidth: 300 }}>
              Fotografie voor jonge gezinnen, pasgeboren baby's en koppels. Almere en omgeving.
            </p>
          </div>
          <div>
            <h4>Menu</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Over ons</a></li>
              <li><a href="#">Portfolio</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li>hallo@studioglimlach.nl</li>
              <li>+31 6 12 34 56 78</li>
              <li>Almere · NL</li>
            </ul>
          </div>
          <div>
            <h4>Volg</h4>
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Pinterest</a></li>
              <li><a href="#">Nieuwsbrief</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-copy">
          <div>© 2026 Studio Glimlach · KvK 89234123</div>
          <div>Gemaakt met liefde in Almere</div>
        </div>
      </footer>
    </main>
  );
}

window.Home = Home;
