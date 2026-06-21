"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { HourEntry, Category } from "@/lib/types";
import { getCategoryColor, getCategoryById } from "@/lib/categories";
import { formatHour24 } from "@/lib/utils";
import { setEntries, setEntry, clearEntry, getEntryAt } from "@/lib/storage";
// storage fns are now async — callers pass currentEntries
import EditPanel from "./EditPanel";

function getPillTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 0.45 ? "#111827" : "#ffffff";
}

function abbreviateCat(name: string): string {
  const first = name.split(" ")[0];
  return first.length <= 6 ? first.toUpperCase() : first.slice(0, 6).toUpperCase();
}

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
  const [showPanel, setShowPanel] = useState(false);
  const didDragRef = useRef(false);

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

  /* ---- Mouse drag (desktop) ---- */
  function handleMouseDown(day: number, hour: number, e: React.MouseEvent) {
    e.preventDefault();
    didDragRef.current = false;
    setIsDragging(true);
    setDragStart({ day, hour });
    setSelected(new Set([key(day, hour)]));
    setShowPanel(false);
  }

  function handleMouseEnter(day: number, hour: number) {
    if (!isDragging || !dragStart) return;
    didDragRef.current = true;
    const minDay = Math.min(dragStart.day, day);
    const maxDay = Math.max(dragStart.day, day);
    const minHour = Math.min(dragStart.hour, hour);
    const maxHour = Math.max(dragStart.hour, hour);
    const s = new Set<string>();
    for (let d = minDay; d <= maxDay; d++)
      for (let h = minHour; h <= maxHour; h++) s.add(key(d, h));
    setSelected(s);
  }

  function handleMouseUp(day: number, hour: number) {
    if (!isDragging) return;
    setIsDragging(false);
    const isSingleClick = !didDragRef.current;
    setEditTarget(isSingleClick ? { day, hour } : null);
    setShowPanel(true);
    didDragRef.current = false;
  }

  useEffect(() => {
    function onGlobalMouseUp() {
      if (isDragging) {
        setIsDragging(false);
        if (selected.size > 1) { setEditTarget(null); setShowPanel(true); }
        didDragRef.current = false;
      }
    }
    window.addEventListener("mouseup", onGlobalMouseUp);
    return () => window.removeEventListener("mouseup", onGlobalMouseUp);
  }, [isDragging, selected]);

  /* ---- Touch drag (mobile) ---- */
  const touchStartRef = useRef<{ day: number; hour: number } | null>(null);

  function handleTouchStart(day: number, hour: number) {
    touchStartRef.current = { day, hour };
    setSelected(new Set([key(day, hour)]));
    setIsDragging(true);
    didDragRef.current = false;
  }

  function handleTouchMove(e: React.TouchEvent) {
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!el) return;
    const d = parseInt(el.getAttribute("data-day") ?? "-1");
    const h = parseInt(el.getAttribute("data-hour") ?? "-1");
    if (d < 0 || h < 0 || !touchStartRef.current) return;
    didDragRef.current = true;
    const { day: sd, hour: sh } = touchStartRef.current;
    const minDay = Math.min(sd, d), maxDay = Math.max(sd, d);
    const minHour = Math.min(sh, h), maxHour = Math.max(sh, h);
    const s = new Set<string>();
    for (let dd = minDay; dd <= maxDay; dd++)
      for (let hh = minHour; hh <= maxHour; hh++) s.add(key(dd, hh));
    setSelected(s);
  }

  function handleTouchEnd(day: number, hour: number) {
    setIsDragging(false);
    const isSingleTap = !didDragRef.current;
    setEditTarget(isSingleTap ? { day, hour } : null);
    setShowPanel(true);
    didDragRef.current = false;
  }

  /* ---- Save / clear ---- */
  async function handleSave(data: Partial<HourEntry>) {
    if (selected.size > 1 || !editTarget) {
      const slots = Array.from(selected).map(k => {
        const [d, h] = k.split("-").map(Number);
        return { day: d, hour: h };
      });
      onEntriesChange(await setEntries(weekId, slots, data, entries));
    } else {
      onEntriesChange(await setEntry(weekId, editTarget.day, editTarget.hour, data, entries));
    }
    setShowPanel(false);
    setSelected(new Set());
    setEditTarget(null);
  }

  async function handleClear() {
    if (!editTarget) return;
    onEntriesChange(await clearEntry(weekId, editTarget.day, editTarget.hour, entries));
  }

  function handleClose() {
    setShowPanel(false);
    setSelected(new Set());
    setEditTarget(null);
  }

  const panelEntry = editTarget ? getEntry(editTarget.day, editTarget.hour) || null : null;
  const bulkCount = selected.size > 1 ? selected.size : undefined;

  const BLOCK_H = isMobile ? 34 : 40;
  const LABEL_W = isMobile ? 42 : 50;
  const COL_MIN = isMobile ? 80 : 108;

  return (
    <div style={{ position: "relative", flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Scrollable grid */}
      <div
        style={{
          flex: 1,
          overflowX: "auto",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
        }}
        onMouseLeave={() => { if (isDragging) setIsDragging(false); }}
        onTouchMove={handleTouchMove}
      >
        <div style={{
          display: "grid",
          gridTemplateColumns: `${LABEL_W}px repeat(7, minmax(${COL_MIN}px, 1fr))`,
          minWidth: LABEL_W + COL_MIN * 7,
        }}>
          {/* Sticky header row */}
          <div style={headerCell(LABEL_W)} />
          {DAYS.map((day, d) => (
            <div key={day} style={{
              ...headerCell(0),
              color: d >= 5 ? "var(--accent2)" : "var(--text-dim)",
              borderRight: d < 6 ? "1px solid var(--border)" : "none",
            }}>{day}</div>
          ))}

          {/* Hour rows */}
          {HOURS.map(hour => (
            <React.Fragment key={hour}>
              {/* Hour label */}
              <div style={{
                position: "sticky",
                left: 0,
                zIndex: 5,
                background: "var(--bg)",
                height: BLOCK_H,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: 8,
                fontSize: 10,
                fontWeight: 700,
                fontFamily: "Inter, sans-serif",
                color: "var(--muted)",
                borderRight: "1px solid var(--border)",
                borderBottom: "1px solid var(--border-dim)",
                flexShrink: 0,
                letterSpacing: "0.03em",
              }}>
                {formatHour24(hour)}
              </div>

              {/* Day cells */}
              {DAYS.map((_, d) => {
                const entry = getEntry(d, hour);
                const catColor = entry?.category ? getCategoryColor(categories, entry.category) : null;
                const catObj = entry?.category ? getCategoryById(categories, entry.category) : null;
                const k = key(d, hour);
                const isSelected = selected.has(k);

                const pillText = getPillTextColor(catColor ?? "#334155");

                return (
                  <div
                    key={`${d}-${hour}`}
                    data-day={d}
                    data-hour={hour}
                    className={`hour-block${isSelected ? " selected" : ""}`}
                    onMouseDown={e => handleMouseDown(d, hour, e)}
                    onMouseEnter={() => handleMouseEnter(d, hour)}
                    onMouseUp={() => handleMouseUp(d, hour)}
                    onTouchStart={() => handleTouchStart(d, hour)}
                    onTouchEnd={() => handleTouchEnd(d, hour)}
                    style={{
                      height: BLOCK_H,
                      background: "transparent",
                      borderRight: d < 6 ? "1px solid var(--border-dim)" : "none",
                      borderBottom: "1px solid var(--border-dim)",
                      overflow: "hidden",
                      padding: 2,
                    }}
                  >
                    {catColor && catObj ? (
                      /* Filled cell — pill badge style */
                      <div style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 4,
                        background: `${catColor}14`,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "0 4px",
                        overflow: "hidden",
                      }}>
                        {/* Pill */}
                        <div style={{
                          flexShrink: 0,
                          background: catColor,
                          color: pillText,
                          borderRadius: 99,
                          padding: "1px 5px",
                          fontSize: 8,
                          fontWeight: 700,
                          fontFamily: "Inter, sans-serif",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                          lineHeight: 1.4,
                        }}>
                          {abbreviateCat(catObj.name)}
                        </div>
                        {/* Title */}
                        {entry?.title && (
                          <div style={{
                            fontSize: 9,
                            fontFamily: "Inter, sans-serif",
                            color: "rgba(240,244,255,0.7)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            lineHeight: 1.3,
                            fontWeight: 500,
                          }}>
                            {entry.title}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Empty cell */
                      <div style={{ width: "100%", height: "100%", borderRadius: 4 }} />
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Edit / Bulk panel */}
      {showPanel && (
        <EditPanel
          entry={panelEntry}
          day={editTarget?.day ?? 0}
          hour={editTarget?.hour ?? 0}
          categories={categories}
          onSave={handleSave}
          onClear={handleClear}
          onClose={handleClose}
          isMobile={isMobile}
          bulkCount={bulkCount}
        />
      )}
    </div>
  );
}

/* Header cell style */
function headerCell(w: number): React.CSSProperties {
  return {
    position: "sticky",
    top: 0,
    zIndex: 20,
    background: "var(--surface)",
    borderBottom: "1px solid var(--border)",
    padding: "8px 4px",
    textAlign: "center",
    fontSize: 11,
    fontWeight: 800,
    fontFamily: "Inter, sans-serif",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    ...(w ? { width: w, flexShrink: 0 } : {}),
  };
}
