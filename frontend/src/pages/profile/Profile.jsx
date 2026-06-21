import React, { useState, useEffect } from "react";
import { FiMail, FiMapPin, FiPhone, FiGlobe, FiBriefcase, FiCalendar, FiLinkedin, FiGithub, FiShield, FiUser, FiClock, FiHash } from "react-icons/fi";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

const getInitials = (name) => {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const InfoCard = ({ icon: Icon, label, value }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#F0FDFA" : "#F8FAFC",
        border: `1px solid ${hovered ? "#99F6E4" : "#E2E8F0"}`,
        borderRadius: "14px",
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        transition: "all 0.2s ease",
        cursor: "default",
        boxShadow: hovered ? "0 4px 16px rgba(13,148,136,0.08)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
        <Icon size={13} style={{ color: "#0D9488", flexShrink: 0 }} />
        <span style={{ fontSize: "10px", fontWeight: "700", color: "#94A3B8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {label}
        </span>
      </div>
      <span style={{ fontSize: "14px", fontWeight: "500", color: value ? "#0F172A" : "#CBD5E1", lineHeight: 1.5 }}>
        {value || "Not provided"}
      </span>
    </div>
  );
};

const SectionHeading = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
    <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase" }}>
      {children}
    </span>
    <div style={{ flex: 1, height: "1px", background: "#E2E8F0" }} />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setUserData(data.user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div style={s.shell}>
        <div style={s.shimmerWrap}>
          <div style={{ ...s.shimmer, height: 220, borderRadius: 20, marginBottom: 20 }} />
          <div style={{ ...s.shimmer, height: 400, borderRadius: 20 }} />
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={s.shell}>
        <div style={{ textAlign: "center", color: "#64748B", paddingTop: 80 }}>Unable to load profile.</div>
      </div>
    );
  }

  const u = userData;

  return (
    <div style={s.shell}>
      {/* Page header */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>My Profile</h1>
          <p style={s.pageSubtitle}>Your account details and professional information</p>
        </div>
        <div style={s.activeBadge}>
          <span style={s.activeDot} />
          Active Account
        </div>
      </div>

      {/* Main grid */}
      <div style={s.grid}>

        {/* ── LEFT: Identity card ─────────────────────────────────── */}
        <aside style={s.leftCard}>
          {/* Avatar — fetched from DB, read-only */}
          <div style={s.avatarWrap}>
            {u.profile_picture ? (
              <img src={u.profile_picture} alt={u.full_name} style={s.avatarImg} />
            ) : (
              <div style={s.avatarInitials}>{getInitials(u.full_name)}</div>
            )}
            <div style={s.avatarRing} />
          </div>

          {/* Name & role */}
          <h2 style={s.userName}>{u.full_name || "—"}</h2>
          {u.currentrole && <p style={s.userRole}>{u.currentrole}</p>}

          <div style={s.divider} />

          {/* Quick info */}
          <div style={s.quickList}>
            <QuickRow icon={FiMail}     text={u.email}    href={`mailto:${u.email}`} />
            {u.location && <QuickRow icon={FiMapPin}  text={u.location} />}
            {u.phone    && <QuickRow icon={FiPhone}   text={u.phone} />}
            <QuickRow icon={FiCalendar} text={`Joined ${formatDate(u.created_at)}`} />
          </div>

          <div style={s.divider} />

          {/* Social links */}
          {(u.linkedin || u.github) && (
            <div style={s.linkRow}>
              {u.linkedin && (
                <a href={u.linkedin} target="_blank" rel="noreferrer" style={s.socialBtn}>
                  <FiLinkedin size={15} /> LinkedIn
                </a>
              )}
              {u.github && (
                <a href={u.github} target="_blank" rel="noreferrer" style={s.socialBtn}>
                  <FiGithub size={15} /> GitHub
                </a>
              )}
            </div>
          )}
        </aside>

        {/* ── RIGHT: Details ──────────────────────────────────────── */}
        <main style={s.rightCol}>

          <div style={s.section}>
            <SectionHeading>Personal Information</SectionHeading>
            <div style={s.infoGrid}>
              <InfoCard icon={FiUser}   label="Full Name" value={u.full_name} />
              <InfoCard icon={FiMail}   label="Email"     value={u.email} />
              <InfoCard icon={FiPhone}  label="Phone"     value={u.phone} />
              <InfoCard icon={FiMapPin} label="Location"  value={u.location} />
            </div>
          </div>

          <div style={s.section}>
            <SectionHeading>Professional Details</SectionHeading>
            <div style={s.infoGrid}>
              <InfoCard icon={FiBriefcase} label="Current Role"       value={u.currentrole} />
              <InfoCard icon={FiGlobe}     label="Experience (Years)"  value={u.experience_years ? `${u.experience_years} years` : null} />
              <InfoCard icon={FiLinkedin}  label="LinkedIn"            value={u.linkedin} />
              <InfoCard icon={FiGithub}    label="GitHub"              value={u.github} />
            </div>
          </div>

          <div style={s.metaCard}>
            <SectionHeading>Account Information</SectionHeading>
            <div style={s.metaGrid}>
              <MetaItem icon={FiCalendar} label="Account Created" value={formatDate(u.created_at)} />
              {u.updated_at && <MetaItem icon={FiClock} label="Last Updated" value={formatDate(u.updated_at)} />}
              <MetaItem icon={FiShield} label="Account Status" value="Active" accent />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

const QuickRow = ({ icon: Icon, text, href }) => {
  if (!text) return null;
  const inner = (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
      <Icon size={14} style={{ color: "#0D9488", marginTop: 2, flexShrink: 0 }} />
      <span style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5, wordBreak: "break-word" }}>{text}</span>
    </div>
  );
  return href ? <a href={href} style={{ textDecoration: "none" }}>{inner}</a> : inner;
};

const MetaItem = ({ icon: Icon, label, value, mono, accent }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: "1px solid #F1F5F9" }}>
    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F0FDFA", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon size={14} style={{ color: "#0D9488" }} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: "10px", fontWeight: "700", color: "#94A3B8", letterSpacing: "0.07em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: "13px", fontWeight: "500", color: accent ? "#0D9488" : "#0F172A", fontFamily: mono ? "monospace" : "inherit", marginTop: 2 }}>
        {value}
      </div>
    </div>
  </div>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  shell: {
    minHeight: "100vh",
    background: "#F8FAFC",
    padding: "40px 24px 80px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    boxSizing: "border-box",
  },
  shimmerWrap: { maxWidth: 1060, margin: "0 auto" },
  shimmer: {
    background: "linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
  },
  pageHeader: {
    maxWidth: 1060, margin: "0 auto 32px",
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    flexWrap: "wrap", gap: 16,
  },
  pageTitle:    { fontSize: 26, fontWeight: 800, color: "#0F172A", margin: 0 },
  pageSubtitle: { fontSize: 14, color: "#64748B", margin: "4px 0 0" },
  activeBadge: {
    display: "flex", alignItems: "center", gap: 7,
    background: "#F0FDFA", border: "1px solid #99F6E4",
    borderRadius: 100, padding: "6px 14px",
    fontSize: 12, fontWeight: 600, color: "#0D9488",
  },
  activeDot: { width: 7, height: 7, borderRadius: "50%", background: "#0D9488", display: "block" },
  grid: {
    maxWidth: 1060, margin: "0 auto",
    display: "grid", gridTemplateColumns: "300px 1fr",
    gap: 24, alignItems: "start",
  },
  leftCard: {
    background: "#fff", borderRadius: 20,
    border: "1px solid #E2E8F0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 0,
  },
  avatarWrap:     { position: "relative", marginBottom: 18 },
  avatarImg:      { width: 120, height: 120, borderRadius: "50%", objectFit: "cover", display: "block" },
  avatarInitials: {
    width: 120, height: 120, borderRadius: "50%",
    background: "linear-gradient(135deg,#0D9488,#0F766E)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: 2,
  },
  avatarRing: {
    position: "absolute", inset: -4,
    borderRadius: "50%", border: "2px solid #99F6E4",
    pointerEvents: "none",
  },
  userName:  { fontSize: 18, fontWeight: 800, color: "#0F172A", margin: "0 0 4px", textAlign: "center" },
  userRole:  { fontSize: 13, color: "#64748B", margin: 0, textAlign: "center" },
  divider:   { width: "100%", height: 1, background: "#F1F5F9", margin: "20px 0" },
  quickList: { width: "100%", display: "flex", flexDirection: "column", gap: 12 },
  linkRow:   { width: "100%", display: "flex", flexDirection: "column", gap: 8 },
  socialBtn: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "9px 14px", borderRadius: 10,
    background: "#F8FAFC", border: "1px solid #E2E8F0",
    fontSize: 13, fontWeight: 600, color: "#334155",
    textDecoration: "none", transition: "all 0.2s",
  },
  rightCol: { display: "flex", flexDirection: "column", gap: 24 },
  section: {
    background: "#fff", borderRadius: 20,
    border: "1px solid #E2E8F0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    padding: "26px 24px",
  },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  metaCard: {
    background: "#fff", borderRadius: 20,
    border: "1px solid #E2E8F0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    padding: "26px 24px",
  },
  metaGrid: { display: "flex", flexDirection: "column" },
};