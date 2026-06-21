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
      padding: "14px 16px",
      background: "var(--surface)",
      borderTop: "1px solid var(--border)",
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      alignItems: "center",
    }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: 4 }}>
        Legend
      </span>
      {categories.map(cat => (
        <div key={cat.id} style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "3px 8px",
          borderRadius: 6,
          background: "var(--surface2)",
          border: "1px solid var(--border)",
          fontSize: 12,
          color: "var(--text)",
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: cat.color, flexShrink: 0 }} />
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
            }}
          />
          <button onClick={handleAdd} style={{
            padding: "4px 10px",
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontSize: 12,
            cursor: "pointer",
            fontWeight: 600,
          }}>Add</button>
          <button onClick={() => setAdding(false)} style={{
            padding: "4px 8px",
            background: "transparent",
            color: "var(--muted)",
            border: "none",
            fontSize: 12,
            cursor: "pointer",
          }}>✕</button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{
          padding: "3px 10px",
          background: "transparent",
          border: "1px dashed var(--border)",
          borderRadius: 6,
          color: "var(--muted)",
          fontSize: 12,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 4,
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--accent2)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}
        >+ Add Category</button>
      )}
    </div>
  );
}
