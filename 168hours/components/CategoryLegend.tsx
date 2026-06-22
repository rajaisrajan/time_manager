"use client";
import { Category } from "@/lib/types";
import { useState } from "react";
import { saveCustomCategory, getCategories, deleteCustomCategory } from "@/lib/storage";

interface Props {
  categories: Category[];
  onCategoriesChange: (cats: Category[]) => void;
}

export default function CategoryLegend({ categories, onCategoriesChange }: Props) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [managing, setManaging] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleAdd() {
    if (!newName.trim()) return;
    await saveCustomCategory(newName.trim());
    const cats = await getCategories();
    onCategoriesChange(cats);
    setNewName("");
    setAdding(false);
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
            maxWidth: 480,
            maxHeight: "80vh",
            overflowY: "auto",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            fontFamily: "Inter, sans-serif",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.3px" }}>
                Manage Categories
              </div>
              <button
                onClick={() => setManaging(false)}
                style={{ background: "transparent", border: "none", color: "var(--muted)", fontSize: 18, cursor: "pointer", lineHeight: 1 }}
              >✕</button>
            </div>

            {/* Default Categories */}
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
              Default Categories
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
              {defaultCats.map(cat => (
                <div key={cat.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px",
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: cat.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{cat.name}</span>
                  <span style={{ fontSize: 10, color: "var(--muted)", fontStyle: "italic" }}>built-in</span>
                </div>
              ))}
            </div>

            {/* Custom Categories */}
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
              Custom Categories
            </div>
            {customCats.length === 0 ? (
              <div style={{ fontSize: 12, color: "var(--muted)", padding: "12px", background: "var(--surface2)", borderRadius: 10, textAlign: "center", marginBottom: 16 }}>
                No custom categories yet
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                {customCats.map(cat => (
                  <div key={cat.id} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px",
                    background: `${cat.color}12`,
                    border: `1px solid ${cat.color}40`,
                    borderRadius: 10,
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
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: deleting === cat.id ? "not-allowed" : "pointer",
                        padding: "4px 10px",
                        fontFamily: "Inter, sans-serif",
                        transition: "all 0.15s",
                      }}
                    >
                      {deleting === cat.id ? "Removing…" : "Remove"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new inline */}
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginTop: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
                Add New Category
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleAdd(); }}
                  placeholder="Category name…"
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    background: "var(--surface2)",
                    border: "1px solid var(--accent)",
                    borderRadius: 8,
                    color: "var(--text)",
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
                <button
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="btn btn-primary"
                  style={{ padding: "8px 16px", fontSize: 13, opacity: newName.trim() ? 1 : 0.5 }}
                >Add</button>
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
          fontSize: 10,
          fontWeight: 700,
          color: "var(--muted)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginRight: 4,
          flexShrink: 0,
          fontFamily: "Inter, sans-serif",
        }}>Legend</span>

        {categories.map(cat => (
          <div key={cat.id} style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 8px",
            borderRadius: 5,
            background: `${cat.color}15`,
            border: `1px solid ${cat.color}40`,
            fontSize: 11,
            fontWeight: 600,
            color: cat.color,
            fontFamily: "Inter, sans-serif",
            flexShrink: 0,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: 1, background: cat.color, flexShrink: 0 }} />
            {cat.name}
          </div>
        ))}

        {adding ? (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setAdding(false); }}
              placeholder="Category name"
              style={{
                padding: "4px 10px",
                background: "var(--surface2)",
                border: "1px solid var(--accent)",
                borderRadius: 6,
                color: "var(--text)",
                fontSize: 12,
                outline: "none",
                width: 140,
                fontFamily: "Inter, sans-serif",
                boxShadow: "0 0 0 3px var(--accent-glow)",
              }}
            />
            <button onClick={handleAdd} className="btn btn-primary" style={{ padding: "4px 10px", fontSize: 12 }}>Add</button>
            <button onClick={() => setAdding(false)} style={{ padding: "4px 8px", background: "transparent", color: "var(--muted)", border: "none", fontSize: 13, cursor: "pointer" }}>✕</button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginLeft: "auto" }}>
            <button
              onClick={() => setAdding(true)}
              style={{
                padding: "3px 10px",
                background: "transparent",
                border: "1px dashed var(--border)",
                borderRadius: 5,
                color: "var(--muted)",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                transition: "all 0.15s",
                fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent2)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--muted)";
              }}
            >+ Category</button>
            <button
              onClick={() => setManaging(true)}
              style={{
                padding: "3px 10px",
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: 5,
                color: "var(--muted)",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                transition: "all 0.15s",
                fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent2)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--muted)";
              }}
            >⚙ Manage</button>
          </div>
        )}
      </div>
    </>
  );
}
