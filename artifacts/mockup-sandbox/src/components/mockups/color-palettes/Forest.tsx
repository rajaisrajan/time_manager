export function Forest() {
  const bg = "#050c07";
  const surface = "#0a1a0d";
  const surface2 = "#0f2414";
  const border = "#1a3a20";
  const accent = "#22c55e";
  const accent2 = "#4ade80";
  const text = "#dcfce7";
  const muted = "#3d6647";

  const cats = [
    { name: "Sleep", color: "#166534", hours: 52 },
    { name: "Work", color: "#15803d", hours: 40 },
    { name: "Learning", color: "#16a34a", hours: 14 },
    { name: "Family", color: "#65a30d", hours: 18 },
    { name: "Fitness", color: "#22c55e", hours: 8 },
    { name: "Wasted", color: "#1c2a1e", hours: 6 },
  ];

  const grid = [
    ["#166534","#166534","#15803d","#15803d","#15803d","#15803d","#15803d"],
    ["#166534","#16a34a","#15803d","#15803d","#16a34a","#15803d","#65a30d"],
    ["#22c55e","#16a34a","#16a34a","#15803d","#16a34a","#22c55e","#65a30d"],
    ["#166534","#166534","#1c2a1e","#65a30d","#1c2a1e","#166534","#166534"],
    ["#166534","#166534","#15803d","#15803d","#15803d","#166534","#166534"],
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#020804", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: 380, borderRadius: 20, overflow: "hidden", border: `1px solid ${border}`, boxShadow: `0 0 60px ${accent}20, 0 24px 48px rgba(0,0,0,0.7)` }}>
        {/* Navbar */}
        <div style={{ background: surface, borderBottom: `1px solid ${border}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: "#000" }}>X</div>
          <span style={{ fontSize: 12, fontWeight: 800, color: text, letterSpacing: "-0.3px" }}>168 Hours</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {["Grid", "Analytics"].map(l => (
              <span key={l} style={{ fontSize: 10, fontWeight: 600, color: muted, padding: "3px 8px", borderRadius: 5, background: surface2 }}>{l}</span>
            ))}
          </div>
        </div>

        {/* Mini grid */}
        <div style={{ background: bg, padding: "14px 14px 8px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Weekly Grid</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
            {["M","T","W","T","F","S","S"].map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: 8, fontWeight: 700, color: muted, paddingBottom: 4 }}>{d}</div>
            ))}
            {grid.map((row, r) => row.map((color, c) => (
              <div key={`${r}-${c}`} style={{ height: 16, borderRadius: 3, background: `${color}cc`, border: `1px solid ${color}` }} />
            )))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ background: bg, padding: "6px 14px 12px", display: "flex", flexWrap: "wrap", gap: 4 }}>
          {cats.map(c => (
            <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 7px", borderRadius: 4, background: `${c.color}20`, border: `1px solid ${c.color}50`, fontSize: 9, fontWeight: 600, color: c.color }}>
              <div style={{ width: 5, height: 5, borderRadius: 1, background: c.color }} />{c.name}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ background: surface, borderTop: `1px solid ${border}`, padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ l: "Productive", v: "54h", color: accent2 }, { l: "Sleep", v: "52h", color: "#86efac" }, { l: "Wasted", v: "6h", color: "#f87171" }].map(s => (
            <div key={s.l} style={{ padding: "10px 10px", background: surface2, borderRadius: 8, border: `1px solid ${border}` }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{s.l}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color, letterSpacing: "-1px", lineHeight: 1 }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Label */}
        <div style={{ background: surface2, padding: "10px 16px", borderTop: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: text }}>Forest Night</div>
            <div style={{ fontSize: 10, color: muted, marginTop: 1 }}>Calm & grounded · Deep emerald</div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[bg, surface, accent, "#65a30d", "#166534"].map((c, i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c, border: `1px solid ${border}` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
