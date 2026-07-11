const { useState, useEffect, useRef } = React;

// Soft swatch placeholder — uses brand palette
function Placeholder({ tone = "sand", label, corner, children, style = {}, className = "" }) {
  const tones = {
    sand:   { bg: "#F2E9DE", stripe: "rgba(0,0,0,0.035)" },
    sage:   { bg: "#CDD4B2", stripe: "rgba(0,0,0,0.04)" },
    clay:   { bg: "#E1C5B0", stripe: "rgba(0,0,0,0.035)" },
    terra:  { bg: "#D6927B", stripe: "rgba(255,255,255,0.08)" },
    warm:   { bg: "#E8D5C0", stripe: "rgba(0,0,0,0.035)" },
    cream:  { bg: "#EEDFCB", stripe: "rgba(0,0,0,0.03)" },
    muted:  { bg: "#D9C8B4", stripe: "rgba(0,0,0,0.04)" },
    deep:   { bg: "#B88A72", stripe: "rgba(255,255,255,0.08)" }
  };
  const t = tones[tone] || tones.sand;
  return (
    <div
      className={"ph " + className}
      style={{
        background: `repeating-linear-gradient(135deg, ${t.bg} 0, ${t.bg} 14px, ${t.stripe} 14px, ${t.stripe} 15px), ${t.bg}`,
        ...style
      }}
    >
      {children}
      {corner && <span className="ph-corner">{corner}</span>}
      {label && <span className="ph-label">{label}</span>}
    </div>
  );
}

window.Placeholder = Placeholder;
