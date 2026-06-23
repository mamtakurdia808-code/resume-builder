/**
 * ModernTemplate.jsx
 * ResumeAI – AI Resume Builder & ATS Checker
 * A premium, print-ready A4 resume template with sidebar layout.
 *
 * Usage:
 *   <ModernTemplate resume={resume} />
 *
 * Props:
 *   resume {Object} – PostgreSQL-sourced resume object with the shape:
 *     resume.personalInfo   – { name, title, email, phone, location, photo, website, linkedin, github }
 *     resume.summary        – string
 *     resume.skills         – [{ category, items: [string] }]  OR  [string]
 *     resume.experience     – [{ company, role, startDate, endDate, location, bullets: [string] }]
 *     resume.projects       – [{ name, url, description, tech: [string] }]
 *     resume.education      – [{ institution, degree, field, startDate, endDate, gpa }]
 *     resume.certifications – [{ name, issuer, date, credentialId }]
 *     resume.languages      – [{ language, proficiency }]
 *     resume.achievements   – [string]
 */

import React from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  teal:       "#0D9488",
  tealDark:   "#0A7A70",
  tealLight:  "#CCFBF1",
  tealMid:    "#14B8A6",
  sidebar:    "#0F2E2B",
  sidebarAlt: "#163D39",
  white:      "#FFFFFF",
  ink:        "#111827",
  inkMid:     "#374151",
  inkLight:   "#6B7280",
  border:     "#E5E7EB",
  bgPage:     "#F3F4F6",

  // Typography
  fontDisplay: "'Inter', 'Segoe UI', system-ui, sans-serif",
  fontMono:    "'JetBrains Mono', 'Fira Code', monospace",

  // Spacing
  sidebarW: "30%",
  contentW: "70%",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  // Root wrapper – centres the A4 page on screen
  pageWrapper: {
    background: T.bgPage,
    minHeight:  "100vh",
    display:    "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding:    "32px 16px",
    fontFamily: T.fontDisplay,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },

  // A4 card
  page: {
    width:     "210mm",
    minHeight: "297mm",
    background: T.white,
    display:   "flex",
    flexDirection: "row",
    boxShadow: "0 4px 40px rgba(0,0,0,0.12)",
    borderRadius: "4px",
    overflow:  "hidden",
    position:  "relative",
  },

  // ── Sidebar ────────────────────────────────────────────────────────────────
  sidebar: {
    width:      T.sidebarW,
    minWidth:   "200px",
    background: T.sidebar,
    color:      T.white,
    display:    "flex",
    flexDirection: "column",
    padding:    "36px 24px 40px",
    flexShrink: 0,
  },

  // Profile photo
  photoWrapper: {
    display:       "flex",
    justifyContent: "center",
    marginBottom:  "24px",
  },
  photo: {
    width:        "100px",
    height:       "100px",
    borderRadius: "50%",
    objectFit:    "cover",
    border:       `3px solid ${T.tealMid}`,
    display:      "block",
  },
  photoPlaceholder: {
    width:           "100px",
    height:          "100px",
    borderRadius:    "50%",
    background:      T.sidebarAlt,
    border:          `3px solid ${T.tealMid}`,
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    fontSize:        "36px",
    color:           T.tealMid,
    fontWeight:      700,
    userSelect:      "none",
  },

  // Name / title
  name: {
    fontSize:   "20px",
    fontWeight: 700,
    color:      T.white,
    textAlign:  "center",
    lineHeight: 1.25,
    margin:     0,
    letterSpacing: "-0.01em",
  },
  jobTitle: {
    fontSize:     "11px",
    fontWeight:   500,
    color:        T.tealMid,
    textAlign:    "center",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    marginTop:    "5px",
    marginBottom: "28px",
  },

  // Divider
  divider: {
    borderTop: `1px solid ${T.sidebarAlt}`,
    margin:    "0 0 20px",
  },

  // Sidebar section label
  sidebarLabel: {
    fontSize:      "9px",
    fontWeight:    700,
    color:         T.tealMid,
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    marginBottom:  "12px",
  },

  // Sidebar section block
  sidebarSection: {
    marginBottom: "24px",
  },

  // Contact row
  contactRow: {
    display:    "flex",
    alignItems: "flex-start",
    gap:        "8px",
    marginBottom: "8px",
    color:      "#CBD5E1",
    fontSize:   "11px",
    lineHeight: 1.5,
    wordBreak:  "break-all",
  },
  contactIcon: {
    flexShrink: 0,
    marginTop:  "1px",
    width:      "13px",
    height:     "13px",
    color:      T.tealMid,
  },
  contactLink: {
    color:          "#CBD5E1",
    textDecoration: "none",
  },

  // Skill chip
  skillGroup: {
    marginBottom: "12px",
  },
  skillCategory: {
    fontSize:      "10px",
    color:         T.tealLight,
    fontWeight:    600,
    marginBottom:  "5px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  skillChips: {
    display:   "flex",
    flexWrap:  "wrap",
    gap:       "4px",
  },
  skillChip: {
    background:   T.sidebarAlt,
    color:        "#CBD5E1",
    borderRadius: "4px",
    padding:      "2px 7px",
    fontSize:     "10px",
    fontWeight:   400,
    border:       `1px solid rgba(20,184,166,0.20)`,
    lineHeight:   1.6,
  },

  // Language row
  langRow: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    marginBottom:   "8px",
  },
  langName: {
    fontSize:   "11px",
    color:      "#CBD5E1",
    fontWeight: 500,
  },
  langLevel: {
    fontSize:      "9px",
    color:         T.tealMid,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight:    600,
  },

  // Sidebar link
  sidebarLink: {
    display:        "block",
    color:          "#CBD5E1",
    fontSize:       "11px",
    textDecoration: "none",
    marginBottom:   "6px",
    wordBreak:      "break-all",
  },

  // ── Main content ───────────────────────────────────────────────────────────
  content: {
    width:    T.contentW,
    padding:  "36px 32px 40px",
    display:  "flex",
    flexDirection: "column",
    gap:      "24px",
  },

  // Section
  section: {
    display:      "flex",
    flexDirection: "column",
  },
  sectionHeader: {
    display:        "flex",
    alignItems:     "center",
    gap:            "10px",
    marginBottom:   "14px",
  },
  sectionTitle: {
    fontSize:      "11px",
    fontWeight:    700,
    color:         T.teal,
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    margin:        0,
    whiteSpace:    "nowrap",
  },
  sectionLine: {
    flex:      1,
    height:    "1px",
    background: T.border,
  },

  // Summary text
  summaryText: {
    fontSize:   "12px",
    color:      T.inkMid,
    lineHeight: 1.75,
    margin:     0,
  },

  // Experience / Education card
  entryCard: {
    borderLeft:  `2px solid ${T.tealLight}`,
    paddingLeft: "14px",
    marginBottom: "16px",
    position:    "relative",
  },
  entryCardDot: {
    position:     "absolute",
    left:         "-5px",
    top:          "5px",
    width:        "8px",
    height:       "8px",
    borderRadius: "50%",
    background:   T.teal,
    flexShrink:   0,
  },
  entryRow: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "flex-start",
    flexWrap:       "wrap",
    gap:            "2px",
    marginBottom:   "2px",
  },
  entryTitle: {
    fontSize:   "13px",
    fontWeight: 700,
    color:      T.ink,
    margin:     0,
    lineHeight: 1.3,
  },
  entryDate: {
    fontSize:      "10px",
    color:         T.inkLight,
    fontWeight:    500,
    whiteSpace:    "nowrap",
    letterSpacing: "0.02em",
  },
  entrySubtitle: {
    fontSize:   "11px",
    color:      T.teal,
    fontWeight: 600,
    margin:     "0 0 6px",
  },
  entryLocation: {
    fontSize: "10px",
    color:    T.inkLight,
    margin:   "0 0 6px",
  },
  bulletList: {
    margin:     "4px 0 0",
    paddingLeft: "16px",
  },
  bullet: {
    fontSize:    "11.5px",
    color:       T.inkMid,
    lineHeight:  1.65,
    marginBottom: "3px",
  },

  // Project card
  projectCard: {
    background:   "#F8FAFC",
    border:       `1px solid ${T.border}`,
    borderRadius: "8px",
    padding:      "12px 14px",
    marginBottom: "10px",
  },
  projectHeader: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    marginBottom:   "5px",
    flexWrap:       "wrap",
    gap:            "4px",
  },
  projectName: {
    fontSize:   "12.5px",
    fontWeight: 700,
    color:      T.ink,
    margin:     0,
  },
  projectLink: {
    fontSize:      "10px",
    color:         T.teal,
    textDecoration: "none",
    fontWeight:    500,
  },
  projectDesc: {
    fontSize:   "11.5px",
    color:      T.inkMid,
    lineHeight: 1.6,
    margin:     "0 0 7px",
  },
  techStack: {
    display:  "flex",
    flexWrap: "wrap",
    gap:      "4px",
  },
  techTag: {
    background:    T.tealLight,
    color:         T.tealDark,
    borderRadius:  "4px",
    padding:       "1px 6px",
    fontSize:      "9.5px",
    fontWeight:    600,
    letterSpacing: "0.03em",
  },

  // Cert row
  certRow: {
    display:      "flex",
    alignItems:   "flex-start",
    gap:          "10px",
    marginBottom: "10px",
  },
  certDot: {
    width:        "6px",
    height:       "6px",
    borderRadius: "50%",
    background:   T.teal,
    flexShrink:   0,
    marginTop:    "5px",
  },
  certName: {
    fontSize:   "12px",
    fontWeight: 600,
    color:      T.ink,
    margin:     0,
    lineHeight: 1.4,
  },
  certMeta: {
    fontSize: "10px",
    color:    T.inkLight,
    margin:   "1px 0 0",
  },

  // Achievement
  achievementItem: {
    display:      "flex",
    alignItems:   "flex-start",
    gap:          "8px",
    marginBottom: "7px",
  },
  achieveIcon: {
    fontSize:   "12px",
    lineHeight: 1.5,
    flexShrink: 0,
  },
  achieveText: {
    fontSize:  "11.5px",
    color:     T.inkMid,
    lineHeight: 1.6,
    margin:    0,
  },
};

