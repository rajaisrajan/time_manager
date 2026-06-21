"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkPassword, setSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (checkPassword(password)) {
        setSession();
        router.push("/grid");
      } else {
        setError("Incorrect password. Try again.");
        setLoading(false);
      }
    }, 400);
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      padding: "16px",
    }}>
      <div className="fade-in" style={{
        width: "100%",
        maxWidth: 400,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "40px 36px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
            borderRadius: 14,
            marginBottom: 20,
            boxShadow: "0 8px 24px rgba(59,130,246,0.3)",
          }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: "#fff" }}>⧖</span>
          </div>
          <h1 style={{
            fontSize: 26,
            fontWeight: 700,
            color: "var(--text)",
            margin: 0,
            letterSpacing: "-0.5px",
          }}>168 Hours</h1>
          <p style={{
            color: "var(--muted)",
            fontSize: 14,
            marginTop: 6,
            margin: "6px 0 0",
          }}>Every hour of your week, accounted for.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              placeholder="Enter your password"
              autoFocus
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "var(--surface2)",
                border: `1px solid ${error ? "#dc2626" : "var(--border)"}`,
                borderRadius: 10,
                color: "var(--text)",
                fontSize: 15,
                outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={e => {
                if (!error) e.target.style.borderColor = "var(--accent)";
              }}
              onBlur={e => {
                if (!error) e.target.style.borderColor = "var(--border)";
              }}
            />
            {error && <p style={{ color: "#f87171", fontSize: 13, marginTop: 6, margin: "6px 0 0" }}>{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: "100%",
              padding: "13px",
              background: loading || !password ? "var(--border)" : "linear-gradient(135deg, #1d4ed8, #3b82f6)",
              color: loading || !password ? "var(--muted)" : "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading || !password ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              marginTop: 4,
              boxShadow: loading || !password ? "none" : "0 4px 16px rgba(59,130,246,0.3)",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p style={{
          textAlign: "center",
          color: "var(--muted)",
          fontSize: 12,
          marginTop: 28,
        }}>Personal access only · No accounts needed</p>
      </div>
    </div>
  );
}
