/**
 * ProfessionalTemplate.jsx
 * ResumeAI – AI Resume Builder & ATS Checker
 * Corporate single-column ATS-optimised resume template.
 * All data driven via `resume` prop (PostgreSQL shape).
 */

import React from "react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const tokens = {
  color: {
    ink:       "#111111",
    heading:   "#000000",
    accent:    "#1A1A2E",
    muted:     "#555555",
    divider:   "#CCCCCC",
    bg:        "#FFFFFF",
    tag:       "#F0F0F0",
    tagText:   "#333333",
  },
  font: {
    serif:  "'Georgia', 'Times New Roman', serif",
    sans:   "'Arial', 'Helvetica Neue', Helvetica, sans-serif",
  },
  size: {
    name:        "26px",
    sectionHead: "11px",
    jobTitle:    "14px",
    body:        "12px",
    small:       "10.5px",
  },
  spacing: {
    pagePad:     "36px 44px",
    sectionGap:  "18px",
    itemGap:     "12px",
    lineHeight:  "1.55",
  },
};

// ─── Inline Styles ────────────────────────────────────────────────────────────
const styles = {
  page: {
    background:    tokens.color.bg,
    color:         tokens.color.ink,
    fontFamily:    tokens.font.sans,
    fontSize:      tokens.size.body,
    lineHeight:    tokens.spacing.lineHeight,
    width:         "210mm",
    minHeight:     "297mm",
    margin:        "0 auto",
    padding:       tokens.spacing.pagePad,
    boxSizing:     "border-box",
    WebkitPrintColorAdjust: "exact",
    printColorAdjust:       "exact",
  },

  header: {
    textAlign:    "center",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: `2px solid ${tokens.color.accent}`,
  },
  name: {
    fontFamily:   tokens.font.serif,
    fontSize:     tokens.size.name,
    fontWeight:   "700",
    color:        tokens.color.heading,
    letterSpacing: "0.04em",
    margin:       "0 0 6px",
    textTransform: "uppercase",
  },
  tagline: {
    fontSize:     "13px",
    color:        tokens.color.muted,
    fontStyle:    "italic",
    margin:       "0 0 10px",
  },
  contactRow: {
    display:      "flex",
    justifyContent: "center",
    flexWrap:     "wrap",
    gap:          "0 16px",
    fontSize:     tokens.size.small,
    color:        tokens.color.muted,
  },
  contactItem: {
    whiteSpace:   "nowrap",
  },
  contactLink: {
    color:        tokens.color.muted,
    textDecoration: "none",
  },

  section: {
    marginBottom: tokens.spacing.sectionGap,
  },
  sectionHead: {
    fontFamily:     tokens.font.sans,
    fontSize:       tokens.size.sectionHead,
    fontWeight:     "700",
    color:          tokens.color.heading,
    letterSpacing:  "0.12em",
    textTransform:  "uppercase",
    margin:         "0 0 6px",
    paddingBottom:  "4px",
    borderBottom:   `1px solid ${tokens.color.divider}`,
  },

  summaryText: {
    margin:  "6px 0 0",
    color:   tokens.color.ink,
  },

  itemBlock: {
    marginBottom: tokens.spacing.itemGap,
  },
  itemHeader: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "baseline",
    flexWrap:       "wrap",
    gap:            "2px 8px",
  },
  itemTitle: {
    fontFamily:  tokens.font.sans,
    fontSize:    tokens.size.jobTitle,
    fontWeight:  "700",
    color:       tokens.color.heading,
    margin:      "0",
  },
  itemMeta: {
    fontSize:  tokens.size.small,
    color:     tokens.color.muted,
    whiteSpace: "nowrap",
  },
  itemSubtitle: {
    fontSize:    tokens.size.body,
    fontWeight:  "600",
    color:       tokens.color.muted,
    margin:      "1px 0 4px",
  },
  bulletList: {
    margin:     "4px 0 0",
    paddingLeft: "18px",
  },
  bulletItem: {
    marginBottom: "2px",
    color:  tokens.color.ink,
  },
  descriptionText: {
    margin: "4px 0 0",
    color:  tokens.color.ink,
  },

  eduHeader: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "baseline",
    flexWrap:       "wrap",
    gap:            "2px 8px",
  },
  eduDegree: {
    fontSize:    tokens.size.jobTitle,
    fontWeight:  "700",
    color:       tokens.color.heading,
    margin:      "0",
  },
  eduInstitution: {
    fontSize:    tokens.size.body,
    fontWeight:  "600",
    color:       tokens.color.muted,
    margin:      "1px 0 0",
  },

  skillsGrid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap:                 "10px 16px",
    marginTop:           "6px",
  },
  skillCategory: {
    marginBottom: "2px",
  },
  skillCategoryName: {
    fontWeight: "700",
    fontSize:   tokens.size.small,
    color:      tokens.color.heading,
    marginBottom: "3px",
    display:    "block",
  },
  skillTagRow: {
    display:  "flex",
    flexWrap: "wrap",
    gap:      "3px",
  },
  skillTag: {
    background:   tokens.color.tag,
    color:        tokens.color.tagText,
    fontSize:     tokens.size.small,
    padding:      "2px 7px",
    borderRadius: "2px",
    whiteSpace:   "nowrap",
  },
  skillFlatRow: {
    display:   "flex",
    flexWrap:  "wrap",
    gap:       "4px",
    marginTop: "6px",
  },

  inlineList: {
    margin:      "6px 0 0",
    paddingLeft: "18px",
  },
  inlineItem: {
    marginBottom: "3px",
    color:        tokens.color.ink,
  },
  achievementItem: {
    marginBottom: "3px",
  },
};

