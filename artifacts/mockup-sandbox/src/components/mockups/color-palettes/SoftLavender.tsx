export function SoftLavender() {
  const bg = "#faf8ff";
  const surface = "#ffffff";
  const surface2 = "#f3f0ff";
  const border = "#e4d9ff";
  const accent = "#7c3aed";
  const accent2 = "#6d28d9";
  const text = "#1e1040";
  const muted = "#9b8bb4";

  const cats = [
    { name: "Sleep", color: "#7c3aed", hours: 52 },
    { name: "Work", color: "#ec4899", hours: 40 },
    { name: "Learning", color: "#6366f1", hours: 14 },
    { name: "Family", color: "#a855f7", hours: 18 },
    { name: "Fitness", color: "#0ea5e9", hours: 8 },
    { name: "Wasted", color: "#c4b5d8", hours: 6 },
  ];

  const grid = [
    ["#7c3aed","#7c3aed","#ec4899","#ec4899","#ec4899","#ec4899","#ec4899"],
    ["#7c3aed","#6366f1","#ec4899","#ec4899","#6366f1","#ec4899","#a855f7"],
    ["#0ea5e9","#6366f1","#6366f1","#ec4899","#6366f1","#0ea5e9","#a855f7"],
    ["#7c3aed","#7c3aed","#c4b5d8","#a855f7","#c4b5d8","#7c3aed","#7c3aed"],
    ["#7c3aed","#7c3aed","#ec4899","#ec4899","#ec4899","#7c3aed","#7c3aed"],
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#ede8ff", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: 380, borderRadius: 20, overflow: "hidden", border: `1px solid ${border}`, boxShadow: `0 4px 24px rgba(124,58,237,0.15), 0 12px 40px rgba(0,0,0,0.07)` }}>
        {/* Navbar */}
        <div style={{ background: surface, borderBottom: `1px solid ${border}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#fff" }}>X</div>
          <span style={{ fontSize: 12, fontWeight: 800, color: text, letterSpacing: "-0.3px" }}>168 Hours</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {["Grid", "Analytics"].map(l => (
              <span key={l} style={{ fontSize: 10, fontWeight: 600, color: muted, padding: "3px 8px", borderRadius: 5, background: surface2, border: `1px solid ${border}` }}>{l}</span>
            ))}
          </div>
        </div>

        <div style={{ background: bg, padding: "14px 14px 8px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Weekly Grid</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
            {["M","T","W","T","F","S","S"].map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: 8, fontWeight: 700, color: muted, paddingBottom: 4 }}>{d}</div>
            ))}
            {grid.map((row, r) => row.map((color, c) => (
              <div key={`${r}-${c}`} style={{ height: 16, borderRadius: 3, background: `${color}30`, border: `1.5px solid ${color}90` }} />
            )))}
          </div>
        </div>

        <div style={{ background: bg, padding: "6px 14px 12px", display: "flex", flexWrap: "wrap", gap: 4 }}>
          {cats.map(c => (
            <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 7px", borderRadius: 4, background: `${c.color}15`, border: `1px solid ${c.color}40`, fontSize: 9, fontWeight: 600, color: c.color }}>
              <div style={{ width: 5, height: 5, borderRadius: 1, background: c.color }} />{c.name}
            </div>
          ))}
        </div>

        <div style={{ background: surface, borderTop: `1px solid ${border}`, padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ l: "Productive", v: "54h", color: accent2 }, { l: "Sleep", v: "52h", color: "#6366f1" }, { l: "Wasted", v: "6h", color: "#ec4899" }].map(s => (
            <div key={s.l} style={{ padding: "10px 10px", background: surface2, borderRadius: 8, border: `1px solid ${border}` }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{s.l}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color, letterSpacing: "-1px", lineHeight: 1 }}>{s.v}</div>
            </div>
          ))}
        </div>

        <div style={{ background: surface2, padding: "10px 16px", borderTop: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: text }}>Soft Lavender</div>
            <div style={{ fontSize: 10, color: muted, marginTop: 1 }}>Gentle & creative · Purple + Pink</div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[bg, surface, accent, "#ec4899", "#6366f1"].map((c, i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c, border: `1px solid ${border}` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
