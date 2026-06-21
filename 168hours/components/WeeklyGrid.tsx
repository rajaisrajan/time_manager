"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { HourEntry, Category } from "@/lib/types";
import { getCategoryColor, getCategoryById } from "@/lib/categories";
import { formatHour24 } from "@/lib/utils";
import { setEntries, setEntry, clearEntry, getEntryAt } from "@/lib/storage";
import EditPanel from "./EditPanel";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface Props {
  weekId: string;
  entries: HourEntry[];
  categories: Category[];
  onEntriesChange: (entries: HourEntry[]) => void;
}

export default function WeeklyGrid({ weekId, entries, categories, onEntriesChange }: Props) {
  const [editTarget, setEditTarget] = useState<{ day: number; hour: number } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ day: number; hour: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [bulkPanel, setBulkPanel] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const key = (d: number, h: number) => `${d}-${h}`;

  const getEntry = useCallback((day: number, hour: number) => {
    return getEntryAt(entries, day, hour);
  }, [entries]);

  function handleMouseDown(day: number, hour: number, e: React.MouseEvent) {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ day, hour });
    const k = key(day, hour);
    setSelected(new Set([k]));
  }

  function handleMouseEnter(day: number, hour: number) {
    if (!isDragging || !dragStart) return;
    const minDay = Math.min(dragStart.day, day);
    const maxDay = Math.max(dragStart.day, day);
    const minHour = Math.min(dragStart.hour, hour);
    const maxHour = Math.max(dragStart.hour, hour);
    const newSelected = new Set<string>();
    for (let d = minDay; d <= maxDay; d++) {
      for (let h = minHour; h <= maxHour; h++) {
        newSelected.add(key(d, h));
      }
    }
    setSelected(newSelected);
  }

  function handleMouseUp(day: number, hour: number) {
    setIsDragging(false);
    if (selected.size <= 1) {
      setEditTarget({ day, hour });
      setBulkPanel(false);
    } else {
      setBulkPanel(true);
      setEditTarget(null);
    }
  }

  useEffect(() => {
    function handleGlobalMouseUp() {
      if (isDragging) {
        setIsDragging(false);
        if (selected.size > 1) {
          setBulkPanel(true);
          setEditTarget(null);
        }
      }
    }
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging, selected]);

  function handleSingle(data: Partial<HourEntry>) {
    if (!editTarget) return;
    const newEntries = setEntry(weekId, editTarget.day, editTarget.hour, data);
    onEntriesChange(newEntries);
    setEditTarget(null);
    setSelected(new Set());
  }

  function handleBulkSave(data: Partial<HourEntry>) {
    const slots = Array.from(selected).map(k => {
      const [d, h] = k.split("-").map(Number);
      return { day: d, hour: h };
    });
    const newEntries = setEntries(weekId, slots, data);
    onEntriesChange(newEntries);
    setBulkPanel(false);
    setSelected(new Set());
  }

  function handleClear() {
    if (!editTarget) return;
    const newEntries = clearEntry(weekId, editTarget.day, editTarget.hour);
    onEntriesChange(newEntries);
  }

  const showPanel = editTarget !== null || bulkPanel;

  return (
    <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
      <div
        ref={gridRef}
        style={{
          overflowX: "auto",
          overflowY: "auto",
          height: "100%",
          WebkitOverflowScrolling: "touch",
        }}
        onMouseLeave={() => { if (isDragging) setIsDragging(false); }}
      >
        <div style={{
          display: "grid",
          gridTemplateColumns: `52px repeat(7, minmax(${isMobile ? 88 : 110}px, 1fr))`,
          minWidth: isMobile ? 672 : 822,
        }}>
          {/* Header row */}
          <div style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--bg)", borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border)" }} />
          {DAYS.map((day, d) => (
            <div
              key={day}
              style={{
                position: "sticky",
                top: 0,
                zIndex: 20,
                background: "var(--surface)",
                borderBottom: "1px solid var(--border)",
                borderRight: d < 6 ? "1px solid var(--border)" : "none",
                padding: "8px 4px",
                textAlign: "center",
                fontSize: 12,
                fontWeight: 700,
                color: d >= 5 ? "var(--accent2)" : "var(--text)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {day}
            </div>
          ))}

          {/* Hour rows */}
          {HOURS.map(hour => (
            <>
              <div
                key={`label-${hour}`}
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 10,
                  background: "var(--bg)",
                  borderRight: "1px solid var(--border)",
                  borderBottom: "1px solid var(--border)20",
                  padding: "0 6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  height: isMobile ? 36 : 42,
                  fontSize: 10,
                  fontWeight: 600,
                  color: "var(--muted)",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
              >
                {formatHour24(hour)}
              </div>
              {DAYS.map((_, d) => {
                const entry = getEntry(d, hour);
                const catColor = entry?.category ? getCategoryColor(categories, entry.category) : null;
                const catObj = entry?.category ? getCategoryById(categories, entry.category) : null;
                const k = key(d, hour);
                const isSelected = selected.has(k);
                const isDrag = isDragging && isSelected;

                return (
                  <div
                    key={`${d}-${hour}`}
                    className={`hour-block${isSelected ? " selected" : ""}${isDrag ? " dragging" : ""}`}
                    onMouseDown={e => handleMouseDown(d, hour, e)}
                    onMouseEnter={() => handleMouseEnter(d, hour)}
                    onMouseUp={() => handleMouseUp(d, hour)}
                    onClick={() => {
                      if (!isDragging && selected.size <= 1) {
                        setSelected(new Set([k]));
                        setEditTarget({ day: d, hour });
                        setBulkPanel(false);
                      }
                    }}
                    style={{
                      height: isMobile ? 36 : 42,
                      background: catColor ? `${catColor}cc` : "var(--surface2)12",
                      borderRight: d < 6 ? "1px solid var(--border)20" : "none",
                      borderBottom: "1px solid var(--border)18",
                      overflow: "hidden",
                      padding: "2px 5px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    {catColor && (
                      <div style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 3,
                        background: catColor,
                        borderRadius: "0 1px 1px 0",
                      }} />
                    )}
                    {catObj && (
                      <div style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: catColor ? "#fff" : "var(--muted)",
                        opacity: 0.9,
                        lineHeight: 1.2,
                        paddingLeft: 4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        {catObj.name}
                      </div>
                    )}
                    {entry?.title && (
                      <div style={{
                        fontSize: 10,
                        color: "rgba(255,255,255,0.7)",
                        lineHeight: 1.2,
                        paddingLeft: 4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        {entry.title}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Edit Panel */}
      {showPanel && (
        bulkPanel ? (
          <BulkEditPanel
            count={selected.size}
            categories={categories}
            onSave={handleBulkSave}
            onClose={() => { setBulkPanel(false); setSelected(new Set()); }}
            isMobile={isMobile}
          />
        ) : editTarget ? (
          <EditPanel
            entry={getEntry(editTarget.day, editTarget.hour) || null}
            day={editTarget.day}
            hour={editTarget.hour}
            categories={categories}
            onSave={handleSingle}
            onClear={handleClear}
            onClose={() => { setEditTarget(null); setSelected(new Set()); }}
            isMobile={isMobile}
          />
        ) : null
      )}
    </div>
  );
}

function BulkEditPanel({ count, categories, onSave, onClose, isMobile }: {
  count: number;
  categories: Category[];
  onSave: (data: Partial<HourEntry>) => void;
  onClose: () => void;
  isMobile: boolean;
}) {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");

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

  return (
    <>
      {isMobile && (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 199 }} />
      )}
      <div style={panelStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 2 }}>Bulk Fill</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: 0 }}>
              {count} hour{count !== 1 ? "s" : ""} selected
            </h3>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--muted)", fontSize: 20, cursor: "pointer" }}>✕</button>
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
              placeholder="e.g. Sleep, Work session..."
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

          <button
            onClick={() => { if (category) onSave({ category, title }); }}
            disabled={!category}
            style={{
              padding: "12px",
              background: category ? "linear-gradient(135deg, #1d4ed8, #3b82f6)" : "var(--border)",
              color: category ? "#fff" : "var(--muted)",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: category ? "pointer" : "not-allowed",
              boxShadow: category ? "0 4px 12px rgba(59,130,246,0.25)" : "none",
            }}
          >
            Fill {count} Hour{count !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </>
  );
}