// ─── Print + Responsive stylesheet ────────────────────────────────────────────
const PRINT_CSS = `
/* ── Mobile: fluid single column ── */
@media screen and (max-width: 680px) {
  .resume-page {
    width: 100% !important;
    min-height: unset !important;
    padding: 20px 16px !important;
    box-shadow: none !important;
  }
  .resume-contact-row {
    flex-direction: column !important;
    align-items: center !important;
    gap: 4px !important;
  }
  .resume-contact-dot {
    display: none !important;
  }
  .resume-item-header,
  .resume-edu-header {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 2px !important;
  }
  .resume-item-meta {
    white-space: normal !important;
  }
  .resume-skills-grid {
    grid-template-columns: 1fr 1fr !important;
  }
  .resume-name {
    font-size: 20px !important;
    letter-spacing: 0.02em !important;
  }
}

/* ── Tablet: shrink padding, constrain width ── */
@media screen and (min-width: 681px) and (max-width: 900px) {
  .resume-page {
    width: 100% !important;
    min-height: unset !important;
    padding: 28px 32px !important;
  }
}

/* ── Screen shadow (desktop only) ── */
@media screen and (min-width: 901px) {
  .resume-page {
    box-shadow: 0 2px 32px rgba(0,0,0,0.10);
  }
}

/* ── Print: true A4 ── */
@media print {
  @page {
    size: A4;
    margin: 0;
  }
  body {
    margin: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .resume-page {
    width: 210mm !important;
    min-height: 297mm !important;
    padding: 28px 36px !important;
    margin: 0 !important;
    box-shadow: none !important;
    page-break-after: always;
  }
  a { color: inherit !important; text-decoration: none !important; }
}
`;

// ─── Helper components ────────────────────────────────────────────────────────
const SectionHeading = ({ children }) => (
  <h2 style={styles.sectionHead}>{children}</h2>
);

const Dot = () => (
  <span className="resume-contact-dot" style={{ margin: "0 4px", color: "#999" }}>·</span>
);

// ─── Section: Personal Info / Header ─────────────────────────────────────────
const HeaderSection = ({ info }) => {
  if (!info) return null;
  const {
    firstName, lastName, fullName,
    title, email, phone, location,
    linkedin, github, website, portfolio,
  } = info;

  const displayName = fullName || [firstName, lastName].filter(Boolean).join(" ");

  const links = [
    email     && { label: email,                                           href: `mailto:${email}` },
    phone     && { label: phone,                                           href: `tel:${phone}` },
    location  && { label: location,                                        href: null },
    linkedin  && { label: linkedin.replace(/^https?:\/\/(www\.)?/i, ""),  href: linkedin },
    github    && { label: github.replace(/^https?:\/\/(www\.)?/i, ""),    href: github },
    website   && { label: website.replace(/^https?:\/\/(www\.)?/i, ""),   href: website },
    portfolio && { label: portfolio.replace(/^https?:\/\/(www\.)?/i, ""), href: portfolio },
  ].filter(Boolean);

  return (
    <header style={styles.header}>
      {displayName && <h1 className="resume-name" style={styles.name}>{displayName}</h1>}
      {title       && <p style={styles.tagline}>{title}</p>}
      {links.length > 0 && (
        <div className="resume-contact-row" style={styles.contactRow}>
          {links.map((l, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Dot />}
              <span className="resume-contact-item" style={styles.contactItem}>
                {l.href
                  ? <a href={l.href} style={styles.contactLink}>{l.label}</a>
                  : l.label
                }
              </span>
            </React.Fragment>
          ))}
        </div>
      )}
    </header>
  );
};

