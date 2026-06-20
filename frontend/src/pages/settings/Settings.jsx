import React, { useState, useEffect, useCallback } from "react";
import {
  FiUser, FiMail, FiCalendar, FiShield, FiLock, FiEye, FiEyeOff,
  FiSun, FiMoon, FiMonitor, FiGlobe, FiFileText, FiSave,
  FiZap, FiLinkedin, FiGithub, FiLink, FiTrash2,
  FiAlertTriangle, FiCheckCircle, FiXCircle, FiRefreshCw, FiInfo,
  FiChevronDown, FiEdit2, FiExternalLink, FiX,
} from "react-icons/fi";

// ─── Constants ────────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL;
const TOKEN = () => localStorage.getItem("token");

const LANGUAGES = ["English"];

// ─── Theme Engine ─────────────────────────────────────────────────────────────
// Reads system preference and merges with user choice.
// Applies CSS custom properties to :root so ALL pages respond.
const THEME_VARS = {
  light: {
    "--bg-base":       "#f0f9f8",
    "--bg-card":       "#ffffff",
    "--bg-input":      "#f8fafc",
    "--bg-icon":       "#f0fdf9",
    "--border-card":   "#e8f5f3",
    "--border-input":  "#e2e8f0",
    "--border-subtle": "#f1f5f9",
    "--text-primary":  "#1a2332",
    "--text-secondary":"#374151",
    "--text-muted":    "#64748b",
    "--text-faint":    "#94a3b8",
    "--accent":        "#0d9488",
    "--accent-light":  "#f0fdf9",
    "--accent-border": "#a7f3d0",
  },
  dark: {
    "--bg-base":       "#0f172a",
    "--bg-card":       "#1e293b",
    "--bg-input":      "#0f172a",
    "--bg-icon":       "#134e4a",
    "--border-card":   "#334155",
    "--border-input":  "#475569",
    "--border-subtle": "#334155",
    "--text-primary":  "#f1f5f9",
    "--text-secondary":"#e2e8f0",
    "--text-muted":    "#94a3b8",
    "--text-faint":    "#64748b",
    "--accent":        "#2dd4bf",
    "--accent-light":  "#134e4a",
    "--accent-border": "#0f766e",
  },
};

const applyTheme = (theme) => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = theme === "System" ? (prefersDark ? "dark" : "light") : theme.toLowerCase();
  const vars = THEME_VARS[resolved] || THEME_VARS.light;
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  root.setAttribute("data-theme", resolved);
};

