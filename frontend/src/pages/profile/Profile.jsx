import React, { useState, useEffect } from "react";
import {
  FiMail, FiMapPin, FiPhone, FiGlobe, FiBriefcase,
  FiCalendar, FiLinkedin, FiGithub, FiShield, FiUser, FiClock,
} from "react-icons/fi";

// ─── Responsive hook ──────────────────────────────────────────────────────────

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
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
        borderRadius: 14,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        transition: "all 0.2s ease",
        cursor: "default",
        boxShadow: hovered ? "0 4px 16px rgba(13,148,136,0.08)" : "none",
        minWidth: 0, // prevent grid blowout on mobile
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <Icon size={13} style={{ color: "#0D9488", flexShrink: 0 }} />
        <span style={{
          fontSize: 10, fontWeight: 700, color: "#94A3B8",
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          {label}
        </span>
      </div>
      <span style={{
        fontSize: 14, fontWeight: 500,
        color: value ? "#0F172A" : "#CBD5E1",
        lineHeight: 1.5,
        wordBreak: "break-word",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}>
        {value || "Not provided"}
      </span>
    </div>
  );
};

const SectionHeading = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
    <span style={{
      fontSize: 12, fontWeight: 700, color: "#64748B",
      letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap",
    }}>
      {children}
    </span>
    <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
  </div>
);

const QuickRow = ({ icon: Icon, text, href }) => {
  if (!text) return null;
  const inner = (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <Icon size={14} style={{ color: "#0D9488", marginTop: 2, flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, wordBreak: "break-word" }}>
        {text}
      </span>
    </div>
  );
  return href
    ? <a href={href} style={{ textDecoration: "none" }}>{inner}</a>
    : inner;
};

const MetaItem = ({ icon: Icon, label, value, accent }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 12,
    padding: "10px 0", borderBottom: "1px solid #F1F5F9",
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: 8, background: "#F0FDFA",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <Icon size={14} style={{ color: "#0D9488" }} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: "#94A3B8",
        letterSpacing: "0.07em", textTransform: "uppercase",
      }}>{label}</div>
      <div style={{
        fontSize: 13, fontWeight: 500,
        color: accent ? "#0D9488" : "#0F172A",
        marginTop: 2,
        wordBreak: "break-word",
      }}>
        {value}
      </div>
    </div>
  </div>
);

// ─── Shimmer ──────────────────────────────────────────────────────────────────

