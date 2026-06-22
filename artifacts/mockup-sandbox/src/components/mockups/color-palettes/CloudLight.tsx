export function CloudLight() {
  const bg = "#f8fafc";
  const surface = "#ffffff";
  const surface2 = "#f1f5f9";
  const border = "#e2e8f0";
  const accent = "#3b82f6";
  const accent2 = "#2563eb";
  const text = "#0f172a";
  const muted = "#94a3b8";

  const cats = [
    { name: "Sleep", color: "#3b82f6", hours: 52 },
    { name: "Work", color: "#ef4444", hours: 40 },
    { name: "Learning", color: "#8b5cf6", hours: 14 },
    { name: "Family", color: "#f97316", hours: 18 },
    { name: "Fitness", color: "#22c55e", hours: 8 },
    { name: "Wasted", color: "#94a3b8", hours: 6 },
  ];

  const grid = [
    ["#3b82f6","#3b82f6","#ef4444","#ef4444","#ef4444","#ef4444","#ef4444"],
    ["#3b82f6","#8b5cf6","#ef4444","#ef4444","#8b5cf6","#ef4444","#f97316"],
    ["#22c55e","#8b5cf6","#8b5cf6","#ef4444","#8b5cf6","#22c55e","#f97316"],
    ["#3b82f6","#3b82f6","#94a3b8","#f97316","#94a3b8","#3b82f6","#3b82f6"],
    ["#3b82f6","#3b82f6","#ef4444","#ef4444","#ef4444","#3b82f6","#3b82f6"],
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: 380, borderRadius: 20, overflow: "hidden", border: `1px solid ${border}`, boxShadow: `0 4px 24px rgba(59,130,246,0.12), 0 12px 40px rgba(0,0,0,0.08)` }}>
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

        {/* Mini grid */}
        <div style={{ background: bg, padding: "14px 14px 8px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Weekly Grid</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
            {["M","T","W","T","F","S","S"].map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: 8, fontWeight: 700, color: muted, paddingBottom: 4 }}>{d}</div>
            ))}
            {grid.map((row, r) => row.map((color, c) => (
              <div key={`${r}-${c}`} style={{ height: 16, borderRadius: 3, background: `${color}33`, border: `1.5px solid ${color}99` }} />
            )))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ background: bg, padding: "6px 14px 12px", display: "flex", flexWrap: "wrap", gap: 4 }}>
          {cats.map(c => (
            <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 7px", borderRadius: 4, background: `${c.color}15`, border: `1px solid ${c.color}40`, fontSize: 9, fontWeight: 600, color: c.color }}>
              <div style={{ width: 5, height: 5, borderRadius: 1, background: c.color }} />{c.name}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ background: surface, borderTop: `1px solid ${border}`, padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ l: "Productive", v: "54h", color: accent2 }, { l: "Sleep", v: "52h", color: "#3b82f6" }, { l: "Wasted", v: "6h", color: "#ef4444" }].map(s => (
            <div key={s.l} style={{ padding: "10px 10px", background: surface2, borderRadius: 8, border: `1px solid ${border}` }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{s.l}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color, letterSpacing: "-1px", lineHeight: 1 }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Label */}
        <div style={{ background: surface2, padding: "10px 16px", borderTop: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: text }}>Cloud Light</div>
            <div style={{ fontSize: 10, color: muted, marginTop: 1 }}>Clean & airy · White + Blue</div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[bg, surface, accent, "#ef4444", "#8b5cf6"].map((c, i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c, border: `1px solid ${border}` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
