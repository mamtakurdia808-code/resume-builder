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
const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><polyline points="1.5 6 4.5 9 10.5 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
  const lifted = focused || (value && value.length > 0);
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
            background: focused ? "#F0FDFA" : "#F8FAFC",
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

// ─── Skill pill (used inside the resume mockup) ────────────────────────────────
const SkillPill = ({ label, matched }) => (
  <div style={{
    fontSize: 10, fontWeight: 600, fontFamily: "'Inter', sans-serif",
    padding: "4px 9px", borderRadius: 999,
    background: matched ? "rgba(13,148,136,0.1)" : "#F1F5F9",
    color: matched ? "#0D9488" : "#94A3B8",
    border: `1px solid ${matched ? "rgba(13,148,136,0.25)" : "#E2E8F0"}`,
    display: "flex", alignItems: "center", gap: 4,
  }}>
    {matched && <CheckIcon />}{label}
  </div>
);

// ─── Bar (used inside the resume mockup) ───────────────────────────────────────
const Bar = ({ width, color = "#E2E8F0", height = 6 }) => (
  <div style={{ height, width, background: color, borderRadius: 4 }} />
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

    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    try {
      const { data } = await axios.post(`${apiBaseUrl}/auth/login`, {
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
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

  html, body, #root {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
    box-sizing: border-box;
    background: #1E293B;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  @keyframes drift {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-22px, -28px); }
  }

  @keyframes scanline {
    0% { top: 6%; opacity: 0; }
    8% { opacity: 1; }
    48% { top: 90%; opacity: 1; }
    56% { opacity: 0; }
    100% { top: 6%; opacity: 0; }
  }

  @keyframes chipFloatA {
    0%, 100% { transform: translateY(0) rotate(-3deg); }
    50% { transform: translateY(-10px) rotate(-3deg); }
  }
  @keyframes chipFloatB {
    0%, 100% { transform: translateY(0) rotate(4deg); }
    50% { transform: translateY(-8px) rotate(4deg); }
  }
  @keyframes chipFloatC {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px #F8FAFC inset !important;
    -webkit-text-fill-color: #111827 !important;
    caret-color: #111827;
  }

  ::placeholder { color: rgba(156, 163, 175, 0.7); font-size: 13px; }

  .login-root {
    width: 100%;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1.05fr 1fr;
    align-items: center;
    background: #1E293B;
    font-family: "Inter", sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .bg-glow-a {
    position: fixed; top: -180px; left: -160px; width: 480px; height: 480px;
    border-radius: 50%; pointer-events: none;
    background: radial-gradient(circle, rgba(13,148,136,0.16) 0%, transparent 70%);
    animation: drift 18s ease-in-out infinite;
  }
  .bg-glow-b {
    position: fixed; bottom: -200px; right: -120px; width: 520px; height: 520px;
    border-radius: 50%; pointer-events: none;
    background: radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 70%);
    animation: drift 22s ease-in-out infinite reverse;
  }
  .bg-dots {
    position: fixed; inset: 0; pointer-events: none; opacity: 0.05;
    background-image: radial-gradient(circle, #FFFFFF 1px, transparent 1px);
    background-size: 26px 26px;
  }

  .stage-panel {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 56px 64px;
    z-index: 1;
  }

  .mockup-stage {
    position: relative;
    width: 100%;
    max-width: 360px;
    height: 380px;
    margin: 44px 0 8px;
  }

  .resume-card {
    position: absolute;
    top: 50%; left: 50%;
    width: 246px;
    transform: translate(-50%, -50%) rotate(-5deg);
    background: #FFFFFF;
    border-radius: 14px;
    padding: 20px;
    box-shadow: 0 28px 60px -18px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04);
    overflow: hidden;
  }

  .scanline {
    position: absolute;
    left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent, #2DD4BF 35%, #2DD4BF 65%, transparent);
    box-shadow: 0 0 18px 3px rgba(45,212,191,0.55);
    animation: scanline 4.5s ease-in-out infinite;
  }

  .float-chip {
    position: absolute;
    display: flex; align-items: center; gap: 6px;
    font-family: 'Inter', sans-serif; font-weight: 700; font-size: 12px;
    padding: 8px 13px; border-radius: 999px;
    background: #FFFFFF; color: #0D9488;
    box-shadow: 0 14px 30px -10px rgba(0,0,0,0.45);
    border: 1px solid rgba(13,148,136,0.18);
    white-space: nowrap;
  }

  .right-panel {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 56px;
    background: #F8FAFC;
    position: relative;
    z-index: 1;
    box-shadow: -40px 0 80px -40px rgba(0,0,0,0.35);
  }

  .form-container { width: 100%; max-width: 440px; }

  @media (max-width: 1150px) {
    .stage-panel { padding: 48px; }
    .right-panel { padding: 48px; }
  }

  @media (max-width: 990px) {
    .login-root { grid-template-columns: 1fr; }
    .stage-panel { display: none !important; }
    .right-panel { padding: 40px 22px; min-height: 100vh; box-shadow: none; }
    .mobile-logo-wrapper { display: block !important; }
  }
`;

  return (
    <>
      <style>{css}</style>
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
      <div className="bg-glow-a" />
      <div className="bg-glow-b" />
      <div className="bg-dots" />

      <div className="login-root" onKeyDown={handleKeyDown}>

        {/* ── Left Stage Panel: brand + animated ATS-scan mockup ── */}
        <div className="stage-panel">
          <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(14px)", transition: "all 0.6s cubic-bezier(0.34,1.1,0.64,1)" }}>

            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: "#0D9488", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="9" rx="1" fill="white" opacity="0.95"/>
                  <rect x="3" y="14" width="7" height="2" rx="0.5" fill="white" opacity="0.6"/>
                  <rect x="3" y="18" width="5" height="2" rx="0.5" fill="white" opacity="0.4"/>
                  <path d="M14 7h6M14 11h4M14 15h6M14 19h3" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: "#FFFFFF", letterSpacing: "-0.02em" }}>ResumeAI</div>
                <div style={{ fontSize: 10.5, color: "#0D9488", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>AI Resume Builder</div>
              </div>
            </div>

            {/* Headline */}
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 34, color: "#F8FAFC", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 12, maxWidth: 420 }}>
              Built to pass the bots,<br/>written to win the room.
            </h2>
            <p style={{ color: "#94A3B8", fontSize: 14.5, lineHeight: 1.65, maxWidth: 380 }}>
              Every résumé you build is scanned against real ATS rules the moment you save —
              so you fix the gaps before a recruiter ever sees it.
            </p>

            {/* ── Signature visual: tilted resume card with scan-line + live match chips ── */}
            <div className="mockup-stage">
              <div className="float-chip" style={{ top: 6, right: 4, animation: "chipFloatA 5.5s ease-in-out infinite" }}>
                <CheckIcon /> React.js
              </div>
              <div className="float-chip" style={{ bottom: 18, left: -6, animation: "chipFloatB 6.5s ease-in-out infinite" }}>
                <CheckIcon /> Team Leadership
              </div>
              <div style={{
                position: "absolute", top: "50%", right: -8, transform: "translateY(-130%) rotate(3deg)",
                animation: "chipFloatC 5s ease-in-out infinite",
                width: 68, height: 68, borderRadius: "50%",
                background: "conic-gradient(#2DD4BF 0% 94%, rgba(255,255,255,0.08) 94% 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 16px 34px -12px rgba(0,0,0,0.5)",
              }}>
                <div style={{ width: 54, height: 54, borderRadius: "50%", background: "#1E293B", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: "#2DD4BF" }}>94%</span>
                  <span style={{ fontSize: 7, color: "#94A3B8", letterSpacing: "0.12em" }}>ATS</span>
                </div>
              </div>

              <div className="resume-card">
                <div className="scanline" />
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#0D9488", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <Bar width="72%" height={8} color="#1E293B" />
                    <div style={{ height: 6 }} />
                    <Bar width="46%" height={6} color="#CBD5E1" />
                  </div>
                </div>
                <div style={{ height: 1, background: "#E2E8F0", margin: "14px 0" }} />
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.14em", color: "#0D9488", fontWeight: 700, marginBottom: 9 }}>EXPERIENCE</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 14 }}>
                  <Bar width="92%" />
                  <Bar width="80%" />
                  <Bar width="64%" />
                </div>
                <div style={{ height: 1, background: "#E2E8F0", margin: "14px 0" }} />
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.14em", color: "#0D9488", fontWeight: 700, marginBottom: 9 }}>SKILLS</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <SkillPill label="React" matched />
                  <SkillPill label="Node.js" matched />
                  <SkillPill label="SQL" />
                  <SkillPill label="Figma" matched />
                  <SkillPill label="AWS" />
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 28, marginTop: 18 }}>
              {[{ value: "50K+", label: "Resumes built" }, { value: "3.2×", label: "More interviews" }, { value: "94%", label: "ATS pass rate" }].map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 19, fontWeight: 700, color: "#2DD4BF", letterSpacing: "-0.02em" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Panel: Login form ── */}
        <div className="right-panel">
          <div className="form-container" style={{ opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(16px)", transition: "all 0.5s cubic-bezier(0.34,1.1,0.64,1)" }}>

            {/* Mobile-only logo */}
            <div style={{ display: "none" }} className="mobile-logo-wrapper">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, justifyContent: "center" }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: "#0D9488", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="7" height="9" rx="1" fill="white" opacity="0.95"/>
                    <rect x="3" y="14" width="7" height="2" rx="0.5" fill="white" opacity="0.6"/>
                    <rect x="3" y="18" width="5" height="2" rx="0.5" fill="white" opacity="0.4"/>
                    <path d="M14 7h6M14 11h4M14 15h6M14 19h3" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
                  </svg>
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: "#111827", letterSpacing: "-0.02em" }}>ResumeAI</div>
              </div>
            </div>

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#0D9488" }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: "#0D9488", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Secure Login</span>
              </div>
              <h1 style={{ fontSize: 30, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>
                Welcome back 👋
              </h1>
              <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.5 }}>
                Sign in to continue building résumés that get noticed.
              </p>
            </div>

            {/* Global error */}
            {errors.form && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", marginBottom: 18, color: "#DC2626", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                <span>⚠</span> {errors.form}
              </div>
            )}

            {/* Input Fields Stack */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <div onClick={() => setRemember(r => !r)} style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${remember ? "#0D9488" : "#D1D5DB"}`, background: remember ? "#0D9488" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", cursor: "pointer", flexShrink: 0 }}>
                  {remember && <span style={{ color: "#fff", display: "flex" }}><CheckIcon /></span>}
                </div>
                <span style={{ fontSize: 13.5, color: "#64748B", userSelect: "none" }}>Remember me</span>
              </label>
              <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 13.5, color: "#0D9488", textDecoration: "none", fontWeight: 600, transition: "color 0.15s" }}>Forgot password?</a>
            </div>

            {/* Primary Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%", marginTop: 24,
                padding: "14px 24px",
                background: loading ? "#64748B" : "#0D9488",
                border: "none", borderRadius: 8,
                cursor: loading ? "not-allowed" : "pointer",
                color: "#fff", fontFamily: "'Inter', sans-serif",
                fontWeight: 600, fontSize: 15, letterSpacing: "0.01em",
                transition: "all 0.2s ease",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: loading ? "none" : "0 12px 24px -10px rgba(13,148,136,0.55)",
              }}
            >
              {loading ? <><SpinnerIcon /> Signing in…</> : <>Sign In <ArrowIcon /></>}
            </button>

            {/* Redirect Link */}
            <p style={{ textAlign: "center", marginTop: 28, color: "#64748B", fontSize: 13.5 }}>
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: "#0D9488", fontWeight: 700, textDecoration: "none" }}>Create one free →</Link>
            </p>

            {/* Security Encryption Badge */}
            <div style={{ marginTop: 24, padding: "11px 14px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#94A3B8", display: "flex", alignItems: "center" }}><ShieldIcon /></span>
              <span style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.4 }}>
                Protected with 256-bit SSL encryption.
              </span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}