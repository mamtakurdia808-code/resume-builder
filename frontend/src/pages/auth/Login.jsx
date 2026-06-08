import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// ─── Icons ────────────────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const SpinnerIcon = () => (
  <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.25)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite" }} />
);
const ShieldIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, type, visible }) => (
  <div style={{
    position: "fixed", top: 24, right: 24, zIndex: 9999,
    display: "flex", alignItems: "center", gap: 10,
    background: type === "error"
      ? "linear-gradient(135deg,#7f1d1d,#991b1b)"
      : "linear-gradient(135deg,#064e3b,#065f46)",
    color: type === "error" ? "#fecaca" : "#d1fae5",
    padding: "13px 20px", borderRadius: 13,
    boxShadow: `0 8px 32px ${type === "error" ? "rgba(153,27,27,0.4)" : "rgba(6,95,70,0.4)"}`,
    fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 500, fontSize: 14,
    transform: visible ? "translateY(0) scale(1)" : "translateY(-16px) scale(0.96)",
    opacity: visible ? 1 : 0,
    transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
    pointerEvents: "none", maxWidth: 340,
  }}>
    <span style={{
      width: 24, height: 24, borderRadius: "50%",
      background: "rgba(255,255,255,0.12)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, flexShrink: 0,
    }}>
      {type === "error" ? "✕" : "✓"}
    </span>
    {message}
  </div>
);

