document.addEventListener('DOMContentLoaded', () => {
  // sg-nav: hide while opening splash is on screen, show after scrolling past
  const sgNav = document.querySelector('.sg-nav');
  if (sgNav) {
    const opening = document.querySelector('.opening');

    if (opening) {
      // Hide nav while the opening is visible; reveal it once scrolled past
      const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            sgNav.classList.add('nav-hidden');
            sgNav.classList.remove('nav-visible');
          } else {
            sgNav.classList.remove('nav-hidden');
            sgNav.classList.add('nav-visible');
          }
        });
      }, {
        threshold: 0,
        rootMargin: '0px'
      });

      navObserver.observe(opening);
    } else {
      // No opening block — always show the nav
      sgNav.classList.add('nav-visible');
    }

    // Mobile hamburger toggle
    const toggle = document.getElementById('sg-nav-toggle');
    const links = sgNav.querySelector('.sg-nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        links.classList.toggle('open', !expanded);
      });
      // Close on link click (single-page nav)
      links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          toggle.setAttribute('aria-expanded', 'false');
          links.classList.remove('open');
        });
      });
    }
  }

  // 2. Opening scroll arrow
  const scrollArrow = document.getElementById('opening-scroll-btn');
  if (scrollArrow) {
    const openingSection = scrollArrow.closest('.opening');

    // Hide arrow as soon as the user scrolls at all
    const arrowObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        scrollArrow.classList.toggle('arrow-hidden', !e.isIntersecting);
      });
    }, { threshold: 0.5 }); // hide when less than half the opening is visible

    if (openingSection) arrowObserver.observe(openingSection);

    // Click: smooth scroll to the next block after the opening
    scrollArrow.addEventListener('click', () => {
      // Show nav immediately — don't wait for IntersectionObserver
      if (sgNav) {
        sgNav.classList.remove('nav-hidden');
        sgNav.classList.add('nav-visible');
      }
      const nextBlock = openingSection ? openingSection.nextElementSibling : null;
      if (nextBlock) {
        nextBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      }
    });
  }

  // 3. Reveal on scroll
  const els = document.querySelectorAll(".reveal");

  if (els.length > 0) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
  }

  // 2. Booking Modal — self-bootstrapping so it works on every page,
  //    even when the appointment block is not placed in Gutenberg.
  let modalContainer = document.getElementById('booking-modal-container');
  if (!modalContainer) {
    // No appointment block on this page — create the modal DOM ourselves
    modalContainer = document.createElement('div');
    modalContainer.id = 'booking-modal-container';
    // The overlay itself is what we show/hide, the container is always in DOM
    modalContainer.innerHTML = `
      <div class="modal-overlay" id="booking-modal-overlay" style="display:none">
        <div class="modal" id="booking-modal-content" onclick="event.stopPropagation()">
          <button class="modal-close" onclick="document.dispatchEvent(new CustomEvent('closeBookingModal'))">&#x00D7;</button>
          <div id="booking-app"
               data-shoot-types='[{"id":"newborn","label":"Newborn","sub":"0 \u2013 2 weken"},{"id":"baby","label":"Baby &amp; sitter","sub":"3 \u2013 12 maanden"},{"id":"gezin","label":"Gezinsshoot","sub":"Alle leeftijden"},{"id":"verjaardag","label":"Eerste verjaardag","sub":"11 \u2013 14 maanden"},{"id":"zwanger","label":"Zwangerschap","sub":"Vanaf 30 weken"},{"id":"koppel","label":"Koppel","sub":"Met z\u2019n twee\u00EBn"}]'
               data-success-msg="Je hoort binnen 24 uur van ons met een bevestiging.">
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalContainer);
  } else {
    // Appointment block exists — move it to body root so z-index stacking works
    document.body.appendChild(modalContainer);
    // Ensure overlay starts hidden
    const existingOverlay = modalContainer.querySelector('.modal-overlay');
    if (existingOverlay) existingOverlay.style.display = 'none';
  }

  if (modalContainer) {

    document.addEventListener('openBookingModal', () => {
      // Show the overlay directly (position:fixed + flex centering)
      const overlay = document.getElementById('booking-modal-overlay');
      if (overlay) overlay.style.display = 'flex';
      renderBookingForm(); // re-render to reset state
    });

    document.addEventListener('closeBookingModal', () => {
      const overlay = document.getElementById('booking-modal-overlay');
      if (overlay) overlay.style.display = 'none';
    });

    // allow clicking on overlay to close
    const overlay = document.getElementById('booking-modal-overlay');
    if (overlay) {
      // Initially hide the overlay (not the container)
      overlay.style.display = 'none';
      overlay.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('closeBookingModal'));
      });
    }

    const appDiv = document.getElementById('booking-app');
    let shootTypes = [];
    let successMsg = 'Je hoort binnen 24 uur van ons met een bevestiging.';
    if (appDiv) {
      try {
        shootTypes = JSON.parse(appDiv.getAttribute('data-shoot-types') || '[]');
        successMsg = appDiv.getAttribute('data-success-msg') || successMsg;
      } catch (e) { }
    }

    let step = 1;
    let data = { type: '', dates: ['', '', ''], name: '', email: '', phone: '', note: '' };

    const renderBookingForm = () => {
      if (!appDiv) return;

      const updateData = (k, v) => { data[k] = v; renderBookingForm(); };
      const updateDate = (i, v) => { data.dates[i] = v; renderBookingForm(); };
      const canNext = step === 1
        ? (!!data.type && data.dates.filter(d => !!d).length >= 3)
        : (data.name && data.email);

      let content = '';

      if (step === 3) {
        const typeObj = shootTypes.find(t => t.id === data.type);
        const typeLabel = typeObj ? typeObj.label.toLowerCase() : 'shoot';
        content = `
          <div class="booking-success">
            <span class="script">Dankjewel!</span>
            <h2 class="h-2" style="margin-top: 20px;">We nemen snel contact op</h2>
            <p class="body" style="margin-top: 16px; max-width: 380px; margin-left: auto; margin-right: auto;">
              Je verzoek voor een <strong>${typeLabel}</strong> is binnen. Je voorkeurdatums: <strong>${data.dates.filter(d => d).join(', ')}</strong>. ${successMsg}
            </p>
            <button class="btn" style="margin-top: 32px;" onclick="document.dispatchEvent(new CustomEvent('closeBookingModal'))">Sluiten</button>
          </div>
        `;
      } else {
        const typesHtml = shootTypes.map(t => `
          <button class="shoot-type ${data.type === t.id ? 'selected' : ''}" data-id="${t.id}">
            ${t.label}
            <small>${t.sub}</small>
          </button>
        `).join('');

        const step1Html = `
          <div class="form-row">
            <label>Type shoot</label>
            <div class="shoot-types" id="st-grid">
              ${typesHtml}
            </div>
          </div>
          <div class="form-row">
            <label>Voorkeurdatum</label>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 4px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-family: var(--mono); font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--mute); width: 36px; flex-shrink: 0;">1e</span>
                <input type="date" id="st-date-0" value="${data.dates[0]}" style="flex: 1;" />
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-family: var(--mono); font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--mute); width: 36px; flex-shrink: 0;">2e</span>
                <input type="date" id="st-date-1" value="${data.dates[1]}" style="flex: 1;" />
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-family: var(--mono); font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--mute); width: 36px; flex-shrink: 0;">3e</span>
                <input type="date" id="st-date-2" value="${data.dates[2]}" style="flex: 1;" />
              </div>
            </div>
          </div>
        `;

        const step2Html = `
          <div class="form-row">
            <label>Je naam</label>
            <input type="text" id="st-name" placeholder="Voor- en achternaam" value="${data.name}" />
          </div>
          <div class="form-row">
            <label>E-mailadres</label>
            <input type="email" id="st-email" placeholder="jij@voorbeeld.nl" value="${data.email}" />
          </div>
          <div class="form-row">
            <label>Telefoonnummer (optioneel)</label>
            <input type="tel" id="st-phone" placeholder="+31 6 ..." value="${data.phone}" />
          </div>
          <div class="form-row">
            <label>Vertel kort iets over jullie (optioneel)</label>
            <textarea id="st-note" placeholder="Hoeveel kinderen, locatie-voorkeur, bijzonderheden...">${data.note}</textarea>
          </div>
        `;

        content = `
          <div class="eyebrow" style="margin-bottom: 12px;">Stap ${step} van 2</div>
          <h2 class="h-2">Plan je <span class="script" style="color: var(--terracotta);">shoot</span></h2>
          <p class="modal-sub">Kies het type shoot en minimaal 3 voorkeurdatums — we nemen daarna persoonlijk contact op om alles vast te leggen.</p>
          
          <div>
            ${step === 1 ? step1Html : step2Html}
          </div>

          <div style="display: flex; gap: 12px; margin-top: 32px; justify-content: space-between;">
            ${step > 1 ? '<button class="btn btn-ghost" id="st-back">← Terug</button>' : '<div></div>'}
            <button class="btn" id="st-next" ${!canNext ? 'disabled style="opacity:0.4"' : ''}>
              ${step === 1 ? 'Volgende →' : 'Verstuur aanvraag'}
            </button>
          </div>
        `;
      }

      appDiv.innerHTML = content;

      // Event listeners
      if (step === 1) {
        appDiv.querySelectorAll('.shoot-type').forEach(b => {
          b.addEventListener('click', (e) => { e.preventDefault(); updateData('type', b.getAttribute('data-id')); });
        });
        [0, 1, 2].forEach(i => {
          const dateInput = document.getElementById('st-date-' + i);
          if (dateInput) {
            dateInput.addEventListener('input', (e) => { updateDate(i, e.target.value); });
          }
        });
      } else if (step === 2) {
        ['name', 'email', 'phone', 'note'].forEach(field => {
          const input = document.getElementById('st-' + field);
          if (input) {
            input.addEventListener('input', (e) => { updateData(field, e.target.value); });
          }
        });
      }

      const backBtn = document.getElementById('st-back');
      if (backBtn) {
        backBtn.addEventListener('click', () => { step--; renderBookingForm(); });
      }

      const nextBtn = document.getElementById('st-next');
      if (nextBtn) {
        nextBtn.addEventListener('click', async () => {
          if (step === 1) {
            step = 2;
            renderBookingForm();
          } else if (step === 2) {
            nextBtn.innerText = "Verzenden...";
            nextBtn.disabled = true;
            try {
              const res = await fetch('/wp-json/sg/v1/appointment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
              });
              if (res.ok) {
                step = 3;
                renderBookingForm();
              } else {
                alert('Er is helaas iets misgegaan. Probeer het later opnieuw.');
                nextBtn.innerText = "Verstuur aanvraag";
                nextBtn.disabled = false;
              }
            } catch (err) {
              alert('Netwerkfout.');
              nextBtn.innerText = "Verstuur aanvraag";
              nextBtn.disabled = false;
            }
          }
        });
      }
    };

    renderBookingForm();
  }
});
