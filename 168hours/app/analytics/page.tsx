"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getWeekId, getWeekEntries, offsetWeekId, getCategories } from "@/lib/storage";
import { getWeekLabel, computeWeekStats } from "@/lib/utils";
import { HourEntry, Category } from "@/lib/types";
import Navbar from "@/components/Navbar";
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

const DAYS_SHORT = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const DAYS_FULL = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const PRODUCTIVITY_STORAGE_KEY = "168hours_productivity_cats";

function loadProductivityCats(defaultIds: string[]): string[] {
  if (typeof window === "undefined") return defaultIds;
  try {
    const raw = localStorage.getItem(PRODUCTIVITY_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch { /* ignore */ }
  return defaultIds;
}

function saveProductivityCats(ids: string[]) {
  try { localStorage.setItem(PRODUCTIVITY_STORAGE_KEY, JSON.stringify(ids)); } catch { /* ignore */ }
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [weekId, setWeekId] = useState(() => getWeekId());
  const [entries, setEntries] = useState<HourEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mounted, setMounted] = useState(false);
  const [productivityCatIds, setProductivityCatIds] = useState<string[]>(["work","learning"]);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/login"); return; }
    setMounted(true);
    getCategories().then(cats => {
      setCategories(cats);
      setProductivityCatIds(loadProductivityCats(["work","learning"]));
    });
  }, [router]);

  useEffect(() => {
    if (mounted) getWeekEntries(weekId).then(setEntries);
  }, [weekId, mounted]);

  const toggleProductivityCat = useCallback((id: string) => {
    setProductivityCatIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      saveProductivityCats(next);
      return next;
    });
  }, []);

  if (!mounted) return null;

  const stats = computeWeekStats(entries);
  const activeCats = categories.filter(c => (stats.byCategory[c.id] || 0) > 0);

  // Productivity time
  const totalProductivityHours = productivityCatIds.reduce((sum, id) => sum + (stats.byCategory[id] || 0), 0);
  const productivityPct = stats.totalLogged > 0 ? Math.round(totalProductivityHours / 168 * 100) : 0;

  const pieData = activeCats.map(c => ({
    name: c.name, value: stats.byCategory[c.id] || 0, color: c.color,
  }));

  const barData = DAYS_SHORT.map((day, d) => {
    const row: Record<string, number | string> = { day };
    activeCats.forEach(c => { row[c.name] = stats.byDay[d]?.[c.id] || 0; });
    return row;
  });

  const heatmapRows = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    days: Array.from({ length: 7 }, (_, d) => {
      const e = entries.find(e => e.day === d && e.hour === h);
      const cat = categories.find(c => c.id === e?.category);
      return { color: cat?.color ?? null, name: cat?.name ?? null };
    }),
  }));

  // Insights
  const insights: { icon: string; text: string }[] = [];
  if (stats.sleepHours > 0)
    insights.push({ icon: "🌙", text: `${stats.sleepHours}h sleeping — ${Math.round(stats.sleepHours / 7 * 10) / 10}h avg/night` });
  if (stats.byCategory["work"] > 0)
    insights.push({ icon: "💼", text: `Work = ${Math.round((stats.byCategory["work"]) / 168 * 100)}% of your week (${stats.byCategory["work"]}h)` });
  if (stats.byCategory["learning"] > 0)
    insights.push({ icon: "📚", text: `${stats.byCategory["learning"]}h invested in learning` });
  if (stats.byCategory["self-improvement"] > 0)
    insights.push({ icon: "💪", text: `${stats.byCategory["self-improvement"]}h on self-improvement` });
  if (stats.wastedHours > 0)
    insights.push({ icon: "⚠️", text: `${stats.wastedHours}h wasted — ${Math.round(stats.wastedHours / 168 * 100)}% of week` });
  if (stats.totalUnlogged > 0)
    insights.push({ icon: "📋", text: `${stats.totalUnlogged}h still unlogged this week` });
  const builtinProductiveCats = ["work","learning","self-improvement"];
  const bestDayIdx = (() => {
    let max = 0, best = -1;
    for (let d = 0; d < 7; d++) {
      const t = builtinProductiveCats.reduce((s, c) => s + (stats.byDay[d]?.[c] || 0), 0);
      if (t > max) { max = t; best = d; }
    }
    return best;
  })();
  if (bestDayIdx >= 0 && stats.totalLogged > 0)
    insights.push({ icon: "🏆", text: `${DAYS_FULL[bestDayIdx]} was your most productive day` });

  const scoreColor = stats.productivityScore >= 70 ? "#34d399" : stats.productivityScore >= 40 ? "#fbbf24" : "#f87171";
  const prodColor = "#a78bfa";
  const navBtnStyle: React.CSSProperties = {
    width: 30, height: 30, background: "var(--surface2)", border: "1px solid var(--border)",
    borderRadius: 8, color: "var(--text)", fontSize: 14, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        padding: "12px 20px", background: "var(--surface)", borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setWeekId(w => offsetWeekId(w, -1))} style={navBtnStyle}>‹</button>
          <div style={{ textAlign: "center", minWidth: 160 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", fontFamily: "Inter, sans-serif" }}>{getWeekLabel(weekId)}</div>
            <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>{weekId}</div>
          </div>
          <button onClick={() => setWeekId(w => offsetWeekId(w, 1))} style={navBtnStyle}>›</button>
          <button onClick={() => setWeekId(getWeekId())} style={{
            padding: "4px 10px", background: "transparent", border: "1px solid var(--border)",
            borderRadius: 6, color: "var(--muted)", fontSize: 11, fontWeight: 700, cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}>Today</button>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginLeft: "auto", fontFamily: "Inter, sans-serif", letterSpacing: "-0.4px" }}>Analytics</h2>
      </div>

      <div style={{ flex: 1, padding: "24px 20px", display: "flex", flexDirection: "column", gap: 20, maxWidth: 1200, margin: "0 auto", width: "100%" }}>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
          {[
            { label: "Logged", value: stats.totalLogged, unit: "hrs", accent: "var(--accent)" },
            { label: "Unlogged", value: stats.totalUnlogged, unit: "hrs", accent: "var(--muted)" },
            { label: "Sleep", value: stats.sleepHours, unit: "hrs", accent: "#1d4ed8" },
            { label: "Work", value: stats.byCategory["work"] || 0, unit: "hrs", accent: "#dc2626" },
            { label: "Learning", value: stats.byCategory["learning"] || 0, unit: "hrs", accent: "#7c3aed" },
            { label: "Wasted", value: stats.wastedHours, unit: "hrs", accent: "#57534e" },
          ].map(c => (
            <div key={c.label} className="fade-in" style={{
              padding: "14px 16px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              borderLeft: `3px solid ${c.accent}`,
              boxShadow: `0 0 20px ${c.accent}15`,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "Inter, sans-serif", marginBottom: 6 }}>{c.label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "var(--text)", fontFamily: "Inter, sans-serif", letterSpacing: "-1px", lineHeight: 1 }}>{c.value}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "Inter, sans-serif", marginTop: 2 }}>{c.unit}</div>
            </div>
          ))}
        </div>

        {/* Total Productivity Time */}
        <div style={{
          padding: "22px 24px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          borderColor: `${prodColor}30`,
          boxShadow: `0 0 40px ${prodColor}08`,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 28, flexWrap: "wrap" }}>
            {/* Left: big number */}
            <div style={{ minWidth: 120 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "Inter, sans-serif", marginBottom: 8 }}>
                Total Productivity Time
              </div>
              <div style={{ fontSize: 56, fontWeight: 900, fontFamily: "Inter, sans-serif", letterSpacing: "-3px", lineHeight: 1, color: prodColor, textShadow: `0 0 28px ${prodColor}50` }}>
                {totalProductivityHours}
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "Inter, sans-serif", marginTop: 4 }}>
                hrs · {productivityPct}% of week
              </div>
              <div style={{ height: 6, background: "var(--surface2)", borderRadius: 3, overflow: "hidden", marginTop: 12, maxWidth: 120 }}>
                <div style={{
                  height: "100%", width: `${productivityPct}%`,
                  background: `linear-gradient(90deg, ${prodColor}80, ${prodColor})`,
                  borderRadius: 3, transition: "width 1s ease",
                  boxShadow: `0 0 10px ${prodColor}50`,
                }} />
              </div>
            </div>

            {/* Right: category toggles */}
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "Inter, sans-serif", marginBottom: 12 }}>
                Count toward productivity
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 6 }}>
                {categories.map(cat => {
                  const checked = productivityCatIds.includes(cat.id);
                  const hrs = stats.byCategory[cat.id] || 0;
                  return (
                    <label key={cat.id} style={{
                      display: "flex", alignItems: "center", gap: 9,
                      padding: "8px 11px",
                      borderRadius: 8,
                      background: checked ? `${cat.color}18` : "var(--surface2)",
                      border: `1px solid ${checked ? cat.color + "50" : "var(--border)"}`,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      userSelect: "none",
                    }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleProductivityCat(cat.id)}
                        style={{ accentColor: cat.color, width: 13, height: 13, cursor: "pointer", flexShrink: 0 }}
                      />
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: cat.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: checked ? "var(--text)" : "var(--muted)", fontFamily: "Inter, sans-serif", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {cat.name}
                      </span>
                      {hrs > 0 && (
                        <span style={{ fontSize: 11, color: checked ? cat.color : "var(--muted)", fontFamily: "Inter, sans-serif", fontWeight: 700, flexShrink: 0 }}>
                          {hrs}h
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Productivity Score */}
        <div style={{
          padding: "24px 28px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          gap: 28,
          flexWrap: "wrap",
          boxShadow: `0 0 40px ${scoreColor}10`,
          borderColor: `${scoreColor}30`,
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "Inter, sans-serif", marginBottom: 8 }}>Productivity Score</div>
            <div style={{ fontSize: 64, fontWeight: 900, fontFamily: "Inter, sans-serif", letterSpacing: "-4px", lineHeight: 1, color: scoreColor, textShadow: `0 0 32px ${scoreColor}60` }}>
              {stats.productivityScore}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "Inter, sans-serif", marginTop: 4 }}>out of 100</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ height: 8, background: "var(--surface2)", borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
              <div style={{
                height: "100%", width: `${stats.productivityScore}%`,
                background: `linear-gradient(90deg, ${scoreColor}80, ${scoreColor})`,
                borderRadius: 4, transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
                boxShadow: `0 0 12px ${scoreColor}60`,
              }} />
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "Inter, sans-serif", lineHeight: 1.7 }}>
              Based on <span style={{ color: "#a78bfa" }}>learning</span>, <span style={{ color: "#f87171" }}>work</span> & <span style={{ color: "#34d399" }}>self-improvement</span> vs <span style={{ color: "#78716c" }}>wasted time</span>.
            </div>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {/* Pie */}
          <div style={cardStyle}>
            <SectionTitle>Time Distribution</SectionTitle>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={44} paddingAngle={2}>
                      {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)", fontSize: 12, fontFamily: "Inter, sans-serif" }}
                      formatter={(v) => [`${Number(v)}h (${Math.round(Number(v) / 168 * 100)}%)`, ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {pieData.map(d => (
                    <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--muted)", fontFamily: "Inter, sans-serif" }}>
                      <div style={{ width: 7, height: 7, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                      {d.name} ({Math.round(d.value / 168 * 100)}%)
                    </div>
                  ))}
                </div>
              </>
            ) : <EmptyState />}
          </div>

          {/* Bar */}
          <div style={cardStyle}>
            <SectionTitle>Daily Breakdown</SectionTitle>
            {entries.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="var(--border-dim)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "var(--muted)", fontSize: 10, fontFamily: "Inter" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--muted)", fontSize: 10, fontFamily: "Inter" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)", fontSize: 11, fontFamily: "Inter, sans-serif" }} />
                  {activeCats.map(c => <Bar key={c.id} dataKey={c.name} stackId="a" fill={c.color} radius={[0,0,0,0]} />)}
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyState />}
          </div>
        </div>

        {/* Heatmap */}
        <div style={cardStyle}>
          <SectionTitle>Activity Heatmap</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "40px repeat(7, 1fr)", gap: 2, minWidth: 380 }}>
              <div />
              {DAYS_SHORT.map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "Inter, sans-serif", paddingBottom: 6 }}>{d}</div>
              ))}
              {heatmapRows.map(({ hour, days }) => (
                <React.Fragment key={hour}>
                  <div style={{ fontSize: 9, color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 5, fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
                    {String(hour).padStart(2, "0")}
                  </div>
                  {days.map((day, d) => (
                    <div
                      key={`${hour}-${d}`}
                      title={day.name ?? "Empty"}
                      style={{
                        height: 13,
                        borderRadius: 2,
                        background: day.color ? `${day.color}bb` : "var(--surface2)",
                        border: "1px solid var(--border-dim)",
                        transition: "filter 0.08s",
                        cursor: "default",
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.filter = "brightness(1.6)"}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.filter = "none"}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div style={cardStyle}>
            <SectionTitle>Weekly Insights</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
              {insights.map((ins, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  padding: "12px 14px",
                  background: "var(--surface2)",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  fontSize: 13,
                  color: "var(--text-dim)",
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1.5,
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{ins.icon}</span>
                  {ins.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sleep */}
        {stats.sleepHours > 0 && (
          <div style={{ ...cardStyle, borderColor: "#1d4ed840" }}>
            <SectionTitle>Sleep Analysis</SectionTitle>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { l: "Total", v: `${stats.sleepHours}h` },
                { l: "Avg/Night", v: `${Math.round(stats.sleepHours / 7 * 10) / 10}h` },
                { l: "% of Week", v: `${Math.round(stats.sleepHours / 168 * 100)}%` },
              ].map(s => (
                <div key={s.l} style={{
                  padding: "14px 18px",
                  background: "#1d4ed810",
                  border: "1px solid #1d4ed840",
                  borderRadius: 10,
                  minWidth: 100,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "Inter, sans-serif", marginBottom: 4 }}>{s.l}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#93c5fd", fontFamily: "Inter, sans-serif", letterSpacing: "-1px" }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  padding: "20px",
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 16,
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", fontFamily: "Inter, sans-serif", letterSpacing: "-0.2px", marginBottom: 16 }}>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 13, fontFamily: "Inter, sans-serif" }}>
      Fill your grid to see data
    </div>
  );
}
