/**
 * MinimalTemplate.jsx
 * ResumeAI – AI Resume Builder & ATS Checker
 * Scandinavian-minimal single-column ATS-optimised resume template.
 *
 * Usage:
 *   <MinimalTemplate resume={resume} />
 *
 * Props:
 *   resume {Object} – PostgreSQL-sourced resume object with the shape:
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
  // Palette – near-pure black/white with two calibrated grays
  black:     "#0A0A0A",
  charcoal:  "#2C2C2C",
  mid:       "#6B6B6B",
  light:     "#B0B0B0",
  rule:      "#E0E0E0",
  bg:        "#FFFFFF",

  // Typography – pairing a geometric sans for headings with a humanist for body
  fontHead: "'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontBody: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",

  // Scale
  szName:    "28px",
  szTagline: "12px",
  szSection: "9px",
  szBody:    "11.5px",
  szSmall:   "10px",

  // Spacing
  pagePadV:  "44px",
  pagePadH:  "52px",
  sectionGap:"22px",
  itemGap:   "14px",
  lineHeight:"1.65",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  page: {
    background:    T.bg,
    color:         T.charcoal,
    fontFamily:    T.fontBody,
    fontSize:      T.szBody,
    lineHeight:    T.lineHeight,
    width:         "210mm",
    minHeight:     "297mm",
    margin:        "0 auto",
    padding:       `${T.pagePadV} ${T.pagePadH}`,
    boxSizing:     "border-box",
    WebkitPrintColorAdjust: "exact",
    printColorAdjust:       "exact",
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    marginBottom: "32px",
    paddingBottom: "24px",
    borderBottom:  `1px solid ${T.rule}`,
  },
  name: {
    fontFamily:    T.fontHead,
    fontSize:      T.szName,
    fontWeight:    700,
    color:         T.black,
    letterSpacing: "-0.03em",
    margin:        "0 0 5px",
    lineHeight:    1.1,
  },
  tagline: {
    fontFamily:    T.fontBody,
    fontSize:      T.szTagline,
    fontWeight:    500,
    color:         T.mid,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    margin:        "0 0 18px",
  },
  contactRow: {
    display:    "flex",
    flexWrap:   "wrap",
    gap:        "0",
    fontSize:   T.szSmall,
    color:      T.mid,
    lineHeight: 1.7,
  },
  contactItem: {
    whiteSpace: "nowrap",
  },
  contactSep: {
    margin:  "0 10px",
    color:   T.rule,
    userSelect: "none",
  },
  contactLink: {
    color:          T.mid,
    textDecoration: "none",
  },

  // ── Section ───────────────────────────────────────────────────────────────
  section: {
    marginBottom: T.sectionGap,
  },
  sectionHead: {
    fontFamily:    T.fontHead,
    fontSize:      T.szSection,
    fontWeight:    700,
    color:         T.black,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    margin:        "0 0 10px",
    paddingBottom: "7px",
    borderBottom:  `1px solid ${T.rule}`,
  },

  // ── Summary ───────────────────────────────────────────────────────────────
  summaryText: {
    margin:     "4px 0 0",
    color:      T.charcoal,
    lineHeight: T.lineHeight,
    fontSize:   T.szBody,
  },

  // ── Experience / Projects ─────────────────────────────────────────────────
  itemBlock: {
    marginBottom: T.itemGap,
  },
  itemRow: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "baseline",
    flexWrap:       "wrap",
    gap:            "2px 8px",
    marginBottom:   "1px",
  },
  itemTitle: {
    fontFamily:  T.fontHead,
    fontSize:    "12.5px",
    fontWeight:  700,
    color:       T.black,
    margin:      0,
    letterSpacing: "-0.01em",
  },
  itemMeta: {
    fontSize:   T.szSmall,
    color:      T.light,
    whiteSpace: "nowrap",
    fontWeight: 400,
  },
  itemSub: {
    fontSize:   T.szSmall,
    color:      T.mid,
    fontWeight: 500,
    margin:     "0 0 5px",
    letterSpacing: "0.01em",
  },
  bulletList: {
    margin:      "5px 0 0",
    paddingLeft: "14px",
    listStyle:   "none",
  },
  bulletItem: {
    color:        T.charcoal,
    marginBottom: "3px",
    fontSize:     T.szBody,
    lineHeight:   T.lineHeight,
    position:     "relative",
    paddingLeft:  "0",
  },
  bulletDash: {
    position:   "absolute",
    left:       "-12px",
    color:      T.light,
    userSelect: "none",
  },
  descText: {
    margin:     "5px 0 0",
    color:      T.charcoal,
    lineHeight: T.lineHeight,
    fontSize:   T.szBody,
    whiteSpace: "pre-line",
  },
  techLine: {
    fontSize:    T.szSmall,
    color:       T.mid,
    fontStyle:   "italic",
    margin:      "2px 0 4px",
    fontWeight:  400,
  },
  projectLinks: {
    display:   "flex",
    gap:       "12px",
    marginTop: "4px",
  },
  projectLink: {
    fontSize:       T.szSmall,
    color:          T.mid,
    textDecoration: "none",
    borderBottom:   `1px solid ${T.rule}`,
    paddingBottom:  "1px",
    letterSpacing:  "0.01em",
  },

  // ── Education ─────────────────────────────────────────────────────────────
  eduRow: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "baseline",
    flexWrap:       "wrap",
    gap:            "2px 8px",
    marginBottom:   "1px",
  },
  eduDegree: {
    fontFamily:  T.fontHead,
    fontSize:    "12.5px",
    fontWeight:  700,
    color:       T.black,
    margin:      0,
    letterSpacing: "-0.01em",
  },
  eduInstitution: {
    fontSize:   T.szSmall,
    color:      T.mid,
    fontWeight: 500,
    margin:     "0 0 2px",
  },
  eduMeta: {
    fontSize:   T.szSmall,
    color:      T.light,
    marginTop:  "2px",
  },

  // ── Skills ────────────────────────────────────────────────────────────────
  skillFlatRow: {
    display:    "flex",
    flexWrap:   "wrap",
    gap:        "6px 0",
    marginTop:  "6px",
    fontSize:   T.szBody,
    color:      T.charcoal,
  },
  skillSep: {
    margin:    "0 10px",
    color:     T.rule,
    userSelect: "none",
  },
  skillGroupWrap: {
    display:        "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap:            "10px 20px",
    marginTop:      "8px",
  },
  skillGroupLabel: {
    fontFamily:  T.fontHead,
    fontSize:    T.szSmall,
    fontWeight:  700,
    color:       T.black,
    letterSpacing: "0.04em",
    marginBottom: "4px",
    textTransform: "uppercase",
  },
  skillGroupItems: {
    fontSize:   T.szBody,
    color:      T.charcoal,
    lineHeight: 1.7,
  },

  // ── Certifications ────────────────────────────────────────────────────────
  certItem: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "baseline",
    flexWrap:       "wrap",
    gap:            "2px 12px",
    marginBottom:   "6px",
    fontSize:       T.szBody,
  },
  certName: {
    color:      T.charcoal,
    fontWeight: 600,
  },
  certMeta: {
    fontSize:   T.szSmall,
    color:      T.light,
    whiteSpace: "nowrap",
  },

  // ── Languages ─────────────────────────────────────────────────────────────
  langRow: {
    display:    "flex",
    flexWrap:   "wrap",
    gap:        "0",
    marginTop:  "6px",
    fontSize:   T.szBody,
    color:      T.charcoal,
  },

  // ── Achievements ──────────────────────────────────────────────────────────
  achieveItem: {
    color:        T.charcoal,
    marginBottom: "4px",
    fontSize:     T.szBody,
    lineHeight:   T.lineHeight,
    paddingLeft:  "0",
  },
};

// ─── Print stylesheet ─────────────────────────────────────────────────────────
const PRINT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Inter:wght@400;500&display=swap');

@media print {
  @page { size: A4; margin: 0; }
  body  { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .minimal-resume-page {
    width: 210mm !important;
    min-height: 297mm !important;
    padding: 38px 48px !important;
    margin: 0 !important;
    box-shadow: none !important;
    page-break-after: always;
  }
  a { color: inherit !important; text-decoration: none !important; }
  .page-break-avoid { break-inside: avoid; page-break-inside: avoid; }
}
@media screen {
  .minimal-resume-page {
    box-shadow: 0 2px 40px rgba(0,0,0,0.08);
  }
}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const clean = (url = "") => url.replace(/^https?:\/\/(www\.)?/i, "");

const BulletList = ({ text, bullets }) => {
  // Support both a pre-split bullets array and a \n-separated responsibilities string
  const items = Array.isArray(bullets) && bullets.length > 0
    ? bullets
    : typeof text === "string"
      ? text.split("\n").filter(Boolean)
      : [];
  if (!items.length) return null;
  return (
    <ul style={S.bulletList}>
      {items.map((b, i) => (
        <li key={i} style={S.bulletItem}>
          <span style={S.bulletDash} aria-hidden="true">—</span>
          {b}
        </li>
      ))}
    </ul>
  );
};

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
  <section style={S.section} className="page-break-avoid">
    <h2 style={S.sectionHead}>{title}</h2>
    {children}
  </section>
);

// ─── Header ───────────────────────────────────────────────────────────────────
const Header = ({ personal }) => {
  if (!personal) return null;
  const { fullName, title, email, phone, location, linkedin, github, portfolio } = personal;

  const contacts = [
    email     && { label: email,           href: `mailto:${email}` },
    phone     && { label: phone,           href: `tel:${phone}` },
    location  && { label: location,        href: null },
    linkedin  && { label: clean(linkedin), href: linkedin },
    github    && { label: clean(github),   href: github },
    portfolio && { label: clean(portfolio),href: portfolio },
  ].filter(Boolean);

  return (
    <header style={S.header}>
      {fullName && <h1 style={S.name}>{fullName}</h1>}
      {title    && <p  style={S.tagline}>{title}</p>}
      {contacts.length > 0 && (
        <div style={S.contactRow}>
          {contacts.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={S.contactSep} aria-hidden="true">/</span>}
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
  );
};

// ─── Experience ───────────────────────────────────────────────────────────────
const Experience = ({ experience }) => {
  if (!experience?.length) return null;
  return (
    <Section title="Experience">
      {experience.map((job, i) => (
        <div key={i} style={S.itemBlock} className="page-break-avoid">
          <div style={S.itemRow}>
            <h3 style={S.itemTitle}>{job.role || job.position || job.title}</h3>
            <span style={S.itemMeta}>
              {[job.startDate, job.endDate || "Present"].filter(Boolean).join(" – ")}
            </span>
          </div>
          <p style={S.itemSub}>{[job.company, job.location].filter(Boolean).join("  ·  ")}</p>
          <BulletList text={job.responsibilities} bullets={job.bullets} />
          {!job.responsibilities && !job.bullets && job.description && (
            <p style={S.descText}>{job.description}</p>
          )}
        </div>
      ))}
    </Section>
  );
};

// ─── Projects ─────────────────────────────────────────────────────────────────
const Projects = ({ projects }) => {
  if (!projects?.length) return null;
  return (
    <Section title="Projects">
      {projects.map((proj, i) => (
        <div key={i} style={S.itemBlock} className="page-break-avoid">
          <div style={S.itemRow}>
            <h3 style={S.itemTitle}>{proj.title || proj.name}</h3>
          </div>
          {(proj.technologies || proj.techStack) && (
            <p style={S.techLine}>
              {proj.technologies
                ? proj.technologies
                : Array.isArray(proj.techStack) ? proj.techStack.join(", ") : proj.techStack}
            </p>
          )}
          {proj.description && <p style={S.descText}>{proj.description}</p>}
          {(proj.github || proj.demo || proj.url) && (
            <div style={S.projectLinks}>
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
              {!proj.github && !proj.demo && proj.url && (
                <a href={proj.url} style={S.projectLink} target="_blank" rel="noreferrer">
                  {clean(proj.url)}
                </a>
              )}
            </div>
          )}
        </div>
      ))}
    </Section>
  );
};

// ─── Education ────────────────────────────────────────────────────────────────
const Education = ({ education }) => {
  if (!education?.length) return null;
  return (
    <Section title="Education">
      {education.map((edu, i) => (
        <div key={i} style={S.itemBlock} className="page-break-avoid">
          <div style={S.eduRow}>
            <h3 style={S.eduDegree}>
              {[edu.degree, edu.field].filter(Boolean).join(", ")}
            </h3>
            <span style={S.itemMeta}>
              {[edu.startYear || edu.startDate, edu.endYear || edu.endDate || "Present"]
                .filter(Boolean).join(" – ")}
            </span>
          </div>
          <p style={S.eduInstitution}>
            {[edu.college, edu.university].filter(Boolean).join(", ")}
          </p>
          {(edu.cgpa || edu.gpa) && (
            <p style={S.eduMeta}>CGPA {edu.cgpa || edu.gpa}</p>
          )}
        </div>
      ))}
    </Section>
  );
};

// ─── Skills ───────────────────────────────────────────────────────────────────
const Skills = ({ skills }) => {
  if (!skills?.length) return null;
  const isCategorised = typeof skills[0] === "object" && (skills[0].category || skills[0].name);

  return (
    <Section title="Skills">
      {isCategorised ? (
        <div style={S.skillGroupWrap}>
          {skills.map((group, i) => (
            <div key={i}>
              <div style={S.skillGroupLabel}>{group.category || group.name}</div>
              <div style={S.skillGroupItems}>
                {(group.items || group.skills || []).join("  ·  ")}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={S.skillFlatRow}>
          {skills.map((sk, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={S.skillSep} aria-hidden="true">/</span>}
              <span>{sk}</span>
            </React.Fragment>
          ))}
        </div>
      )}
    </Section>
  );
};

// ─── Certifications ───────────────────────────────────────────────────────────
const Certifications = ({ certifications }) => {
  if (!certifications?.length) return null;
  return (
    <Section title="Certifications">
      {certifications.map((cert, i) => {
        if (typeof cert === "string") {
          return <p key={i} style={{ ...S.certItem, display: "block" }}>{cert}</p>;
        }
        return (
          <div key={i} style={S.certItem}>
            <span style={S.certName}>{cert.name}</span>
            <span style={S.certMeta}>
              {[cert.organization || cert.issuer, cert.year || cert.date]
                .filter(Boolean).join("  ·  ")}
            </span>
          </div>
        );
      })}
    </Section>
  );
};

// ─── Languages ────────────────────────────────────────────────────────────────
const Languages = ({ languages }) => {
  if (!languages?.length) return null;
  return (
    <Section title="Languages">
      <div style={S.langRow}>
        {languages.map((lang, i) => {
          const label = typeof lang === "string"
            ? lang
            : [lang.language || lang.name, lang.proficiency || lang.level]
                .filter(Boolean).join(" – ");
          return (
            <React.Fragment key={i}>
              {i > 0 && <span style={S.skillSep} aria-hidden="true">/</span>}
              <span>{label}</span>
            </React.Fragment>
          );
        })}
      </div>
    </Section>
  );
};

// ─── Achievements ─────────────────────────────────────────────────────────────
const Achievements = ({ achievements }) => {
  if (!achievements?.length) return null;
  return (
    <Section title="Achievements">
      {achievements.map((ach, i) => {
        const label = typeof ach === "string"
          ? ach
          : [ach.title || ach.achievement, ach.year || ach.date].filter(Boolean).join("  ·  ");
        return <p key={i} style={S.achieveItem}>— {label}</p>;
      })}
    </Section>
  );
};

// ─── Root Component ───────────────────────────────────────────────────────────
const MinimalTemplate = ({ resume = {} }) => {
  const {
    personal = {},
    skills         = [],
    experience     = [],
    projects       = [],
    education      = [],
    certifications = [],
    languages      = [],
    achievements   = [],
  } = resume;

  const summary = personal.summary || resume.summary || "";

  return (
    <>
      <style>{PRINT_CSS}</style>
      <article className="minimal-resume-page" style={S.page}>
        <Header personal={personal} />

        {summary && (
          <Section title="Summary">
            <p style={S.summaryText}>{summary}</p>
          </Section>
        )}

        <Experience   experience={experience} />
        <Projects     projects={projects} />
        <Education    education={education} />
        <Skills       skills={skills} />
        <Certifications certifications={certifications} />
        <Languages    languages={languages} />
        <Achievements achievements={achievements} />
      </article>
    </>
  );
};

export default MinimalTemplate;