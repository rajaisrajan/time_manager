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
        setError("Wrong password. Try again.");
        setLoading(false);
        setPassword("");
      }
    }, 350);
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500,
        height: 400,
        background: "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="fade-in" style={{
        width: "100%",
        maxWidth: 380,
        position: "relative",
      }}>
        {/* Card */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: "36px 32px 32px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,92,246,0.08)",
        }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 60,
              height: 60,
              background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
              borderRadius: 16,
              marginBottom: 18,
              boxShadow: "0 8px 32px rgba(139,92,246,0.5)",
              fontSize: 26,
              color: "#fff",
            }}>⧖</div>
            <h1 style={{
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "-0.6px",
              color: "var(--text)",
              fontFamily: "Inter, sans-serif",
              marginBottom: 6,
            }}>168 Hours</h1>
            <p style={{
              fontSize: 13,
              color: "var(--muted)",
              fontFamily: "Inter, sans-serif",
              lineHeight: 1.5,
            }}>Every hour of your week, accounted for.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{
                display: "block",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 8,
                fontFamily: "Inter, sans-serif",
              }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter your password"
                autoFocus
                autoComplete="current-password"
                className="field"
                style={{
                  borderColor: error ? "#f87171" : undefined,
                  boxShadow: error ? "0 0 0 3px rgba(248,113,113,0.15)" : undefined,
                }}
              />
              {error && (
                <div style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: "#f87171",
                  fontFamily: "Inter, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}>⚠ {error}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="btn btn-primary"
              style={{
                width: "100%",
                minHeight: 46,
                fontSize: 15,
                marginTop: 4,
                opacity: loading || !password ? 0.5 : 1,
                cursor: loading || !password ? "not-allowed" : "pointer",
                letterSpacing: "-0.2px",
              }}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <div style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: 11,
            color: "var(--muted)",
            fontFamily: "Inter, sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}>
            <span style={{ width: 24, height: 1, background: "var(--border)", display: "inline-block" }} />
            Personal access · No accounts
            <span style={{ width: 24, height: 1, background: "var(--border)", display: "inline-block" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
