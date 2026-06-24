import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Password Rule Item ────────────────────────────────────────────────────────
const RuleItem = ({ met, label }) => (
  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: met ? "#4ade80" : "#94a3b8", transition: "color 0.2s" }}>
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 16, height: 16, borderRadius: "50%",
      background: met ? "rgba(74,222,128,0.15)" : "rgba(148,163,184,0.1)",
      color: met ? "#4ade80" : "#475569", transition: "all 0.2s",
    }}>
      {met ? <CheckIcon /> : <XIcon />}
    </span>
    {label}
  </span>
);

// ─── Toast Component ───────────────────────────────────────────────────────────
const Toast = ({ message, visible }) => (
  <div style={{
    position: "fixed", top: 28, right: 28, zIndex: 9999,
    display: "flex", alignItems: "center", gap: 12,
    background:
"linear-gradient(135deg, #0D9488, #14B8A6)",
    color: "#ecfdf5", padding: "14px 22px", borderRadius: 14,
    boxShadow: "0 8px 32px rgba(4,120,87,0.45)",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14,
    transform: visible ? "translateY(0) scale(1)" : "translateY(-16px) scale(0.95)",
    opacity: visible ? 1 : 0,
    transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
    pointerEvents: "none",
    letterSpacing: "0.01em",
  }}>
    <span style={{
      width: 26, height: 26, borderRadius: "50%",
      background: "rgba(255,255,255,0.15)", display: "inline-flex",
      alignItems: "center", justifyContent: "center",
    }}>
      <CheckIcon />
    </span>
    {message}
  </div>
);

// ─── Field Component ───────────────────────────────────────────────────────────
const Field = ({ label, id, type, value, onChange, error, placeholder, rightEl, autoComplete }) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ position: "relative" }}>
        {/* Floating label */}
        <label
          htmlFor={id}
          style={{
            position: "absolute", left: 16,
            top: focused || hasValue ? 8 : "50%",
            transform: focused || hasValue ? "none" : "translateY(-50%)",
            fontSize: focused || hasValue ? 11 : 14,
            fontWeight: focused || hasValue ? 600 : 400,
            color: focused
  ? "#0D9488"
  : error
  ? "#EF4444"
  : "#64748B",
            letterSpacing: focused || hasValue ? "0.06em" : "normal",
            textTransform: focused || hasValue ? "uppercase" : "none",
            transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
            pointerEvents: "none",
            zIndex: 1,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {label}
        </label>

        <input
  id={id}
  type={type}
  value={value}
  onChange={onChange}
  onFocus={() => setFocused(true)}
  onBlur={() => setFocused(false)}
  autoComplete={autoComplete}
  placeholder={focused ? placeholder : ""}
  style={{
    width: "100%",
    paddingTop: 22,
    paddingBottom: 10,
    paddingLeft: 16,
    paddingRight: rightEl ? 48 : 16,

    background: focused ? "#F0FDFA" : "#F8FAFC",

    border: `1.5px solid ${
      error
        ? "#EF4444"
        : focused
        ? "#0D9488"
        : "#E2E8F0"
    }`,

    borderRadius: 12,

    color: "#111827",

    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,

    outline: "none",
    boxSizing: "border-box",

    transition:
      "border-color 0.22s ease, box-shadow 0.22s ease, background-color 0.22s ease",

    boxShadow: focused
      ? error
        ? "0 0 0 3px rgba(239,68,68,0.12)"
        : "0 0 0 3px rgba(13,148,136,0.15)"
      : "0 1px 2px rgba(15,23,42,0.03)",

    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
  }}
/>

        {rightEl && (
          <div style={{
            position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
            color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center",
          }}>
            {rightEl}
          </div>
        )}
      </div>

      {error && (
        <p style={{
          margin: "5px 4px 0", fontSize: 12, color: "#f87171",
          fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 4,
          animation: "slideDown 0.2s ease",
        }}>
          <span style={{ opacity: 0.8 }}>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

// ─── Main SignUp Component ─────────────────────────────────────────────────────
export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirm_password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [mounted, setMounted] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const passwordRules = [
    { met: /[A-Z]/.test(form.password), label: "Uppercase letter" },
    { met: /[a-z]/.test(form.password), label: "Lowercase letter" },
    { met: /[0-9]/.test(form.password), label: "Number" },
    { met: /[^A-Za-z0-9]/.test(form.password), label: "Special character" },
    { met: form.password.length >= 8, label: "8+ characters" },
  ];
  const passwordStrength = passwordRules.filter(r => r.met).length;

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = "Full name is required";
    else if (form.full_name.trim().length < 2) e.full_name = "Must be at least 2 characters";

    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";

    if (!form.password) e.password = "Password is required";
    else if (passwordStrength < 5) e.password = "Password doesn't meet all requirements";

    if (!form.confirm_password) e.confirm_password = "Please confirm your password";
    else if (form.password !== form.confirm_password) e.confirm_password = "Passwords don't match";

    return e;
  };

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: "" }));
  };

  const showToast = (msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: "" }), 3200);
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      showToast("Account created! Redirecting to login…");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Registration failed. Please try again.";
      if (err.response?.status === 409) setErrors({ email: "This email is already registered" });
      else setErrors({ form: msg });
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = [
"#DC2626",
"#EA580C",
"#D97706",
"#14B8A6",
"#0D9488"
];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Syne:wght@700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { margin: 0; }
    ::placeholder { color: rgba(148,163,184,0.45); font-size: 13px; }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
    @keyframes orb1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,-30px) scale(1.08); } }
    @keyframes orb2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-30px,40px) scale(1.06); } }
    @keyframes orb3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,20px) scale(1.04); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 1000px #F8FAFC inset !important;
