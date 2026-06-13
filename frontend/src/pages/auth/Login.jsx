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
  <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite" }} />
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
    background: type === "error" ? "#FEF2F2" : "#E6F4F1", 
    color: type === "error" ? "#DC2626" : "#0D9488", 
    border: `1px solid ${type === "error" ? "#FECACA" : "#99F6E4"}`,
    padding: "13px 20px", borderRadius: 12,
    boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
    fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 14,
    transform: visible ? "translateY(0) scale(1)" : "translateY(-16px) scale(0.96)",
    opacity: visible ? 1 : 0,
    transition: "all 0.3s cubic-bezier(0.34,1.4,0.64,1)",
    pointerEvents: "none", maxWidth: 340,
  }}>
    <span style={{
      width: 22, height: 22, borderRadius: "50%",
      background: type === "error" ? "#FEE2E2" : "#CCFBF1",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: 12, flexShrink: 0,
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
          position: "absolute", left: 14,
          top: lifted ? 8 : "50%",
          transform: lifted ? "none" : "translateY(-50%)",
          fontSize: lifted ? 10 : 14,
          fontWeight: lifted ? 600 : 400,
          color: focused ? "#0D9488" : error ? "#EF4444" : "#9CA3AF", 
          letterSpacing: lifted ? "0.07em" : "normal",
          textTransform: lifted ? "uppercase" : "none",
          transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: "none", zIndex: 1,
          fontFamily: "'Inter', sans-serif",
        }}>{label}</label>
        <input
          id={id} type={type} value={value} onChange={onChange} autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ""}
          style={{
            width: "100%", paddingTop: 22, paddingBottom: 9, paddingLeft: 14,
            paddingRight: rightEl ? 46 : 14,
            background: focused ? "#F0Fdfa" : "#F8FAFC", 
            border: `1.5px solid ${error ? "#FCA5A5" : focused ? "#0D9488" : "#E2E8F0"}`, 
            borderRadius: 8, color: "#111827", fontSize: 14.5,
            fontFamily: "'Inter', sans-serif", outline: "none",
            boxSizing: "border-box", transition: "all 0.18s ease",
            boxShadow: focused ? `0 0 0 3px ${error ? "rgba(239,68,68,0.08)" : "rgba(13,148,136,0.1)"}` : "none", 
          }}
        />
        {rightEl && (
          <div style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center" }}>
            {rightEl}
          </div>
        )}
      </div>
      {error && (
        <p style={{ margin: "5px 4px 0", fontSize: 12, color: "#EF4444", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

// ─── Feature Row ──────────────────────────────────────────────────────────────
const Feature = ({ icon, text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{icon}</div>
    <span style={{ color: "#E2E8F0", fontSize: 13.5, fontFamily: "'Inter', sans-serif" }}>{text}</span> 
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

  useEffect(() => {
    const saved = localStorage.getItem("remember_email");
    if (saved) { setForm(f => ({ ...f, email: saved })); setRemember(true); }
  }, []);

  const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght=400;500;600;700;800&display=swap');

  html,
  body,
  #root {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    min-height: 100% !important;
    box-sizing: border-box;
    background: #F8FAFC;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes float1 {
    0%,
    100 {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-16px);
    }
  }

  @keyframes float2 {
    0%,
    100 {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px #F8FAFC inset !important;
    -webkit-text-fill-color: #111827 !important;
    caret-color: #111827;
  }

  ::placeholder {
    color: rgba(156, 163, 175, 0.7);
    font-size: 13px;
  }

  /* MAIN LAYOUT */
  .login-root {
    width: 100%;
    min-height: 100vh;
    display: flex;
    background: #F8FAFC;
    font-family: "Inter", sans-serif;
    align-items: stretch;
  }

  /* LEFT SIDE - Half screen width, allows normal page scrolling */
  .left-panel {
    width: 50%;
    background: #1E293B;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 60px 50px;
    position: relative;
    flex-shrink: 0;
    border-right: 1px solid #334155;
    box-sizing: border-box;
  }

  /* RIGHT SIDE - Half screen width, fully fills out margins */
  .right-panel {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 48px;
    background: #F8FAFC;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  /* FORM - Expands efficiently to use space on both sides */
  .form-container {
    width: 100%;
    max-width: 580px;
  }

  @media (max-width: 990px) {
    .left-panel {
      display: none !important;
    }

    .right-panel {
      width: 100%;
      padding: 40px 24px;
    }

    .form-container {
      max-width: 520px;
    }
  }

  @media (max-width: 480px) {
    .right-panel {
      padding: 32px 16px;
    }
  }
`;

  return (
    <>
      <style>{css}</style>
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />

      <div className="login-root" onKeyDown={handleKeyDown}>

        {/* ── Left Panel ── */}
        <div className="left-panel">
          {/* Accent-shaded glowing organic design strings representing the theme */}
          <div style={{ position: "absolute", top: "-5%", left: "-10%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(13,148,136,0.12) 0%,transparent 70%)", animation: "float1 14s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "5%", right: "-5%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,rgba(148,163,184,0.1) 0%,transparent 70%)", animation: "float2 18s ease-in-out infinite", pointerEvents: "none" }} />
          
          {/* Precision alignment tracking dots */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: "radial-gradient(circle, #FFFFFF 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 2, opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateX(-16px)", transition: "all 0.6s cubic-bezier(0.34,1.1,0.64,1)" }}>
            {/* Logo configured with Slate & Teal Accent block */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 52 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: "#0D9488", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="9" rx="1" fill="white" opacity="0.95"/>
                  <rect x="3" y="14" width="7" height="2" rx="0.5" fill="white" opacity="0.6"/>
                  <rect x="3" y="18" width="5" height="2" rx="0.5" fill="white" opacity="0.4"/>
                  <path d="M14 7h6M14 11h4M14 15h6M14 19h3" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 18, color: "#FFFFFF", letterSpacing: "-0.02em" }}>ResumeAI</div>
                <div style={{ fontSize: 10.5, color: "#0D9488", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}>AI Resume Builder</div>
              </div>
            </div>

            {/* Headline */}
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 34, color: "#F8FAFC", letterSpacing: "-0.04em", lineHeight: 1.15, marginBottom: 14 }}>
              Land your{" "}
              <span style={{ color: "#2DD4BF" }}>dream job</span>
              {" "}faster.
            </h2>
            <p style={{ color: "#94A3B8", fontSize: 14.5, lineHeight: 1.7, marginBottom: 40, maxWidth: 380 }}>
              Build ATS-optimized resumes with AI, get real-time feedback, and track your applications — all in one place.
            </p>

            {/* Features */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 44 }}>
              <Feature icon="🤖" text="AI-powered resume writing & tailoring" />
              <Feature icon="✅" text="Real-time ATS score & keyword analysis" />
              <Feature icon="📊" text="Job application tracker & analytics" />
              <Feature icon="🎯" text="Role-specific resume templates" />
            </div>

            {/* Stats Counter Row */}
            <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", border: "1px solid #334155", borderRadius: 10, overflow: "hidden", marginBottom: 28 }}>
              {[{ value: "50K+", label: "Resumes built" }, { value: "3.2×", label: "More interviews" }, { value: "94%", label: "ATS pass rate" }].map((s, i) => (
                <div key={s.label} style={{ flex: 1, padding: "16px 12px", textAlign: "center", borderLeft: i > 0 ? "1px solid #334155" : "none" }}>
                  <div style={{ fontSize: 19, fontWeight: 800, color: "#2DD4BF", letterSpacing: "-0.03em" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500, marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Subtle Accent-shaded testimonial container */}
            <div style={{ padding: "18px 20px", background: "rgba(13,148,136,0.06)", border: "1px solid rgba(13,148,136,0.2)", borderRadius: 10 }}>
              <div style={{ fontSize: 18, marginBottom: 4, opacity: 0.6, color: "#2DD4BF" }}>"</div>
              <p style={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.65, fontStyle: "italic", marginBottom: 12 }}>
                ResumeAI helped me land a senior role at a FAANG company. My ATS score went from 42% to 91% overnight.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#0D9488", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>A</div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#F1F5F9" }}>Arjun Mehta</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>Software Engineer @ Google</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="right-panel">
          <div
            className="form-container"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "none" : "translateY(16px)",
              transition: "all 0.5s cubic-bezier(0.34,1.1,0.64,1)",
            }}
          >
            {/* Mobile logo */}
            <div style={{ textAlign: "center", marginBottom: 28, display: "none" }} className="mobile-logo-wrapper">
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 50, padding: "8px 16px 8px 8px" }}>
                <div style={{ width: 30, height: 30, borderRadius: 6, background: "#0D9488", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="7" height="9" rx="1" fill="white" opacity="0.95"/>
                    <rect x="3" y="14" width="7" height="2" rx="0.5" fill="white" opacity="0.6"/>
                    <rect x="3" y="18" width="5" height="2" rx="0.5" fill="white" opacity="0.4"/>
                    <path d="M14 7h6M14 11h4M14 15h6M14 19h3" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
                  </svg>
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 15, color: "#111827" }}>ResumeAI</span>
              </div>
            </div>

            {/* Central White Premium Card */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: 12,
                padding: "40px 36px 34px",
                boxShadow: "0 4px 20px rgba(15,23,42,0.03), 0 1px 2px rgba(15,23,42,0.02)",
                position: "relative",
                width: "100%"
              }}
            >
              {/* Subtle top edge layout marker */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#0D9488", borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />

              {/* Header */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0D9488" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#0D9488", letterSpacing: "0.1em", textTransform: "uppercase" }}>Secure Login</span>
                </div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>
                  Welcome back 👋
                </h1>
                <p style={{ color: "#64748B", fontSize: 13.5, lineHeight: 1.5 }}>
                  Sign in to your ResumeAI account and continue building job-winning resumes.
                </p>
              </div>

              {/* Global error */}
              {errors.form && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", marginBottom: 18, color: "#DC2626", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>⚠</span> {errors.form}
                </div>
              )}

              {/* Input Fields Stack */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Field label="Email Address" id="email" type="email" value={form.email} onChange={handleChange("email")} error={errors.email} placeholder="you@company.com" autoComplete="email" />
                <Field
                  label="Password" id="password" type={showPwd ? "text" : "password"}
                  value={form.password} onChange={handleChange("password")}
                  error={errors.password} placeholder="Your password" autoComplete="current-password"
                  rightEl={
                    <button onClick={() => setShowPwd(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", color: showPwd ? "#0D9488" : "#9CA3AF", display: "flex", padding: 2, transition: "color 0.15s" }} tabIndex={-1}>
                      {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  }
                />
              </div>

              {/* Remember me + Forgot Option Row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "between", justifyContent: "space-between", marginTop: 16 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <div onClick={() => setRemember(r => !r)} style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${remember ? "#0D9488" : "#D1D5DB"}`, background: remember ? "#0D9488" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", cursor: "pointer", flexShrink: 0 }}>
                    {remember && <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><polyline points="1.5 6 4.5 9 10.5 3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ fontSize: 13, color: "#64748B", userSelect: "none" }}>Remember me</span>
                </label>
                <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 13, color: "#0D9488", textDecoration: "none", fontWeight: 600, transition: "color 0.15s" }}
                  onMouseEnter={e => e.target.style.color = "#0F766E"}
                  onMouseLeave={e => e.target.style.color = "#0D9488"}
                >Forgot password?</a>
              </div>

              {/* Matte Charcoal Primary Action Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: "100%", marginTop: 22,
                  padding: "14px 24px",
                  background: loading ? "#64748B" : "#1E293B", 
                  border: "none", borderRadius: 8,
                  cursor: loading ? "not-allowed" : "pointer",
                  color: "#fff", fontFamily: "'Inter', sans-serif",
                  fontWeight: 600, fontSize: 14.5, letterSpacing: "0.01em",
                  transition: "all 0.2s ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = "#0F172A"; } }}
                onMouseLeave={e => { e.currentTarget.style.background = loading ? "#64748B" : "#1E293B"; }}
              >
                {loading ? <><SpinnerIcon /> Signing in…</> : <>Sign In <ArrowIcon /></>}
              </button>

              {/* Structural Section Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0 20px" }}>
                <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
                <span style={{ color: "#94A3B8", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em" }}>OR CONTINUE WITH</span>
                <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
              </div>

              {/* Social Authentication Row */}
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { label: "Google", icon: <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
                  { label: "LinkedIn", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="#0A66C2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
                ].map(({ label, icon }) => (
                  <button key={label} style={{ flex: 1, padding: "11px 16px", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 8, cursor: "pointer", color: "#334155", fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.borderColor = "#CBD5E1"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#FFFFFF"; e.currentTarget.style.borderColor = "#E2E8F0"; }}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>

              {/* Redirection link using the core theme action-teal setup */}
              <p style={{ textAlign: "center", marginTop: 24, color: "#64748B", fontSize: 13 }}>
                Don't have an account?{" "}
                <Link to="/signup" style={{ color: "#0D9488", fontWeight: 700, textDecoration: "none" }}>Create one free →</Link>
              </p>

              {/* Encryption Secure Metadata Badge */}
              <div style={{ marginTop: 20, padding: "10px 14px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#94A3B8", display: "flex", alignItems: "center" }}><ShieldIcon /></span>
                <span style={{ fontSize: 11.5, color: "#94A3B8", lineHeight: 1.4 }}>
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