// ─── CSS-in-const Styles (uses CSS vars — auto dark/light) ───────────────────
const s = {
  page: {
    minHeight: "100vh",
    backgroundColor: "var(--bg-base)",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    color: "var(--text-primary)",
    transition: "background-color 0.3s, color 0.3s",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 24px 80px",
  },
  header: {
    marginBottom: "40px",
    paddingBottom: "28px",
    borderBottom: "1px solid var(--border-card)",
  },
  headerTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "var(--accent)",
    margin: "0 0 6px",
    letterSpacing: "-0.5px",
  },
  headerSubtitle: {
    fontSize: "15px",
    color: "var(--text-muted)",
    margin: "0",
    fontWeight: "400",
  },
  card: {
    backgroundColor: "var(--bg-card)",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(13,148,136,0.06)",
    border: "1px solid var(--border-card)",
    transition: "background-color 0.3s, border-color 0.3s",
  },
  cardDanger: {
    backgroundColor: "var(--bg-card)",
    borderRadius: "16px",
    padding: "28px",
    border: "2px solid #fca5a5",
    transition: "background-color 0.3s",
  },
  sectionLabel: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    color: "var(--accent)",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  cardTitle: {
    fontSize: "17px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "0 0 4px",
  },
  cardDesc: {
    fontSize: "13px",
    color: "var(--text-faint)",
    margin: "0 0 22px",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 0",
    borderBottom: "1px solid var(--border-subtle)",
  },
  infoIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    backgroundColor: "var(--bg-icon)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--accent)",
    flexShrink: 0,
  },
  infoLabel: {
    fontSize: "12px",
    color: "var(--text-faint)",
    fontWeight: "500",
    marginBottom: "2px",
  },
  infoValue: {
    fontSize: "14px",
    fontWeight: "600",
    color: "var(--text-primary)",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: "#dcfce7",
    color: "#15803d",
  },
  btnRow: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "10px 20px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "var(--accent)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "opacity 0.18s, transform 0.12s",
  },
  btnSecondary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "10px 20px",
    borderRadius: "10px",
    border: "1.5px solid var(--accent)",
    backgroundColor: "transparent",
    color: "var(--accent)",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "opacity 0.18s",
  },
  btnDanger: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "10px 22px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#ef4444",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "opacity 0.18s",
  },
  btnGhost: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1.5px solid var(--border-input)",
    backgroundColor: "transparent",
    color: "var(--text-muted)",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  field: { marginBottom: "16px" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "var(--text-secondary)",
    marginBottom: "7px",
  },
  inputWrap: { position: "relative" },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1.5px solid var(--border-input)",
    fontSize: "14px",
    color: "var(--text-primary)",
    backgroundColor: "var(--bg-input)",
    outline: "none",
    transition: "border 0.18s, background-color 0.3s",
    boxSizing: "border-box",
  },
  inputWithIcon: {
    width: "100%",
    padding: "10px 42px 10px 14px",
    borderRadius: "10px",
    border: "1.5px solid var(--border-input)",
    fontSize: "14px",
    color: "var(--text-primary)",
    backgroundColor: "var(--bg-input)",
    outline: "none",
    boxSizing: "border-box",
    transition: "border 0.18s, background-color 0.3s",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "var(--text-faint)",
    display: "flex",
    alignItems: "center",
  },
  select: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1.5px solid var(--border-input)",
    fontSize: "14px",
    color: "var(--text-primary)",
    backgroundColor: "var(--bg-input)",
    outline: "none",
    appearance: "none",
    cursor: "pointer",
    boxSizing: "border-box",
    transition: "border 0.18s, background-color 0.3s",
  },
  selectWrap: { position: "relative" },
  selectArrow: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--text-faint)",
    pointerEvents: "none",
  },
  strengthBar: { display: "flex", gap: "4px", marginTop: "8px" },
  strengthSegment: (filled, color) => ({
    flex: 1,
    height: "4px",
    borderRadius: "4px",
    backgroundColor: filled ? color : "var(--border-input)",
    transition: "background 0.2s",
  }),
  strengthLabel: (color) => ({
    fontSize: "12px",
    fontWeight: "600",
    color,
    marginTop: "5px",
  }),
  themeGroup: { display: "flex", gap: "10px", flexWrap: "wrap" },
  themeOption: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "8px 16px",
    borderRadius: "10px",
    border: `2px solid ${active ? "var(--accent)" : "var(--border-input)"}`,
    backgroundColor: active ? "var(--accent-light)" : "var(--bg-input)",
    color: active ? "var(--accent)" : "var(--text-muted)",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.15s",
  }),
  toggleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "13px 0",
    borderBottom: "1px solid var(--border-subtle)",
  },
  toggleLabel: { fontSize: "14px", fontWeight: "500", color: "var(--text-secondary)" },
  toggleSub: { fontSize: "12px", color: "var(--text-faint)", marginTop: "2px" },
  toggleBtn: (on) => ({
    width: "44px",
    height: "24px",
    borderRadius: "12px",
    backgroundColor: on ? "var(--accent)" : "#d1d5db",
    border: "none",
    cursor: "pointer",
    position: "relative",
    transition: "background 0.2s",
    flexShrink: 0,
  }),
  toggleDot: (on) => ({
    position: "absolute",
    top: "3px",
    left: on ? "23px" : "3px",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    transition: "left 0.2s",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  }),
  socialCard: (connected) => ({
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px",
    borderRadius: "12px",
    border: `1.5px solid ${connected ? "var(--accent-border)" : "var(--border-input)"}`,
    backgroundColor: connected ? "var(--accent-light)" : "var(--bg-input)",
    marginBottom: "12px",
    transition: "all 0.18s",
  }),
  socialIcon: (color) => ({
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    backgroundColor: color + "20",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color,
    fontSize: "20px",
    flexShrink: 0,
  }),
  socialName: { fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" },
  socialUrl: {
    fontSize: "12px",
    color: "var(--text-muted)",
    marginTop: "2px",
    wordBreak: "break-all",
  },
  alert: (type) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "12px 16px",
    borderRadius: "10px",
    marginBottom: "16px",
    fontSize: "14px",
    fontWeight: "500",
    backgroundColor:
      type === "success" ? "#dcfce7" : type === "error" ? "#fee2e2" : "#fef9c3",
    color:
      type === "success" ? "#15803d" : type === "error" ? "#b91c1c" : "#92400e",
    border: `1px solid ${
      type === "success" ? "#86efac" : type === "error" ? "#fca5a5" : "#fde68a"
    }`,
  }),
  dangerTitle: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#ef4444",
    margin: "0 0 8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  dangerDesc: { fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px" },
  dangerList: {
    fontSize: "13px",
    color: "var(--text-faint)",
    paddingLeft: "18px",
    marginBottom: "20px",
    lineHeight: "1.8",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    backgroundColor: "var(--bg-card)",
    borderRadius: "20px",
    padding: "36px",
    width: "100%",
    maxWidth: "440px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    border: "1px solid var(--border-card)",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "var(--text-primary)",
    margin: "0 0 8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  modalDesc: { fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" },
  aboutRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "11px 0",
    borderBottom: "1px solid var(--border-subtle)",
    fontSize: "14px",
  },
  aboutKey: { color: "var(--text-muted)", fontWeight: "500" },
  aboutVal: { fontWeight: "600", color: "var(--text-primary)" },
  versionBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 10px",
    borderRadius: "20px",
    backgroundColor: "var(--accent-light)",
    color: "var(--accent)",
    fontWeight: "700",
    fontSize: "13px",
    border: "1px solid var(--accent-border)",
  },
  spinner: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    border: "2px solid currentColor",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { label: "Too weak",    color: "#ef4444" },
    { label: "Weak",        color: "#f97316" },
    { label: "Fair",        color: "#eab308" },
    { label: "Strong",      color: "#22c55e" },
    { label: "Very strong", color: "#0d9488" },
  ];
  return { score, ...map[score] };
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const Alert = ({ type, message, onClose }) =>
  message ? (
    <div style={s.alert(type)}>
      {type === "success" ? <FiCheckCircle size={16} /> : <FiXCircle size={16} />}
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", display: "flex" }}>
          <FiX size={14} />
        </button>
      )}
    </div>
  ) : null;