// ─── Section: Summary ─────────────────────────────────────────────────────────
const SummarySection = ({ summary }) => {
  if (!summary) return null;
  return (
    <section style={styles.section}>
      <SectionHeading>Professional Summary</SectionHeading>
      <p style={styles.summaryText}>{summary}</p>
    </section>
  );
};

// ─── Section: Experience ──────────────────────────────────────────────────────
const ExperienceSection = ({ experience }) => {
  if (!experience?.length) return null;
  return (
    <section style={styles.section}>
      <SectionHeading>Experience</SectionHeading>
      {experience.map((job, i) => (
        <div key={i} style={styles.itemBlock}>
          <div className="resume-item-header" style={styles.itemHeader}>
            <h3 style={styles.itemTitle}>{job.title || job.position || job.role}</h3>
            <span className="resume-item-meta" style={styles.itemMeta}>
              {[job.startDate, job.endDate || "Present"].filter(Boolean).join(" – ")}
            </span>
          </div>
          <p style={styles.itemSubtitle}>
            {[job.company, job.location].filter(Boolean).join("  ·  ")}
          </p>
          {Array.isArray(job.bullets) && job.bullets.length > 0 ? (
            <ul style={styles.bulletList}>
              {job.bullets.map((b, j) => (
                <li key={j} style={styles.bulletItem}>{b}</li>
              ))}
            </ul>
          ) : job.responsibilities ? (
            <ul style={styles.bulletList}>
              {job.responsibilities.split("\n").filter(Boolean).map((b, j) => (
                <li key={j} style={styles.bulletItem}>{b}</li>
              ))}
            </ul>
          ) : job.description ? (
            <p style={styles.descriptionText}>{job.description}</p>
          ) : null}
        </div>
      ))}
    </section>
  );
};

