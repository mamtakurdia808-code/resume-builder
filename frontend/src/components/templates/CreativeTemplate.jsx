/**
 * CreativeTemplate.jsx
 * ResumeAI – AI Resume Builder & ATS Checker
 * Creative portfolio resume — timeline, skill bars, project cards, icon accents.
 *
 * Usage:
 *   <CreativeTemplate resume={resume} />
 *
 * Props:
 *   resume {Object} – PostgreSQL-sourced resume object:
 *     resume.personal       – { fullName, title, email, phone, location, portfolio, linkedin, github, summary, photo }
 *     resume.skills         – [string]  OR  [{ category, items: [string] }]
 *     resume.experience     – [{ company, role, startDate, endDate, responsibilities }]
 *     resume.projects       – [{ title, technologies, description, github, demo }]
 *     resume.education      – [{ college, university, degree, startYear, endYear, cgpa }]
 *     resume.certifications – [{ name, organization, year }]
 *     resume.languages      – [{ language, proficiency }]
 *     resume.achievements   – [string]
 */

import React from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  // Palette — violet-to-indigo primary, soft warm white base
  p50:   "#F5F3FF",
  p100:  "#EDE9FE",
  p200:  "#DDD6FE",
  p400:  "#A78BFA",
  p500:  "#8B5CF6",
  p600:  "#7C3AED",
  p700:  "#6D28D9",

  // Accent — teal for contrast moments
  a400:  "#2DD4BF",
  a500:  "#14B8A6",
  a600:  "#0D9488",

  // Neutrals
  ink:     "#0F0F0F",
  inkMid:  "#2D2D2D",
  inkSoft: "#5B5B5B",
  inkFaint:"#9B9B9B",
  border:  "#EBEBEB",
  bg:      "#FAFAFA",
  white:   "#FFFFFF",

  // Tag backgrounds
  tagBg:   "#F0F0F0",
  tagText: "#3D3D3D",

  // Typography
  fontHead: "'Plus Jakarta Sans', 'DM Sans', 'Inter', sans-serif",
  fontBody: "'Inter', 'Helvetica Neue', sans-serif",

  // Sizes
  szName:    "26px",
  szSection: "10px",
  szBody:    "11.5px",
  szSmall:   "10px",
  szTiny:    "9px",

  radius: "10px",
  radiusSm: "6px",
  radiusLg: "14px",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  pageWrapper: {
    background:  "#EEF0F5",
    minHeight:   "100vh",
    display:     "flex",
    justifyContent: "center",
    alignItems:  "flex-start",
    padding:     "32px 16px",
    fontFamily:  T.fontBody,
    WebkitFontSmoothing: "antialiased",
  },

  page: {
    width:        "210mm",
    minHeight:    "297mm",
    background:   T.bg,
    boxShadow:    "0 8px 48px rgba(0,0,0,0.10)",
    borderRadius: "2px",
    overflow:     "hidden",
    position:     "relative",
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    background:  `linear-gradient(135deg, ${T.p600} 0%, ${T.p500} 55%, ${T.a500} 100%)`,
    padding:     "32px 36px 28px",
    display:     "flex",
    gap:         "24px",
    alignItems:  "flex-start",
    position:    "relative",
    overflow:    "hidden",
  },
  headerDecor1: {
    position:     "absolute",
    top:          "-30px",
    right:        "-30px",
    width:        "140px",
    height:       "140px",
    borderRadius: "50%",
    background:   "rgba(255,255,255,0.06)",
    pointerEvents: "none",
  },
  headerDecor2: {
    position:     "absolute",
    bottom:       "-50px",
    right:        "80px",
    width:        "180px",
    height:       "180px",
    borderRadius: "50%",
    background:   "rgba(255,255,255,0.04)",
    pointerEvents: "none",
  },
  photoRing: {
    width:        "84px",
    height:       "84px",
    borderRadius: "50%",
    border:       "3px solid rgba(255,255,255,0.5)",
    flexShrink:   0,
    overflow:     "hidden",
    background:   "rgba(255,255,255,0.1)",
    display:      "flex",
    alignItems:   "center",
    justifyContent: "center",
  },
  photo: {
    width:     "100%",
    height:    "100%",
    objectFit: "cover",
    display:   "block",
  },
  photoInitials: {
    fontSize:   "26px",
    fontWeight: 700,
    color:      T.white,
    fontFamily: T.fontHead,
    lineHeight: 1,
  },
  headerInfo: {
    flex:          1,
    position:      "relative",
    zIndex:        1,
  },
  headerName: {
    fontFamily:    T.fontHead,
    fontSize:      T.szName,
    fontWeight:    800,
    color:         T.white,
    letterSpacing: "-0.02em",
    margin:        "0 0 3px",
    lineHeight:    1.15,
  },
  headerTitle: {
    fontSize:      "11px",
    fontWeight:    600,
    color:         "rgba(255,255,255,0.75)",
    letterSpacing: "0.10em",
    textTransform: "uppercase",
    margin:        "0 0 14px",
  },
  headerContacts: {
    display:   "flex",
    flexWrap:  "wrap",
    gap:       "6px 14px",
  },
  headerContact: {
    display:    "flex",
    alignItems: "center",
    gap:        "5px",
    fontSize:   T.szSmall,
    color:      "rgba(255,255,255,0.80)",
  },
  headerContactLink: {
    color:          "rgba(255,255,255,0.80)",
    textDecoration: "none",
  },
  headerContactIcon: {
    fontSize:   "11px",
    lineHeight: 1,
    color:      "rgba(255,255,255,0.55)",
  },

  // ── Body layout ───────────────────────────────────────────────────────────
  body: {
    display:   "flex",
    gap:       "0",
  },
  leftCol: {
    width:         "34%",
    padding:       "24px 20px 32px",
    borderRight:   `1px solid ${T.border}`,
    flexShrink:    0,
    background:    T.white,
  },
  rightCol: {
    flex:    1,
    padding: "24px 28px 32px",
    background: T.bg,
  },

  // ── Section ───────────────────────────────────────────────────────────────
  section: {
    marginBottom: "22px",
  },
  sectionHead: {
    display:      "flex",
    alignItems:   "center",
    gap:          "8px",
    marginBottom: "12px",
  },
  sectionIcon: {
    width:           "26px",
    height:          "26px",
    borderRadius:    T.radiusSm,
    background:      T.p100,
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    fontSize:        "13px",
    flexShrink:      0,
  },
  sectionTitle: {
    fontFamily:    T.fontHead,
    fontSize:      T.szSection,
    fontWeight:    800,
    color:         T.ink,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    margin:        0,
  },
  sectionLine: {
    flex:       1,
    height:     "1px",
    background: `linear-gradient(90deg, ${T.p200}, transparent)`,
  },

  // ── Summary ───────────────────────────────────────────────────────────────
  summaryCard: {
    background:   T.p50,
    border:       `1px solid ${T.p200}`,
    borderRadius: T.radiusSm,
    padding:      "12px 14px",
  },
  summaryText: {
    fontSize:   T.szBody,
    color:      T.inkMid,
    lineHeight: 1.75,
    margin:     0,
  },

  // ── Skill bar ─────────────────────────────────────────────────────────────
  skillItem: {
    marginBottom: "9px",
  },
  skillLabel: {
    display:        "flex",
    justifyContent: "space-between",
    marginBottom:   "4px",
  },
  skillName: {
    fontSize:   T.szSmall,
    fontWeight: 600,
    color:      T.inkMid,
  },
  skillTrack: {
    height:       "5px",
    background:   T.p100,
    borderRadius: "999px",
    overflow:     "hidden",
  },
  skillFill: (pct) => ({
    height:           "100%",
    width:            `${pct}%`,
    background:       `linear-gradient(90deg, ${T.p500}, ${T.a500})`,
    borderRadius:     "999px",
    transition:       "width 0.6s ease",
  }),
  // Flat chips (when no percentage info)
  skillChipRow: {
    display:   "flex",
    flexWrap:  "wrap",
    gap:       "5px",
    marginTop: "4px",
  },
  skillChip: {
    background:   T.p50,
    color:        T.p600,
    border:       `1px solid ${T.p200}`,
    borderRadius: "999px",
    padding:      "3px 9px",
    fontSize:     T.szTiny,
    fontWeight:   600,
    lineHeight:   1.6,
  },
  skillGroupLabel: {
    fontFamily:  T.fontHead,
    fontSize:    T.szTiny,
    fontWeight:  700,
    color:       T.p500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "6px",
    marginTop:   "10px",
  },

  // ── Languages ─────────────────────────────────────────────────────────────
  langItem: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    marginBottom:   "7px",
  },
  langName: {
    fontSize:   T.szSmall,
    fontWeight: 600,
    color:      T.inkMid,
  },
  langBadge: {
    background:   T.p100,
    color:        T.p600,
    fontSize:     T.szTiny,
    fontWeight:   700,
    padding:      "2px 7px",
    borderRadius: "999px",
    letterSpacing: "0.06em",
  },

  // ── Cert ──────────────────────────────────────────────────────────────────
  certItem: {
    background:   T.white,
    border:       `1px solid ${T.border}`,
    borderRadius: T.radiusSm,
    padding:      "8px 10px",
    marginBottom: "7px",
    borderLeft:   `3px solid ${T.p400}`,
  },
  certName: {
    fontSize:   T.szSmall,
    fontWeight: 600,
    color:      T.ink,
    margin:     "0 0 2px",
    lineHeight: 1.3,
  },
  certMeta: {
    fontSize: T.szTiny,
    color:    T.inkFaint,
  },

  // ── Timeline (experience) ─────────────────────────────────────────────────
  timeline: {
    position:   "relative",
    paddingLeft: "20px",
  },
  timelineTrack: {
    position:   "absolute",
    left:       "6px",
    top:        "6px",
    bottom:     "6px",
    width:      "2px",
    background: `linear-gradient(180deg, ${T.p400}, ${T.p200})`,
    borderRadius: "2px",
  },
  timelineItem: {
    position:     "relative",
    marginBottom: "16px",
  },
  timelineDot: {
    position:     "absolute",
    left:         "-17px",
    top:          "4px",
    width:        "10px",
    height:       "10px",
    borderRadius: "50%",
    background:   T.white,
    border:       `2px solid ${T.p500}`,
    boxSizing:    "border-box",
  },
  timelineCard: {
    background:   T.white,
    border:       `1px solid ${T.border}`,
    borderRadius: T.radius,
    padding:      "12px 14px",
    boxShadow:    "0 1px 4px rgba(0,0,0,0.04)",
  },
  timelineHeader: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "flex-start",
    flexWrap:       "wrap",
    gap:            "4px",
    marginBottom:   "2px",
  },
  timelineTitle: {
    fontFamily:  T.fontHead,
    fontSize:    "12.5px",
    fontWeight:  700,
    color:       T.ink,
    margin:      0,
    letterSpacing: "-0.01em",
  },
  timelineDatePill: {
    background:    T.p50,
    color:         T.p600,
    border:        `1px solid ${T.p200}`,
    borderRadius:  "999px",
    padding:       "2px 8px",
    fontSize:      T.szTiny,
    fontWeight:    600,
    whiteSpace:    "nowrap",
  },
  timelineCompany: {
    fontSize:   T.szSmall,
    fontWeight: 600,
    color:      T.a500,
    margin:     "0 0 6px",
  },
  bulletList: {
    margin:      "0",
    paddingLeft: "0",
    listStyle:   "none",
  },
  bulletItem: {
    fontSize:     T.szBody,
    color:        T.inkSoft,
    lineHeight:   1.65,
    marginBottom: "3px",
    paddingLeft:  "12px",
    position:     "relative",
  },
  bulletDot: {
    position:     "absolute",
    left:         "0",
    top:          "7px",
    width:        "4px",
    height:       "4px",
    borderRadius: "50%",
    background:   T.p400,
  },

  // ── Education ─────────────────────────────────────────────────────────────
  eduCard: {
    background:   T.white,
    border:       `1px solid ${T.border}`,
    borderRadius: T.radius,
    padding:      "11px 14px",
    marginBottom: "10px",
    display:      "flex",
    gap:          "12px",
    alignItems:   "flex-start",
  },
  eduIconWrap: {
    width:           "32px",
    height:          "32px",
    borderRadius:    T.radiusSm,
    background:      T.p100,
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    fontSize:        "16px",
    flexShrink:      0,
  },
  eduDegree: {
    fontFamily:  T.fontHead,
    fontSize:    "12px",
    fontWeight:  700,
    color:       T.ink,
    margin:      "0 0 2px",
    letterSpacing: "-0.01em",
    lineHeight:  1.3,
  },
  eduInstitution: {
    fontSize:   T.szSmall,
    color:      T.inkSoft,
    fontWeight: 500,
    margin:     "0 0 3px",
  },
  eduMeta: {
    display:   "flex",
    gap:       "8px",
    flexWrap:  "wrap",
  },
  eduPill: {
    background:   T.p50,
    color:        T.p600,
    border:       `1px solid ${T.p200}`,
    borderRadius: "999px",
    padding:      "1px 7px",
    fontSize:     T.szTiny,
    fontWeight:   600,
  },

  // ── Project card ──────────────────────────────────────────────────────────
  projectCard: {
    background:   T.white,
    border:       `1px solid ${T.border}`,
    borderRadius: T.radiusLg,
    padding:      "12px 14px",
    marginBottom: "10px",
    boxShadow:    "0 2px 8px rgba(0,0,0,0.04)",
    position:     "relative",
    overflow:     "hidden",
  },
  projectAccentBar: {
    position:     "absolute",
    top:          0,
    left:         0,
    right:        0,
    height:       "3px",
    background:   `linear-gradient(90deg, ${T.p500}, ${T.a500})`,
  },
  projectHeader: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "flex-start",
    marginBottom:   "5px",
    flexWrap:       "wrap",
    gap:            "4px",
  },
  projectTitle: {
    fontFamily:  T.fontHead,
    fontSize:    "12.5px",
    fontWeight:  700,
    color:       T.ink,
    margin:      0,
    letterSpacing: "-0.01em",
  },
  projectLinks: {
    display: "flex",
    gap:     "6px",
  },
  projectLink: {
    fontSize:       T.szTiny,
    color:          T.p600,
    textDecoration: "none",
    fontWeight:     700,
    background:     T.p50,
    border:         `1px solid ${T.p200}`,
    borderRadius:   "999px",
    padding:        "2px 8px",
    letterSpacing:  "0.04em",
  },
  projectDesc: {
    fontSize:   T.szBody,
    color:      T.inkSoft,
    lineHeight: 1.65,
    margin:     "0 0 8px",
    whiteSpace: "pre-line",
  },
  techRow: {
    display:  "flex",
    flexWrap: "wrap",
    gap:      "4px",
  },
  techTag: {
    background:   T.tagBg,
    color:        T.tagText,
    borderRadius: T.radiusSm,
    padding:      "2px 7px",
    fontSize:     T.szTiny,
    fontWeight:   600,
  },

  // ── Achievements ──────────────────────────────────────────────────────────
  achieveItem: {
    display:      "flex",
    gap:          "10px",
    alignItems:   "flex-start",
    marginBottom: "7px",
  },
  achieveIconWrap: {
    width:           "20px",
    height:          "20px",
    borderRadius:    "50%",
    background:      `linear-gradient(135deg, ${T.p500}, ${T.a500})`,
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    flexShrink:      0,
    marginTop:       "1px",
    fontSize:        "9px",
    color:           T.white,
    fontWeight:      700,
  },
  achieveText: {
    fontSize:  T.szBody,
    color:     T.inkMid,
    lineHeight: 1.65,
    margin:    0,
  },
};

