document.addEventListener(`DOMContentLoaded`,()=>{let e=document.querySelector(`.sg-nav`);if(e){let t=document.querySelector(`.opening`);t?new IntersectionObserver(t=>{t.forEach(t=>{t.isIntersecting?(e.classList.add(`nav-hidden`),e.classList.remove(`nav-visible`)):(e.classList.remove(`nav-hidden`),e.classList.add(`nav-visible`))})},{threshold:0,rootMargin:`0px`}).observe(t):e.classList.add(`nav-visible`);let n=document.getElementById(`sg-nav-toggle`),r=e.querySelector(`.sg-nav-links`);n&&r&&(n.addEventListener(`click`,()=>{let e=n.getAttribute(`aria-expanded`)===`true`;n.setAttribute(`aria-expanded`,String(!e)),r.classList.toggle(`open`,!e)}),r.querySelectorAll(`a`).forEach(e=>{e.addEventListener(`click`,()=>{n.setAttribute(`aria-expanded`,`false`),r.classList.remove(`open`)})}))}let t=document.getElementById(`opening-scroll-btn`);if(t){let n=t.closest(`.opening`),r=new IntersectionObserver(e=>{e.forEach(e=>{t.classList.toggle(`arrow-hidden`,!e.isIntersecting)})},{threshold:.5});n&&r.observe(n),t.addEventListener(`click`,()=>{e&&(e.classList.remove(`nav-hidden`),e.classList.add(`nav-visible`));let t=n?n.nextElementSibling:null;t?t.scrollIntoView({behavior:`smooth`,block:`start`}):window.scrollBy({top:window.innerHeight,behavior:`smooth`})})}let n=document.querySelectorAll(`.reveal`);if(n.length>0){let e=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&e.target.classList.add(`in`)})},{threshold:.1});n.forEach(t=>e.observe(t))}let r=document.getElementById(`booking-modal-container`);if(r){document.body.appendChild(r),document.addEventListener(`openBookingModal`,()=>{r.style.display=`block`,s()}),document.addEventListener(`closeBookingModal`,()=>{r.style.display=`none`});let e=document.getElementById(`booking-modal-overlay`);e&&e.addEventListener(`click`,()=>{document.dispatchEvent(new CustomEvent(`closeBookingModal`))});let t=document.getElementById(`booking-app`),n=[],i=`Je hoort binnen 24 uur van ons met een bevestiging.`;if(t)try{n=JSON.parse(t.getAttribute(`data-shoot-types`)||`[]`),i=t.getAttribute(`data-success-msg`)||i}catch{}let a=1,o={type:``,date:``,name:``,email:``,phone:``,note:``},s=()=>{if(!t)return;let e=(e,t)=>{o[e]=t,s()},r=a===1?!!o.type&&!!o.date:o.name&&o.email,c=``;if(a===3){let e=n.find(e=>e.id===o.type);c=`
          <div class="booking-success">
            <span class="script">Dankjewel!</span>
            <h2 class="h-2" style="margin-top: 20px;">We nemen snel contact op</h2>
            <p class="body" style="margin-top: 16px; max-width: 380px; margin-left: auto; margin-right: auto;">
              Je verzoek voor een <strong>${e?e.label.toLowerCase():`shoot`}</strong> rond <strong>${o.date}</strong> is binnen. ${i}
            </p>
            <button class="btn" style="margin-top: 32px;" onclick="document.dispatchEvent(new CustomEvent('closeBookingModal'))">Sluiten</button>
          </div>
        `}else{let e=`
          <div class="form-row">
            <label>Type shoot</label>
            <div class="shoot-types" id="st-grid">
              ${n.map(e=>`
          <button class="shoot-type ${o.type===e.id?`selected`:``}" data-id="${e.id}">
            ${e.label}
            <small>${e.sub}</small>
          </button>
        `).join(``)}
            </div>
          </div>
          <div class="form-row">
            <label>Voorkeursdatum</label>
            <input type="date" id="st-date" value="${o.date}" />
          </div>
        `,t=`
          <div class="form-row">
            <label>Je naam</label>
            <input type="text" id="st-name" placeholder="Voor- en achternaam" value="${o.name}" />
          </div>
          <div class="form-row">
            <label>E-mailadres</label>
            <input type="email" id="st-email" placeholder="jij@voorbeeld.nl" value="${o.email}" />
          </div>
          <div class="form-row">
            <label>Telefoonnummer (optioneel)</label>
            <input type="tel" id="st-phone" placeholder="+31 6 ..." value="${o.phone}" />
          </div>
          <div class="form-row">
            <label>Vertel kort iets over jullie (optioneel)</label>
            <textarea id="st-note" placeholder="Hoeveel kinderen, locatie-voorkeur, bijzonderheden...">${o.note}</textarea>
          </div>
        `;c=`
          <div class="eyebrow" style="margin-bottom: 12px;">Stap ${a} van 2</div>
          <h2 class="h-2">Plan je <span class="script" style="color: var(--terracotta);">shoot</span></h2>
          <p class="modal-sub">Kies het type shoot en een voorkeursdatum — we nemen daarna persoonlijk contact op om alles vast te leggen.</p>
          
          <div>
            ${a===1?e:t}
          </div>

          <div style="display: flex; gap: 12px; margin-top: 32px; justify-content: space-between;">
            ${a>1?`<button class="btn btn-ghost" id="st-back">← Terug</button>`:`<div></div>`}
            <button class="btn" id="st-next" ${r?``:`disabled style="opacity:0.4"`}>
              ${a===1?`Volgende →`:`Verstuur aanvraag`}
            </button>
          </div>
        `}if(t.innerHTML=c,a===1){t.querySelectorAll(`.shoot-type`).forEach(t=>{t.addEventListener(`click`,n=>{n.preventDefault(),e(`type`,t.getAttribute(`data-id`))})});let n=document.getElementById(`st-date`);n&&n.addEventListener(`input`,t=>{e(`date`,t.target.value)})}else a===2&&[`name`,`email`,`phone`,`note`].forEach(t=>{let n=document.getElementById(`st-`+t);n&&n.addEventListener(`input`,n=>{e(t,n.target.value)})});let l=document.getElementById(`st-back`);l&&l.addEventListener(`click`,()=>{a--,s()});let u=document.getElementById(`st-next`);u&&u.addEventListener(`click`,async()=>{if(a===1)a=2,s();else if(a===2){u.innerText=`Verzenden...`,u.disabled=!0;try{(await fetch(`/wp-json/sg/v1/appointment`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(o)})).ok?(a=3,s()):(alert(`Er is helaas iets misgegaan. Probeer het later opnieuw.`),u.innerText=`Verstuur aanvraag`,u.disabled=!1)}catch{alert(`Netwerkfout.`),u.innerText=`Verstuur aanvraag`,u.disabled=!1}}})};s()}});