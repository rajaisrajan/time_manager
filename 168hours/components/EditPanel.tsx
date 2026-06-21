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
  bulkCount?: number;
}

export default function EditPanel({ entry, day, hour, categories, onSave, onClear, onClose, isMobile, bulkCount }: Props) {
  const [category, setCategory] = useState(entry?.category || "");
  const [title, setTitle] = useState(entry?.title || "");
  const [notes, setNotes] = useState(entry?.notes || "");

  useEffect(() => {
    setCategory(entry?.category || "");
    setTitle(entry?.title || "");
    setNotes(entry?.notes || "");
  }, [entry, day, hour]);

  const isBulk = (bulkCount ?? 0) > 1;

  function handleSave() {
    if (!category) return;
    onSave({ category, title, notes });
    onClose();
  }

  const timeLabel = `${formatHour24(hour)} – ${formatHour24(hour + 1 > 23 ? 0 : hour + 1)}`;

  /* ---- Desktop side panel ---- */
  if (!isMobile) {
    return (
      <div
        className="slide-right"
        style={{
          position: "fixed",
          top: 52,
          right: 0,
          bottom: 0,
          width: 300,
          background: "var(--surface)",
          borderLeft: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          zIndex: 100,
          boxShadow: "-16px 0 48px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "18px 20px 14px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}>
          <div>
            {isBulk ? (
              <>
                <div style={{ fontSize: 11, color: "var(--accent2)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Bulk Fill</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{bulkCount} hours selected</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, marginBottom: 3 }}>
                  {DAYS[day]} · {timeLabel}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Edit Hour</div>
              </>
            )}
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 7,
            background: "var(--surface2)", border: "1px solid var(--border)",
            color: "var(--muted)", fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
          <FieldBlock label="Category">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {categories.map(cat => {
                const active = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "5px 10px", borderRadius: 7,
                      border: `1.5px solid ${active ? cat.color : "var(--border)"}`,
                      background: active ? `${cat.color}20` : "var(--surface2)",
                      color: active ? cat.color : "var(--muted)",
                      fontSize: 12, fontWeight: active ? 700 : 500,
                      cursor: "pointer", transition: "all 0.12s",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: 2, background: cat.color, flexShrink: 0, display: "block" }} />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </FieldBlock>

          <FieldBlock label="Title">
            <input
              className="field"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSave()}
              placeholder="Short description…"
            />
          </FieldBlock>

          {!isBulk && (
            <FieldBlock label="Notes">
              <textarea
                className="field"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Optional notes…"
                rows={3}
                style={{ resize: "vertical" }}
              />
            </FieldBlock>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!category}
            style={{ flex: 1, opacity: category ? 1 : 0.4, cursor: category ? "pointer" : "not-allowed" }}
          >
            {isBulk ? `Fill ${bulkCount} Hours` : "Save"}
          </button>
          {!isBulk && entry?.category && (
            <button
              onClick={() => { onClear(); onClose(); }}
              style={{
                padding: "8px 14px", borderRadius: 10,
                background: "transparent", border: "1px solid #f8717130",
                color: "#f87171", fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: "Inter, sans-serif", transition: "all 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8717115"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >Clear</button>
          )}
        </div>
      </div>
    );
  }

  /* ---- Mobile bottom drawer ---- */
  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.65)", zIndex: 199,
        backdropFilter: "blur(4px)",
      }} />
      <div className="slide-up" style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "20px 20px 0 0",
        zIndex: 200,
        boxShadow: "0 -24px 64px rgba(0,0,0,0.7)",
        maxHeight: "85vh",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)" }} />
        </div>

        <div style={{ padding: "0 20px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            {isBulk
              ? <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{bulkCount} hours selected</div>
              : (
                <>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{DAYS[day]} · {timeLabel}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Edit Hour</div>
                </>
              )
            }
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 8,
            background: "var(--surface2)", border: "1px solid var(--border)",
            color: "var(--muted)", fontSize: 14, cursor: "pointer",
          }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
          <FieldBlock label="Category">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {categories.map(cat => {
                const active = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 12px", borderRadius: 8,
                      border: `1.5px solid ${active ? cat.color : "var(--border)"}`,
                      background: active ? `${cat.color}20` : "var(--surface2)",
                      color: active ? cat.color : "var(--muted)",
                      fontSize: 13, fontWeight: active ? 700 : 500,
                      cursor: "pointer", transition: "all 0.12s",
                      fontFamily: "Inter, sans-serif",
                      minHeight: 44,
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: cat.color, display: "block" }} />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </FieldBlock>

          <FieldBlock label="Title">
            <input
              className="field"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Short description…"
              style={{ fontSize: 16 }}
            />
          </FieldBlock>

          {!isBulk && (
            <FieldBlock label="Notes">
              <textarea
                className="field"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Optional notes…"
                rows={3}
                style={{ resize: "none", fontSize: 15 }}
              />
            </FieldBlock>
          )}
        </div>

        <div style={{ padding: "12px 20px 28px", borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!category}
            style={{ flex: 1, opacity: category ? 1 : 0.4, minHeight: 48, fontSize: 15 }}
          >
            {isBulk ? `Fill ${bulkCount} Hours` : "Save"}
          </button>
          {!isBulk && entry?.category && (
            <button
              onClick={() => { onClear(); onClose(); }}
              style={{
                padding: "0 18px", borderRadius: 10, minHeight: 48,
                background: "transparent", border: "1px solid #f8717130",
                color: "#f87171", fontSize: 14, fontWeight: 600, cursor: "pointer",
                fontFamily: "Inter, sans-serif",
              }}
            >Clear</button>
          )}
        </div>
      </div>
    </>
  );
}

function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 700, color: "var(--muted)",
        textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8,
        fontFamily: "Inter, sans-serif",
      }}>{label}</label>
      {children}
    </div>
  );
}
