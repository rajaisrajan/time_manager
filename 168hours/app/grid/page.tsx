"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getWeekId, getWeekEntries, offsetWeekId, duplicatePreviousWeek, exportToCSV, exportToJSON, getCategories } from "@/lib/storage";
import { getWeekLabel } from "@/lib/utils";
import { HourEntry, Category } from "@/lib/types";
import Navbar from "@/components/Navbar";
import WeeklyGrid from "@/components/WeeklyGrid";
import CategoryLegend from "@/components/CategoryLegend";
import QuickFill from "@/components/QuickFill";

export default function GridPage() {
  const router = useRouter();
  const [weekId, setWeekId] = useState(() => getWeekId());
  const [entries, setEntries] = useState<HourEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showQuickFill, setShowQuickFill] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/login"); return; }
    setMounted(true);
    setCategories(getCategories());
    setEntries(getWeekEntries(weekId));
  }, [router]);

  useEffect(() => {
    if (mounted) setEntries(getWeekEntries(weekId));
  }, [weekId, mounted]);

  if (!mounted) return null;

  const logged = entries.filter(e => e.category).length;
  const pct = Math.round((logged / 168) * 100);

  function handleExport(format: "csv" | "json") {
    const content = format === "csv" ? exportToCSV(weekId) : exportToJSON(weekId);
    const blob = new Blob([content], { type: format === "csv" ? "text/csv" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `168hours-${weekId}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExport(false);
  }

  function handleDuplicate() {
    const newEntries = duplicatePreviousWeek(weekId);
    setEntries(newEntries);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Navbar />

      {/* Week toolbar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 20px",
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setWeekId(w => offsetWeekId(w, -1))}
            style={{
              width: 30, height: 30,
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text)",
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >‹</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
              {getWeekLabel(weekId)}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{weekId}</div>
          </div>
          <button
            onClick={() => setWeekId(w => offsetWeekId(w, 1))}
            style={{
              width: 30, height: 30,
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text)",
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >›</button>
          <button
            onClick={() => setWeekId(getWeekId())}
            style={{
              padding: "4px 10px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: 6,
              color: "var(--muted)",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              marginLeft: 4,
            }}
          >Today</button>
        </div>

        {/* Progress bar */}
        <div style={{ flex: 1, minWidth: 120, maxWidth: 240 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>{logged} / 168 logged</span>
            <span style={{ fontSize: 11, color: "var(--accent2)", fontWeight: 600 }}>{pct}%</span>
          </div>
          <div style={{ height: 4, background: "var(--border)", borderRadius: 2 }}>
            <div style={{
              height: "100%",
              width: `${pct}%`,
              background: "linear-gradient(90deg, #1d4ed8, #3b82f6)",
              borderRadius: 2,
              transition: "width 0.3s ease",
            }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginLeft: "auto", flexWrap: "wrap" }}>
          <button
            onClick={() => setShowQuickFill(true)}
            style={{
              padding: "6px 14px",
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >⚡ Quick Fill</button>

          <button
            onClick={handleDuplicate}
            style={{
              padding: "6px 14px",
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >⎘ Copy Last Week</button>

          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowExport(e => !e)}
              style={{
                padding: "6px 14px",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: "var(--text)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >↓ Export</button>
            {showExport && (
              <div className="fade-in" style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                overflow: "hidden",
                zIndex: 50,
                minWidth: 140,
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}>
                {["csv","json"].map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => handleExport(fmt as "csv" | "json")}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "10px 16px",
                      background: "transparent",
                      border: "none",
                      borderBottom: fmt === "csv" ? "1px solid var(--border)" : "none",
                      color: "var(--text)",
                      fontSize: 13,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)"}
                    onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
                  >
                    Export as .{fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main grid */}
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

      {showQuickFill && (
        <QuickFill
          weekId={weekId}
          categories={categories}
          onFill={setEntries}
          onClose={() => setShowQuickFill(false)}
        />
      )}
    </div>
  );
}