// ─── Print CSS ────────────────────────────────────────────────────────────────
const PRINT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');

@media print {
  @page { size: A4; margin: 0; }
  body  { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .creative-wrapper { padding: 0 !important; background: white !important; min-height: unset !important; }
  .creative-page    { box-shadow: none !important; }
  .page-break-avoid { break-inside: avoid; page-break-inside: avoid; }
  a { color: inherit !important; text-decoration: none !important; }
}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const clean = (url = "") => url.replace(/^https?:\/\/(www\.)?/i, "");

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);
  if (!parts[0]) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Estimate skill percentage from string labels
const levelToPct = (skill) => {
  const lower = (skill || "").toLowerCase();
  if (lower.includes("expert") || lower.includes("advanced")) return 90;
  if (lower.includes("proficient") || lower.includes("upper")) return 75;
  if (lower.includes("intermediate")) return 60;
  if (lower.includes("beginner") || lower.includes("basic")) return 35;
  return null; // no bar — just chip
};

const BulletList = ({ text, bullets }) => {
  const items = Array.isArray(bullets) && bullets.length > 0
    ? bullets
    : typeof text === "string" ? text.split("\n").filter(Boolean) : [];
  if (!items.length) return null;
  return (
    <ul style={S.bulletList}>
      {items.map((b, i) => (
        <li key={i} style={S.bulletItem}>
          <span style={S.bulletDot} aria-hidden="true" />
          {b}
        </li>
      ))}
    </ul>
  );
};

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ icon, title, children }) => (
  <div style={S.section}>
    <div style={S.sectionHead}>
      <div style={S.sectionIcon} aria-hidden="true">{icon}</div>
      <h2 style={S.sectionTitle}>{title}</h2>
      <div style={S.sectionLine} />
    </div>
    {children}
  </div>
);

