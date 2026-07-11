function Booking({ onClose }) {
  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState({ type: "", date: "", name: "", email: "", phone: "", note: "" });

  const shootTypes = [
    { id: "newborn", label: "Newborn", sub: "0 – 2 weken" },
    { id: "baby", label: "Baby & sitter", sub: "3 – 12 maanden" },
    { id: "gezin", label: "Gezinsshoot", sub: "Alle leeftijden" },
    { id: "verjaardag", label: "Eerste verjaardag", sub: "11 – 14 maanden" },
    { id: "zwanger", label: "Zwangerschap", sub: "Vanaf 30 weken" },
    { id: "koppel", label: "Koppel", sub: "Met z'n tweeën" },
  ];

  const update = (k, v) => setData(d => ({ ...d, [k]: v }));
  const canNext = step === 1 ? !!data.type && !!data.date : data.name && data.email;

  if (step === 3) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>×</button>
          <div className="booking-success">
            <span className="script">Dankjewel!</span>
            <h2 className="h-2" style={{ marginTop: 20 }}>We nemen snel contact op</h2>
            <p className="body" style={{ marginTop: 16, maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
              Je verzoek voor een <strong>{shootTypes.find(t => t.id === data.type)?.label.toLowerCase()}</strong> rond <strong>{data.date}</strong> is binnen. Je hoort binnen 24 uur van ons met een bevestiging en een voorstel voor een tijdstip.
            </p>
            <button className="btn" style={{ marginTop: 32 }} onClick={onClose}>Sluiten</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="eyebrow" style={{ marginBottom: 12 }}>Stap {step} van 2</div>
        <h2 className="h-2">Plan je <span className="script" style={{ color: "var(--terracotta)" }}>shoot</span></h2>
        <p className="modal-sub">Kies het type shoot en een voorkeursdatum — we nemen daarna persoonlijk contact op om alles vast te leggen.</p>

        {step === 1 && (
          <div>
            <div className="form-row">
              <label>Type shoot</label>
              <div className="shoot-types">
                {shootTypes.map(t => (
                  <button key={t.id} className={"shoot-type " + (data.type === t.id ? "selected" : "")} onClick={() => update("type", t.id)}>
                    {t.label}
                    <small>{t.sub}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <label>Voorkeursdatum</label>
              <input type="date" value={data.date} onChange={e => update("date", e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="form-row">
              <label>Je naam</label>
              <input type="text" placeholder="Voor- en achternaam" value={data.name} onChange={e => update("name", e.target.value)} />
            </div>
            <div className="form-row">
              <label>E-mailadres</label>
              <input type="email" placeholder="jij@voorbeeld.nl" value={data.email} onChange={e => update("email", e.target.value)} />
            </div>
            <div className="form-row">
              <label>Telefoonnummer (optioneel)</label>
              <input type="tel" placeholder="+31 6 ..." value={data.phone} onChange={e => update("phone", e.target.value)} />
            </div>
            <div className="form-row">
              <label>Vertel kort iets over jullie (optioneel)</label>
              <textarea placeholder="Hoeveel kinderen, locatie-voorkeur, bijzonderheden..." value={data.note} onChange={e => update("note", e.target.value)} />
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 32, justifyContent: "space-between" }}>
          {step > 1 ? <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>← Terug</button> : <div />}
          <button className="btn" disabled={!canNext} style={{ opacity: canNext ? 1 : 0.4 }} onClick={() => step === 1 ? setStep(2) : setStep(3)}>
            {step === 1 ? "Volgende →" : "Verstuur aanvraag"}
          </button>
        </div>
      </div>
    </div>
  );
}

window.Booking = Booking;