// ─── Input Field ──────────────────────────────────────────────────────────────
const Field = ({ label, id, type, value, onChange, error, placeholder, rightEl, autoComplete }) => {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;
  return (
    <div>
      <div style={{ position: "relative" }}>
        <label htmlFor={id} style={{
          position: "absolute", left: 15,
          top: lifted ? 8 : "50%",
          transform: lifted ? "none" : "translateY(-50%)",
          fontSize: lifted ? 10.5 : 14,
          fontWeight: lifted ? 700 : 400,
          color: focused ? "#a78bfa" : error ? "#f87171" : "#64748b",
          letterSpacing: lifted ? "0.07em" : "normal",
          textTransform: lifted ? "uppercase" : "none",
          transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: "none", zIndex: 1,
          fontFamily: "'Plus Jakarta Sans',sans-serif",
        }}>{label}</label>
        <input
          id={id} type={type} value={value} onChange={onChange} autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ""}
          style={{
            width: "100%", paddingTop: 22, paddingBottom: 9, paddingLeft: 15,
            paddingRight: rightEl ? 48 : 15,
            background: focused ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
            border: `1.5px solid ${error ? "#f87171" : focused ? "#a78bfa" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 12, color: "#f1f5f9", fontSize: 14.5,
            fontFamily: "'Plus Jakarta Sans',sans-serif", outline: "none",
            boxSizing: "border-box", transition: "all 0.2s ease",
            boxShadow: focused ? `0 0 0 3px ${error ? "rgba(248,113,113,0.1)" : "rgba(167,139,250,0.12)"}` : "none",
          }}
        />
        {rightEl && (
          <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center" }}>
            {rightEl}
          </div>
        )}
      </div>
      {error && (
        <p style={{ margin: "5px 4px 0", fontSize: 12, color: "#f87171", fontFamily: "'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", gap: 4, animation: "slideIn 0.2s ease" }}>
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

// ─── Stat Badge ───────────────────────────────────────────────────────────────
const StatBadge = ({ value, label }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Plus Jakarta Sans',sans-serif", background: "linear-gradient(135deg,#a78bfa,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{value}</div>
    <div style={{ fontSize: 11, color: "#475569", fontWeight: 500, marginTop: 2 }}>{label}</div>
  </div>
);

// ─── Feature Row ──────────────────────────────────────────────────────────────
const Feature = ({ icon, text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{icon}</div>
    <span style={{ color: "#94a3b8", fontSize: 13, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{text}</span>
  </div>
);

// ─── Main Login Component ─────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3500);
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: "" }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (remember) localStorage.setItem("remember_email", form.email);
        else localStorage.removeItem("remember_email");
        showToast(`Welcome back, ${data.user.full_name?.split(" ")[0]}! 👋`);
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Invalid credentials. Please try again.";
      const status = err.response?.status;
      if (status === 401) setErrors({ password: "Incorrect email or password" });
      else if (status === 404) setErrors({ email: "No account found with this email" });
      else showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  // Pre-fill remembered email
  useEffect(() => {
    const saved = localStorage.getItem("remember_email");
    if (saved) { setForm(f => ({ ...f, email: saved })); setRemember(true); }
  }, []);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Clash+Display:wght@600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes slideIn { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:none; } }
    @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
    @keyframes float1 { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-18px) rotate(3deg); } }
    @keyframes float2 { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-12px) rotate(-2deg); } }
    @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
    @keyframes pulse-ring { 0%,100% { opacity:0.4; transform:scale(1); } 50% { opacity:0.7; transform:scale(1.04); } }
    input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 1000px rgba(13,17,30,0.95) inset !important;
      -webkit-text-fill-color: #f1f5f9 !important;
      caret-color: #f1f5f9;
    }
    ::placeholder { color: rgba(100,116,139,0.5); font-size: 13px; }
    ::-webkit-scrollbar { width: 0; }
  `;

  return (
    <>
      <style>{css}</style>
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />

      <div onKeyDown={handleKeyDown} style={{
        minHeight: "100vh", display: "flex",
        background: "#080d18",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        overflow: "hidden", position: "relative",
      }}>

        {/* ── Left Panel (decorative) ── */}
        <div style={{
          display: "none",
          // shown via media query simulation — we'll show it at width > 900
          // For pure inline CSS we use a wrapper trick below
        }} />

        <LeftPanel />

        {/* ── Right Panel (form) ── */}
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "40px 20px", position: "relative", minHeight: "100vh",
        }}>
          {/* Subtle right-side glow */}
          <div style={{
            position: "absolute", top: "30%", right: "-10%",
            width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{
            width: "100%", maxWidth: 440,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "none" : "translateY(20px)",
            transition: "all 0.55s cubic-bezier(0.34,1.1,0.64,1)",
          }}>
            {/* Mobile logo */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 50, padding: "8px 16px 8px 8px",
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 9,
                  background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(124,58,237,0.4)",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="7" height="9" rx="1.5" fill="white" opacity="0.95"/>
                    <rect x="3" y="14" width="7" height="2" rx="1" fill="white" opacity="0.6"/>
                    <rect x="3" y="18" width="5" height="2" rx="1" fill="white" opacity="0.35"/>
                    <path d="M14 7h6M14 11h4M14 15h6M14 19h3" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
                  </svg>
                </div>
                <span style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 15,
                  background: "linear-gradient(90deg,#a78bfa,#818cf8)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>ResumeAI</span>
              </div>
            </div>

            {/* Card */}
            <div style={{
              background: "rgba(13,17,30,0.9)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 22,
              padding: "38px 36px 32px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
              position: "relative", overflow: "hidden",
            }}>
              {/* Card shimmer accent top */}
              <div style={{
                position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
                background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent)",
              }} />

              {/* Header */}
              <div style={{ marginBottom: 30 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "linear-gradient(135deg,#a78bfa,#60a5fa)",
                    boxShadow: "0 0 8px rgba(167,139,250,0.6)",
                    animation: "pulse-ring 2.5s ease-in-out infinite",
                  }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Secure Login
                  </span>
                </div>
                <h1 style={{
                  fontSize: 26, fontWeight: 800, color: "#f8fafc",
                  letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 6,
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                }}>
                  Welcome back 👋
                </h1>
                <p style={{ color: "#64748b", fontSize: 13.5, lineHeight: 1.5 }}>
                  Sign in to your ResumeAI account and continue building job-winning resumes.
                </p>
              </div>

              {/* Global error */}
              {errors.form && (
                <div style={{
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 10, padding: "10px 14px", marginBottom: 18,
                  color: "#fca5a5", fontSize: 13, fontWeight: 500,
                  animation: "slideIn 0.2s ease", display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span>⚠</span> {errors.form}
                </div>
              )}

              {/* Fields */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Field
                  label="Email Address" id="email" type="email"
                  value={form.email} onChange={handleChange("email")}
                  error={errors.email} placeholder="you@company.com"
                  autoComplete="email"
                />
                <Field
                  label="Password" id="password" type={showPwd ? "text" : "password"}
                  value={form.password} onChange={handleChange("password")}
                  error={errors.password} placeholder="Your password"
                  autoComplete="current-password"
                  rightEl={
                    <button
                      onClick={() => setShowPwd(s => !s)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: showPwd ? "#a78bfa" : "#475569", display: "flex", padding: 2, transition: "color 0.2s" }}
                      tabIndex={-1} aria-label="Toggle password visibility"
                    >
                      {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  }
                />
              </div>

              {/* Remember me + Forgot */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <div
                    onClick={() => setRemember(r => !r)}
                    style={{
                      width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${remember ? "#a78bfa" : "rgba(255,255,255,0.15)"}`,
                      background: remember ? "rgba(167,139,250,0.2)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s", cursor: "pointer", flexShrink: 0,
                    }}
                  >
                    {remember && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <polyline points="1.5 6 4.5 9 10.5 3" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: 13, color: "#64748b", userSelect: "none" }}>Remember me</span>
                </label>

                <a
                  href="#"
                  onClick={e => e.preventDefault()}
                  style={{
                    fontSize: 13, color: "#a78bfa", textDecoration: "none", fontWeight: 600,
                    borderBottom: "1px solid rgba(167,139,250,0.25)", paddingBottom: 1,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => e.target.style.color = "#c4b5fd"}
                  onMouseLeave={e => e.target.style.color = "#a78bfa"}
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: "100%", marginTop: 22,
                  padding: "15px 24px",
                  background: loading
                    ? "rgba(124,58,237,0.4)"
                    : "linear-gradient(135deg,#7c3aed 0%,#4f46e5 100%)",
                  border: "none", borderRadius: 12,
                  cursor: loading ? "not-allowed" : "pointer",
                  color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontWeight: 700, fontSize: 14.5, letterSpacing: "0.01em",
                  boxShadow: loading ? "none" : "0 4px 20px rgba(124,58,237,0.4)",
                  transition: "all 0.25s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(124,58,237,0.5)"; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 20px rgba(124,58,237,0.4)"; }}
              >
                {loading ? (
                  <><SpinnerIcon /> Signing in…</>
                ) : (
                  <> Sign In <ArrowIcon /></>
                )}
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                <span style={{ color: "#334155", fontSize: 11.5, fontWeight: 600, letterSpacing: "0.05em" }}>OR CONTINUE WITH</span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              </div>

              {/* Social buttons */}
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  {
                    label: "Google",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    ),
                  },
                  {
                    label: "LinkedIn",
                    icon: (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="#0A66C2">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                        <rect x="2" y="9" width="4" height="12"/>
                        <circle cx="4" cy="4" r="2"/>
                      </svg>
                    ),
                  },
                ].map(({ label, icon }) => (
                  <button
                    key={label}
                    style={{
                      flex: 1, padding: "11px 16px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 11, cursor: "pointer",
                      color: "#94a3b8", fontSize: 13, fontWeight: 600,
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; e.currentTarget.style.color = "#e2e8f0"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#94a3b8"; }}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>

              {/* Sign up */}
              <p style={{ textAlign: "center", marginTop: 22, color: "#475569", fontSize: 13 }}>
                Don't have an account?{" "}
                <Link to="/signup" style={{
                  color: "#a78bfa", fontWeight: 700, textDecoration: "none",
                  borderBottom: "1px solid rgba(167,139,250,0.3)", paddingBottom: 1,
                }}>
                  Create one free →
                </Link>
              </p>

              {/* Security note */}
              <div style={{
                marginTop: 20, padding: "10px 14px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 9, display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ color: "#334155" }}><ShieldIcon /></span>
                <span style={{ fontSize: 11.5, color: "#334155", lineHeight: 1.4 }}>
                  Protected with 256-bit SSL encryption. Your data is always safe.
                </span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  );
}

// ─── Left Decorative Panel ────────────────────────────────────────────────────
function LeftPanel() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div style={{
      width: "45%", minHeight: "100vh", position: "relative",
      background: "linear-gradient(145deg,#0d0f1e 0%,#0a0d1f 50%,#080c1a 100%)",
      borderRight: "1px solid rgba(255,255,255,0.05)",
      display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "60px 52px", overflow: "hidden",
      // Hide on small screens using a wrapper — note: inline CSS can't do media queries
      // so we simulate with min-width check. For responsive, wrap in conditional render
    }}>
      {/* Background orbs */}
      <div style={{ position: "absolute", top: "-5%", left: "-10%", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 70%)", animation: "float1 14s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "5%", right: "-5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(79,70,229,0.1) 0%,transparent 70%)", animation: "float2 18s ease-in-out infinite" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(96,165,250,0.05) 0%,transparent 70%)" }} />

      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      <div style={{ position: "relative", zIndex: 2, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(-20px)", transition: "all 0.7s cubic-bezier(0.34,1.1,0.64,1)" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 52 }}>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(124,58,237,0.45)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="9" rx="1.5" fill="white" opacity="0.95"/>
              <rect x="3" y="14" width="7" height="2" rx="1" fill="white" opacity="0.6"/>
              <rect x="3" y="18" width="5" height="2" rx="1" fill="white" opacity="0.35"/>
              <path d="M14 7h6M14 11h4M14 15h6M14 19h3" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 18, background: "linear-gradient(90deg,#a78bfa,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ResumeAI</div>
            <div style={{ fontSize: 10.5, color: "#334155", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}>AI Resume Builder</div>
          </div>
        </div>

        {/* Headline */}
        <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 34, color: "#f8fafc", letterSpacing: "-0.04em", lineHeight: 1.15, marginBottom: 16 }}>
          Land your{" "}
          <span style={{ background: "linear-gradient(135deg,#a78bfa,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>dream job</span>
          {" "}faster.
        </h2>
        <p style={{ color: "#475569", fontSize: 14.5, lineHeight: 1.7, marginBottom: 40, maxWidth: 320 }}>
          Build ATS-optimized resumes with AI, get real-time feedback, and track your job applications — all in one place.
        </p>

        {/* Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 44 }}>
          <Feature icon="🤖" text="AI-powered resume writing & tailoring" />
          <Feature icon="✅" text="Real-time ATS score & keyword analysis" />
          <Feature icon="📊" text="Job application tracker & analytics" />
          <Feature icon="🎯" text="Role-specific resume templates" />
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: 0,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14, overflow: "hidden",
        }}>
          {[
            { value: "50K+", label: "Resumes built" },
            { value: "3.2×", label: "More interviews" },
            { value: "94%", label: "ATS pass rate" },
          ].map((s, i) => (
            <div key={s.label} style={{ flex: 1, padding: "16px 12px", textAlign: "center", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <StatBadge value={s.value} label={s.label} />
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div style={{
          marginTop: 28, padding: "18px 20px",
          background: "rgba(167,139,250,0.06)",
          border: "1px solid rgba(167,139,250,0.15)",
          borderRadius: 14,
        }}>
          <div style={{ fontSize: 18, marginBottom: 8, opacity: 0.8 }}>"</div>
          <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6, fontStyle: "italic", marginBottom: 12 }}>
            ResumeAI helped me land a senior role at a FAANG company. My ATS score went from 42% to 91% overnight.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>A</div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#c4b5fd" }}>Arjun Mehta</div>
              <div style={{ fontSize: 11, color: "#475569" }}>Software Engineer @ Google</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}