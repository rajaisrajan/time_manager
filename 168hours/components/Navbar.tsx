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
    { href: "/grid", label: "Weekly Grid", icon: "⊞" },
    { href: "/analytics", label: "Analytics", icon: "◈" },
  ];

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(11,18,33,0.92)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      height: 56,
      gap: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 24 }}>
        <div style={{
          width: 30,
          height: 30,
          background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 700,
          color: "#fff",
          flexShrink: 0,
        }}>⧖</div>
        <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text)", letterSpacing: "-0.3px" }}>
          168 Hours
        </span>
      </div>

      <div style={{ display: "flex", gap: 4, flex: 1 }}>
        {navItems.map(item => (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "none",
              background: path === item.href ? "var(--surface2)" : "transparent",
              color: path === item.href ? "var(--text)" : "var(--muted)",
              fontSize: 13,
              fontWeight: path === item.href ? 600 : 400,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              if (path !== item.href) (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
            }}
            onMouseLeave={e => {
              if (path !== item.href) (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleLogout}
        style={{
          padding: "6px 14px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "transparent",
          color: "var(--muted)",
          fontSize: 13,
          cursor: "pointer",
          transition: "all 0.15s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border2)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
        }}
      >
        Sign Out
      </button>
    </nav>
  );
}
