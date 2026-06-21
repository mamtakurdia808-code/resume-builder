import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser, FiMail, FiCalendar, FiShield, FiLock, FiEye, FiEyeOff,
  FiGlobe, FiFileText, FiSave, FiZap, FiLinkedin, FiGithub, FiLink,
  FiTrash2, FiAlertTriangle, FiCheckCircle, FiXCircle, FiRefreshCw,
  FiInfo, FiChevronDown, FiEdit2, FiExternalLink, FiX, FiPhone,
  FiMapPin, FiBriefcase, FiAward,
} from "react-icons/fi";

// ─── Constants ────────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL;
const TOKEN   = () => localStorage.getItem("token");

const EXP_YEARS   = ["0–1", "1–2", "2–3", "3–5", "5–7", "7–10", "10+"];

// ─── Password strength helper ─────────────────────────────────────────────────
const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8)          score++;
  if (/[A-Z]/.test(pwd))        score++;
  if (/[0-9]/.test(pwd))        score++;
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

// ─── CSS-in-const styles ──────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f0f9f8",
    fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
    color: "#1a2332",
  },
  container:   { maxWidth: "1100px", margin: "0 auto", padding: "40px 24px 80px" },
  header:      { marginBottom: "40px", paddingBottom: "28px", borderBottom: "1px solid #d1ede9" },
  headerTitle: { fontSize: "32px", fontWeight: "800", color: "#0d9488", margin: "0 0 6px", letterSpacing: "-0.5px" },
  headerSub:   { fontSize: "15px", color: "#64748b", margin: "0", fontWeight: "400" },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(13,148,136,0.06)",
    border: "1px solid #e8f5f3",
  },
  cardDanger: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "28px",
    border: "2px solid #fca5a5",
  },

  sectionLabel: {
    fontSize: "11px", fontWeight: "700", textTransform: "uppercase",
    letterSpacing: "1.2px", color: "#0d9488", marginBottom: "20px",
    display: "flex", alignItems: "center", gap: "8px",
  },
  cardTitle: { fontSize: "17px", fontWeight: "700", color: "#1a2332", margin: "0 0 4px" },
  cardDesc:  { fontSize: "13px", color: "#94a3b8", margin: "0 0 22px" },

  // Account info rows
  infoRow: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "14px 0", borderBottom: "1px solid #f1f5f9",
  },
  infoIcon: {
    width: "36px", height: "36px", borderRadius: "10px",
    backgroundColor: "#f0fdf9", display: "flex",
    alignItems: "center", justifyContent: "center",
    color: "#0d9488", flexShrink: 0,
  },
  infoLabel: { fontSize: "12px", color: "#94a3b8", fontWeight: "500", marginBottom: "2px" },
  infoValue: { fontSize: "14px", fontWeight: "600", color: "#1a2332" },
  statusBadge: {
    display: "inline-flex", alignItems: "center", gap: "5px",
    padding: "3px 10px", borderRadius: "20px", fontSize: "12px",
    fontWeight: "600", backgroundColor: "#dcfce7", color: "#15803d",
  },

  // Buttons
  btnRow: { display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" },
  btnPrimary: {
    display: "inline-flex", alignItems: "center", gap: "7px",
    padding: "10px 20px", borderRadius: "10px", border: "none",
    backgroundColor: "#0d9488", color: "#fff",
    fontSize: "14px", fontWeight: "600", cursor: "pointer",
    transition: "opacity 0.18s, transform 0.12s",
  },
  btnSecondary: {
    display: "inline-flex", alignItems: "center", gap: "7px",
    padding: "10px 20px", borderRadius: "10px",
    border: "1.5px solid #0d9488", backgroundColor: "transparent",
    color: "#0d9488", fontSize: "14px", fontWeight: "600",
    cursor: "pointer", transition: "opacity 0.18s",
  },
  btnDanger: {
    display: "inline-flex", alignItems: "center", gap: "7px",
    padding: "10px 22px", borderRadius: "10px", border: "none",
    backgroundColor: "#ef4444", color: "#fff",
    fontSize: "14px", fontWeight: "600", cursor: "pointer",
  },
  btnGhost: {
    display: "inline-flex", alignItems: "center", gap: "7px",
    padding: "8px 14px", borderRadius: "8px",
    border: "1.5px solid #e2e8f0", backgroundColor: "transparent",
    color: "#64748b", fontSize: "13px", fontWeight: "500",
    cursor: "pointer", transition: "background 0.15s",
  },

  // Form
  field:    { marginBottom: "16px" },
  fieldRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" },
  label:    { display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "7px" },
  inputWrap: { position: "relative" },
  input: {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: "1.5px solid #e2e8f0", fontSize: "14px",
    color: "#1a2332", backgroundColor: "#f8fafc",
    outline: "none", boxSizing: "border-box",
    transition: "border 0.18s",
  },
  inputWithIcon: {
    width: "100%", padding: "10px 42px 10px 14px", borderRadius: "10px",
    border: "1.5px solid #e2e8f0", fontSize: "14px",
    color: "#1a2332", backgroundColor: "#f8fafc",
    outline: "none", boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute", right: "12px", top: "50%",
    transform: "translateY(-50%)", background: "none",
    border: "none", cursor: "pointer", color: "#94a3b8",
    display: "flex", alignItems: "center",
  },
  select: {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: "1.5px solid #e2e8f0", fontSize: "14px",
    color: "#1a2332", backgroundColor: "#f8fafc",
    outline: "none", appearance: "none", cursor: "pointer",
    boxSizing: "border-box",
  },
  selectWrap:  { position: "relative" },
  selectArrow: {
    position: "absolute", right: "12px", top: "50%",
    transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none",
  },

  // Password strength
  strengthBar: { display: "flex", gap: "4px", marginTop: "8px" },
  strengthSeg: (filled, color) => ({
    flex: 1, height: "4px", borderRadius: "4px",
    backgroundColor: filled ? color : "#e2e8f0",
    transition: "background 0.2s",
  }),
  strengthLabel: (color) => ({ fontSize: "12px", fontWeight: "600", color, marginTop: "5px" }),

  // Toggles
  toggleRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "13px 0", borderBottom: "1px solid #f1f5f9",
  },
  toggleLabel: { fontSize: "14px", fontWeight: "500", color: "#374151" },
  toggleSub:   { fontSize: "12px", color: "#94a3b8", marginTop: "2px" },
  toggleBtn: (on) => ({
    width: "44px", height: "24px", borderRadius: "12px",
    backgroundColor: on ? "#0d9488" : "#d1d5db",
    border: "none", cursor: "pointer", position: "relative",
    transition: "background 0.2s", flexShrink: 0,
  }),
  toggleDot: (on) => ({
    position: "absolute", top: "3px",
    left: on ? "23px" : "3px", width: "18px", height: "18px",
    borderRadius: "50%", backgroundColor: "#fff",
    transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  }),

  // Social cards
  socialCard: (connected) => ({
    display: "flex", alignItems: "center", gap: "14px",
    padding: "16px", borderRadius: "12px", marginBottom: "12px",
    border: `1.5px solid ${connected ? "#a7f3d0" : "#e2e8f0"}`,
    backgroundColor: connected ? "#f0fdf9" : "#fafafa",
    transition: "all 0.18s",
  }),
  socialIcon: (color) => ({
    width: "40px", height: "40px", borderRadius: "10px",
    backgroundColor: color + "22", display: "flex",
    alignItems: "center", justifyContent: "center",
    color, fontSize: "20px", flexShrink: 0,
  }),
  socialName: { fontSize: "14px", fontWeight: "600", color: "#1a2332" },
  socialUrl:  { fontSize: "12px", color: "#64748b", marginTop: "2px", wordBreak: "break-all" },

  // Alert
  alert: (type) => ({
    display: "flex", alignItems: "flex-start", gap: "10px",
    padding: "12px 16px", borderRadius: "10px", marginBottom: "16px",
    fontSize: "14px", fontWeight: "500",
    backgroundColor: type === "success" ? "#dcfce7" : type === "error" ? "#fee2e2" : "#fef9c3",
    color:           type === "success" ? "#15803d" : type === "error" ? "#b91c1c" : "#92400e",
    border: `1px solid ${type === "success" ? "#86efac" : type === "error" ? "#fca5a5" : "#fde68a"}`,
  }),

  // Danger
  dangerTitle: {
    fontSize: "17px", fontWeight: "700", color: "#ef4444",
    margin: "0 0 8px", display: "flex", alignItems: "center", gap: "8px",
  },
  dangerDesc: { fontSize: "14px", color: "#64748b", marginBottom: "16px" },
  dangerList: {
    fontSize: "13px", color: "#94a3b8",
    paddingLeft: "18px", marginBottom: "20px", lineHeight: "1.8",
  },

  // Modal
  overlay: {
    position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(5px)", display: "flex",
    alignItems: "center", justifyContent: "center",
    zIndex: 1000, padding: "20px",
  },
  modal: {
    backgroundColor: "#fff", borderRadius: "20px", padding: "32px",
    width: "100%", maxWidth: "560px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    maxHeight: "90vh", overflowY: "auto",
  },
  modalHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "24px",
  },
  modalTitle: {
    fontSize: "20px", fontWeight: "800", color: "#1a2332",
    display: "flex", alignItems: "center", gap: "10px", margin: 0,
  },
  modalIconBox: (bg, color) => ({
    width: 36, height: 36, borderRadius: "10px",
    backgroundColor: bg, display: "flex",
    alignItems: "center", justifyContent: "center", color,
  }),
  modalDesc: { fontSize: "14px", color: "#64748b", marginBottom: "24px" },

  // About
  aboutRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "11px 0", borderBottom: "1px solid #f1f5f9", fontSize: "14px",
  },
  aboutKey: { color: "#64748b", fontWeight: "500" },
  aboutVal:  { fontWeight: "600", color: "#1a2332" },
  versionBadge: {
    display: "inline-flex", alignItems: "center",
    padding: "2px 10px", borderRadius: "20px",
    backgroundColor: "#f0fdf9", color: "#0d9488",
    fontWeight: "700", fontSize: "13px", border: "1px solid #a7f3d0",
  },

  // Spinner
  spinner: {
    display: "inline-block", width: "16px", height: "16px",
    border: "2px solid currentColor", borderTopColor: "transparent",
    borderRadius: "50%", animation: "spin 0.7s linear infinite",
  },

  // Divider
  divider: { border: "none", borderTop: "1px solid #f1f5f9", margin: "20px 0" },

  // Section tag inside modal
  modalSection: {
    fontSize: "11px", fontWeight: "700", textTransform: "uppercase",
    letterSpacing: "1px", color: "#0d9488", margin: "20px 0 12px",
    display: "flex", alignItems: "center", gap: "6px",
  },
};

