/**
 * ClassicTemplate.jsx
 * ResumeAI – AI Resume Builder & ATS Checker
 * Traditional single-column serif resume — black & white, ATS-maximised.
 *
 * Usage:
 *   <ClassicTemplate resume={resume} />
 *
 * Props:
 *   resume {Object} – PostgreSQL-sourced resume object:
 *     resume.personal       – { fullName, title, email, phone, location, portfolio, linkedin, github, summary }
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
  black:    "#000000",
  ink:      "#111111",
  inkMid:   "#222222",
  inkSoft:  "#444444",
  inkFaint: "#666666",
  rule:     "#000000",
  ruleLight:"#999999",
  bg:       "#FFFFFF",

  fontSerif: "'Georgia', 'Times New Roman', 'Times', serif",
  fontSans:  "'Arial', 'Helvetica Neue', Helvetica, sans-serif",

  szName:    "22px",
  szSection: "12px",
  szJob:     "12px",
  szBody:    "11.5px",
  szSmall:   "10.5px",
  szTiny:    "10px",

  lineHeight: "1.55",
  pagePadV:   "36px",
  pagePadH:   "48px",
  sectionGap: "14px",
  itemGap:    "10px",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  pageWrapper: {
    background:  "#D8D8D8",
    minHeight:   "100vh",
    display:     "flex",
    justifyContent: "center",
    alignItems:  "flex-start",
    padding:     "32px 16px",
    fontFamily:  T.fontSerif,
  },

  page: {
    width:        "210mm",
    minHeight:    "297mm",
    background:   T.bg,
    color:        T.ink,
    fontFamily:   T.fontSerif,
    fontSize:     T.szBody,
    lineHeight:   T.lineHeight,
    padding:      `${T.pagePadV} ${T.pagePadH}`,
    boxSizing:    "border-box",
    boxShadow:    "0 2px 24px rgba(0,0,0,0.14)",
    WebkitPrintColorAdjust: "exact",
    printColorAdjust:       "exact",
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    textAlign:     "center",
    marginBottom:  "14px",
    paddingBottom: "10px",
  },
  name: {
    fontFamily:    T.fontSerif,
    fontSize:      T.szName,
    fontWeight:    700,
    color:         T.black,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    margin:        "0 0 4px",
    lineHeight:    1.2,
  },
  tagline: {
    fontFamily: T.fontSerif,
    fontSize:   "12.5px",
    fontStyle:  "italic",
    color:      T.inkSoft,
    margin:     "0 0 8px",
  },
  contactRow: {
    display:        "flex",
    justifyContent: "center",
    flexWrap:       "wrap",
    gap:            "0",
    fontSize:       T.szSmall,
    color:          T.inkSoft,
    fontFamily:     T.fontSans,
  },
  contactItem: {
    whiteSpace: "nowrap",
  },
  contactSep: {
    margin:    "0 8px",
    color:     T.ruleLight,
    userSelect: "none",
  },
  contactLink: {
    color:          T.inkSoft,
    textDecoration: "none",
    fontFamily:     T.fontSans,
  },

  // ── Thick rule under header ───────────────────────────────────────────────
  ruleThick: {
    border:        "none",
    borderTop:     `2px solid ${T.black}`,
    margin:        "0 0 2px",
  },
  ruleThin: {
    border:    "none",
    borderTop: `1px solid ${T.black}`,
    margin:    "0 0 10px",
  },

  // ── Section ───────────────────────────────────────────────────────────────
  section: {
    marginBottom: T.sectionGap,
  },
  sectionHead: {
    fontFamily:    T.fontSerif,
    fontSize:      T.szSection,
    fontWeight:    700,
    color:         T.black,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    margin:        "0 0 3px",
  },
  sectionRule: {
    border:    "none",
    borderTop: `1px solid ${T.black}`,
    margin:    "0 0 8px",
  },

  // ── Objective / Summary ───────────────────────────────────────────────────
  objectiveText: {
    margin:     "0",
    color:      T.inkMid,
    lineHeight: T.lineHeight,
    textAlign:  "justify",
    fontFamily: T.fontSerif,
    fontSize:   T.szBody,
  },

  // ── Entry block ───────────────────────────────────────────────────────────
  itemBlock: {
    marginBottom: T.itemGap,
  },
  itemHeaderRow: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "baseline",
    flexWrap:       "wrap",
    gap:            "2px 8px",
  },
  itemTitle: {
    fontFamily:  T.fontSerif,
    fontSize:    T.szJob,
    fontWeight:  700,
    color:       T.black,
    margin:      0,
  },
  itemDate: {
    fontFamily:  T.fontSans,
    fontSize:    T.szSmall,
    color:       T.inkSoft,
    whiteSpace:  "nowrap",
    fontStyle:   "italic",
  },
  itemSubtitle: {
    fontFamily:  T.fontSerif,
    fontSize:    T.szBody,
    fontStyle:   "italic",
    color:       T.inkSoft,
    margin:      "0 0 3px",
  },
  itemLocation: {
    fontFamily: T.fontSans,
    fontSize:   T.szTiny,
    color:      T.inkFaint,
    margin:     "0 0 3px",
  },
  bulletList: {
    margin:      "3px 0 0",
    paddingLeft: "18px",
  },
  bulletItem: {
    fontFamily:   T.fontSerif,
    fontSize:     T.szBody,
    color:        T.inkMid,
    lineHeight:   T.lineHeight,
    marginBottom: "2px",
    textAlign:    "justify",
  },
  descText: {
    fontFamily:  T.fontSerif,
    fontSize:    T.szBody,
    color:       T.inkMid,
    lineHeight:  T.lineHeight,
    margin:      "3px 0 0",
    textAlign:   "justify",
    whiteSpace:  "pre-line",
  },

  // ── Education ─────────────────────────────────────────────────────────────
  eduDegree: {
    fontFamily:  T.fontSerif,
    fontSize:    T.szJob,
    fontWeight:  700,
    color:       T.black,
    margin:      0,
  },
  eduInstitution: {
    fontFamily:  T.fontSerif,
    fontSize:    T.szBody,
    fontStyle:   "italic",
    color:       T.inkSoft,
    margin:      "0 0 1px",
  },
  eduMeta: {
    fontFamily: T.fontSans,
    fontSize:   T.szTiny,
    color:      T.inkFaint,
    margin:     0,
  },

  // ── Skills ────────────────────────────────────────────────────────────────
  skillsRow: {
    marginBottom: "5px",
    fontSize:     T.szBody,
    color:        T.inkMid,
    lineHeight:   T.lineHeight,
    fontFamily:   T.fontSerif,
  },
  skillCatLabel: {
    fontWeight: 700,
    color:      T.black,
    fontFamily: T.fontSerif,
  },

  // ── Projects ─────────────────────────────────────────────────────────────
  projectTitle: {
    fontFamily:  T.fontSerif,
    fontSize:    T.szJob,
    fontWeight:  700,
    color:       T.black,
    margin:      0,
    display:     "inline",
  },
  projectTech: {
    fontFamily:  T.fontSerif,
    fontSize:    T.szBody,
    fontStyle:   "italic",
    color:       T.inkSoft,
    margin:      "1px 0 3px",
  },
  projectLinks: {
    fontFamily: T.fontSans,
    fontSize:   T.szTiny,
    color:      T.inkFaint,
    margin:     "2px 0 0",
  },
  projectLink: {
    color:          T.inkFaint,
    textDecoration: "none",
    marginRight:    "12px",
  },

  // ── Certs / Achievements ──────────────────────────────────────────────────
  listItem: {
    fontFamily:   T.fontSerif,
    fontSize:     T.szBody,
    color:        T.inkMid,
    lineHeight:   T.lineHeight,
    marginBottom: "3px",
    textAlign:    "justify",
  },
  inlineList: {
    margin:      "0",
    paddingLeft: "18px",
  },
};

// ─── Print CSS ────────────────────────────────────────────────────────────────
const PRINT_CSS = `
@media print {
  @page { size: A4; margin: 0; }
  body  { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .classic-wrapper { padding: 0 !important; background: white !important; min-height: unset !important; }
  .classic-page    {
    box-shadow: none !important;
    padding: 28mm 18mm !important;
  }
  .page-break-avoid { break-inside: avoid; page-break-inside: avoid; }
  a { color: inherit !important; text-decoration: none !important; }
}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const clean = (url = "") => url.replace(/^https?:\/\/(www\.)?/i, "");

const BulletList = ({ text, bullets }) => {
  const items = Array.isArray(bullets) && bullets.length > 0
    ? bullets
    : typeof text === "string" ? text.split("\n").filter(Boolean) : [];
  if (!items.length) return null;
  return (
    <ul style={S.bulletList}>
      {items.map((b, i) => (
        <li key={i} style={S.bulletItem}>{b}</li>
      ))}
    </ul>
  );
};

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
  <div style={S.section} className="page-break-avoid">
    <h2 style={S.sectionHead}>{title}</h2>
    <hr style={S.sectionRule} />
    {children}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ClassicTemplate = ({ resume = {} }) => {
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
    summary   = "",
  } = personal;

  const objective = summary || resume.summary || "";

  // Contact items — plain text, no icons
  const contacts = [
    email     && { label: email,           href: `mailto:${email}` },
    phone     && { label: phone,           href: `tel:${phone}` },
    location  && { label: location,        href: null },
    linkedin  && { label: clean(linkedin), href: linkedin },
    github    && { label: clean(github),   href: github },
    portfolio && { label: clean(portfolio),href: portfolio },
  ].filter(Boolean);

  // Normalise skills
  const isCategorised = skills.length > 0 && typeof skills[0] === "object";

  return (
    <>
      <style>{PRINT_CSS}</style>
      <div style={S.pageWrapper} className="classic-wrapper">
        <article style={S.page} className="classic-page">

          {/* ── HEADER ────────────────────────────────────────────────── */}
          <header style={S.header}>
            {fullName && <h1 style={S.name}>{fullName}</h1>}
            {title    && <p  style={S.tagline}>{title}</p>}
            {contacts.length > 0 && (
              <div style={S.contactRow}>
                {contacts.map((c, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span style={S.contactSep} aria-hidden="true">|</span>}
                    <span style={S.contactItem}>
                      {c.href
                        ? <a href={c.href} style={S.contactLink}>{c.label}</a>
                        : c.label}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            )}
          </header>

          {/* Double rule under header — classic convention */}
          <hr style={S.ruleThick} />
          <hr style={S.ruleThin} />

          {/* ── OBJECTIVE ─────────────────────────────────────────────── */}
          {objective && (
            <Section title="Objective">
              <p style={S.objectiveText}>{objective}</p>
            </Section>
          )}

          {/* ── EDUCATION ─────────────────────────────────────────────── */}
          {education.length > 0 && (
            <Section title="Education">
              {education.map((edu, i) => (
                <div key={i} style={S.itemBlock} className="page-break-avoid">
                  <div style={S.itemHeaderRow}>
                    <h3 style={S.eduDegree}>
                      {[edu.degree, edu.field].filter(Boolean).join(", ")}
                    </h3>
                    <span style={S.itemDate}>
                      {[edu.startYear || edu.startDate, edu.endYear || edu.endDate || "Present"]
                        .filter(Boolean).join(" – ")}
                    </span>
                  </div>
                  <p style={S.eduInstitution}>
                    {[edu.college, edu.university].filter(Boolean).join(", ")}
                  </p>
                  {(edu.cgpa || edu.gpa) && (
                    <p style={S.eduMeta}>CGPA / Score: {edu.cgpa || edu.gpa}</p>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* ── EXPERIENCE ────────────────────────────────────────────── */}
          {Array.isArray(experience) && experience.length > 0 && (
            <Section title="Experience">
              {experience.map((job, i) => (
                <div key={i} style={S.itemBlock} className="page-break-avoid">
                  <div style={S.itemHeaderRow}>
                    <h3 style={S.itemTitle}>{job.role || job.position || job.title}</h3>
                    <span style={S.itemDate}>
                      {[job.startDate, job.endDate || "Present"].filter(Boolean).join(" – ")}
                    </span>
                  </div>
                  <p style={S.itemSubtitle}>
                    {[job.company, job.location].filter(Boolean).join(", ")}
                  </p>
                  <BulletList text={job.responsibilities} bullets={job.bullets} />
                  {!job.responsibilities && !job.bullets && job.description && (
                    <p style={S.descText}>{job.description}</p>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* ── PROJECTS ──────────────────────────────────────────────── */}
          {projects.length > 0 && (
            <Section title="Projects">
              {projects.map((proj, i) => (
                <div key={i} style={S.itemBlock} className="page-break-avoid">
                  <div style={S.itemHeaderRow}>
                    <h3 style={S.projectTitle}>{proj.title || proj.name}</h3>
                  </div>
                  {(proj.technologies || proj.techStack) && (
                    <p style={S.projectTech}>
                      Technologies:{" "}
                      {proj.technologies
                        ? proj.technologies
                        : Array.isArray(proj.techStack)
                          ? proj.techStack.join(", ")
                          : proj.techStack}
                    </p>
                  )}
                  {proj.description && (
                    <p style={S.descText}>{proj.description}</p>
                  )}
                  {(proj.github || proj.demo) && (
                    <p style={S.projectLinks}>
                      {proj.github && (
                        <a href={proj.github} style={S.projectLink} target="_blank" rel="noreferrer">
                          {clean(proj.github)}
                        </a>
                      )}
                      {proj.demo && (
                        <a href={proj.demo} style={S.projectLink} target="_blank" rel="noreferrer">
                          {clean(proj.demo)}
                        </a>
                      )}
                    </p>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* ── SKILLS ────────────────────────────────────────────────── */}
          {skills.length > 0 && (
            <Section title="Skills">
              {isCategorised ? (
                skills.map((group, gi) => (
                  <div key={gi} style={S.skillsRow}>
                    <span style={S.skillCatLabel}>
                      {group.category || group.name}:{" "}
                    </span>
                    {(group.items || group.skills || []).join(", ")}
                  </div>
                ))
              ) : (
                <p style={{ ...S.skillsRow, marginBottom: 0 }}>
                  {skills.join(", ")}
                </p>
              )}
            </Section>
          )}

          {/* ── ACHIEVEMENTS ──────────────────────────────────────────── */}
          {achievements.length > 0 && (
            <Section title="Achievements">
              <ul style={S.inlineList}>
                {achievements.map((ach, i) => {
                  const label = typeof ach === "string"
                    ? ach
                    : [ach.title || ach.achievement, ach.year || ach.date]
                        .filter(Boolean).join(", ");
                  return <li key={i} style={S.listItem}>{label}</li>;
                })}
              </ul>
            </Section>
          )}

          {/* ── CERTIFICATIONS ────────────────────────────────────────── */}
          {certifications.length > 0 && (
            <Section title="Certifications">
              <ul style={S.inlineList}>
                {certifications.map((cert, i) => {
                  const label = typeof cert === "string"
                    ? cert
                    : [cert.name, cert.organization || cert.issuer, cert.year || cert.date]
                        .filter(Boolean).join(", ");
                  return <li key={i} style={S.listItem}>{label}</li>;
                })}
              </ul>
            </Section>
          )}

          {/* ── LANGUAGES ─────────────────────────────────────────────── */}
          {languages.length > 0 && (
            <Section title="Languages">
              <p style={{ ...S.skillsRow, marginBottom: 0 }}>
                {languages.map((l, i) => {
                  const name  = typeof l === "string" ? l : (l.language || l.name || "");
                  const level = typeof l === "string" ? "" : (l.proficiency || l.level || "");
                  return (
                    <React.Fragment key={i}>
                      {i > 0 && ", "}
                      {level ? `${name} (${level})` : name}
                    </React.Fragment>
                  );
                })}
              </p>
            </Section>
          )}

        </article>
      </div>
    </>
  );
};

export default ClassicTemplate;