// ─── Section: Projects ────────────────────────────────────────────────────────
const ProjectsSection = ({ projects }) => {
  if (!projects?.length) return null;
  return (
    <section style={styles.section}>
      <SectionHeading>Projects</SectionHeading>
      {projects.map((proj, i) => (
        <div key={i} style={styles.itemBlock}>
          <div className="resume-item-header" style={styles.itemHeader}>
            <h3 style={styles.itemTitle}>
              {proj.demo || proj.github || proj.url
                ? <a href={proj.demo || proj.github || proj.url} style={{ color: tokens.color.heading, textDecoration: "none" }}>
                    {proj.title || proj.name}
                  </a>
                : proj.title || proj.name
              }
            </h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {proj.github && (
                <a href={proj.github} style={{ ...styles.itemMeta, color: tokens.color.muted, textDecoration: "none" }}>
                  {proj.github.replace(/^https?:\/\/(www\.)?github\.com\//, "github.com/")}
                </a>
              )}
              {proj.demo && (
                <a href={proj.demo} style={{ ...styles.itemMeta, color: tokens.color.muted, textDecoration: "none" }}>
                  {proj.demo}
                </a>
              )}
            </div>
          </div>

          {(proj.technologies || proj.techStack) && (
            <p style={{ ...styles.itemSubtitle, fontStyle: "italic" }}>
              {proj.technologies
                ? proj.technologies
                : Array.isArray(proj.techStack) ? proj.techStack.join(", ") : proj.techStack}
            </p>
          )}

          {Array.isArray(proj.bullets) && proj.bullets.length > 0 ? (
            <ul style={styles.bulletList}>
              {proj.bullets.map((b, j) => <li key={j} style={styles.bulletItem}>{b}</li>)}
            </ul>
          ) : proj.description ? (
            <p style={styles.descriptionText}>{proj.description}</p>
          ) : null}
        </div>
      ))}
    </section>
  );
};

// ─── Section: Education ───────────────────────────────────────────────────────
const EducationSection = ({ education }) => {
  if (!education?.length) return null;
  return (
    <section style={styles.section}>
      <SectionHeading>Education</SectionHeading>
      {education.map((edu, i) => (
        <div key={i} style={styles.itemBlock}>
          <div className="resume-edu-header" style={styles.eduHeader}>
            <h3 style={styles.eduDegree}>
              {[edu.degree, edu.field].filter(Boolean).join(", ")}
            </h3>
            <span className="resume-item-meta" style={styles.itemMeta}>
              {[edu.startYear || edu.startDate, edu.endYear || edu.endDate || "Present"]
                .filter(Boolean).join(" – ")}
            </span>
          </div>
          <p style={styles.eduInstitution}>
            {[edu.college, edu.university].filter(Boolean).join(", ")}
          </p>
          {(edu.cgpa || edu.gpa) && (
            <p style={{ ...styles.descriptionText, fontSize: tokens.size.small }}>
              CGPA: {edu.cgpa || edu.gpa}
            </p>
          )}
          {edu.honors && (
            <p style={{ ...styles.descriptionText, fontSize: tokens.size.small }}>
              {edu.honors}
            </p>
          )}
        </div>
      ))}
    </section>
  );
};

// ─── Section: Skills ──────────────────────────────────────────────────────────
const SkillsSection = ({ skills }) => {
  if (!skills?.length) return null;

  const isCategorised =
    typeof skills[0] === "object" && (skills[0].category || skills[0].name);

  return (
    <section style={styles.section}>
      <SectionHeading>Skills</SectionHeading>
      {isCategorised ? (
        <div className="resume-skills-grid" style={styles.skillsGrid}>
          {skills.map((group, i) => (
            <div key={i} style={styles.skillCategory}>
              {(group.category || group.name) && (
                <span style={styles.skillCategoryName}>
                  {group.category || group.name}
                </span>
              )}
              <div style={styles.skillTagRow}>
                {(group.items || group.skills || []).map((sk, j) => (
                  <span key={j} style={styles.skillTag}>{sk}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.skillFlatRow}>
          {skills.map((sk, i) => (
            <span key={i} style={styles.skillTag}>{sk}</span>
          ))}
        </div>
      )}
    </section>
  );
};

// ─── Section: Certifications ──────────────────────────────────────────────────
const CertificationsSection = ({ certifications }) => {
  if (!certifications?.length) return null;
  return (
    <section style={styles.section}>
      <SectionHeading>Certifications</SectionHeading>
      <ul style={styles.inlineList}>
        {certifications.map((cert, i) => {
          const label = typeof cert === "string"
            ? cert
            : [cert.name, cert.organization || cert.issuer, cert.year || cert.date]
                .filter(Boolean).join("  ·  ");
          return <li key={i} style={styles.inlineItem}>{label}</li>;
        })}
      </ul>
    </section>
  );
};

// ─── Section: Languages ───────────────────────────────────────────────────────
const LanguagesSection = ({ languages }) => {
  if (!languages?.length) return null;
  return (
    <section style={styles.section}>
      <SectionHeading>Languages</SectionHeading>
      <div style={styles.skillFlatRow}>
        {languages.map((lang, i) => {
          const label = typeof lang === "string"
            ? lang
            : [lang.language || lang.name, lang.proficiency || lang.level]
                .filter(Boolean).join(" – ");
          return <span key={i} style={styles.skillTag}>{label}</span>;
        })}
      </div>
    </section>
  );
};

// ─── Section: Achievements ────────────────────────────────────────────────────
const AchievementsSection = ({ achievements }) => {
  if (!achievements?.length) return null;
  return (
    <section style={styles.section}>
      <SectionHeading>Achievements</SectionHeading>
      <ul style={styles.inlineList}>
        {achievements.map((ach, i) => {
          const label = typeof ach === "string"
            ? ach
            : [ach.title || ach.achievement, ach.year || ach.date].filter(Boolean).join("  ·  ");
          return <li key={i} style={styles.inlineItem}>{label}</li>;
        })}
      </ul>
    </section>
  );
};

// ─── Root Component ───────────────────────────────────────────────────────────
const ProfessionalTemplate = ({ resume = {} }) => {
  const {
    personal = {},
    skills,
    experience,
    projects,
    education,
    certifications,
    languages,
    achievements,
  } = resume;

  const personalInfo = {
    fullName:  personal.fullName  || "",
    title:     personal.title     || "",
    email:     personal.email     || "",
    phone:     personal.phone     || "",
    location:  personal.location  || "",
    linkedin:  personal.linkedin  || "",
    github:    personal.github    || "",
    portfolio: personal.portfolio || "",
  };

  const summary = personal.summary || "";

  return (
    <>
      <style>{PRINT_CSS}</style>

      <article className="resume-page" style={styles.page}>
        <HeaderSection         info={personalInfo} />
        <SummarySection        summary={summary} />
        <ExperienceSection     experience={experience} />
        <ProjectsSection       projects={projects} />
        <EducationSection      education={education} />
        <SkillsSection         skills={skills} />
        <CertificationsSection certifications={certifications} />
        <AchievementsSection   achievements={achievements} />
        <LanguagesSection      languages={languages} />
      </article>
    </>
  );
};

export default ProfessionalTemplate;