// ─── Reusable atoms ───────────────────────────────────────────────────────────
const Spinner = () => <div style={s.spinner} />;

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
  <button style={s.toggleBtn(on)} onClick={() => onChange(!on)} role="switch" aria-checked={on}>
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
          style={s.inputWithIcon} type={show ? "text" : "password"}
          name={name} value={value} onChange={onChange}
          placeholder={placeholder || "••••••••"} autoComplete="off"
        />
        <button style={s.eyeBtn} onClick={() => setShow((p) => !p)} type="button">
          {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
      </div>
    </div>
  );
};

// ─── Edit Profile Modal ───────────────────────────────────────────────────────
// Fields exactly match the updateProfile controller:
//   full_name, phone, location, linkedin, github, portfolio,
//   profile_picture, currentrole, experience_years
const EditProfileModal = ({ user, onClose, onSaved }) => {
  const [form, setForm]       = useState({
    full_name:        user.full_name        || "",
    phone:            user.phone            || "",
    location:         user.location         || "",
    linkedin:         user.linkedin         || "",
    github:           user.github           || "",
    portfolio:        user.portfolio        || "",
    currentrole:      user.currentrole      || "",
    experience_years: user.experience_years || "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const BASE_URL = API_URL.replace("/api", "");
  const [preview, setPreview] = useState(
  user.profile_picture
    ? `${BASE_URL}${user.profile_picture}`
    : ""
);

  const [loading, setLoading] = useState(false);
  const [alert,   setAlert]   = useState({ type: "", msg: "" });

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    return setAlert({
      type: "error",
      msg: "Please select an image file.",
    });
  }

  if (file.size > 5 * 1024 * 1024) {
    return setAlert({
      type: "error",
      msg: "Image must be less than 5 MB.",
    });
  }

  setProfileImage(file);
  setPreview(URL.createObjectURL(file));
};

  const handleSave = async () => {
    if (!form.full_name.trim())
      return setAlert({ type: "error", msg: "Full name is required." });

    setLoading(true);
    let uploadedPhoto = user.profile_picture;

if (profileImage) {
  const imageData = new FormData();
  imageData.append("profile_picture", profileImage);

  const uploadRes = await fetch(`${API_URL}/profile/photo`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN()}`,
    },
    body: imageData,
  });

  const uploadJson = await uploadRes.json();

  if (!uploadRes.ok) {
    throw new Error(uploadJson.message);
  }

  uploadedPhoto = `${API_URL.replace("/api", "")}${uploadJson.profile_picture}`;

setPreview(uploadedPhoto);
}
    setAlert({ type: "", msg: "" });
    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN()}` },
        // Send exact field names the controller expects
        body: JSON.stringify({
          full_name:        form.full_name.trim(),
          phone:            form.phone.trim(),
          location:         form.location.trim(),
          linkedin:         form.linkedin.trim(),
          github:           form.github.trim(),
          portfolio:        form.portfolio.trim(),
          currentrole:      form.currentrole.trim(),
          experience_years: form.experience_years,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      // Controller returns: { success, message, user: rows[0] }
      const u = data.user || data;
      onSaved({
        full_name:        u.full_name        || form.full_name,
        email:            u.email            || user.email,
        phone:            u.phone            || form.phone,
        location:         u.location         || form.location,
        linkedin:         u.linkedin         || form.linkedin,
        github:           u.github           || form.github,
        portfolio:        u.portfolio        || form.portfolio,
        profile_picture:  u.profile_picture  || uploadedPhoto         || user.profile_picture,
        currentrole:      u.currentrole      || form.currentrole,
        experience_years: u.experience_years || form.experience_years,
        memberSince:      u.created_at       || user.memberSince,
        status:           user.status,
      });
      onClose();
    } catch (err) {
      setAlert({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>

        {/* Modal header */}
        <div style={s.modalHeader}>
          <h2 style={s.modalTitle}>
            <span style={s.modalIconBox("#f0fdf9", "#0d9488")}><FiEdit2 size={17} /></span>
            Edit Profile
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
            <FiX size={22} />
          </button>
        </div>

        <Alert type={alert.type} message={alert.msg} onClose={() => setAlert({ type: "", msg: "" })} />

        {/* ── Basic Info ── */}
        <div style={s.modalSection}><FiUser size={11} /> Basic Information</div>

        <div style={s.field}>
          <label style={s.label}>Full Name <span style={{ color: "#ef4444" }}>*</span></label>
          <input style={s.input} value={form.full_name} onChange={set("full_name")} placeholder="Your full name" />
        </div>

        <div style={s.fieldRow}>
          <div>
            <label style={s.label}>Phone</label>
            <input style={s.input} value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" />
          </div>
          <div>
            <label style={s.label}>Location</label>
            <input style={s.input} value={form.location} onChange={set("location")} placeholder="Mumbai, India" />
          </div>
        </div>

        {/* ── Professional Info ── */}
        <div style={s.modalSection}><FiBriefcase size={11} /> Professional Info</div>

        <div style={s.fieldRow}>
          <div>
            <label style={s.label}>Current Role</label>
            <input style={s.input} value={form.currentrole} onChange={set("currentrole")} placeholder="e.g. Frontend Developer" />
          </div>
          <div>
            <label style={s.label}>Experience</label>
            <SelectField value={form.experience_years} onChange={(v) => setForm((p) => ({ ...p, experience_years: v }))} options={["", ...EXP_YEARS]} />
          </div>
        </div>

        <div style={s.field}>
  <label style={s.label}>Profile Photo</label>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "18px",
    }}
  >
    <img
      src={
        preview ||
        "https://ui-avatars.com/api/?background=0d9488&color=fff&name=" +
          encodeURIComponent(form.full_name || "User")
      }
      alt="Profile"
      style={{
        width: 90,
        height: 90,
        borderRadius: "50%",
        objectFit: "cover",
        border: "3px solid #e2e8f0",
      }}
    />

    <div>
      <input
        id="profile-upload"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      <label
        htmlFor="profile-upload"
        style={{
          ...s.btnSecondary,
          cursor: "pointer",
          display: "inline-flex",
        }}
      >
        Upload Photo
      </label>

      <div
        style={{
          marginTop: 8,
          fontSize: 12,
          color: "#64748b",
        }}
      >
        JPG, PNG or WEBP (Max 5 MB)
      </div>
    </div>
  </div>
</div>

        {/* ── Social Links ── */}
        <div style={s.modalSection}><FiLink size={11} /> Social Links</div>

        <div style={s.field}>
          <label style={s.label}>LinkedIn URL</label>
          <input style={s.input} value={form.linkedin} onChange={set("linkedin")} placeholder="https://linkedin.com/in/yourprofile" />
        </div>
        <div style={s.field}>
          <label style={s.label}>GitHub URL</label>
          <input style={s.input} value={form.github} onChange={set("github")} placeholder="https://github.com/yourusername" />
        </div>
        <div style={s.field}>
          <label style={s.label}>Portfolio URL</label>
          <input style={s.input} value={form.portfolio} onChange={set("portfolio")} placeholder="https://yourportfolio.com" />
        </div>

        {/* Actions */}
        <div style={{ ...s.btnRow, marginTop: "28px" }}>
          <button
            style={{ ...s.btnPrimary, flex: 1, justifyContent: "center" }}
            onClick={handleSave} disabled={loading}
          >
            {loading ? <><Spinner /> Saving…</> : <><FiSave size={14} /> Save Changes</>}
          </button>
          <button style={{ ...s.btnSecondary, flex: 1, justifyContent: "center" }} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Settings Component ──────────────────────────────────────────────────
const Settings = () => {
  const [loading,  setLoading]  = useState(true);
  const [user,     setUser]     = useState({
    full_name: "", email: "", phone: "", location: "",
    linkedin: "", github: "", portfolio: "",
    profile_picture: "", currentrole: "", experience_years: "",
    memberSince: null, status: "Active",
  });
  const [about, setAbout] = useState({});
  const navigate = useNavigate();

  // Modals
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm,   setDeleteConfirm]   = useState("");
  const [deleteLoading,   setDeleteLoading]   = useState(false);

  // Password
  const [passwords,  setPasswords]  = useState({ current: "", newPwd: "", confirm: "" });
  const [pwdAlert,   setPwdAlert]   = useState({ type: "", msg: "" });
  const [pwdLoading, setPwdLoading] = useState(false);

  // Social links — committed (shown) vs draft (editing)
  const [socials,     setSocials]     = useState({ linkedin: "", github: "", portfolio: "" });
  const [socialDraft, setSocialDraft] = useState({ linkedin: "", github: "", portfolio: "" });
  const [socialEdit,  setSocialEdit]  = useState({ linkedin: false, github: false, portfolio: false });
  const [socialBusy,  setSocialBusy]  = useState({ linkedin: false, github: false, portfolio: false });
  const [socialAlert, setSocialAlert] = useState({ type: "", msg: "" });

  // ── GET /api/profile ────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    try {
      const res  = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${TOKEN()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Profile fetch failed");

      // Controller returns rows[0] which has snake_case fields
      const u = data.user || data.profile || data;
      setUser({
        full_name:        u.full_name        || u.fullName  || u.name || "",
        email:            u.email            || "",
        phone:            u.phone            || "",
        location:         u.location         || "",
        linkedin:         u.linkedin         || "",
        github:           u.github           || "",
        portfolio:        u.portfolio        || "",
        profile_picture:  u.profile_picture  || "",
        currentrole:      u.currentrole      || u.current_role || "",
        experience_years: u.experience_years || "",
        memberSince:      u.created_at       || u.memberSince || u.createdAt || null,
        status:           u.status           || "Active",
      });

      // Also seed social links from profile data
      setSocials({
        linkedin:  u.linkedin  || "",
        github:    u.github    || "",
        portfolio: u.portfolio || "",
      });
      setSocialDraft({
        linkedin:  u.linkedin  || "",
        github:    u.github    || "",
        portfolio: u.portfolio || "",
      });
      
    } catch (err) {
      console.error("[Settings] profile:", err.message);
    }
  }, []);

  // ── GET /api/settings ───────────────────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    try {
      const res  = await fetch(`${API_URL}/settings`, {
        headers: { Authorization: `Bearer ${TOKEN()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Settings fetch failed");

      const incoming = data.preferences || data.settings?.preferences || {};
      if (Object.keys(incoming).length)
        setPrefs((p) => ({ ...p, ...incoming }));

      // Social links from settings (if backend stores them separately here too)
      const raw = data.socialLinks || data.settings?.socialLinks || {};
      if (Object.keys(raw).length) {
        const n = {
          linkedin:  raw.linkedin  || raw.linkedinUrl  || "",
          github:    raw.github    || raw.githubUrl     || "",
          portfolio: raw.portfolio || raw.portfolioUrl  || "",
        };
        // Only override if profile fetch didn't already populate them
        setSocials((prev) => ({
          linkedin:  prev.linkedin  || n.linkedin,
          github:    prev.github    || n.github,
          portfolio: prev.portfolio || n.portfolio,
        }));
        setSocialDraft((prev) => ({
          linkedin:  prev.linkedin  || n.linkedin,
          github:    prev.github    || n.github,
          portfolio: prev.portfolio || n.portfolio,
        }));
      }

      if (data.about || data.appInfo)
        setAbout(data.about || data.appInfo);
    } catch (err) {
      console.error("[Settings] settings:", err.message);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchSettings()]);
      setLoading(false);
    })();
  }, [fetchProfile, fetchSettings]);

  // ── Change password ─────────────────────────────────────────────────────────
  const handleChangePassword = async () => {
    setPwdAlert({ type: "", msg: "" });
    if (!passwords.current || !passwords.newPwd || !passwords.confirm)
      return setPwdAlert({ type: "error", msg: "All fields are required." });
    if (passwords.newPwd !== passwords.confirm)
      return setPwdAlert({ type: "error", msg: "Passwords do not match." });
    if (passwords.newPwd.length < 8)
      return setPwdAlert({ type: "error", msg: "Minimum 8 characters required." });

    setPwdLoading(true);
    try {
      const res  = await fetch(`${API_URL}/settings/change-password`, {
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

  // ── Save social link ────────────────────────────────────────────────────────
  const handleSaveSocial = async (key) => {
    setSocialAlert({ type: "", msg: "" });
    setSocialBusy((p) => ({ ...p, [key]: true }));
    try {
      const res  = await fetch(`${API_URL}/settings/social-links`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN()}` },
        body: JSON.stringify({ [key]: socialDraft[key] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed");
      const saved = data.socialLinks?.[key] ?? socialDraft[key];
      setSocials((p)     => ({ ...p, [key]: saved }));
      setSocialDraft((p) => ({ ...p, [key]: saved }));
      setSocialEdit((p)  => ({ ...p, [key]: false }));
      setSocialAlert({ type: "success", msg: `${key.charAt(0).toUpperCase() + key.slice(1)} link saved.` });
    } catch (err) {
      setSocialAlert({ type: "error", msg: err.message });
    } finally {
      setSocialBusy((p) => ({ ...p, [key]: false }));
    }
  };

  // ── Remove social link ──────────────────────────────────────────────────────
  const handleRemoveSocial = async (key) => {
    setSocialBusy((p) => ({ ...p, [key]: true }));
    try {
      const res  = await fetch(`${API_URL}/settings/social-links`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN()}` },
        body: JSON.stringify({ [key]: "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Remove failed");
      setSocials((p)     => ({ ...p, [key]: "" }));
      setSocialDraft((p) => ({ ...p, [key]: "" }));
      setSocialAlert({ type: "success", msg: "Account disconnected." });
    } catch (err) {
      setSocialAlert({ type: "error", msg: err.message });
    } finally {
      setSocialBusy((p) => ({ ...p, [key]: false }));
    }
  };

  // ── Delete account ──────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    setDeleteLoading(true);
    try {
      const res  = await fetch(`${API_URL}/settings/delete-account`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${TOKEN()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      localStorage.clear();
      window.location.href = "/";
    } catch {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const strength = getPasswordStrength(passwords.newPwd);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#0d9488" }}>
          <div style={{ ...s.spinner, width: "40px", height: "40px", borderWidth: "3px", margin: "0 auto 16px" }} />
          <p style={{ fontSize: "15px", fontWeight: "600", color: "#1a2332" }}>Loading settings…</p>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        *, *::before, *::after { box-sizing: border-box; }
        button { font-family: inherit; }
        button:hover  { opacity: 0.88; }
        button:active { transform: scale(0.97); }
        input:focus, select:focus {
          border-color: #0d9488 !important;
          box-shadow: 0 0 0 3px rgba(13,148,136,0.14) !important;
          outline: none;
        }
        @media (max-width: 768px) {
          .rai-grid             { grid-template-columns: 1fr !important; }
          .rai-grid > *         { grid-column: 1 / -1 !important; }
          .rai-prefs-inner      { grid-template-columns: 1fr !important; }
          .rai-field-row        { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={s.page}>
        <div style={s.container}>

          {/* Header */}
          <div style={s.header}>
            <h1 style={s.headerTitle}>Settings</h1>
            <p style={s.headerSub}>Manage your account, security and application preferences.</p>
          </div>

          <div
            className="rai-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px,1fr))", gap: "24px" }}
          >

            {/* ══════════════════════════════════════════════
                §1  ACCOUNT INFORMATION
            ══════════════════════════════════════════════ */}
            <div style={s.card}>
              <div style={s.sectionLabel}><FiUser size={13} /> Account Information</div>

              {[
                { icon: <FiUser     size={16} />, label: "Full Name",      value: user.full_name },
                { icon: <FiMail     size={16} />, label: "Email Address",  value: user.email },
                { icon: <FiPhone    size={16} />, label: "Phone",          value: user.phone },
                { icon: <FiMapPin   size={16} />, label: "Location",       value: user.location },
                { icon: <FiBriefcase size={16} />, label: "Current Role",  value: user.currentrole },
                { icon: <FiAward    size={16} />, label: "Experience",     value: user.experience_years ? `${user.experience_years} years` : "" },
                {
                  icon: <FiCalendar size={16} />,
                  label: "Member Since",
                  value: user.memberSince
                    ? new Date(user.memberSince).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                    : "—",
                },
              ].map((row) => (
                row.value ? (
                  <div key={row.label} style={s.infoRow}>
                    <div style={s.infoIcon}>{row.icon}</div>
                    <div>
                      <div style={s.infoLabel}>{row.label}</div>
                      <div style={s.infoValue}>{row.value}</div>
                    </div>
                  </div>
                ) : null
              ))}

              {/* Always show Member Since even if others are empty */}
              {!user.memberSince && (
                <div style={s.infoRow}>
                  <div style={s.infoIcon}><FiCalendar size={16} /></div>
                  <div>
                    <div style={s.infoLabel}>Member Since</div>
                    <div style={s.infoValue}>—</div>
                  </div>
                </div>
              )}

              <div style={s.infoRow}>
                <div style={s.infoIcon}><FiShield size={16} /></div>
                <div>
                  <div style={s.infoLabel}>Account Status</div>
                  <span style={s.statusBadge}><FiCheckCircle size={11} /> {user.status || "Active"}</span>
                </div>
              </div>

              <div style={s.btnRow}>
                <button style={s.btnPrimary} onClick={() => setShowEditProfile(true)}>
                  <FiEdit2 size={14} /> Edit Profile
                </button>
                <button style={s.btnSecondary} onClick={() => navigate("/dashboard/profile")}>
                  <FiExternalLink size={14} /> View Profile
                </button>
              </div>
            </div>

            {/* ══════════════════════════════════════════════
                §2  SECURITY
            ══════════════════════════════════════════════ */}
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
                    {[0,1,2,3].map((i) => <div key={i} style={s.strengthSeg(i < strength.score, strength.color)} />)}
                  </div>
                  <div style={s.strengthLabel(strength.color)}>{strength.label}</div>
                </div>
              )}

              <PasswordField label="Confirm New Password" name="confirm" value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                placeholder="Repeat new password" />

              <button style={s.btnPrimary} onClick={handleChangePassword} disabled={pwdLoading}>
                {pwdLoading ? <><Spinner /> Updating…</> : <><FiLock size={14} /> Update Password</>}
              </button>
            </div>

            {/* ══════════════════════════════════════════════
                §3  CONNECTED ACCOUNTS
            ══════════════════════════════════════════════ */}
            <div style={s.card}>
              <div style={s.sectionLabel}><FiLink size={13} /> Connected Accounts</div>
              <Alert type={socialAlert.type} message={socialAlert.msg} onClose={() => setSocialAlert({ type: "", msg: "" })} />

              {[
                { key: "linkedin",  label: "LinkedIn",          icon: <FiLinkedin size={18} />, color: "#0077b5", placeholder: "https://linkedin.com/in/yourprofile" },
                { key: "github",    label: "GitHub",            icon: <FiGithub   size={18} />, color: "#333333", placeholder: "https://github.com/yourusername" },
                { key: "portfolio", label: "Portfolio Website", icon: <FiGlobe    size={18} />, color: "#0d9488", placeholder: "https://yourportfolio.com" },
              ].map((soc) => {
                const connected = !!(socials[soc.key]?.trim());
                const editing   = socialEdit[soc.key];
                const busy      = socialBusy[soc.key];

                return (
                  <div key={soc.key} style={s.socialCard(connected)}>
                    <div style={s.socialIcon(soc.color)}>{soc.icon}</div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={s.socialName}>{soc.label}</div>

                      {editing ? (
                        <div style={{ marginTop: "8px", display: "flex", gap: "8px", alignItems: "center" }}>
                          <input
                            style={{ ...s.input, fontSize: "12px", padding: "7px 10px", flex: 1 }}
                            value={socialDraft[soc.key]}
                            onChange={(e) => setSocialDraft((p) => ({ ...p, [soc.key]: e.target.value }))}
                            placeholder={soc.placeholder}
                            autoFocus
                            onKeyDown={(e) => e.key === "Enter" && handleSaveSocial(soc.key)}
                          />
                          <button style={{ ...s.btnPrimary, padding: "7px 12px" }}
                            onClick={() => handleSaveSocial(soc.key)} disabled={busy}>
                            {busy ? <Spinner /> : <FiSave size={13} />}
                          </button>
                          <button style={{ ...s.btnGhost, padding: "7px 10px" }}
                            onClick={() => {
                              setSocialEdit((p)  => ({ ...p, [soc.key]: false }));
                              setSocialDraft((p) => ({ ...p, [soc.key]: socials[soc.key] }));
                            }}>
                            <FiX size={13} />
                          </button>
                        </div>
                      ) : (
                        <div style={s.socialUrl}>
                          {socials[soc.key] ? (
                            <a href={socials[soc.key]} target="_blank" rel="noreferrer"
                              style={{ color: "#0d9488", textDecoration: "none" }}>
                              {socials[soc.key]}
                            </a>
                          ) : "Not connected"}
                        </div>
                      )}
                    </div>

                    {!editing && (
                      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                        <button style={s.btnGhost} disabled={busy}
                          onClick={() => {
                            setSocialDraft((p) => ({ ...p, [soc.key]: socials[soc.key] }));
                            setSocialEdit((p)  => ({ ...p, [soc.key]: true }));
                          }}>
                          {connected ? "Edit" : "Connect"}
                        </button>
                        {connected && (
                          <button
                            style={{ ...s.btnGhost, color: "#ef4444", borderColor: "#fca5a5" }}
                            onClick={() => handleRemoveSocial(soc.key)} disabled={busy}>
                            {busy ? <Spinner /> : "Remove"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ══════════════════════════════════════════════
                §6  DANGER ZONE
            ══════════════════════════════════════════════ */}
            <div style={s.cardDanger}>
              <div style={s.dangerTitle}><FiAlertTriangle size={18} /> Danger Zone</div>
              <p style={s.dangerDesc}>Once deleted, all data is permanently removed and cannot be recovered.</p>
              <div style={s.cardTitle}>Delete Account</div>
              <p style={s.dangerDesc}>Deleting your account permanently removes:</p>
              <ul style={s.dangerList}>
                <li>Profile and personal information</li>
                <li>All resumes and drafts</li>
                <li>ATS reports and scores</li>
                <li>AI review history</li>
                <li>Job analysis history</li>
              </ul>
              <button style={s.btnDanger} onClick={() => setShowDeleteModal(true)}>
                <FiTrash2 size={14} /> Delete Account
              </button>
            </div>

            {/* ══════════════════════════════════════════════
                §7  ABOUT
            ══════════════════════════════════════════════ */}
            <div style={s.card}>
              <div style={s.sectionLabel}><FiInfo size={13} /> About</div>
              {[
                { label: "ResumeAI Version",    value: <span style={s.versionBadge}>{about.appVersion || "v2.4.1"}</span> },
                { label: "Application Version", value: about.applicationVersion || "2.4.1" },
                { label: "Backend Version",     value: about.backendVersion     || "1.8.0" },
                { label: "Database",            value: about.database           || "PostgreSQL" },
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

      {/* ══════════════════════════════════════════════
          EDIT PROFILE MODAL
      ══════════════════════════════════════════════ */}
      {showEditProfile && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditProfile(false)}
          onSaved={(updated) => {
            setUser(updated);
            // Sync social links if they were updated in the profile edit
            setSocials({
              linkedin:  updated.linkedin  || "",
              github:    updated.github    || "",
              portfolio: updated.portfolio || "",
            });
            setSocialDraft({
              linkedin:  updated.linkedin  || "",
              github:    updated.github    || "",
              portfolio: updated.portfolio || "",
            });
          }}
        />
      )}

      {/* ══════════════════════════════════════════════
          DELETE ACCOUNT MODAL
      ══════════════════════════════════════════════ */}
      {showDeleteModal && (
        <div style={s.overlay} onClick={() => setShowDeleteModal(false)}>
          <div style={{ ...s.modal, maxWidth: "440px" }} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>
                <span style={s.modalIconBox("#fee2e2", "#ef4444")}><FiTrash2 size={17} /></span>
                Delete Account
              </h2>
              <button onClick={() => setShowDeleteModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex" }}>
                <FiX size={22} />
              </button>
            </div>
            <p style={s.modalDesc}>
              <strong>This action cannot be undone.</strong> All your data — resumes, reports,
              AI history, and profile — will be permanently deleted.
            </p>
            <div style={s.field}>
              <label style={s.label}>Type <strong>DELETE</strong> to confirm</label>
              <input
                style={s.input} value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
              />
            </div>
            <div style={s.btnRow}>
              <button
                style={{ ...s.btnDanger, flex: 1, justifyContent: "center", opacity: deleteConfirm !== "DELETE" ? 0.45 : 1 }}
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== "DELETE" || deleteLoading}
              >
                {deleteLoading ? <><Spinner /> Deleting…</> : <><FiTrash2 size={14} /> Delete My Account</>}
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