// ─── Small SVG icons (inline, no dependency) ─────────────────────────────────
const Icon = {
  Mail: () => (
    <svg style={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/>
    </svg>
  ),
  Phone: () => (
    <svg style={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.02 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  MapPin: () => (
    <svg style={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Globe: () => (
    <svg style={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  ),
  LinkedIn: () => (
    <svg style={styles.contactIcon} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  GitHub: () => (
    <svg style={styles.contactIcon} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
    </svg>
  ),
};

// ─── Helper: format date range ────────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return "";
  const parsed = new Date(d);
  if (isNaN(parsed)) return d;
  return parsed.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const dateRange = (start, end) => {
  const s = fmtDate(start);
  const e = end ? fmtDate(end) : "Present";
  if (!s) return e;
  return `${s} – ${e}`;
};

// ─── Helper: initials for photo fallback ─────────────────────────────────────
const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Section wrapper with labelled heading + horizontal rule */
const Section = ({ title, children }) => (
  <div style={styles.section}>
    <div style={styles.sectionHeader}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <div style={styles.sectionLine} />
    </div>
    {children}
  </div>
);

/** Sidebar section */
const SidebarSection = ({ label, children }) => (
  <div style={styles.sidebarSection}>
    <div style={styles.sidebarLabel}>{label}</div>
    {children}
  </div>
);

/** Experience / Education entry */
const TimelineEntry = ({ title, subtitle, meta, location, bullets = [] }) => (
  <div style={styles.entryCard}>
    <div style={styles.entryCardDot} />
    <div style={styles.entryRow}>
      <p style={styles.entryTitle}>{title}</p>
      {meta && <span style={styles.entryDate}>{meta}</span>}
    </div>
    {subtitle && <p style={styles.entrySubtitle}>{subtitle}</p>}
    {location && <p style={styles.entryLocation}>📍 {location}</p>}
    {Array.isArray(bullets) && bullets.length > 0 && (  // ← guard added
      <ul style={styles.bulletList}>
        {bullets.map((b, i) => (
          <li key={i} style={styles.bullet}>{b}</li>
        ))}
      </ul>
    )}
  </div>
);

// ─── Print styles injected once ──────────────────────────────────────────────
const PRINT_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@media print {
  body { margin: 0; padding: 0; background: white !important; }
  .resume-page-wrapper { padding: 0 !important; background: white !important; min-height: unset !important; }
  .resume-a4-page {
    width: 210mm !important;
    min-height: 297mm !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    page-break-after: always;
  }
}

@page {
  size: A4;
  margin: 0;
}
`;

// ─── Main Component ───────────────────────────────────────────────────────────

const ModernTemplate = ({ resume = {} }) => {
  const {
    personal = {},        // DB stores as "personal"
    skills = [],
    experience = [],
    projects = [],
    education = [],
    certifications = [],
    languages = [],
    achievements = [],
  } = resume;

  // summary lives inside personal in DB
  const {
    fullName: name = "",      // DB field is "fullName"
    title: jobTitle = "",
    email = "",
    phone = "",
    location = "",
    photo = "",
    portfolio: website = "",  // DB field is "portfolio", not "website"
    linkedin = "",
    github = "",
    summary = "",             // summary is INSIDE personal in DB
  } = personal;
  // Normalise skills: support both [{category, items}] and [string]
  const normalisedSkills = skills.length > 0
    ? typeof skills[0] === "string"
      ? [{ category: "Skills", items: skills }]
      : skills
    : [];

  return (
    <>
      {/* Inject print + font styles once */}
      <style>{PRINT_STYLES}</style>

      <div style={styles.pageWrapper} className="resume-page-wrapper">
        <div style={styles.page} className="resume-a4-page">

          {/* ── LEFT SIDEBAR ────────────────────────────────────────────── */}
          <aside style={styles.sidebar}>

            {/* Photo */}
<div style={styles.photoWrapper}>
  {photo ? (
    <img
      src={photo}
      alt={name || "Profile"}
      style={styles.photo}
    />
  ) : (
    <div style={styles.photoPlaceholder}>
      {getInitials(name)}
    </div>
  )}
</div>

            {/* Name + Title */}
            {name && <h1 style={styles.name}>{name}</h1>}
            {jobTitle && <p style={styles.jobTitle}>{jobTitle}</p>}

            <div style={styles.divider} />

            {/* Contact */}
            {(email || phone || location) && (
              <SidebarSection label="Contact">
                {email && (
                  <div style={styles.contactRow}>
                    <Icon.Mail />
                    <a href={`mailto:${email}`} style={styles.contactLink}>{email}</a>
                  </div>
                )}
                {phone && (
                  <div style={styles.contactRow}>
                    <Icon.Phone />
                    <span>{phone}</span>
                  </div>
                )}
                {location && (
                  <div style={styles.contactRow}>
                    <Icon.MapPin />
                    <span>{location}</span>
                  </div>
                )}
              </SidebarSection>
            )}

            {/* Skills */}
            {normalisedSkills.length > 0 && (
              <SidebarSection label="Skills">
                {normalisedSkills.map((group, gi) => (
                  <div key={gi} style={styles.skillGroup}>
                    {normalisedSkills.length > 1 && (
                      <div style={styles.skillCategory}>{group.category}</div>
                    )}
                    <div style={styles.skillChips}>
                      {(group.items || []).map((skill, si) => (
                        <span key={si} style={styles.skillChip}>{skill}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </SidebarSection>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <SidebarSection label="Languages">
                {languages.map((l, i) => (
                  <div key={i} style={styles.langRow}>
                    <span style={styles.langName}>{l.language}</span>
                    {l.proficiency && (
                      <span style={styles.langLevel}>{l.proficiency}</span>
                    )}
                  </div>
                ))}
              </SidebarSection>
            )}

            {/* Links */}
            {(website || linkedin || github) && (
              <SidebarSection label="Links">
                {website && (
                  <div style={styles.contactRow}>
                    <Icon.Globe />
                    <a href={website} target="_blank" rel="noreferrer" style={styles.contactLink}>
                      {website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                {linkedin && (
                  <div style={styles.contactRow}>
                    <Icon.LinkedIn />
                    <a href={linkedin} target="_blank" rel="noreferrer" style={styles.contactLink}>
                      {linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}
                    </a>
                  </div>
                )}
                {github && (
                  <div style={styles.contactRow}>
                    <Icon.GitHub />
                    <a href={github} target="_blank" rel="noreferrer" style={styles.contactLink}>
                      {github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
                    </a>
                  </div>
                )}
              </SidebarSection>
            )}

          </aside>

          {/* ── RIGHT CONTENT ───────────────────────────────────────────── */}
          <main style={styles.content}>

            {/* Summary */}
            {summary && (
  <Section title="Professional Summary">
    <p style={styles.summaryText}>{summary}</p>
  </Section>
)}

            {/* Experience */}
            {Array.isArray(experience) && experience.length > 0 && (
              <Section title="Experience">
                {experience.map((exp, i) => (
  <TimelineEntry
    key={i}
    title={exp.role}
    subtitle={exp.company}
    meta={dateRange(exp.startDate, exp.endDate)}
    bullets={
        exp.responsibilities
            ? exp.responsibilities
                  .split("\n")
                  .filter(Boolean)
            : []
    }
/>
))}
              </Section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <Section title="Projects">
                {projects.map((proj, i) => (
                  <div key={i} style={styles.projectCard}>
                    <div style={styles.projectHeader}>
  <p style={styles.projectName}>{proj.title}</p>

  <div style={{ display: "flex", gap: "10px" }}>
    {proj.demo && (
      <a
        href={proj.demo}
        target="_blank"
        rel="noreferrer"
        style={styles.projectLink}
      >
        Live Demo
      </a>
    )}

    {proj.github && (
      <a
        href={proj.github}
        target="_blank"
        rel="noreferrer"
        style={styles.projectLink}
      >
        GitHub
      </a>
    )}
  </div>
</div>
                    {proj.description && (
                      <p style={styles.projectDesc}>{proj.description}</p>
                    )}
                    {proj.technologies && (
  <div style={styles.techStack}>
    {proj.technologies
      .split(",")
      .map((tech, index) => (
        <span key={index} style={styles.techTag}>
          {tech.trim()}
        </span>
      ))}
  </div>
)}
                  </div>
                ))}
              </Section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <Section title="Education">
                {education.map((edu, i) => (
                  <TimelineEntry
                    key={i}
                    title={edu.college}

subtitle={`${edu.degree}${
    edu.university ? ` • ${edu.university}` : ""
}`}

meta={`${edu.startYear} - ${edu.endYear}`}

bullets={edu.cgpa ? [`CGPA: ${edu.cgpa}`] : []}
                  />
                ))}
              </Section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <Section title="Certifications">
                {certifications.map((cert, i) => (
                  <div key={i} style={styles.certRow}>
                    <div style={styles.certDot} />
                    <div>
                      <p style={styles.certName}>{cert.name}</p>
                      <p style={styles.certMeta}>
                        {[cert.organization, cert.year]
                          .filter(Boolean)
                          .join(" · ")}
                        {cert.credentialId && ` · ID: ${cert.credentialId}`}
                      </p>
                    </div>
                  </div>
                ))}
              </Section>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <Section title="Achievements">
                {achievements.map((ach, i) => (
                  <div key={i} style={styles.achievementItem}>
                    <span style={styles.achieveIcon}>🏆</span>
                    <p style={styles.achieveText}>{ach}</p>
                  </div>
                ))}
              </Section>
            )}

          </main>
        </div>
      </div>
    </>
  );
};

export default ModernTemplate;