"use client";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();
  const path = usePathname();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const navItems = [
    { href: "/grid", label: "Grid", icon: "⊞" },
    { href: "/analytics", label: "Analytics", icon: "◈" },
  ];

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(8,8,15,0.9)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border)",
      padding: "0 20px",
      display: "flex",
      alignItems: "center",
      height: 52,
      gap: 6,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 20 }}>
        <div style={{
          width: 28,
          height: 28,
          background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 800,
          color: "#fff",
          flexShrink: 0,
          boxShadow: "0 0 12px rgba(139,92,246,0.4)",
        }}>⧖</div>
        <span style={{
          fontWeight: 800,
          fontSize: 14,
          color: "var(--text)",
          letterSpacing: "-0.4px",
          background: "linear-gradient(135deg, var(--text), var(--accent2))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>168 Hours</span>
      </div>

      {/* Nav items */}
      <div style={{ display: "flex", gap: 2, flex: 1 }}>
        {navItems.map(item => {
          const active = path === item.href;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: active ? "1px solid var(--border)" : "1px solid transparent",
                background: active ? "var(--surface2)" : "transparent",
                color: active ? "var(--accent2)" : "var(--muted)",
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s",
                fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.color = "var(--text)";
                  e.currentTarget.style.background = "var(--surface2)";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.color = "var(--muted)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <span style={{ fontSize: 12 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Sign out */}
      <button
        onClick={handleLogout}
        className="btn btn-ghost"
        style={{ fontSize: 12, padding: "5px 12px" }}
      >
        Sign Out
      </button>
    </nav>
  );
}