-webkit-text-fill-color: #111827 !important;
      caret-color: #111827;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <Toast message={toast.message} visible={toast.visible} />

      {/* Background */}
      <div style={{
        minHeight: "100vh", width: "100%",
        background: "#F8FAFC",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 16px", position: "relative", overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* Animated orbs */}
        <div style={{
          position: "absolute", top: "-10%", left: "-5%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)",
          animation: "orb1 12s ease-in-out infinite", filter: "blur(1px)",
        }} />
        <div style={{
          position: "absolute", bottom: "-15%", right: "-8%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 70%)",
          animation: "orb2 16s ease-in-out infinite", filter: "blur(1px)",
        }} />
        <div style={{
          position: "absolute", top: "40%", left: "60%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(13,148,136,0.08)0%, transparent 70%)",
          animation: "orb3 10s ease-in-out infinite",
        }} />

        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        {/* Card */}
        <div style={{
          width: "100%", maxWidth: 500, position: "relative", zIndex: 10,
          opacity: mounted ? 1 : 0,
          padding: "32px 36px",
          transform: mounted ? "none" : "translateY(24px)",
          transition: "all 0.6s cubic-bezier(0.34,1.2,0.64,1)",
        }}>
          {/* Glow behind card */}
          <div
  style={{
    position: "absolute",
    inset: -20,
    background:
      "radial-gradient(circle, rgba(13,148,136,0.15) 0%, transparent 70%)",
    filter: "blur(30px)",
  }}
/>

          <div style={{
            position: "relative",
            background: "#FFFFFF",
border: "1px solid #E2E8F0",
backdropFilter: "none",
WebkitBackdropFilter: "none",
            borderRadius: 24,
            padding: "40px 40px 36px",
            boxShadow:"0 4px 20px rgba(15,23,42,0.03), 0 1px 2px rgba(15,23,42,0.02)",
          }}>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              {/* Logo mark */}
              <div style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 52, height: 52, borderRadius: 16,
                background: "#0D9488",
                marginBottom: 18,
                boxShadow: "0 10px 24px rgba(13,148,136,0.25)"
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="9" rx="1.5" fill="white" opacity="0.9"/>
                  <rect x="3" y="14" width="7" height="2" rx="1" fill="white" opacity="0.6"/>
                  <rect x="3" y="18" width="5" height="2" rx="1" fill="white" opacity="0.4"/>
                  <path d="M14 7h6M14 11h4M14 15h6M14 19h3" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
                </svg>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 4 }}>
                <span style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22,
                  color: "#111827",
                  letterSpacing: "-0.02em",
                }}>ResumeAI</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, color: "#0D9488",