const shimmerStyle = {
  background: "linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.4s infinite",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const [profileRes, photoRes] = await Promise.all([
          fetch(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const profileData = await profileRes.json();
        const photoData = await photoRes.json().catch(() => null);
        if (profileData.success) {
          setUserData({
            ...profileData.user,
            profile_picture: photoData?.url || profileData.user?.profile_picture,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ── Inject keyframe ──
  useEffect(() => {
    const id = "profile-shimmer-kf";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = `
        @keyframes shimmer { to { background-position: -200% 0 } }
        @media (max-width: 767px) {
          .profile-info-grid { grid-template-columns: 1fr !important; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // ── Loading ──
  if (loading) {
    return (
      <div style={s.shell}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ ...shimmerStyle, height: 220, borderRadius: 20, marginBottom: 20 }} />
          <div style={{ ...shimmerStyle, height: 400, borderRadius: 20 }} />
        </div>
      </div>
    );
  }

  // ── Error ──
  if (!userData) {
    return (
      <div style={s.shell}>
        <div style={{ textAlign: "center", color: "#64748B", paddingTop: 80 }}>
          Unable to load profile.
        </div>
      </div>
    );
  }

  const u = userData;

  // ── Identity card content (shared between mobile hero & desktop sidebar) ──
  const IdentityContent = () => (
    <>
      {/* Avatar */}
      <div style={{ position: "relative", marginBottom: isMobile ? 14 : 18, flexShrink: 0 }}>
        {u.profile_picture ? (
          <img
             src={u.profile_picture}
             alt={u.full_name}
            style={{
              width: isMobile ? 88 : 120,
              height: isMobile ? 88 : 120,
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div style={{
            width: isMobile ? 88 : 120,
            height: isMobile ? 88 : 120,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#0D9488,#0F766E)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: isMobile ? 26 : 36, fontWeight: 800, color: "#fff", letterSpacing: 2,
          }}>
            {getInitials(u.full_name)}
          </div>
        )}
        <div style={{
          position: "absolute", inset: -4,
          borderRadius: "50%", border: "2px solid #99F6E4",
          pointerEvents: "none",
        }} />
      </div>

      {/* Name & role */}
      <h2 style={{
        fontSize: isMobile ? 16 : 18, fontWeight: 800, color: "#0F172A",
        margin: isMobile ? "0 0 2px" : "0 0 4px", textAlign: "center",
      }}>
        {u.full_name || "—"}
      </h2>
      {u.currentrole && (
        <p style={{ fontSize: 13, color: "#64748B", margin: 0, textAlign: "center" }}>
          {u.currentrole}
        </p>
      )}
    </>
  );

  // ── Quick contact content ──
  const QuickContact = () => (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
      <QuickRow icon={FiMail}     text={u.email}    href={`mailto:${u.email}`} />
      {u.location && <QuickRow icon={FiMapPin}  text={u.location} />}
      {u.phone    && <QuickRow icon={FiPhone}   text={u.phone} />}
      <QuickRow icon={FiCalendar} text={`Joined ${formatDate(u.created_at)}`} />
    </div>
  );

  // ── Social links ──
  const SocialLinks = () =>
    (u.linkedin || u.github) ? (
      <div style={{
        width: "100%",
        display: "flex",
        flexDirection: isMobile ? "row" : "column",
        gap: 8,
        justifyContent: isMobile ? "center" : undefined,
      }}>
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
    ) : null;

  return (
    <div style={s.shell}>
      {/* ── Page header ── */}
      <div style={{
        maxWidth: 1060, margin: "0 auto 24px",
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 20 : 26, fontWeight: 800, color: "#0F172A", margin: 0 }}>
            My Profile
          </h1>
          <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0" }}>
            Your account details and professional information
          </p>
        </div>
        <div style={s.activeBadge}>
          <span style={s.activeDot} />
          Active Account
        </div>
      </div>

      {/* ── MOBILE layout ── */}
      {isMobile ? (
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Hero card: avatar + name + quick contact + socials */}
          <div style={{ ...s.card, padding: "24px 20px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              <IdentityContent />
              <div style={s.divider} />
              <QuickContact />
              <div style={s.divider} />
              <SocialLinks />
            </div>
          </div>

          {/* Personal Info */}
          <div style={{ ...s.card, padding: "20px 16px" }}>
            <SectionHeading>Personal Information</SectionHeading>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              <InfoCard icon={FiUser}   label="Full Name" value={u.full_name} />
              <InfoCard icon={FiMail}   label="Email"     value={u.email} />
              <InfoCard icon={FiPhone}  label="Phone"     value={u.phone} />
              <InfoCard icon={FiMapPin} label="Location"  value={u.location} />
            </div>
          </div>

          {/* Professional Details */}
          <div style={{ ...s.card, padding: "20px 16px" }}>
            <SectionHeading>Professional Details</SectionHeading>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              <InfoCard icon={FiBriefcase} label="Current Role"      value={u.currentrole} />
              <InfoCard icon={FiGlobe}     label="Experience (Years)" value={u.experience_years ? `${u.experience_years} years` : null} />
              <InfoCard icon={FiLinkedin}  label="LinkedIn"           value={u.linkedin} />
              <InfoCard icon={FiGithub}    label="GitHub"             value={u.github} />
            </div>
          </div>

          {/* Account Info */}
          <div style={{ ...s.card, padding: "20px 16px" }}>
            <SectionHeading>Account Information</SectionHeading>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <MetaItem icon={FiCalendar} label="Account Created" value={formatDate(u.created_at)} />
              {u.updated_at && <MetaItem icon={FiClock} label="Last Updated" value={formatDate(u.updated_at)} />}
              <MetaItem icon={FiShield} label="Account Status" value="Active" accent />
            </div>
          </div>

        </div>
      ) : (
        /* ── DESKTOP layout ── */
        <div style={{
          maxWidth: 1060, margin: "0 auto",
          display: "grid", gridTemplateColumns: "300px 1fr",
          gap: 24, alignItems: "start",
        }}>
          {/* Left sidebar */}
          <aside style={{ ...s.card, padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            <IdentityContent />
            <div style={s.divider} />
            <QuickContact />
            <div style={s.divider} />
            <SocialLinks />
          </aside>

          {/* Right column */}
          <main style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ ...s.card, padding: "26px 24px" }}>
              <SectionHeading>Personal Information</SectionHeading>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <InfoCard icon={FiUser}   label="Full Name" value={u.full_name} />
                <InfoCard icon={FiMail}   label="Email"     value={u.email} />
                <InfoCard icon={FiPhone}  label="Phone"     value={u.phone} />
                <InfoCard icon={FiMapPin} label="Location"  value={u.location} />
              </div>
            </div>

            <div style={{ ...s.card, padding: "26px 24px" }}>
              <SectionHeading>Professional Details</SectionHeading>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <InfoCard icon={FiBriefcase} label="Current Role"      value={u.currentrole} />
                <InfoCard icon={FiGlobe}     label="Experience (Years)" value={u.experience_years ? `${u.experience_years} years` : null} />
                <InfoCard icon={FiLinkedin}  label="LinkedIn"           value={u.linkedin} />
                <InfoCard icon={FiGithub}    label="GitHub"             value={u.github} />
              </div>
            </div>

            <div style={{ ...s.card, padding: "26px 24px" }}>
              <SectionHeading>Account Information</SectionHeading>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <MetaItem icon={FiCalendar} label="Account Created" value={formatDate(u.created_at)} />
                {u.updated_at && <MetaItem icon={FiClock} label="Last Updated" value={formatDate(u.updated_at)} />}
                <MetaItem icon={FiShield} label="Account Status" value="Active" accent />
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const s = {
  shell: {
    minHeight: "100vh",
    background: "#F8FAFC",
    padding: "24px 16px 80px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    boxSizing: "border-box",
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    border: "1px solid #E2E8F0",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  activeBadge: {
    display: "flex", alignItems: "center", gap: 7,
    background: "#F0FDFA", border: "1px solid #99F6E4",
    borderRadius: 100, padding: "6px 14px",
    fontSize: 12, fontWeight: 600, color: "#0D9488",
    whiteSpace: "nowrap",
  },
  activeDot: { width: 7, height: 7, borderRadius: "50%", background: "#0D9488", display: "block" },
  divider: { width: "100%", height: 1, background: "#F1F5F9", margin: "20px 0" },
  socialBtn: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "9px 14px", borderRadius: 10,
    background: "#F8FAFC", border: "1px solid #E2E8F0",
    fontSize: 13, fontWeight: 600, color: "#334155",
    textDecoration: "none", transition: "all 0.2s",
  },
};