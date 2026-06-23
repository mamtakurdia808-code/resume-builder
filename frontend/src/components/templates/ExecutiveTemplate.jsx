/**
 * ExecutiveTemplate.jsx
 * ResumeAI – AI Resume Builder & ATS Checker
 * Premium executive resume — dark sidebar, gold accents, profile photo.
 *
 * Usage:
 *   <ExecutiveTemplate resume={resume} />
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
  // Sidebar palette
  sidebarBg:     "#0E1117",
  sidebarDeep:   "#161B24",
  sidebarBorder: "#1F2733",

  // Gold system — three weights for hierarchy
  goldPrimary:   "#C9A84C",
  goldLight:     "#E2C87A",
  goldDim:       "#7A6230",
  goldRule:      "rgba(201,168,76,0.25)",
  goldGlow:      "rgba(201,168,76,0.08)",

  // Main content palette
  contentBg:     "#FFFFFF",
  ink:           "#0D0D0D",
  inkMid:        "#2C2C2C",
  inkSoft:       "#5A5A5A",
  inkFaint:      "#9A9A9A",
  border:        "#EBEBEB",
  rowAlt:        "#FAFAFA",

  // Typography
  fontSerif: "'Georgia', 'Times New Roman', serif",
  fontSans:  "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",

  // Sidebar widths
  sidebarW:  "31%",
  contentW:  "69%",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  // Root A4 wrapper
  pageWrapper: {
    background: "#E8E4DC",
    minHeight:  "100vh",
    display:    "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding:    "32px 16px",
    fontFamily: T.fontSans,
    WebkitFontSmoothing: "antialiased",
  },

  page: {
    width:        "210mm",
    minHeight:    "297mm",
    background:   T.contentBg,
    display:      "flex",
    flexDirection: "row",
    boxShadow:    "0 8px 60px rgba(0,0,0,0.22)",
    position:     "relative",
    overflow:     "hidden",
  },

  // ── Sidebar ───────────────────────────────────────────────────────────────
  sidebar: {
    width:         T.sidebarW,
    minWidth:      "188px",
    background:    T.sidebarBg,
    display:       "flex",
    flexDirection: "column",
    padding:       "0 0 40px",
    flexShrink:    0,
    position:      "relative",
  },

  // Sidebar top gold bar
  sidebarTopBar: {
    height:     "4px",
    background: `linear-gradient(90deg, ${T.goldPrimary}, ${T.goldLight}, ${T.goldPrimary})`,
    flexShrink: 0,
  },

  // Photo area
  photoArea: {
    padding:       "28px 24px 20px",
    display:       "flex",
    flexDirection: "column",
    alignItems:    "center",
    borderBottom:  `1px solid ${T.sidebarBorder}`,
  },
  photoRing: {
    width:        "96px",
    height:       "96px",
    borderRadius: "50%",
    padding:      "3px",
    background:   `linear-gradient(135deg, ${T.goldPrimary}, ${T.goldLight}, ${T.goldDim})`,
    marginBottom: "16px",
    flexShrink:   0,
  },
  photo: {
    width:        "100%",
    height:       "100%",
    borderRadius: "50%",
    objectFit:    "cover",
    display:      "block",
    background:   T.sidebarDeep,
  },
  photoPlaceholder: {
    width:           "100%",
    height:          "100%",
    borderRadius:    "50%",
    background:      T.sidebarDeep,
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    fontSize:        "32px",
    fontWeight:      700,
    color:           T.goldPrimary,
    letterSpacing:   "-0.02em",
    fontFamily:      T.fontSerif,
    userSelect:      "none",
  },
  sidebarName: {
    fontFamily:    T.fontSerif,
    fontSize:      "17px",
    fontWeight:    700,
    color:         "#F5F0E8",
    textAlign:     "center",
    letterSpacing: "0.02em",
    lineHeight:    1.2,
    margin:        "0 0 5px",
  },
  sidebarTitle: {
    fontFamily:    T.fontSans,
    fontSize:      "8.5px",
    fontWeight:    600,
    color:         T.goldPrimary,
    textAlign:     "center",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    margin:        0,
  },

  // Sidebar sections
  sidebarBody: {
    padding:  "0 20px",
    flex:     1,
    overflowY: "hidden",
  },
  sidebarSection: {
    marginTop: "22px",
  },
  sidebarSectionTitle: {
    fontFamily:    T.fontSans,
    fontSize:      "7.5px",
    fontWeight:    700,
    color:         T.goldPrimary,
    letterSpacing: "0.20em",
    textTransform: "uppercase",
    marginBottom:  "10px",
    paddingBottom: "6px",
    borderBottom:  `1px solid ${T.goldRule}`,
  },

  // Contact rows
  contactRow: {
    display:      "flex",
    alignItems:   "flex-start",
    gap:          "8px",
    marginBottom: "7px",
  },
  contactLabel: {
    fontSize:      "7.5px",
    color:         T.goldDim,
    fontWeight:    700,
    letterSpacing: "0.10em",
    textTransform: "uppercase",
    marginBottom:  "1px",
    display:       "block",
  },
  contactValue: {
    fontSize:   "10px",
    color:      "#B8C0CC",
    lineHeight: 1.4,
    wordBreak:  "break-all",
  },
  contactLink: {
    fontSize:       "10px",
    color:          "#B8C0CC",
    textDecoration: "none",
    wordBreak:      "break-all",
  },

  // Skill bar
  skillRow: {
    marginBottom: "9px",
  },
  skillLabel: {
    display:        "flex",
    justifyContent: "space-between",
    marginBottom:   "4px",
  },
  skillName: {
    fontSize:   "10px",
    color:      "#C8CDD6",
    fontWeight: 500,
  },
  skillBarTrack: {
    height:       "2px",
    background:   T.sidebarBorder,
    borderRadius: "2px",
    overflow:     "hidden",
  },
  skillBarFill: (pct) => ({
    height:       "100%",
    width:        `${pct}%`,
    background:   `linear-gradient(90deg, ${T.goldDim}, ${T.goldPrimary})`,
    borderRadius: "2px",
  }),

  // Flat skill chip (for string arrays)
  skillChip: {
    display:      "inline-block",
    background:   T.sidebarDeep,
    color:        "#B8C0CC",
    fontSize:     "9.5px",
    padding:      "3px 8px",
    borderRadius: "3px",
    marginBottom: "5px",
    marginRight:  "4px",
    border:       `1px solid ${T.sidebarBorder}`,
    lineHeight:   1.5,
  },

  // Language row
  langRow: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    marginBottom:   "7px",
  },
  langName: {
    fontSize:   "10px",
    color:      "#C8CDD6",
    fontWeight: 500,
  },
  langLevel: {
    fontSize:      "8px",
    color:         T.goldPrimary,
    fontWeight:    700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  // ── Main content ──────────────────────────────────────────────────────────
  content: {
    width:         T.contentW,
    display:       "flex",
    flexDirection: "column",
    position:      "relative",
  },

  // Content top bar
  contentTopBar: {
    height:     "4px",
    background: `linear-gradient(90deg, ${T.border}, ${T.border})`,
    flexShrink: 0,
  },

  contentInner: {
    padding: "28px 30px 40px",
    flex:    1,
  },

  // Name / title hero (main content top)
  heroName: {
    fontFamily:    T.fontSerif,
    fontSize:      "30px",
    fontWeight:    700,
    color:         T.ink,
    letterSpacing: "-0.02em",
    lineHeight:    1.1,
    margin:        "0 0 5px",
  },
  heroTitle: {
    fontFamily:    T.fontSans,
    fontSize:      "10px",
    fontWeight:    600,
    color:         T.goldPrimary,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    margin:        "0 0 20px",
  },
  heroRule: {
    height:     "1px",
    background: `linear-gradient(90deg, ${T.goldPrimary}, ${T.border})`,
    margin:     "0 0 22px",
    border:     "none",
  },

  // Content section
  section: {
    marginBottom: "20px",
  },
  sectionHead: {
    display:      "flex",
    alignItems:   "center",
    gap:          "10px",
    marginBottom: "12px",
  },
  sectionTitle: {
    fontFamily:    T.fontSans,
    fontSize:      "8.5px",
    fontWeight:    700,
    color:         T.ink,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    margin:        0,
    whiteSpace:    "nowrap",
  },
  sectionGoldDot: {
    width:        "5px",
    height:       "5px",
    borderRadius: "50%",
    background:   T.goldPrimary,
    flexShrink:   0,
  },
  sectionLine: {
    flex:       1,
    height:     "1px",
    background: T.border,
  },

  // Summary
  summaryText: {
    fontSize:   "11.5px",
    color:      T.inkMid,
    lineHeight: 1.8,
    margin:     0,
    fontStyle:  "italic",
    borderLeft: `3px solid ${T.goldPrimary}`,
    paddingLeft: "14px",
  },

  // Entry (experience / projects)
  entryBlock: {
    marginBottom:  "16px",
    paddingBottom: "16px",
    borderBottom:  `1px solid ${T.border}`,
    position:      "relative",
  },
  entryBlockLast: {
    marginBottom: "0",
    paddingBottom: "0",
    borderBottom: "none",
  },
  entryRow: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "flex-start",
    flexWrap:       "wrap",
    gap:            "2px 8px",
    marginBottom:   "2px",
  },
  entryTitle: {
    fontFamily:  T.fontSans,
    fontSize:    "12.5px",
    fontWeight:  700,
    color:       T.ink,
    margin:      0,
    lineHeight:  1.3,
    letterSpacing: "-0.01em",
  },
  entryDate: {
    fontSize:      "9px",
    color:         T.goldPrimary,
    fontWeight:    600,
    whiteSpace:    "nowrap",
    letterSpacing: "0.04em",
    background:    T.goldGlow,
    padding:       "2px 7px",
    borderRadius:  "3px",
    border:        `1px solid ${T.goldRule}`,
  },
  entrySubtitle: {
    fontSize:   "10.5px",
    color:      T.inkSoft,
    fontWeight: 600,
    margin:     "0 0 6px",
  },
  bulletList: {
    margin:      "4px 0 0",
    paddingLeft: "0",
    listStyle:   "none",
  },
  bulletItem: {
    fontSize:     "11px",
    color:        T.inkMid,
    lineHeight:   1.65,
    marginBottom: "3px",
    paddingLeft:  "14px",
    position:     "relative",
  },
  bulletDot: {
    position:  "absolute",
    left:      "0",
    top:       "7px",
    width:     "4px",
    height:    "4px",
    borderRadius: "50%",
    background: T.goldPrimary,
    flexShrink: 0,
  },

  // Project
  projectCard: {
    background:   T.rowAlt,
    border:       `1px solid ${T.border}`,
    borderLeft:   `3px solid ${T.goldPrimary}`,
    borderRadius: "4px",
    padding:      "10px 14px",
    marginBottom: "10px",
  },
  projectHeader: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "flex-start",
    flexWrap:       "wrap",
    gap:            "4px",
    marginBottom:   "4px",
  },
  projectTitle: {
    fontSize:    "12px",
    fontWeight:  700,
    color:       T.ink,
    margin:      0,
    letterSpacing: "-0.01em",
  },
  projectLinks: {
    display: "flex",
    gap:     "8px",
  },
  projectLink: {
    fontSize:       "9px",
    color:          T.goldPrimary,
    textDecoration: "none",
    fontWeight:     600,
    letterSpacing:  "0.04em",
    textTransform:  "uppercase",
  },
  techTags: {
    display:   "flex",
    flexWrap:  "wrap",
    gap:       "4px",
    marginTop: "6px",
  },
  techTag: {
    background:    T.goldGlow,
    color:         T.goldPrimary,
    border:        `1px solid ${T.goldRule}`,
    borderRadius:  "3px",
    padding:       "1px 6px",
    fontSize:      "9px",
    fontWeight:    600,
    letterSpacing: "0.04em",
  },

  // Education
  eduRow: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "flex-start",
    gap:            "8px",
    marginBottom:   "3px",
  },
  eduDegree: {
    fontSize:    "12px",
    fontWeight:  700,
    color:       T.ink,
    margin:      0,
    letterSpacing: "-0.01em",
  },
  eduDate: {
    fontSize:   "9px",
    color:      T.goldPrimary,
    fontWeight: 600,
    whiteSpace: "nowrap",
    background: T.goldGlow,
    padding:    "2px 7px",
    borderRadius: "3px",
    border:     `1px solid ${T.goldRule}`,
  },
  eduInstitution: {
    fontSize:   "10.5px",
    color:      T.inkSoft,
    fontWeight: 500,
    margin:     "0 0 3px",
  },
  eduMeta: {
    fontSize: "9.5px",
    color:    T.inkFaint,
  },

  // Cert row
  certRow: {
    display:      "flex",
    alignItems:   "center",
    gap:          "10px",
    marginBottom: "8px",
  },
  certGoldBar: {
    width:        "3px",
    height:       "28px",
    background:   `linear-gradient(180deg, ${T.goldPrimary}, ${T.goldDim})`,
    borderRadius: "2px",
    flexShrink:   0,
  },
  certName: {
    fontSize:   "11.5px",
    fontWeight: 600,
    color:      T.ink,
    margin:     0,
    lineHeight: 1.3,
  },
  certMeta: {
    fontSize: "9.5px",
    color:    T.inkFaint,
    marginTop: "1px",
  },

  // Achievement
  achieveItem: {
    display:      "flex",
    alignItems:   "flex-start",
    gap:          "10px",
    marginBottom: "7px",
  },
  achieveStar: {
    fontSize:   "10px",
    color:      T.goldPrimary,
    flexShrink: 0,
    marginTop:  "3px",
    lineHeight: 1,
  },
  achieveText: {
    fontSize:  "11px",
    color:     T.inkMid,
    lineHeight: 1.65,
    margin:    0,
  },
};

// ─── Print CSS ────────────────────────────────────────────────────────────────
const PRINT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@media print {
  @page { size: A4; margin: 0; }
  body  { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .exec-page-wrapper { padding: 0 !important; background: white !important; min-height: unset !important; }
  .exec-a4-page      { box-shadow: none !important; }
  .page-break-avoid  { break-inside: avoid; page-break-inside: avoid; }
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

// ─── Sidebar Section ──────────────────────────────────────────────────────────
const SidebarSection = ({ title, children }) => (
  <div style={S.sidebarSection}>
    <div style={S.sidebarSectionTitle}>{title}</div>
    {children}
  </div>
);

// ─── Content Section ──────────────────────────────────────────────────────────
const ContentSection = ({ title, children }) => (
  <div style={S.section}>
    <div style={S.sectionHead}>
      <span style={S.sectionGoldDot} aria-hidden="true" />
      <h2 style={S.sectionTitle}>{title}</h2>
      <div style={S.sectionLine} />
    </div>
    {children}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ExecutiveTemplate = ({ resume = {} }) => {
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

  // Normalise skills
  const isCategorised = skills.length > 0 && typeof skills[0] === "object";
  const flatSkills    = isCategorised ? null : skills;
  const groupedSkills = isCategorised ? skills : null;

  return (
    <>
      <style>{PRINT_CSS}</style>
      <div style={S.pageWrapper} className="exec-page-wrapper">
        <div style={S.page} className="exec-a4-page">

          {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
          <aside style={S.sidebar}>
            <div style={S.sidebarTopBar} />

            {/* Photo + Name */}
            <div style={S.photoArea}>
              <div style={S.photoRing}>
                {photo ? (
                  <img src={photo} alt={fullName || "Profile"} style={S.photo} />
                ) : (
                  <div style={S.photoPlaceholder}>{getInitials(fullName)}</div>
                )}
              </div>
              {fullName && <h1 style={S.sidebarName}>{fullName}</h1>}
              {title    && <p  style={S.sidebarTitle}>{title}</p>}
            </div>

            <div style={S.sidebarBody}>

              {/* Contact */}
              {(email || phone || location) && (
                <SidebarSection title="Contact">
                  {email && (
                    <div style={S.contactRow}>
                      <div>
                        <span style={S.contactLabel}>Email</span>
                        <a href={`mailto:${email}`} style={S.contactLink}>{email}</a>
                      </div>
                    </div>
                  )}
                  {phone && (
                    <div style={S.contactRow}>
                      <div>
                        <span style={S.contactLabel}>Phone</span>
                        <span style={S.contactValue}>{phone}</span>
                      </div>
                    </div>
                  )}
                  {location && (
                    <div style={S.contactRow}>
                      <div>
                        <span style={S.contactLabel}>Location</span>
                        <span style={S.contactValue}>{location}</span>
                      </div>
                    </div>
                  )}
                </SidebarSection>
              )}

              {/* Links */}
              {(linkedin || github || portfolio) && (
                <SidebarSection title="Links">
                  {linkedin && (
                    <div style={S.contactRow}>
                      <div>
                        <span style={S.contactLabel}>LinkedIn</span>
                        <a href={linkedin} target="_blank" rel="noreferrer" style={S.contactLink}>
                          {clean(linkedin)}
                        </a>
                      </div>
                    </div>
                  )}
                  {github && (
                    <div style={S.contactRow}>
                      <div>
                        <span style={S.contactLabel}>GitHub</span>
                        <a href={github} target="_blank" rel="noreferrer" style={S.contactLink}>
                          {clean(github)}
                        </a>
                      </div>
                    </div>
                  )}
                  {portfolio && (
                    <div style={S.contactRow}>
                      <div>
                        <span style={S.contactLabel}>Portfolio</span>
                        <a href={portfolio} target="_blank" rel="noreferrer" style={S.contactLink}>
                          {clean(portfolio)}
                        </a>
                      </div>
                    </div>
                  )}
                </SidebarSection>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <SidebarSection title="Professional Skills">
                  {groupedSkills && groupedSkills.map((group, gi) => (
                    <div key={gi} style={{ marginBottom: "10px" }}>
                      {groupedSkills.length > 1 && (
                        <div style={{ ...S.contactLabel, marginBottom: "5px" }}>
                          {group.category || group.name}
                        </div>
                      )}
                      <div>
                        {(group.items || group.skills || []).map((sk, si) => (
                          <span key={si} style={S.skillChip}>{sk}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {flatSkills && flatSkills.map((sk, i) => (
                    <span key={i} style={S.skillChip}>{sk}</span>
                  ))}
                </SidebarSection>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <SidebarSection title="Languages">
                  {languages.map((l, i) => {
                    const name  = typeof l === "string" ? l : (l.language || l.name || "");
                    const level = typeof l === "string" ? "" : (l.proficiency || l.level || "");
                    return (
                      <div key={i} style={S.langRow}>
                        <span style={S.langName}>{name}</span>
                        {level && <span style={S.langLevel}>{level}</span>}
                      </div>
                    );
                  })}
                </SidebarSection>
              )}

            </div>
          </aside>

          {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
          <main style={S.content}>
            <div style={S.contentTopBar} />
            <div style={S.contentInner}>

              {/* Hero name / title */}
              {fullName && <h1 style={S.heroName}>{fullName}</h1>}
              {title    && <p  style={S.heroTitle}>{title}</p>}
              <hr style={S.heroRule} />

              {/* Executive Summary */}
              {topSummary && (
                <ContentSection title="Executive Summary">
                  <p style={S.summaryText}>{topSummary}</p>
                </ContentSection>
              )}

              {/* Leadership Experience */}
              {Array.isArray(experience) && experience.length > 0 && (
                <ContentSection title="Leadership Experience">
                  {experience.map((job, i) => (
                    <div
                      key={i}
                      style={i === experience.length - 1 ? S.entryBlockLast : S.entryBlock}
                      className="page-break-avoid"
                    >
                      <div style={S.entryRow}>
                        <h3 style={S.entryTitle}>{job.role || job.position || job.title}</h3>
                        <span style={S.entryDate}>
                          {[job.startDate, job.endDate || "Present"].filter(Boolean).join(" – ")}
                        </span>
                      </div>
                      <p style={S.entrySubtitle}>
                        {[job.company, job.location].filter(Boolean).join("  ·  ")}
                      </p>
                      <BulletList text={job.responsibilities} bullets={job.bullets} />
                      {!job.responsibilities && !job.bullets && job.description && (
                        <p style={{ ...S.achieveText, marginTop: "4px" }}>{job.description}</p>
                      )}
                    </div>
                  ))}
                </ContentSection>
              )}

              {/* Projects */}
              {projects.length > 0 && (
                <ContentSection title="Projects">
                  {projects.map((proj, i) => (
                    <div key={i} style={S.projectCard} className="page-break-avoid">
                      <div style={S.projectHeader}>
                        <p style={S.projectTitle}>{proj.title || proj.name}</p>
                        <div style={S.projectLinks}>
                          {proj.github && (
                            <a href={proj.github} style={S.projectLink} target="_blank" rel="noreferrer">
                              GitHub
                            </a>
                          )}
                          {proj.demo && (
                            <a href={proj.demo} style={S.projectLink} target="_blank" rel="noreferrer">
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                      {proj.description && (
                        <p style={{ ...S.achieveText, marginTop: "4px" }}>{proj.description}</p>
                      )}
                      {(proj.technologies || proj.techStack) && (
                        <div style={S.techTags}>
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
                </ContentSection>
              )}

              {/* Achievements */}
              {achievements.length > 0 && (
                <ContentSection title="Achievements">
                  {achievements.map((ach, i) => {
                    const label = typeof ach === "string"
                      ? ach
                      : [ach.title || ach.achievement, ach.year].filter(Boolean).join("  ·  ");
                    return (
                      <div key={i} style={S.achieveItem}>
                        <span style={S.achieveStar} aria-hidden="true">◆</span>
                        <p style={S.achieveText}>{label}</p>
                      </div>
                    );
                  })}
                </ContentSection>
              )}

              {/* Education */}
              {education.length > 0 && (
                <ContentSection title="Education">
                  {education.map((edu, i) => (
                    <div key={i} style={{ marginBottom: "12px" }} className="page-break-avoid">
                      <div style={S.eduRow}>
                        <h3 style={S.eduDegree}>
                          {[edu.degree, edu.field].filter(Boolean).join(", ")}
                        </h3>
                        <span style={S.eduDate}>
                          {[edu.startYear || edu.startDate, edu.endYear || edu.endDate || "Present"]
                            .filter(Boolean).join(" – ")}
                        </span>
                      </div>
                      <p style={S.eduInstitution}>
                        {[edu.college, edu.university].filter(Boolean).join(", ")}
                      </p>
                      {(edu.cgpa || edu.gpa) && (
                        <p style={S.eduMeta}>CGPA: {edu.cgpa || edu.gpa}</p>
                      )}
                    </div>
                  ))}
                </ContentSection>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <ContentSection title="Certifications">
                  {certifications.map((cert, i) => (
                    <div key={i} style={S.certRow} className="page-break-avoid">
                      <div style={S.certGoldBar} aria-hidden="true" />
                      <div>
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
                    </div>
                  ))}
                </ContentSection>
              )}

            </div>
          </main>

        </div>
      </div>
    </>
  );
};

export default ExecutiveTemplate;