background: "#F0FDFA",
border: "1px solid #99F6E4",
                  borderRadius: 6, padding: "2px 7px", letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}>Beta</span>
              </div>

              <p style={{ color: "#64748B", fontSize: 13, letterSpacing: "0.01em", lineHeight: 1.5 }}>
                AI Resume Builder &amp; ATS Checker
              </p>

              <div style={{ marginTop: 14 }}>
                <h1 style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 26,
                  color: "#111827", letterSpacing: "-0.03em", lineHeight: 1.2,
                }}>Create your account</h1>
                <p style={{ color: "#64748b", fontSize: 13, marginTop: 6 }}>
                  Build resumes that beat ATS systems effortlessly
                </p>
              </div>
            </div>

            {/* Form error */}
            {errors.form && (
              <div style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 10, padding: "10px 14px", marginBottom: 20,
                color: "#fca5a5", fontSize: 13, fontWeight: 500,
                animation: "slideDown 0.2s ease",
              }}>
                {errors.form}
              </div>
            )}

            {/* Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field
                label="Full Name" id="full_name" type="text"
                value={form.full_name} onChange={handleChange("full_name")}
                error={errors.full_name} placeholder="Jane Smith"
                autoComplete="name"
              />
              <Field
                label="Email Address" id="email" type="email"
                value={form.email} onChange={handleChange("email")}
                error={errors.email} placeholder="jane@company.com"
                autoComplete="email"
              />
              <div>
                <Field
                  label="Password" id="password" type={showPassword ? "text" : "password"}
                  value={form.password} onChange={handleChange("password")}
                  error={errors.password} placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  rightEl={
                    <span onClick={() => setShowPassword(s => !s)} style={{ color: showPassword ? "#0D9488" : "#64748B", transition: "color 0.2s" }}>
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </span>
                  }
                />

                {/* Strength bar */}
                {form.password.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} style={{
                          flex: 1, height: 3, borderRadius: 4,
                          background: i <= passwordStrength ? strengthColors[passwordStrength - 1] : "rgba(255,255,255,0.08)",
                          transition: "background 0.3s ease",
                        }} />
                      ))}
                    </div>
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      marginBottom: 8,
                    }}>
                      <span style={{ fontSize: 11, color: passwordStrength > 0 ? strengthColors[passwordStrength - 1] : "#64748b", fontWeight: 600 }}>
                        {strengthLabels[passwordStrength]}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 12px" }}>
                      {passwordRules.map(r => <RuleItem key={r.label} met={r.met} label={r.label} />)}
                    </div>
                  </div>
                )}
              </div>

              <Field
                label="Confirm Password" id="confirm_password"
                type={showConfirm ? "text" : "password"}
                value={form.confirm_password} onChange={handleChange("confirm_password")}
                error={errors.confirm_password} placeholder="Re-enter your password"
                autoComplete="new-password"
                rightEl={
                  <span onClick={() => setShowConfirm(s => !s)} style={{ color: showConfirm ? "#0D9488": "#64748b", transition: "color 0.2s" }}>
                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                  </span>
                }
              />
            </div>

            {/* Terms */}
            <p style={{ fontSize: 12, color: "#475569", marginTop: 14, lineHeight: 1.6, textAlign: "center" }}>
              By signing up, you agree to our{" "}
              <a href="#" style={{ color: "#0D9488", textDecoration: "none", fontWeight: 500 }}>Terms of Service</a>
              {" "}and{" "}
              <a href="#" style={{ color: "#0D9488", textDecoration: "none", fontWeight: 500 }}>Privacy Policy</a>
            </p>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%", marginTop: 20,
                padding: "15px 24px",
                background: "#1E293B",
                border: "none", borderRadius: 13, cursor: loading ? "not-allowed" : "pointer",
                color: "#fff", fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600, fontSize: 15, letterSpacing: "0.01em",
                boxShadow:"0 4px 20px rgba(15,23,42,0.08)",
                transition: "all 0.25s ease",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transform: loading ? "scale(0.99)" : "scale(1)",
              }}
              onMouseEnter={e => { if (!loading) e.target.style.transform = "scale(1.01)"; }}
              onMouseLeave={e => { e.target.style.transform = "scale(1)"; }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    border: "2.5px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    animation: "spin 0.7s linear infinite",
                  }} />
                  Creating account…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                  Create Free Account
                </>
              )}
            </button>

            {/* Sign in link */}
            <p style={{ textAlign: "center", marginTop: 24, color: "#64748b", fontSize: 13 }}>
              Already have an account?{" "}
              <Link to="/login" style={{
                color: "#0D9488", fontWeight: 600, textDecoration: "none",
                borderBottom: "1px solid rgba(13,148,136,0.25)",paddingBottom: 1,
                transition: "all 0.2s",
              }}>
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}