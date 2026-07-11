function Tweaks({ variant, setVariant }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === "__activate_edit_mode") setVisible(true);
      if (e.data?.type === "__deactivate_edit_mode") setVisible(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  if (!visible) return null;

  const variants = [
    { id: "editorial", label: "Editorial", desc: "Warm zand, veel witruimte" },
    { id: "bloesem", label: "Bloesem", desc: "Klei hero, salie CTA" },
    { id: "linnen", label: "Linnen", desc: "Ultra minimaal, hairlines" },
  ];

  const pick = (id) => {
    setVariant(id);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { variant: id } }, "*");
  };

  return (
    <div className="tweaks-panel">
      <h4>Richting</h4>
      <p>Kies een visuele richting voor de homepage.</p>
      {variants.map(v => (
        <button key={v.id} className={"tweak-option " + (variant === v.id ? "active" : "")} onClick={() => pick(v.id)}>
          <span className="tweak-dot" />
          <div>
            <div style={{ fontWeight: 500 }}>{v.label}</div>
            <div style={{ fontSize: 11, color: "var(--mute)" }}>{v.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

window.Tweaks = Tweaks;
