"use client";
import { useState, useEffect } from "react";
import { HourEntry, Category } from "@/lib/types";
import { formatHour24 } from "@/lib/utils";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

interface Props {
  entry: HourEntry | null;
  day: number;
  hour: number;
  categories: Category[];
  onSave: (data: Partial<HourEntry>) => void;
  onClear: () => void;
  onClose: () => void;
  isMobile: boolean;
}

export default function EditPanel({ entry, day, hour, categories, onSave, onClear, onClose, isMobile }: Props) {
  const [category, setCategory] = useState(entry?.category || "");
  const [title, setTitle] = useState(entry?.title || "");
  const [notes, setNotes] = useState(entry?.notes || "");

  useEffect(() => {
    setCategory(entry?.category || "");
    setTitle(entry?.title || "");
    setNotes(entry?.notes || "");
  }, [entry, day, hour]);

  function handleSave() {
    if (!category) return;
    onSave({ category, title, notes });
    onClose();
  }

  const panelStyle: React.CSSProperties = isMobile ? {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "16px 16px 0 0",
    padding: "20px",
    zIndex: 200,
    boxShadow: "0 -16px 48px rgba(0,0,0,0.6)",
    animation: "slideUp 0.22s ease",
    maxHeight: "80vh",
    overflowY: "auto",
  } : {
    position: "fixed",
    top: 56,
    right: 0,
    bottom: 0,
    width: 320,
    background: "var(--surface)",
    borderLeft: "1px solid var(--border)",
    padding: "24px",
    zIndex: 100,
    boxShadow: "-12px 0 40px rgba(0,0,0,0.4)",
    animation: "slideRight 0.22s ease",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  };

  const selectedCat = categories.find(c => c.id === category);

  return (
    <>
      {isMobile && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 199,
          }}
        />
      )}
      <div style={panelStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isMobile ? 16 : 0 }}>
          <div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 2 }}>
              {DAYS[day]} · {formatHour24(hour)} – {formatHour24(hour + 1 > 23 ? 0 : hour + 1)}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: 0 }}>
              Edit Hour
            </h3>
          </div>
          <button onClick={onClose} style={{
            background: "transparent",
            border: "none",
            color: "var(--muted)",
            fontSize: 20,
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: 6,
            lineHeight: 1,
          }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              Category
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: `2px solid ${category === cat.id ? cat.color : "var(--border)"}`,
                    background: category === cat.id ? `${cat.color}22` : "var(--surface2)",
                    color: category === cat.id ? cat.color : "var(--muted)",
                    fontSize: 13,
                    fontWeight: category === cat.id ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.12s",
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: cat.color }} />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              Title
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={selectedCat ? `e.g. ${selectedCat.name} block` : "Short description"}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: "var(--text)",
                fontSize: 14,
                outline: "none",
              }}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              Notes
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Optional notes..."
              rows={3}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: "var(--text)",
                fontSize: 14,
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
              }}
              onFocus={e => e.target.style.borderColor = "var(--accent)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleSave}
              disabled={!category}
              style={{
                flex: 1,
                padding: "11px",
                background: category ? "linear-gradient(135deg, #1d4ed8, #3b82f6)" : "var(--border)",
                color: category ? "#fff" : "var(--muted)",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: category ? "pointer" : "not-allowed",
                boxShadow: category ? "0 4px 12px rgba(59,130,246,0.25)" : "none",
                transition: "all 0.15s",
              }}
            >
              Save
            </button>
            {entry?.category && (
              <button
                onClick={() => { onClear(); onClose(); }}
                style={{
                  padding: "11px 16px",
                  background: "transparent",
                  border: "1px solid #dc262633",
                  color: "#f87171",
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#dc262618"}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