// ─── Skills renderer ──────────────────────────────────────────────────────────
const SkillsBlock = ({ skills }) => {
  if (!skills?.length) return null;
  const isCategorised = typeof skills[0] === "object";

  if (isCategorised) {
    return skills.map((group, gi) => (
      <div key={gi}>
        {group.category && (
          <div style={S.skillGroupLabel}>{group.category || group.name}</div>
        )}
        <div style={S.skillChipRow}>
          {(group.items || group.skills || []).map((sk, si) => (
            <span key={si} style={S.skillChip}>{sk}</span>
          ))}
        </div>
      </div>
    ));
  }

  // For flat string arrays — try to show bars if level words, else chips
  const hasBars = skills.some(sk => levelToPct(sk) !== null);
  if (hasBars) {
    return skills.map((sk, i) => {
      const pct = levelToPct(sk);
      const [name] = sk.split(/\s*[\-–:]\s*/);
      return (
        <div key={i} style={S.skillItem}>
          <div style={S.skillLabel}>
            <span style={S.skillName}>{name.trim()}</span>
          </div>
          <div style={S.skillTrack}>
            <div style={S.skillFill(pct || 70)} />
          </div>
        </div>
      );
    });
  }

  return (
    <div style={S.skillChipRow}>
      {skills.map((sk, i) => (
        <span key={i} style={S.skillChip}>{sk}</span>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const CreativeTemplate = ({ resume = {} }) => {
  const {
    personal       = {},
    skills         = [],
    experience     = [],
    projects       = [],
    education      = [],
    certifications = [],
    languages      = [],
    achievements   = [],
  } = resume;

  const {
    fullName  = "",
    title     = "",
    email     = "",
    phone     = "",
    location  = "",
    linkedin  = "",
    github    = "",
    portfolio = "",
    photo     = "",
    summary   = "",
  } = personal;

  const topSummary = summary || resume.summary || "";

  const contacts = [
    email     && { icon: "✉", label: email,           href: `mailto:${email}` },
    phone     && { icon: "✆", label: phone,           href: `tel:${phone}` },
    location  && { icon: "◎", label: location,        href: null },
    linkedin  && { icon: "in", label: clean(linkedin), href: linkedin },
    github    && { icon: "⌥", label: clean(github),   href: github },
    portfolio && { icon: "↗", label: clean(portfolio), href: portfolio },
  ].filter(Boolean);

  return (
    <>
      <style>{PRINT_CSS}</style>
      <div style={S.pageWrapper} className="creative-wrapper">
        <div style={S.page} className="creative-page">

          {/* ── HEADER ──────────────────────────────────────────────────── */}
          <header style={S.header}>
            <div style={S.headerDecor1} aria-hidden="true" />
            <div style={S.headerDecor2} aria-hidden="true" />

            {/* Photo */}
            <div style={S.photoRing}>
              {photo ? (
                <img src={photo} alt={fullName || "Profile"} style={S.photo} />
              ) : fullName ? (
                <span style={S.photoInitials}>{getInitials(fullName)}</span>
              ) : null}
            </div>

            {/* Name + contacts */}
            <div style={S.headerInfo}>
              {fullName && <h1 style={S.headerName}>{fullName}</h1>}
              {title    && <p  style={S.headerTitle}>{title}</p>}
              <div style={S.headerContacts}>
                {contacts.map((c, i) => (
                  <div key={i} style={S.headerContact}>
                    <span style={S.headerContactIcon} aria-hidden="true">{c.icon}</span>
                    {c.href
                      ? <a href={c.href} style={S.headerContactLink} target={c.href.startsWith("mailto") || c.href.startsWith("tel") ? "_self" : "_blank"} rel="noreferrer">{c.label}</a>
                      : <span>{c.label}</span>
                    }
                  </div>
                ))}
              </div>
            </div>
          </header>

          {/* ── TWO-COLUMN BODY ─────────────────────────────────────────── */}
          <div style={S.body}>

            {/* LEFT COLUMN */}
            <div style={S.leftCol}>

              {/* Summary */}
              {topSummary && (
                <Section icon="◈" title="About">
                  <div style={S.summaryCard}>
                    <p style={S.summaryText}>{topSummary}</p>
                  </div>
                </Section>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <Section icon="◉" title="Skills">
                  <SkillsBlock skills={skills} />
                </Section>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <Section icon="◐" title="Languages">
                  {languages.map((l, i) => {
                    const name  = typeof l === "string" ? l : (l.language || l.name || "");
                    const level = typeof l === "string" ? "" : (l.proficiency || l.level || "");
                    return (
                      <div key={i} style={S.langItem}>
                        <span style={S.langName}>{name}</span>
                        {level && <span style={S.langBadge}>{level}</span>}
                      </div>
                    );
                  })}
                </Section>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <Section icon="◇" title="Certifications">
                  {certifications.map((cert, i) => (
                    <div key={i} style={S.certItem} className="page-break-avoid">
                      <p style={S.certName}>
                        {typeof cert === "string" ? cert : cert.name}
                      </p>
                      {typeof cert !== "string" && (
                        <p style={S.certMeta}>
                          {[cert.organization || cert.issuer, cert.year || cert.date]
                            .filter(Boolean).join("  ·  ")}
                        </p>
                      )}
                    </div>
                  ))}
                </Section>
              )}

            </div>

            {/* RIGHT COLUMN */}
            <div style={S.rightCol}>

              {/* Experience — timeline */}
              {Array.isArray(experience) && experience.length > 0 && (
                <Section icon="◑" title="Experience">
                  <div style={S.timeline}>
                    <div style={S.timelineTrack} aria-hidden="true" />
                    {experience.map((job, i) => (
                      <div key={i} style={S.timelineItem} className="page-break-avoid">
                        <div style={S.timelineDot} aria-hidden="true" />
                        <div style={S.timelineCard}>
                          <div style={S.timelineHeader}>
                            <h3 style={S.timelineTitle}>{job.role || job.position || job.title}</h3>
                            <span style={S.timelineDatePill}>
                              {[job.startDate, job.endDate || "Present"].filter(Boolean).join(" – ")}
                            </span>
                          </div>
                          {job.company && (
                            <p style={S.timelineCompany}>{[job.company, job.location].filter(Boolean).join("  ·  ")}</p>
                          )}
                          <BulletList text={job.responsibilities} bullets={job.bullets} />
                          {!job.responsibilities && !job.bullets && job.description && (
                            <p style={{ ...S.achieveText, fontSize: T.szBody }}>{job.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Projects — cards */}
              {projects.length > 0 && (
                <Section icon="◈" title="Projects">
                  {projects.map((proj, i) => (
                    <div key={i} style={S.projectCard} className="page-break-avoid">
                      <div style={S.projectAccentBar} aria-hidden="true" />
                      <div style={S.projectHeader}>
                        <p style={S.projectTitle}>{proj.title || proj.name}</p>
                        <div style={S.projectLinks}>
                          {proj.github && (
                            <a href={proj.github} style={S.projectLink} target="_blank" rel="noreferrer">GitHub</a>
                          )}
                          {proj.demo && (
                            <a href={proj.demo} style={S.projectLink} target="_blank" rel="noreferrer">Demo</a>
                          )}
                        </div>
                      </div>
                      {proj.description && (
                        <p style={S.projectDesc}>{proj.description}</p>
                      )}
                      {(proj.technologies || proj.techStack) && (
                        <div style={S.techRow}>
                          {(proj.technologies
                            ? proj.technologies.split(",")
                            : Array.isArray(proj.techStack) ? proj.techStack : [proj.techStack]
                          ).map((t, ti) => (
                            <span key={ti} style={S.techTag}>{t.trim()}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </Section>
              )}

              {/* Education */}
              {education.length > 0 && (
                <Section icon="◎" title="Education">
                  {education.map((edu, i) => (
                    <div key={i} style={S.eduCard} className="page-break-avoid">
                      <div style={S.eduIconWrap} aria-hidden="true">🎓</div>
                      <div style={{ flex: 1 }}>
                        <h3 style={S.eduDegree}>
                          {[edu.degree, edu.field].filter(Boolean).join(", ")}
                        </h3>
                        <p style={S.eduInstitution}>
                          {[edu.college, edu.university].filter(Boolean).join(", ")}
                        </p>
                        <div style={S.eduMeta}>
                          {(edu.startYear || edu.startDate) && (
                            <span style={S.eduPill}>
                              {[edu.startYear || edu.startDate, edu.endYear || edu.endDate || "Present"]
                                .filter(Boolean).join(" – ")}
                            </span>
                          )}
                          {(edu.cgpa || edu.gpa) && (
                            <span style={S.eduPill}>CGPA {edu.cgpa || edu.gpa}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </Section>
              )}

              {/* Achievements */}
              {achievements.length > 0 && (
                <Section icon="★" title="Achievements">
                  {achievements.map((ach, i) => {
                    const label = typeof ach === "string"
                      ? ach
                      : [ach.title || ach.achievement, ach.year].filter(Boolean).join("  ·  ");
                    return (
                      <div key={i} style={S.achieveItem}>
                        <div style={S.achieveIconWrap} aria-hidden="true">★</div>
                        <p style={S.achieveText}>{label}</p>
                      </div>
                    );
                  })}
                </Section>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreativeTemplate;