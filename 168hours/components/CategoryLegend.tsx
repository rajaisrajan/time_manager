"use client";
import { Category } from "@/lib/types";
import { useState } from "react";
import { saveCustomCategory, getCategories } from "@/lib/storage";

interface Props {
  categories: Category[];
  onCategoriesChange: (cats: Category[]) => void;
}

export default function CategoryLegend({ categories, onCategoriesChange }: Props) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  function handleAdd() {
    if (!newName.trim()) return;
    saveCustomCategory(newName.trim());
    onCategoriesChange(getCategories());
    setNewName("");
    setAdding(false);
  }

  return (
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
      )}
    </div>
  );
}