const Toggle = ({ on, onChange }) => (
  <button style={s.toggleBtn(on)} onClick={() => onChange(!on)} aria-checked={on} role="switch">
    <span style={s.toggleDot(on)} />
  </button>
);

const SelectField = ({ value, onChange, options }) => (
  <div style={s.selectWrap}>
    <select style={s.select} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
    <span style={s.selectArrow}><FiChevronDown size={15} /></span>
  </div>
);

const PasswordField = ({ label, name, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <div style={s.inputWrap}>
        <input
          style={s.inputWithIcon}
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder || "••••••••"}
          autoComplete="off"
        />
        <button style={s.eyeBtn} onClick={() => setShow((p) => !p)} type="button">
          {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Settings = () => {
  const [loading, setLoading]     = useState(true);
  const [user, setUser]           = useState({});
  const [about, setAbout]         = useState({});

  // Password
  const [passwords, setPasswords] = useState({ current: "", newPwd: "", confirm: "" });
  const [pwdAlert, setPwdAlert]   = useState({ type: "", msg: "" });
  const [pwdLoading, setPwdLoading] = useState(false);

  // Preferences
  const [prefs, setPrefs] = useState({
    theme: "System",
    language: "English",
    autoSave: true,
    emailNotifications: true,
    atsTips: true,
    aiSuggestions: true,
  });
  const [prefsAlert, setPrefsAlert]   = useState({ type: "", msg: "" });
  const [prefsLoading, setPrefsLoading] = useState(false);

  // Social links — keep a "saved" copy to show on screen
  const [socials, setSocials]         = useState({ linkedin: "", github: "", portfolio: "" });
  const [socialDraft, setSocialDraft] = useState({ linkedin: "", github: "", portfolio: "" });
  const [socialEditing, setSocialEditing] = useState({ linkedin: false, github: false, portfolio: false });
  const [socialLoading, setSocialLoading] = useState({ linkedin: false, github: false, portfolio: false });
  const [socialAlert, setSocialAlert]   = useState({ type: "", msg: "" });

  // Delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm]     = useState("");
  const [deleteLoading, setDeleteLoading]     = useState(false);

  // ── Apply theme on prefs change ──────────────────────────────────────────────
  useEffect(() => {
    applyTheme(prefs.theme);
    localStorage.setItem("resumeai-theme", prefs.theme);
  }, [prefs.theme]);

  // ── Apply saved theme on first load (before API responds) ───────────────────
  useEffect(() => {
    const saved = localStorage.getItem("resumeai-theme") || "System";
    applyTheme(saved);
    setPrefs((p) => ({ ...p, theme: saved }));
  }, []);

  // ── Fetch user profile from /profile ────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${TOKEN()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load profile");
      // Support both flat and nested response shapes
      const u = data.user || data;
      setUser({
        fullName:    u.fullName || u.name || u.username || "—",
        email:       u.email || "—",
        memberSince: u.memberSince || u.createdAt || u.created_at || null,
        status:      u.status || u.accountStatus || "Active",
      });
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  }, []);

  // ── Fetch settings from /settings ───────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/settings`, {
        headers: { Authorization: `Bearer ${TOKEN()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load settings");

      if (data.preferences) {
        setPrefs((p) => {
          const merged = { ...p, ...data.preferences };
          // Don't overwrite locally applied theme from localStorage
          const saved = localStorage.getItem("resumeai-theme");
          if (saved) merged.theme = saved;
          return merged;
        });
      }
      if (data.socialLinks) {
        setSocials(data.socialLinks);
        setSocialDraft(data.socialLinks);
      }
      if (data.about) setAbout(data.about);
    } catch (err) {
      console.error("Settings fetch error:", err);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchSettings()]);
      setLoading(false);
    };
    init();
  }, [fetchProfile, fetchSettings]);

  // ── Change password ──────────────────────────────────────────────────────────
  const handleChangePassword = async () => {
    setPwdAlert({ type: "", msg: "" });
    if (!passwords.current || !passwords.newPwd || !passwords.confirm)
      return setPwdAlert({ type: "error", msg: "All fields are required." });
    if (passwords.newPwd !== passwords.confirm)
      return setPwdAlert({ type: "error", msg: "New passwords do not match." });
    if (passwords.newPwd.length < 8)
      return setPwdAlert({ type: "error", msg: "Password must be at least 8 characters." });

    setPwdLoading(true);
    try {
      const res = await fetch(`${API_URL}/settings/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN()}` },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPwd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      setPwdAlert({ type: "success", msg: "Password updated successfully." });
      setPasswords({ current: "", newPwd: "", confirm: "" });
    } catch (err) {
      setPwdAlert({ type: "error", msg: err.message });
    } finally {
      setPwdLoading(false);
    }
  };

  // ── Save preferences ─────────────────────────────────────────────────────────
  const handleSavePrefs = async () => {
    setPrefsLoading(true);
    setPrefsAlert({ type: "", msg: "" });
    try {
      const res = await fetch(`${API_URL}/settings/preferences`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN()}` },
        body: JSON.stringify(prefs),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save");
      setPrefsAlert({ type: "success", msg: "Preferences saved." });
    } catch (err) {
      setPrefsAlert({ type: "error", msg: err.message });
    } finally {
      setPrefsLoading(false);
    }
  };

  // ── Reset preferences ────────────────────────────────────────────────────────
  const handleResetPrefs = async () => {
    setPrefsLoading(true);
    try {
      const res = await fetch(`${API_URL}/settings/reset`, {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      if (data.preferences) setPrefs((p) => ({ ...p, ...data.preferences }));
      setPrefsAlert({ type: "success", msg: "Preferences reset to defaults." });
    } catch (err) {
      setPrefsAlert({ type: "error", msg: err.message });
    } finally {
      setPrefsLoading(false);
    }
  };

  // ── Save social link (FIX: updates both draft + saved state on success) ──────
  const handleSaveSocial = async (key) => {
    setSocialAlert({ type: "", msg: "" });
    setSocialLoading((p) => ({ ...p, [key]: true }));
    try {
      const res = await fetch(`${API_URL}/settings/social-links`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN()}` },
        body: JSON.stringify({ [key]: socialDraft[key] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save");

      // ✅ Commit draft → displayed value
      setSocials((p) => ({ ...p, [key]: socialDraft[key] }));
      setSocialEditing((p) => ({ ...p, [key]: false }));
      setSocialAlert({ type: "success", msg: `${key.charAt(0).toUpperCase() + key.slice(1)} link updated.` });
    } catch (err) {
      setSocialAlert({ type: "error", msg: err.message });
    } finally {
      setSocialLoading((p) => ({ ...p, [key]: false }));
    }
  };

  // ── Disconnect social ─────────────────────────────────────────────────────────
  const handleDisconnectSocial = async (key) => {
    setSocialLoading((p) => ({ ...p, [key]: true }));
    try {
      const res = await fetch(`${API_URL}/settings/social-links`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN()}` },
        body: JSON.stringify({ [key]: "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSocials((p) => ({ ...p, [key]: "" }));
      setSocialDraft((p) => ({ ...p, [key]: "" }));
      setSocialAlert({ type: "success", msg: "Account disconnected." });
    } catch (err) {
      setSocialAlert({ type: "error", msg: err.message });
    } finally {
      setSocialLoading((p) => ({ ...p, [key]: false }));
    }
  };

  // ── Delete account ────────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_URL}/settings/delete-account`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${TOKEN()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const strength = getPasswordStrength(passwords.newPwd);

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center", color: "var(--accent)" }}>
          <div style={{ ...s.spinner, width: "40px", height: "40px", borderWidth: "3px", margin: "0 auto 16px" }} />
          <p style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)" }}>Loading your settings…</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        *, *::before, *::after { box-sizing: border-box; }
        button:hover { opacity: 0.88; }
        button:active { transform: scale(0.98); }
        input:focus, select:focus {
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 3px rgba(13,148,136,0.15);
        }
        /* Global body theming — affects ALL pages */
        body {
          background-color: var(--bg-base) !important;
          color: var(--text-primary) !important;
          transition: background-color 0.3s, color 0.3s;
        }
        @media (max-width: 768px) {
          .settings-grid { grid-template-columns: 1fr !important; }
          .settings-grid > * { grid-column: 1 / -1 !important; }
          .prefs-inner-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={s.page}>
        <div style={s.container}>

          {/* ── Header ── */}
          <div style={s.header}>
            <h1 style={s.headerTitle}>Settings</h1>
            <p style={s.headerSubtitle}>Manage your account, security and application preferences.</p>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: "24px" }}
            className="settings-grid"
          >

            {/* ═══════════ SECTION 1 — ACCOUNT INFORMATION ═══════════ */}
            <div style={s.card}>
              <div style={s.sectionLabel}><FiUser size={13} /> Account Information</div>

              {[
                { icon: <FiUser size={16} />,     label: "Full Name",    value: user.fullName },
                { icon: <FiMail size={16} />,     label: "Email Address", value: user.email },
                {
                  icon: <FiCalendar size={16} />,
                  label: "Member Since",
                  value: user.memberSince
                    ? new Date(user.memberSince).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                    : "—",
                },
              ].map((row) => (
                <div key={row.label} style={s.infoRow}>
                  <div style={s.infoIcon}>{row.icon}</div>
                  <div>
                    <div style={s.infoLabel}>{row.label}</div>
                    <div style={s.infoValue}>{row.value || "—"}</div>
                  </div>
                </div>
              ))}

              <div style={s.infoRow}>
                <div style={s.infoIcon}><FiShield size={16} /></div>
                <div>
                  <div style={s.infoLabel}>Account Status</div>
                  <span style={s.statusBadge}><FiCheckCircle size={11} /> {user.status || "Active"}</span>
                </div>
              </div>

              <div style={s.btnRow}>
                <button style={s.btnPrimary}><FiEdit2 size={14} /> Edit Profile</button>
                <button style={s.btnSecondary}><FiExternalLink size={14} /> View Profile</button>
              </div>
            </div>

            {/* ═══════════ SECTION 2 — SECURITY ═══════════ */}
            <div style={s.card}>
              <div style={s.sectionLabel}><FiLock size={13} /> Security</div>
              <div style={s.cardTitle}>Change Password</div>
              <div style={s.cardDesc}>Keep your account secure with a strong password.</div>

              <Alert type={pwdAlert.type} message={pwdAlert.msg} onClose={() => setPwdAlert({ type: "", msg: "" })} />

              <PasswordField label="Current Password" name="current" value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                placeholder="Enter current password" />

              <PasswordField label="New Password" name="newPwd" value={passwords.newPwd}
                onChange={(e) => setPasswords((p) => ({ ...p, newPwd: e.target.value }))}
                placeholder="Min. 8 characters" />

              {passwords.newPwd && (
                <div style={{ marginBottom: "14px" }}>
                  <div style={s.strengthBar}>
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} style={s.strengthSegment(i < strength.score, strength.color)} />
                    ))}
                  </div>
                  <div style={s.strengthLabel(strength.color)}>{strength.label}</div>
                </div>
              )}

              <PasswordField label="Confirm New Password" name="confirm" value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                placeholder="Repeat new password" />

              <button style={s.btnPrimary} onClick={handleChangePassword} disabled={pwdLoading}>
                {pwdLoading
                  ? <><div style={s.spinner} /> Updating…</>
                  : <><FiLock size={14} /> Update Password</>}
              </button>
            </div>

            {/* ═══════════ SECTION 3 — APPLICATION PREFERENCES ═══════════ */}
            <div style={{ ...s.card, gridColumn: "1 / -1" }}>
              <div style={s.sectionLabel}><FiZap size={13} /> Application Preferences</div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }} className="prefs-inner-grid">
                <div>
                  <div style={s.field}>
                    <label style={s.label}>Theme</label>
                    <div style={s.themeGroup}>
                      {[
                        { label: "Light",  icon: <FiSun size={14} /> },
                        { label: "Dark",   icon: <FiMoon size={14} /> },
                        { label: "System", icon: <FiMonitor size={14} /> },
                      ].map((t) => (
                        <button
                          key={t.label}
                          style={s.themeOption(prefs.theme === t.label)}
                          onClick={() => setPrefs((p) => ({ ...p, theme: t.label }))}
                        >
                          {t.icon} {t.label}
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--text-faint)", marginTop: "8px", margin: "8px 0 0" }}>
                      Theme applies across all pages instantly.
                    </p>
                  </div>

                  <div style={s.field}>
                    <label style={s.label}>Language</label>
                    <SelectField value={prefs.language} onChange={(v) => setPrefs((p) => ({ ...p, language: v }))} options={LANGUAGES} />
                  </div>


                </div>

                <div>
                  {[
                    { key: "autoSave",            label: "Auto Save Resume",       sub: "Saves your progress automatically" },
                    { key: "emailNotifications",  label: "Email Notifications",    sub: "Receive updates and alerts via email" },
                    { key: "atsTips",             label: "ATS Tips",               sub: "Get ATS optimisation suggestions" },
                    { key: "aiSuggestions",       label: "AI Suggestions",         sub: "Enable AI-powered writing recommendations" },
                  ].map((t) => (
                    <div key={t.key} style={s.toggleRow}>
                      <div>
                        <div style={s.toggleLabel}>{t.label}</div>
                        <div style={s.toggleSub}>{t.sub}</div>
                      </div>
                      <Toggle on={!!prefs[t.key]} onChange={(v) => setPrefs((p) => ({ ...p, [t.key]: v }))} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══════════ SECTION 4 — CONNECTED ACCOUNTS ═══════════ */}
            <div style={s.card}>
              <div style={s.sectionLabel}><FiLink size={13} /> Connected Accounts</div>

              <Alert type={socialAlert.type} message={socialAlert.msg} onClose={() => setSocialAlert({ type: "", msg: "" })} />

              {[
                { key: "linkedin",  label: "LinkedIn",         icon: <FiLinkedin size={18} />, color: "#0077b5", placeholder: "https://linkedin.com/in/yourprofile" },
                { key: "github",    label: "GitHub",           icon: <FiGithub size={18} />,   color: "#24292e", placeholder: "https://github.com/yourusername" },
                { key: "portfolio", label: "Portfolio Website", icon: <FiGlobe size={18} />,   color: "#0d9488", placeholder: "https://yourportfolio.com" },
              ].map((soc) => {
                const connected = !!socials[soc.key];
                const editing   = socialEditing[soc.key];
                const busy      = socialLoading[soc.key];

                return (
                  <div key={soc.key} style={s.socialCard(connected)}>
                    <div style={s.socialIcon(soc.color)}>{soc.icon}</div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={s.socialName}>{soc.label}</div>

                      {editing ? (
                        <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                          <input
                            style={{ ...s.input, fontSize: "12px", padding: "7px 10px" }}
                            value={socialDraft[soc.key]}
                            onChange={(e) => setSocialDraft((p) => ({ ...p, [soc.key]: e.target.value }))}
                            placeholder={soc.placeholder}
                            autoFocus
                          />
                          <button
                            style={{ ...s.btnPrimary, padding: "7px 12px", fontSize: "12px" }}
                            onClick={() => handleSaveSocial(soc.key)}
                            disabled={busy}
                          >
                            {busy ? <div style={s.spinner} /> : <FiSave size={12} />}
                          </button>
                          <button
                            style={{ ...s.btnGhost, padding: "7px 10px" }}
                            onClick={() => {
                              setSocialEditing((p) => ({ ...p, [soc.key]: false }));
                              setSocialDraft((p) => ({ ...p, [soc.key]: socials[soc.key] }));
                            }}
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      ) : (
                        // ✅ Shows saved `socials` value, not draft
                        <div style={s.socialUrl}>{socials[soc.key] || "Not connected"}</div>
                      )}
                    </div>

                    {!editing && (
                      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                        <button
                          style={s.btnGhost}
                          onClick={() => {
                            setSocialDraft((p) => ({ ...p, [soc.key]: socials[soc.key] }));
                            setSocialEditing((p) => ({ ...p, [soc.key]: true }));
                          }}
                          disabled={busy}
                        >
                          {connected ? "Edit" : "Connect"}
                        </button>
                        {connected && (
                          <button
                            style={{ ...s.btnGhost, color: "#ef4444", borderColor: "#fca5a5" }}
                            onClick={() => handleDisconnectSocial(soc.key)}
                            disabled={busy}
                          >
                            {busy ? <div style={s.spinner} /> : "Remove"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ═══════════ SECTION 5 — DANGER ZONE ═══════════ */}
            <div style={s.cardDanger}>
              <div style={s.dangerTitle}><FiAlertTriangle size={18} /> Danger Zone</div>
              <p style={s.dangerDesc}>Once deleted, all data is permanently removed and cannot be recovered.</p>
              <div style={s.cardTitle}>Delete Account</div>
              <p style={s.dangerDesc}>Deleting your account permanently removes:</p>
              <ul style={s.dangerList}>
                <li>Your profile and personal information</li>
                <li>All resumes and drafts</li>
                <li>ATS reports and scores</li>
                <li>AI review history</li>
                <li>Job analysis history</li>
              </ul>
              <button style={s.btnDanger} onClick={() => setShowDeleteModal(true)}>
                <FiTrash2 size={14} /> Delete Account
              </button>
            </div>

            {/* ═══════════ SECTION 6 — ABOUT ═══════════ */}
            <div style={s.card}>
              <div style={s.sectionLabel}><FiInfo size={13} /> About</div>
              {[
                { label: "ResumeAI Version",    value: <span style={s.versionBadge}>{about.appVersion || "v2.4.1"}</span> },
                { label: "Application Version", value: about.applicationVersion || "2.4.1" },
                { label: "Backend Version",     value: about.backendVersion || "1.8.0" },
                { label: "Database",            value: about.database || "PostgreSQL" },
                {
                  label: "Last Updated",
                  value: about.lastUpdated
                    ? new Date(about.lastUpdated).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
                },
              ].map((row) => (
                <div key={row.label} style={s.aboutRow}>
                  <span style={s.aboutKey}>{row.label}</span>
                  <span style={s.aboutVal}>{row.value}</span>
                </div>
              ))}
            </div>

          </div>{/* /grid */}
        </div>{/* /container */}
      </div>

      {/* ═══════════ DELETE ACCOUNT MODAL ═══════════ */}
      {showDeleteModal && (
        <div style={s.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalTitle}>
              <div style={{ width: 36, height: 36, borderRadius: "10px", backgroundColor: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}>
                <FiTrash2 size={18} />
              </div>
              Delete Account
            </div>
            <p style={s.modalDesc}>
              <strong>This action cannot be undone.</strong> All your data — resumes, reports, AI history, and profile — will be permanently deleted.
            </p>
            <div style={s.field}>
              <label style={s.label}>Type <strong>DELETE</strong> to confirm</label>
              <input
                style={s.input}
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
              />
            </div>
            <div style={s.btnRow}>
              <button
                style={{ ...s.btnDanger, flex: 1, justifyContent: "center", opacity: deleteConfirm !== "DELETE" ? 0.5 : 1 }}
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== "DELETE" || deleteLoading}
              >
                {deleteLoading ? <><div style={s.spinner} /> Deleting…</> : <><FiTrash2 size={14} /> Delete My Account</>}
              </button>
              <button
                style={{ ...s.btnSecondary, flex: 1, justifyContent: "center" }}
                onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Settings;