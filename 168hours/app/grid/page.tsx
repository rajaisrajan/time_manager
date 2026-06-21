"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getWeekId, getWeekEntries, offsetWeekId, duplicatePreviousWeek, exportToCSV, exportToJSON, getCategories } from "@/lib/storage";
import { getWeekLabel } from "@/lib/utils";
import { HourEntry, Category } from "@/lib/types";
import Navbar from "@/components/Navbar";
import WeeklyGrid from "@/components/WeeklyGrid";
import CategoryLegend from "@/components/CategoryLegend";
import { exportToPDF } from "@/lib/pdfExport";
import { FileText, FileJson, BarChart2 } from "lucide-react";

export default function GridPage() {
  const router = useRouter();
  const [weekId, setWeekId] = useState(() => getWeekId());
  const [entries, setEntries] = useState<HourEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showExport, setShowExport] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/login"); return; }
    setMounted(true);
    setCategories(getCategories());
    setEntries(getWeekEntries(weekId));
  }, [router]);

  useEffect(() => {
    if (mounted) setEntries(getWeekEntries(weekId));
  }, [weekId, mounted]);

  // Close export dropdown on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExport(false);
      }
    }
    if (showExport) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showExport]);

  if (!mounted) return null;

  const logged = entries.filter(e => e.category).length;
  const pct = Math.round((logged / 168) * 100);

  async function handleExport(format: "csv" | "json" | "pdf") {
    setShowExport(false);
    if (format === "pdf") {
      setPdfLoading(true);
      try { await exportToPDF(weekId, entries, categories); }
      finally { setPdfLoading(false); }
      return;
    }
    const content = format === "csv" ? exportToCSV(weekId) : exportToJSON(weekId);
    const blob = new Blob([content], { type: format === "csv" ? "text/csv" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `168hours-${weekId}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleDuplicate() {
    setEntries(duplicatePreviousWeek(weekId));
  }

  const toolbarBtnStyle: React.CSSProperties = {
    padding: "6px 12px",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text-dim)",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 5,
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Navbar />

      {/* Toolbar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 16px",
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        flexWrap: "wrap",
        minHeight: 52,
      }}>
        {/* Week nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => setWeekId(w => offsetWeekId(w, -1))}
            style={{ ...toolbarBtnStyle, padding: "6px 10px", fontSize: 14 }}
          >‹</button>
          <div style={{ textAlign: "center", minWidth: 160 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", fontFamily: "Inter, sans-serif", letterSpacing: "-0.2px" }}>
              {getWeekLabel(weekId)}
            </div>
            <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>{weekId}</div>
          </div>
          <button
            onClick={() => setWeekId(w => offsetWeekId(w, 1))}
            style={{ ...toolbarBtnStyle, padding: "6px 10px", fontSize: 14 }}
          >›</button>
          <button
            onClick={() => setWeekId(getWeekId())}
            style={{ ...toolbarBtnStyle, padding: "5px 10px", fontSize: 11, color: "var(--muted)" }}
          >Today</button>
        </div>

        {/* Progress */}
        <div style={{ flex: 1, minWidth: 100, maxWidth: 200 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>{logged}/168</span>
            <span style={{ fontSize: 10, color: "var(--accent2)", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>{pct}%</span>
          </div>
          <div style={{ height: 3, background: "var(--surface2)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${pct}%`,
              background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
              borderRadius: 2,
              transition: "width 0.4s ease",
              boxShadow: "0 0 6px rgba(139,92,246,0.6)",
            }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
          <button onClick={handleDuplicate} style={toolbarBtnStyle}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent2)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-dim)"; }}
          >⎘ Copy Last Week</button>

          {/* Export dropdown */}
          <div style={{ position: "relative" }} ref={exportRef}>
            <button
              onClick={() => setShowExport(v => !v)}
              style={{ ...toolbarBtnStyle, ...(showExport ? { borderColor: "var(--accent)", color: "var(--accent2)" } : {}) }}
            >
              {pdfLoading ? "⏳" : "↓"} Export
            </button>
            {showExport && (
              <div className="fade-in" style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                overflow: "hidden",
                zIndex: 50,
                minWidth: 160,
                boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
              }}>
                {(["csv","json","pdf"] as const).map((fmt, i, arr) => (
                  <button
                    key={fmt}
                    onClick={() => handleExport(fmt)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "11px 16px",
                      background: "transparent",
                      border: "none",
                      borderBottom: i < arr.length - 1 ? "1px solid var(--border-dim)" : "none",
                      color: "var(--text-dim)",
                      fontSize: 13,
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.color = "var(--accent2)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-dim)"; }}
                  >
                    <span style={{ display:"flex", alignItems:"center" }}>{fmt === "csv" ? <BarChart2 size={14} /> : fmt === "json" ? <FileJson size={14} /> : <FileText size={14} />}</span>
                    Export as .{fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <WeeklyGrid
        weekId={weekId}
        entries={entries}
        categories={categories}
        onEntriesChange={setEntries}
      />

      {/* Legend */}
      <CategoryLegend
        categories={categories}
        onCategoriesChange={setCategories}
      />
    </div>
  );
}
