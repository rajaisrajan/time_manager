"use client";
import { Category } from "@/lib/types";
import { useState } from "react";
import { saveCustomCategory, getCategories, deleteCustomCategory, getProductivityCatIds, setProductivityCatIds } from "@/lib/storage";

interface Props {
  categories: Category[];
  onCategoriesChange: (cats: Category[]) => void;
}

const COLOR_PALETTE = [
  "#0891b2","#0d9488","#65a30d","#d97706","#be185d","#6366f1",
  "#f59e0b","#10b981","#ef4444","#8b5cf6","#f97316","#06b6d4",
  "#84cc16","#ec4899","#14b8a6","#3b82f6","#a855f7","#22c55e",
  "#eab308","#64748b",
];

export default function CategoryLegend({ categories, onCategoriesChange }: Props) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(COLOR_PALETTE[0]);
  const [newIsProductive, setNewIsProductive] = useState(false);
  const [managing, setManaging] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  function resetForm() {
    setNewName("");
    setNewColor(COLOR_PALETTE[0]);
    setNewIsProductive(false);
    setAdding(false);
  }

  async function handleAdd() {
    if (!newName.trim()) return;
    await saveCustomCategory(newName.trim(), newColor, newIsProductive);
    const cats = await getCategories();
    onCategoriesChange(cats);
    resetForm();
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await deleteCustomCategory(id);
    const cats = await getCategories();
    onCategoriesChange(cats);
    setDeleting(null);
  }

  const customCats = categories.filter(c => !c.isDefault);
  const defaultCats = categories.filter(c => c.isDefault);

  const inputStyle = {
    padding: "8px 12px",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text)",
    fontSize: 13,
    outline: "none",
    fontFamily: "Inter, sans-serif",
  } as React.CSSProperties;

  return (
    <>
      {/* Manage Modal */}
      {managing && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
          onClick={e => { if (e.target === e.currentTarget) setManaging(false); }}
        >
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "24px",
            width: "100%",
            maxWidth: 500,
            maxHeight: "86vh",
            overflowY: "auto",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            fontFamily: "Inter, sans-serif",
          }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.3px" }}>Manage Categories</div>
              <button onClick={() => setManaging(false)} style={{ background: "transparent", border: "none", color: "var(--muted)", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>

            {/* Default Categories */}
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Default</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 20 }}>
              {defaultCats.map(cat => (
                <div key={cat.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px", background: "var(--surface2)",
                  border: "1px solid var(--border)", borderRadius: 9,
                }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: cat.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{cat.name}</span>
                  <span style={{ fontSize: 10, color: "var(--muted)", fontStyle: "italic" }}>built-in</span>
                </div>
              ))}
            </div>

            {/* Custom Categories */}
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Custom</div>
            {customCats.length === 0 ? (
              <div style={{ fontSize: 12, color: "var(--muted)", padding: "12px", background: "var(--surface2)", borderRadius: 9, textAlign: "center", marginBottom: 16 }}>
                No custom categories yet
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 16 }}>
                {customCats.map(cat => (
                  <div key={cat.id} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 12px", background: `${cat.color}12`,
                    border: `1px solid ${cat.color}40`, borderRadius: 9,
                  }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: cat.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{cat.name}</span>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      disabled={deleting === cat.id}
                      style={{
                        background: deleting === cat.id ? "var(--surface2)" : "#ef444420",
                        border: "1px solid #ef444440",
                        borderRadius: 6,
                        color: deleting === cat.id ? "var(--muted)" : "#f87171",
                        fontSize: 11, fontWeight: 700,
                        cursor: deleting === cat.id ? "not-allowed" : "pointer",
                        padding: "4px 10px", fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {deleting === cat.id ? "Removing…" : "Remove"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18, marginTop: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Add New Category</div>

              {/* Name */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", marginBottom: 6 }}>Name</div>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleAdd(); }}
                  placeholder="Category name…"
                  style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                />
              </div>

              {/* Color */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", marginBottom: 8 }}>Color</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {COLOR_PALETTE.map(c => (
                    <button
                      key={c}
                      onClick={() => setNewColor(c)}
                      style={{
                        width: 26, height: 26, borderRadius: 6, background: c,
                        border: newColor === c ? `3px solid white` : "2px solid transparent",
                        cursor: "pointer", boxSizing: "border-box",
                        boxShadow: newColor === c ? `0 0 0 1px ${c}, 0 0 10px ${c}80` : "none",
                        transition: "all 0.12s",
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, background: newColor, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>Selected: {newColor}</span>
                  <input
                    type="color"
                    value={newColor}
                    onChange={e => setNewColor(e.target.value)}
                    style={{ marginLeft: "auto", width: 28, height: 28, border: "none", background: "none", cursor: "pointer", borderRadius: 4 }}
                    title="Custom color"
                  />
                </div>
              </div>

              {/* Productivity toggle */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", marginBottom: 8 }}>Count in Productivity Time?</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {([true, false] as const).map(val => (
                    <button
                      key={String(val)}
                      onClick={() => setNewIsProductive(val)}
                      style={{
                        flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 12, fontWeight: 700,
                        cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 0.15s",
                        background: newIsProductive === val
                          ? (val ? "#22c55e20" : "#ef444420")
                          : "var(--surface2)",
                        border: newIsProductive === val
                          ? `1px solid ${val ? "#22c55e60" : "#ef444460"}`
                          : "1px solid var(--border)",
                        color: newIsProductive === val
                          ? (val ? "#4ade80" : "#f87171")
                          : "var(--muted)",
                      }}
                    >
                      {val ? "✓ Yes" : "✗ No"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview + submit */}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {newName.trim() && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "4px 10px", borderRadius: 6, flexShrink: 0,
                    background: `${newColor}15`, border: `1px solid ${newColor}50`,
                    fontSize: 12, fontWeight: 600, color: newColor,
                  }}>
                    <div style={{ width: 7, height: 7, borderRadius: 2, background: newColor }} />
                    {newName.trim()}
                  </div>
                )}
                <button
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: "9px 0", fontSize: 13, opacity: newName.trim() ? 1 : 0.5 }}
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend bar */}
      <div style={{
        padding: "10px 16px",
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        alignItems: "center",
        minHeight: 44,
      }}>
        <span style={{
          fontSize: 10, fontWeight: 700, color: "var(--muted)",
          textTransform: "uppercase", letterSpacing: "0.1em",
          marginRight: 4, flexShrink: 0, fontFamily: "Inter, sans-serif",
        }}>Legend</span>

        {categories.map(cat => (
          <div key={cat.id} style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "3px 8px", borderRadius: 5,
            background: `${cat.color}15`, border: `1px solid ${cat.color}40`,
            fontSize: 11, fontWeight: 600, color: cat.color,
            fontFamily: "Inter, sans-serif", flexShrink: 0,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: 1, background: cat.color, flexShrink: 0 }} />
            {cat.name}
          </div>
        ))}

        {/* Quick-add inline */}
        {adding ? (
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") resetForm(); }}
              placeholder="Category name"
              style={{
                padding: "4px 10px", background: "var(--surface2)",
                border: "1px solid var(--accent)", borderRadius: 6,
                color: "var(--text)", fontSize: 12, outline: "none", width: 140,
                fontFamily: "Inter, sans-serif",
              }}
            />
            {/* Color swatches inline (compact) */}
            <div style={{ display: "flex", gap: 4 }}>
              {COLOR_PALETTE.slice(0, 8).map(c => (
                <button key={c} onClick={() => setNewColor(c)} style={{
                  width: 18, height: 18, borderRadius: 4, background: c,
                  border: newColor === c ? "2px solid white" : "1px solid transparent",
                  cursor: "pointer", boxSizing: "border-box", flexShrink: 0,
                }} />
              ))}
            </div>
            <button onClick={handleAdd} className="btn btn-primary" style={{ padding: "4px 10px", fontSize: 12 }}>Add</button>
            <button onClick={resetForm} style={{ padding: "4px 8px", background: "transparent", color: "var(--muted)", border: "none", fontSize: 13, cursor: "pointer" }}>✕</button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginLeft: "auto" }}>
            <button
              onClick={() => setAdding(true)}
              style={{
                padding: "3px 10px", background: "transparent",
                border: "1px dashed var(--border)", borderRadius: 5,
                color: "var(--muted)", fontSize: 11, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4,
                transition: "all 0.15s", fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent2)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
            >+ Category</button>
            <button
              onClick={() => { resetForm(); setManaging(true); }}
              style={{
                padding: "3px 10px", background: "transparent",
                border: "1px solid var(--border)", borderRadius: 5,
                color: "var(--muted)", fontSize: 11, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4,
                transition: "all 0.15s", fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent2)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
            >⚙ Manage</button>
          </div>
        )}
      </div>
    </>
  );
}
