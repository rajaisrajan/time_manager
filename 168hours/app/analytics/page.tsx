"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getWeekId, getWeekEntries, offsetWeekId, getCategories } from "@/lib/storage";
import { getWeekLabel, computeWeekStats } from "@/lib/utils";
import { HourEntry, Category } from "@/lib/types";
import Navbar from "@/components/Navbar";
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, Legend, CartesianGrid,
} from "recharts";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function AnalyticsPage() {
  const router = useRouter();
  const [weekId, setWeekId] = useState(() => getWeekId());
  const [entries, setEntries] = useState<HourEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/login"); return; }
    setMounted(true);
    setCategories(getCategories());
  }, [router]);

  useEffect(() => {
    if (mounted) setEntries(getWeekEntries(weekId));
  }, [weekId, mounted]);

  if (!mounted) return null;

  const stats = computeWeekStats(entries);
  const cats = categories.filter(c => (stats.byCategory[c.id] || 0) > 0);

  const pieData = cats.map(c => ({
    name: c.name,
    value: stats.byCategory[c.id] || 0,
    color: c.color,
  }));

  const barData = DAYS.map((day, d) => {
    const row: Record<string, number | string> = { day };
    for (const c of cats) {
      row[c.name] = stats.byDay[d]?.[c.id] || 0;
    }
    return row;
  });

  const heatmapData = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    days: Array.from({ length: 7 }, (_, d) => {
      const e = entries.find(e => e.day === d && e.hour === h);
      const cat = categories.find(c => c.id === e?.category);
      return { color: cat?.color || null, category: cat?.name || null };
    }),
  }));

  const insights: string[] = [];
  if (stats.sleepHours > 0)
    insights.push(`You spent ${stats.sleepHours} hour${stats.sleepHours !== 1 ? "s" : ""} sleeping — ${Math.round(stats.sleepHours / 7 * 10) / 10}h avg/night.`);
  if (stats.byCategory["work"] > 0)
    insights.push(`Work consumed ${Math.round((stats.byCategory["work"] || 0) / 168 * 100)}% of your week (${stats.byCategory["work"]} hrs).`);
  if (stats.byCategory["learning"] > 0)
    insights.push(`You invested ${stats.byCategory["learning"]} hour${stats.byCategory["learning"] !== 1 ? "s" : ""} in learning.`);
  if (stats.wastedHours > 0)
    insights.push(`${stats.wastedHours} hour${stats.wastedHours !== 1 ? "s" : ""} marked as wasted — ${Math.round(stats.wastedHours / 168 * 100)}% of the week.`);
  if (stats.totalUnlogged > 0)
    insights.push(`${stats.totalUnlogged} hours remain unlogged this week.`);
  if (stats.byCategory["entertainment"] > 0)
    insights.push(`Entertainment took up ${stats.byCategory["entertainment"]} hours.`);
  const mostProductiveDay = (() => {
    let max = 0, best = -1;
    const productiveCats = ["work","learning","self-improvement"];
    for (let d = 0; d < 7; d++) {
      const total = productiveCats.reduce((s,c) => s + (stats.byDay[d]?.[c] || 0), 0);
      if (total > max) { max = total; best = d; }
    }
    return best;
  })();
  if (mostProductiveDay >= 0 && stats.totalLogged > 0)
    insights.push(`${["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][mostProductiveDay]} was your most productive day.`);

  const scoreColor = stats.productivityScore >= 70 ? "#22c55e" : stats.productivityScore >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", background: "var(--surface)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setWeekId(w => offsetWeekId(w, -1))} style={navBtnStyle}>‹</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{getWeekLabel(weekId)}</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{weekId}</div>
          </div>
          <button onClick={() => setWeekId(w => offsetWeekId(w, 1))} style={navBtnStyle}>›</button>
          <button onClick={() => setWeekId(getWeekId())} style={{ padding: "4px 10px", background: "transparent", border: "1px solid var(--border)", borderRadius: 6, color: "var(--muted)", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Today</button>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", margin: 0, marginLeft: "auto" }}>Analytics</h2>
      </div>

      <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: 24, maxWidth: 1200, margin: "0 auto", width: "100%" }}>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
          {[
            { label: "Hours Logged", value: stats.totalLogged, sub: "of 168", color: "var(--accent)" },
            { label: "Hours Free", value: stats.totalUnlogged, sub: "unlogged", color: "var(--muted)" },
            { label: "Sleep", value: stats.sleepHours, sub: "hours", color: "#1d4ed8" },
            { label: "Work", value: stats.byCategory["work"] || 0, sub: "hours", color: "#dc2626" },
            { label: "Learning", value: stats.byCategory["learning"] || 0, sub: "hours", color: "#7c3aed" },
            { label: "Wasted", value: stats.wastedHours, sub: "hours", color: "#78716c" },
          ].map(card => (
            <div key={card.label} className="fade-in" style={{
              padding: "16px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              borderTop: `3px solid ${card.color}`,
            }}>
              <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{card.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", lineHeight: 1 }}>{card.value}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Productivity Score */}
        <div style={{
          padding: "24px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          gap: 28,
          flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Productivity Score</div>
            <div style={{ fontSize: 56, fontWeight: 900, color: scoreColor, lineHeight: 1, letterSpacing: "-2px" }}>
              {stats.productivityScore}
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>out of 100</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ height: 12, background: "var(--border)", borderRadius: 6, overflow: "hidden", marginBottom: 10 }}>
              <div style={{
                height: "100%",
                width: `${stats.productivityScore}%`,
                background: `linear-gradient(90deg, ${scoreColor}88, ${scoreColor})`,
                borderRadius: 6,
                transition: "width 1s ease",
              }} />
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              Based on hours spent in <span style={{ color: "#7c3aed" }}>learning</span>, <span style={{ color: "#dc2626" }}>work</span>, and <span style={{ color: "#16a34a" }}>self-improvement</span> vs <span style={{ color: "#78716c" }}>wasted time</span>.
            </div>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          {/* Pie Chart */}
          <div style={{ padding: "20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: "0 0 16px" }}>Time Distribution</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 12 }}
                    formatter={(value: number) => [`${value}h (${Math.round(value / 168 * 100)}%)`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 14 }}>
                No data yet — fill your grid!
              </div>
            )}
            {pieData.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {pieData.map(d => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--muted)" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                    {d.name} ({Math.round(d.value / 168 * 100)}%)
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div style={{ padding: "20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: "0 0 16px" }}>Daily Breakdown</h3>
            {entries.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={barData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)", fontSize: 12 }}
                  />
                  {cats.map(c => (
                    <Bar key={c.id} dataKey={c.name} stackId="a" fill={c.color} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 14 }}>
                No data yet
              </div>
            )}
          </div>
        </div>

        {/* Heatmap */}
        <div style={{ padding: "20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: "0 0 16px" }}>Activity Heatmap</h3>
          <div style={{ overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "44px repeat(7, 1fr)", gap: 2, minWidth: 420 }}>
              <div />
              {DAYS.map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", paddingBottom: 4 }}>{d}</div>
              ))}
              {heatmapData.map(({ hour, days }) => (
                <>
                  <div key={`h-${hour}`} style={{ fontSize: 10, color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6 }}>
                    {String(hour).padStart(2,"0")}
                  </div>
                  {days.map((day, d) => (
                    <div
                      key={`${hour}-${d}`}
                      title={day.category || "Empty"}
                      style={{
                        height: 14,
                        borderRadius: 2,
                        background: day.color ? `${day.color}cc` : "var(--surface2)",
                        border: "1px solid var(--border)20",
                        transition: "filter 0.1s",
                        cursor: "default",
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.filter = "brightness(1.5)"}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.filter = "none"}
                    />
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div style={{ padding: "20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: "0 0 14px" }}>Weekly Insights</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {insights.map((insight, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "12px 14px",
                  background: "var(--surface2)",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  fontSize: 13,
                  color: "var(--text)",
                  lineHeight: 1.5,
                }}>
                  <span style={{ color: "var(--accent2)", flexShrink: 0, marginTop: 1 }}>◆</span>
                  {insight}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sleep Analysis */}
        {stats.sleepHours > 0 && (
          <div style={{ padding: "20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: "0 0 14px" }}>Sleep Analysis</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
              {[
                { label: "Total Sleep", value: `${stats.sleepHours}h` },
                { label: "Avg/Night", value: `${Math.round(stats.sleepHours / 7 * 10) / 10}h` },
                { label: "% of Week", value: `${Math.round(stats.sleepHours / 168 * 100)}%` },
              ].map(s => (
                <div key={s.label} style={{
                  padding: "14px",
                  background: "#1d4ed812",
                  border: "1px solid #1d4ed844",
                  borderRadius: 10,
                }}>
                  <div style={{ fontSize: 11, color: "#60a5fa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#93c5fd" }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time Waste */}
        {stats.wastedHours > 0 && (
          <div style={{ padding: "20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: "0 0 14px" }}>Time Waste Analysis</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
              {[
                { label: "Wasted Hours", value: `${stats.wastedHours}h` },
                { label: "% of Week", value: `${Math.round(stats.wastedHours / 168 * 100)}%` },
              ].map(s => (
                <div key={s.label} style={{
                  padding: "14px",
                  background: "#78716c12",
                  border: "1px solid #78716c44",
                  borderRadius: 10,
                }}>
                  <div style={{ fontSize: 11, color: "#a8a29e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#d6d3d1" }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const navBtnStyle: React.CSSProperties = {
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
};
