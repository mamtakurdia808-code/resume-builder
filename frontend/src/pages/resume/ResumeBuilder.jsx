import { useState, useRef, useEffect } from "react";
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiLinkedin, FiGithub,
  FiGlobe, FiPlus, FiTrash2, FiDownload, FiEye, FiSave,
  FiRefreshCw, FiChevronDown, FiChevronUp, FiBriefcase,
  FiBook, FiAward, FiCode, FiZap, FiX, FiCheck
} from "react-icons/fi";
import {
  createResume,
  getAllResumes,
  updateResume,
  getResumeById,
} from "../../services/resumeService";

// ─── Initial State ───────────────────────────────────────────────────────────
const INITIAL_STATE = {
  personal: {
    fullName: "Alex Morgan",
    title: "Full Stack Developer",
    email: "alex.morgan@email.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmorgan",
    github: "github.com/alexmorgan",
    portfolio: "alexmorgan.dev",
    summary:
      "Passionate full-stack developer with 4+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud technologies. Strong communicator who thrives in collaborative environments and loves turning complex problems into elegant solutions.",
  },
  education: [
    {
      id: 1,
      degree: "B.Tech in Computer Science",
      college: "School of Engineering",
      university: "Stanford University",
      startYear: "2017",
      endYear: "2021",
      cgpa: "8.9 / 10",
    },
  ],
  skills: ["React", "Node.js", "TypeScript", "MongoDB", "PostgreSQL", "Docker", "AWS", "GraphQL", "Tailwind CSS", "Git"],
  projects: [
    {
      id: 1,
      title: "E-Commerce Platform",
      technologies: "React, Node.js, MongoDB, Stripe",
      description: "Built a full-featured e-commerce app with cart, payments, and admin dashboard. Achieved 98% uptime and reduced page load by 40%.",
      github: "github.com/alexmorgan/ecommerce",
      demo: "shop-demo.alexmorgan.dev",
    },
  ],
  experience: [
    {
      id: 1,
      company: "TechCorp Inc.",
      role: "Software Engineer",
      startDate: "Jun 2021",
      endDate: "Present",
      responsibilities:
        "Led migration of monolithic backend to microservices architecture. Mentored 3 junior developers. Improved API response time by 35% through query optimization.",
    },
  ],
  certifications: [
    {
      id: 1,
      name: "AWS Certified Solutions Architect",
      organization: "Amazon Web Services",
      year: "2023",
    },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const uid = () => Date.now() + Math.random();

const emptyEducation = () => ({ id: uid(), degree: "", college: "", university: "", startYear: "", endYear: "", cgpa: "" });
const emptyProject = () => ({ id: uid(), title: "", technologies: "", description: "", github: "", demo: "" });
const emptyExperience = () => ({ id: uid(), company: "", role: "", startDate: "", endDate: "", responsibilities: "" });
const emptyCertification = () => ({ id: uid(), name: "", organization: "", year: "" });

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionCard({ icon: Icon, title, color, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="section-card">
      <button
        onClick={() => setOpen(!open)}
        className="section-header"
        aria-expanded={open}
      >
        <span className="section-title-group">
          <span className={`section-icon-wrap ${color}`}>
            <Icon size={15} />
          </span>
          <span className="section-title">{title}</span>
        </span>
        {open ? <FiChevronUp size={16} className="chevron" /> : <FiChevronDown size={16} className="chevron" />}
      </button>
      {open && <div className="section-body">{children}</div>}
    </div>
  );
}

function InputField({ label, value, onChange, type = "text", placeholder, required, icon: Icon }) {
  return (
    <div className="field-wrap">
      <label className="field-label">
        {label}
        {required && <span className="required-dot">*</span>}
      </label>
      <div className="input-wrap">
        {Icon && <Icon size={14} className="input-icon" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || label}
          className={`field-input ${Icon ? "has-icon" : ""}`}
        />
      </div>
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder, required, rows = 3 }) {
  return (
    <div className="field-wrap">
      <label className="field-label">
        {label}
        {required && <span className="required-dot">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        rows={rows}
        className="field-textarea"
      />
    </div>
  );
}

function AddButton({ onClick, label }) {
  return (
    <button onClick={onClick} className="add-btn">
      <FiPlus size={14} />
      {label}
    </button>
  );
}

function RemoveButton({ onClick }) {
  return (
    <button onClick={onClick} className="remove-btn" title="Remove">
      <FiTrash2 size={14} />
    </button>
  );
}

// ─── Preview ──────────────────────────────────────────────────────────────────
function ResumePreview({ data }) {
  const { personal, education, skills, projects, experience, certifications } = data;
  return (
    <div className="preview-doc">
      {/* Header */}
      <div className="prev-header">
        <h1 className="prev-name">{personal.fullName || "Your Name"}</h1>
        {personal.title && <p className="prev-title">{personal.title}</p>}
        <div className="prev-contacts">
          {personal.email && <span><FiMail size={11} /> {personal.email}</span>}
          {personal.phone && <span><FiPhone size={11} /> {personal.phone}</span>}
          {personal.location && <span><FiMapPin size={11} /> {personal.location}</span>}
          {personal.linkedin && <span><FiLinkedin size={11} /> {personal.linkedin}</span>}
          {personal.github && <span><FiGithub size={11} /> {personal.github}</span>}
          {personal.portfolio && <span><FiGlobe size={11} /> {personal.portfolio}</span>}
        </div>
      </div>

      {personal.summary && (
        <PreviewSection title="Professional Summary">
          <p className="prev-para">{personal.summary}</p>
        </PreviewSection>
      )}

      {skills.length > 0 && (
        <PreviewSection title="Skills">
          <div className="prev-skills">
            {skills.map((s, i) => <span key={i} className="prev-skill-tag">{s}</span>)}
          </div>
        </PreviewSection>
      )}

      {experience.some(e => e.company || e.role) && (
        <PreviewSection title="Experience">
          {experience.filter(e => e.company || e.role).map((exp) => (
            <div key={exp.id} className="prev-entry">
              <div className="prev-entry-header">
                <span className="prev-entry-title">{exp.role || "Role"}</span>
                <span className="prev-entry-sub">{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ""}</span>
              </div>
              {exp.company && <p className="prev-entry-org">{exp.company}</p>}
              {exp.responsibilities && <p className="prev-para">{exp.responsibilities}</p>}
            </div>
          ))}
        </PreviewSection>
      )}

      {education.some(e => e.degree || e.university) && (
        <PreviewSection title="Education">
          {education.filter(e => e.degree || e.university).map((edu) => (
            <div key={edu.id} className="prev-entry">
              <div className="prev-entry-header">
                <span className="prev-entry-title">{edu.degree || "Degree"}</span>
                <span className="prev-entry-sub">{edu.startYear}{edu.endYear ? ` – ${edu.endYear}` : ""}</span>
              </div>
              <p className="prev-entry-org">{[edu.college, edu.university].filter(Boolean).join(", ")}</p>
              {edu.cgpa && <p className="prev-cgpa">CGPA / Score: {edu.cgpa}</p>}
            </div>
          ))}
        </PreviewSection>
      )}

      {projects.some(p => p.title) && (
        <PreviewSection title="Projects">
          {projects.filter(p => p.title).map((proj) => (
            <div key={proj.id} className="prev-entry">
              <div className="prev-entry-header">
                <span className="prev-entry-title">{proj.title}</span>
              </div>
              {proj.technologies && <p className="prev-tech">Technologies: {proj.technologies}</p>}
              {proj.description && <p className="prev-para">{proj.description}</p>}
              <div className="prev-links">
                {proj.github && <span><FiGithub size={10} /> {proj.github}</span>}
                {proj.demo && <span><FiGlobe size={10} /> {proj.demo}</span>}
              </div>
            </div>
          ))}
        </PreviewSection>
      )}

      {certifications.some(c => c.name) && (
        <PreviewSection title="Certifications">
          {certifications.filter(c => c.name).map((cert) => (
            <div key={cert.id} className="prev-cert">
              <span className="prev-entry-title">{cert.name}</span>
              <span className="prev-cert-meta">{cert.organization}{cert.year ? `, ${cert.year}` : ""}</span>
            </div>
          ))}
        </PreviewSection>
      )}
    </div>
  );
}

function PreviewSection({ title, children }) {
  return (
    <div className="prev-section">
      <h2 className="prev-section-title">{title}</h2>
      <div className="prev-section-divider" />
      {children}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{type === "success" ? <FiCheck size={14} /> : <FiZap size={14} />}</span>
      {message}
      <button onClick={onClose} className="toast-close"><FiX size={13} /></button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ResumeBuilder() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [skillInput, setSkillInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState(null);
  const previewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const [savedResumes, setSavedResumes] = useState([]);

  const notify = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updatePersonal = (key, val) =>
    setFormData(prev => ({ ...prev, personal: { ...prev.personal, [key]: val } }));

  const addEducation = () =>
    setFormData(prev => ({ ...prev, education: [...prev.education, emptyEducation()] }));
  const removeEducation = (id) =>
    setFormData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  const updateEducation = (id, key, val) =>
    setFormData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [key]: val } : e),
    }));

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || formData.skills.includes(s)) return;
    setFormData(prev => ({ ...prev, skills: [...prev.skills, s] }));
    setSkillInput("");
  };
  const removeSkill = (skill) =>
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));

  const addProject = () =>
    setFormData(prev => ({ ...prev, projects: [...prev.projects, emptyProject()] }));
  const removeProject = (id) =>
    setFormData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  const updateProject = (id, key, val) =>
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [key]: val } : p),
    }));

  const addExperience = () =>
    setFormData(prev => ({ ...prev, experience: [...prev.experience, emptyExperience()] }));
  const removeExperience = (id) =>
    setFormData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  const updateExperience = (id, key, val) =>
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, [key]: val } : e),
    }));

  const addCertification = () =>
    setFormData(prev => ({ ...prev, certifications: [...prev.certifications, emptyCertification()] }));
  const removeCertification = (id) =>
    setFormData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }));
  const updateCertification = (id, key, val) =>
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === id ? { ...c, [key]: val } : c),
    }));

  const fetchResumes = async () => {
    try {
      const response = await getAllResumes();
      setSavedResumes(response.data.resumes);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        title: formData.personal?.fullName || "Untitled Resume",
        resume_data: formData,
      };
      let response;
      if (resumeId) {
        response = await updateResume(resumeId, payload);
      } else {
        response = await createResume(payload);
        if (response.data.resume?.id) {
          setResumeId(response.data.resume.id);
        }
      }
      await fetchResumes();
      notify("Resume saved successfully!", "success");
    } catch (error) {
      console.error(error);
      notify(error.response?.data?.message || "Failed to save resume", "info");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => { setFormData(INITIAL_STATE); notify("Form cleared.", "info"); };
  const handleDownload = () => notify("PDF download coming soon!", "info");

  return (
    <>
      <style>{CSS}</style>
      <div className="app-root">
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-brand">
            <span className="topbar-logo"><FiZap size={16} /></span>
            <span className="topbar-name">Resume Builder</span>
          </div>
          <div className="topbar-actions">
            <button onClick={handleSave} className="btn btn-ghost"><FiSave size={14} /> Save</button>
            <button onClick={handleClear} className="btn btn-ghost"><FiRefreshCw size={14} /> Clear</button>
            <button onClick={handleDownload} className="btn btn-accent"><FiDownload size={14} /> Download PDF</button>
            <button onClick={() => setShowPreview(!showPreview)} className="btn btn-outline preview-toggle">
              <FiEye size={14} /> {showPreview ? "Edit" : "Preview"}
            </button>
          </div>
        </header>

        {/* Main Layout */}
        <div className={`main-layout ${showPreview ? "preview-mode" : ""}`}>
          {/* ── FORM PANEL ── */}
          <div className={`form-panel ${showPreview ? "hidden-mobile" : ""}`}>
            <div className="panel-scroll">

              <SectionCard icon={FiSave} title="Saved Resumes" color="color-indigo">
                {savedResumes.length === 0 ? (
                  <p className="empty-hint">No resumes found.</p>
                ) : (
                  <div className="skill-chips">
                    {savedResumes.map((resume) => (
                      <button
                        key={resume.id}
                        className="skill-chip"
                        onClick={async () => {
                          try {
                            const data = await getResumeById(resume.id);
                            if (data.success) {
                              setFormData(data.resume.resume_data);
                              setResumeId(data.resume.id);
                            }
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                      >
                        {resume.title}
                      </button>
                    ))}
                  </div>
                )}
              </SectionCard>

              <SectionCard icon={FiUser} title="Personal Information" color="color-indigo">
                <div className="grid-2">
                  <InputField label="Full Name" value={formData.personal.fullName} onChange={v => updatePersonal("fullName", v)} required icon={FiUser} />
                  <InputField label="Professional Title" value={formData.personal.title} onChange={v => updatePersonal("title", v)} icon={FiBriefcase} />
                  <InputField label="Email" value={formData.personal.email} onChange={v => updatePersonal("email", v)} type="email" required icon={FiMail} />
                  <InputField label="Phone" value={formData.personal.phone} onChange={v => updatePersonal("phone", v)} icon={FiPhone} />
                  <InputField label="Location" value={formData.personal.location} onChange={v => updatePersonal("location", v)} icon={FiMapPin} />
                  <InputField label="LinkedIn URL" value={formData.personal.linkedin} onChange={v => updatePersonal("linkedin", v)} icon={FiLinkedin} />
                  <InputField label="GitHub URL" value={formData.personal.github} onChange={v => updatePersonal("github", v)} icon={FiGithub} />
                  <InputField label="Portfolio URL" value={formData.personal.portfolio} onChange={v => updatePersonal("portfolio", v)} icon={FiGlobe} />
                </div>
                <TextAreaField label="Professional Summary" value={formData.personal.summary} onChange={v => updatePersonal("summary", v)} rows={4} placeholder="Write a short professional summary..." />
              </SectionCard>

              <SectionCard icon={FiBook} title="Education" color="color-violet">
                {formData.education.map((edu, idx) => (
                  <div key={edu.id} className="dynamic-entry">
                    <div className="entry-header">
                      <span className="entry-label">Education {idx + 1}</span>
                      {formData.education.length > 1 && <RemoveButton onClick={() => removeEducation(edu.id)} />}
                    </div>
                    <div className="grid-2">
                      <InputField label="Degree" value={edu.degree} onChange={v => updateEducation(edu.id, "degree", v)} required />
                      <InputField label="CGPA / Percentage" value={edu.cgpa} onChange={v => updateEducation(edu.id, "cgpa", v)} />
                      <InputField label="College / School" value={edu.college} onChange={v => updateEducation(edu.id, "college", v)} />
                      <InputField label="University" value={edu.university} onChange={v => updateEducation(edu.id, "university", v)} />
                      <InputField label="Start Year" value={edu.startYear} onChange={v => updateEducation(edu.id, "startYear", v)} placeholder="2019" />
                      <InputField label="End Year" value={edu.endYear} onChange={v => updateEducation(edu.id, "endYear", v)} placeholder="2023" />
                    </div>
                  </div>
                ))}
                <AddButton onClick={addEducation} label="Add Education" />
              </SectionCard>

              <SectionCard icon={FiZap} title="Skills" color="color-emerald">
                <div className="skill-input-row">
                  <input
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addSkill()}
                    placeholder="Type a skill and press Enter…"
                    className="field-input skill-input"
                  />
                  <button onClick={addSkill} className="btn btn-accent skill-add-btn"><FiPlus size={15} /></button>
                </div>
                <div className="skill-chips">
                  {formData.skills.map((skill, i) => (
                    <span key={i} className="skill-chip">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="chip-remove"><FiX size={11} /></button>
                    </span>
                  ))}
                  {formData.skills.length === 0 && <p className="empty-hint">No skills added yet.</p>}
                </div>
              </SectionCard>

              <SectionCard icon={FiCode} title="Projects" color="color-amber">
                {formData.projects.map((proj, idx) => (
                  <div key={proj.id} className="dynamic-entry">
                    <div className="entry-header">
                      <span className="entry-label">Project {idx + 1}</span>
                      {formData.projects.length > 1 && <RemoveButton onClick={() => removeProject(proj.id)} />}
                    </div>
                    <div className="grid-2">
                      <InputField label="Project Title" value={proj.title} onChange={v => updateProject(proj.id, "title", v)} required />
                      <InputField label="Technologies Used" value={proj.technologies} onChange={v => updateProject(proj.id, "technologies", v)} />
                      <InputField label="GitHub Link" value={proj.github} onChange={v => updateProject(proj.id, "github", v)} icon={FiGithub} />
                      <InputField label="Live Demo Link" value={proj.demo} onChange={v => updateProject(proj.id, "demo", v)} icon={FiGlobe} />
                    </div>
                    <TextAreaField label="Description" value={proj.description} onChange={v => updateProject(proj.id, "description", v)} rows={3} />
                  </div>
                ))}
                <AddButton onClick={addProject} label="Add Project" />
              </SectionCard>

              <SectionCard icon={FiBriefcase} title="Experience" color="color-blue">
                {formData.experience.map((exp, idx) => (
                  <div key={exp.id} className="dynamic-entry">
                    <div className="entry-header">
                      <span className="entry-label">Experience {idx + 1}</span>
                      {formData.experience.length > 1 && <RemoveButton onClick={() => removeExperience(exp.id)} />}
                    </div>
                    <div className="grid-2">
                      <InputField label="Company Name" value={exp.company} onChange={v => updateExperience(exp.id, "company", v)} required icon={FiBriefcase} />
                      <InputField label="Role / Position" value={exp.role} onChange={v => updateExperience(exp.id, "role", v)} required />
                      <InputField label="Start Date" value={exp.startDate} onChange={v => updateExperience(exp.id, "startDate", v)} placeholder="Jun 2021" />
                      <InputField label="End Date" value={exp.endDate} onChange={v => updateExperience(exp.id, "endDate", v)} placeholder="Present" />
                    </div>
                    <TextAreaField label="Responsibilities" value={exp.responsibilities} onChange={v => updateExperience(exp.id, "responsibilities", v)} rows={3} />
                  </div>
                ))}
                <AddButton onClick={addExperience} label="Add Experience" />
              </SectionCard>

              <SectionCard icon={FiAward} title="Certifications" color="color-rose">
                {formData.certifications.map((cert, idx) => (
                  <div key={cert.id} className="dynamic-entry">
                    <div className="entry-header">
                      <span className="entry-label">Certification {idx + 1}</span>
                      {formData.certifications.length > 1 && <RemoveButton onClick={() => removeCertification(cert.id)} />}
                    </div>
                    <div className="grid-3">
                      <InputField label="Certification Name" value={cert.name} onChange={v => updateCertification(cert.id, "name", v)} required />
                      <InputField label="Issuing Organization" value={cert.organization} onChange={v => updateCertification(cert.id, "organization", v)} />
                      <InputField label="Year" value={cert.year} onChange={v => updateCertification(cert.id, "year", v)} placeholder="2024" />
                    </div>
                  </div>
                ))}
                <AddButton onClick={addCertification} label="Add Certification" />
              </SectionCard>

              <div className="form-footer-btns">
                <button onClick={handleSave} className="btn btn-accent full-btn" disabled={loading}>
                  <FiSave size={14} />
                  {loading ? "Saving..." : "Save Resume"}
                </button>
                <button onClick={handleDownload} className="btn btn-outline full-btn"><FiDownload size={15} /> Download PDF</button>
                <button onClick={handleClear} className="btn btn-ghost full-btn"><FiRefreshCw size={15} /> Clear Form</button>
              </div>
            </div>
          </div>

          {/* ── PREVIEW PANEL ── */}
          <div ref={previewRef} className={`preview-panel ${!showPreview ? "hidden-mobile" : ""}`}>
            <div className="preview-sticky">
              <div className="preview-label">
                <FiEye size={13} /> Live Preview
              </div>
              <div className="preview-scroll">
                <ResumePreview data={formData} />
              </div>
            </div>
          </div>
        </div>

        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  /* Premium SaaS Layout Color Tokens */
  --bg: #F8FAFC;
  --surface: #FFFFFF;
  --surface2: #F1F5F9;
  --border: #E2E8F0;
  --border-hover: #CBD5E1;
  --text-primary: #111827;
  --text-secondary: #475569;
  --text-muted: #64748B;
  
  /* Unified Branding Brand: Primary Teal (Pure Light System) */
  --accent: #0D9488;
  --accent-soft: #F0FDFA;
  --accent-soft-border: #99F6E4;
  --accent-hover: #0F766E;
  
  /* Auxiliary Semantic Colors */
  --emerald: #10B981;
  --emerald-soft: #ECFDF5;
  --amber: #F59E0B;
  --amber-soft: #FFFBEB;
  --blue: #0D9488;
  --blue-soft: #F0FDFA;
  --rose: #EF4444;
  --rose-soft: #FEF2F2;
  --red: #EF4444;
  --red-soft: #FEF2F2;
  
  /* Radii & Micro-shadow Structural Properties */
  --radius: 16px;
  --radius-sm: 10px;
  --shadow: 0 1px 3px rgba(15,23,42,0.03);
  --shadow-md: 0 8px 24px rgba(15,23,42,0.06);
  --topbar-h: 64px;
  
  /* High-end SaaS Typography System */
  --font: 'DM Sans', sans-serif;
  --font-brand: 'Syne', sans-serif;
  --transition: all 0.2s ease;
}

body { font-family: var(--font); background: var(--bg); color: var(--text-primary); -webkit-font-smoothing: antialiased; }

.app-root { min-height: 100vh; display: flex; flex-direction: column; background: var(--bg); }

/* ── Topbar ── */
.topbar {
  height: var(--topbar-h);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 10;
  gap: 12px;
}
.topbar-brand { display: flex; align-items: center; gap: 10px; }
.topbar-logo {
  width: 32px; height: 32px;
  background: var(--accent);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: #ffffff;
}
.topbar-name { font-family: var(--font-brand); font-size: 16px; font-weight: 700; letter-spacing: -0.02em; color: var(--text-primary); }
.topbar-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

/* ── Buttons ── */
.btn {
  display: flex; align-items: center; gap: 6px;
  font-family: var(--font); font-size: 13.5px; font-weight: 600;
  padding: 8px 16px; border-radius: var(--radius-sm);
  cursor: pointer; border: 1px solid transparent; transition: var(--transition);
  white-space: nowrap;
}
.btn-accent { background: var(--accent); color: #ffffff; box-shadow: 0 2px 8px rgba(13,148,136,0.16); }
.btn-accent:hover { background: var(--accent-hover); transform: translateY(-1px); }
.btn-outline { background: var(--surface); color: var(--text-secondary); border: 1px solid var(--border); }
.btn-outline:hover { background: var(--surface2); color: var(--text-primary); border-color: var(--border-hover); }
.btn-ghost { background: transparent; color: var(--text-secondary); }
.btn-ghost:hover { background: var(--accent-soft); color: var(--accent); }
.full-btn { width: 100%; justify-content: center; padding: 11px; }

/* ── Main Production Layout ── */
.main-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  min-height: calc(100vh - var(--topbar-h));
  overflow: hidden;
}

.form-panel {
  border-right: 1px solid var(--border);
  background: var(--bg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.panel-scroll {
  overflow-y: auto;
  flex: 1;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preview-panel {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #F1F5F9;
}
.preview-sticky {
  position: sticky;
  top: var(--topbar-h);
  height: calc(100vh - var(--topbar-h));
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.preview-label {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--font-brand); font-size: 11px; font-weight: 700; letter-spacing: 0.05em;
  text-transform: uppercase; color: var(--accent);
  padding: 14px 28px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}
.preview-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

/* ── Section Cards ── */
.section-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: var(--transition);
}
.section-card:hover { box-shadow: var(--shadow-md); border-color: var(--border-hover); }
.section-header {
  width: 100%;
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px;
  background: none; border: none; cursor: pointer;
}
.section-header:hover { background: var(--accent-soft); }
.section-title-group { display: flex; align-items: center; gap: 12px; }
.section-icon-wrap {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}

.color-indigo, .color-violet, .color-blue { background: var(--accent-soft); color: var(--accent); border: 1px solid var(--accent-soft-border); }
.color-emerald { background: var(--emerald-soft); color: var(--emerald); border: 1px solid #A7F3D0; }
.color-amber { background: var(--amber-soft); color: var(--amber); border: 1px solid #FDE68A; }
.color-rose { background: var(--rose-soft); color: var(--rose); border: 1px solid #FCA5A5; }

.section-title { font-family: var(--font-brand); font-size: 14px; font-weight: 700; color: var(--text-primary); }
.chevron { color: var(--text-muted); transition: var(--transition); }
.section-body { padding: 4px 20px 20px; display: flex; flex-direction: column; gap: 16px; }

.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

/* ── Inputs ── */
.field-wrap { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 12.5px; font-weight: 600; color: var(--text-secondary); }
.required-dot { color: var(--red); margin-left: 3px; }
.input-wrap { position: relative; }
.input-icon {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  color: var(--text-muted); pointer-events: none; display: flex; align-items: center;
}
.field-input {
  width: 100%; background: var(--surface);
  border: 1px solid var(--border); border-radius: var(--radius-sm);
  color: var(--text-primary); font-family: var(--font); font-size: 13.5px; font-weight: 500;
  padding: 10px 14px; outline: none; transition: var(--transition);
}
.field-input.has-icon { padding-left: 36px; }
.field-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(13,148,136,0.12); background: #ffffff; }

.field-textarea {
  width: 100%; background: var(--surface);
  border: 1px solid var(--border); border-radius: var(--radius-sm);
  color: var(--text-primary); font-family: var(--font); font-size: 13.5px; font-weight: 500;
  padding: 10px 14px; outline: none; transition: var(--transition);
  resize: vertical; min-height: 80px; line-height: 1.6;
}
.field-textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(13,148,136,0.12); background: #ffffff; }

.dynamic-entry {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 16px;
  display: flex; flex-direction: column; gap: 12px;
  position: relative;
}
.entry-header { display: flex; align-items: center; justify-content: space-between; }
.entry-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

.add-btn {
  display: flex; align-items: center; gap: 6px;
  font-family: var(--font); font-size: 13px; font-weight: 600;
  color: var(--accent); background: var(--accent-soft);
  border: 1px dashed var(--accent-soft-border);
  border-radius: var(--radius-sm);
  padding: 10px 14px; cursor: pointer; width: 100%;
  justify-content: center; transition: var(--transition);
  margin-top: 6px;
}
.add-btn:hover { background: rgba(13,148,136,0.1); border-color: var(--accent); }
.remove-btn {
  display: flex; align-items: center; justify-content: center;
  width: 30px; height: 30px;
  background: var(--rose-soft); color: var(--rose);
  border: 1px solid rgba(239,68,68,0.15);
  border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition);
}
.remove-btn:hover { background: #FEE2E2; color: var(--red); }

.skill-input-row { display: flex; gap: 8px; }
.skill-input { flex: 1; }
.skill-add-btn { padding: 10px 16px; flex-shrink: 0; border-radius: var(--radius-sm); }
.skill-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
.skill-chip {
  display: flex; align-items: center; gap: 6px;
  background: var(--accent-soft); color: var(--accent);
  border: 1px solid var(--accent-soft-border);
  border-radius: 20px; font-size: 12.5px; font-weight: 600;
  padding: 5px 10px 5px 14px;
}
.chip-remove {
  display: flex; align-items: center; justify-content: center;
  width: 18px; height: 18px;
  background: rgba(13,148,136,0.08); color: var(--accent);
  border: none; border-radius: 50%; cursor: pointer;
}
.empty-hint { font-size: 13px; color: var(--text-muted); font-style: italic; }

.form-footer-btns { display: flex; flex-direction: column; gap: 10px; padding: 8px 0; }

/* ── Preview Canvas Sheet ── */
.preview-doc {
  background: var(--surface);
  color: #111827;
  border-radius: 12px;
  padding: 48px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  line-height: 1.6;
  box-shadow: 0 4px 20px rgba(15,23,42,0.03), 0 10px 30px rgba(15,23,42,0.04);
  min-height: 842px;
  border: 1px solid var(--border);
}
.prev-header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid var(--accent); margin-bottom: 20px; }
.prev-name { font-family: var(--font-brand); font-size: 26px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; line-height: 1.2; }
.prev-title { font-size: 13px; font-weight: 700; color: var(--accent); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
.prev-contacts { display: flex; flex-wrap: wrap; gap: 8px 16px; justify-content: center; margin-top: 12px; }
.prev-contacts span { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-secondary); }
.prev-section { margin-bottom: 20px; }
.prev-section-title { font-family: var(--font-brand); font-size: 12px; font-weight: 800; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
.prev-section-divider { height: 1px; background: var(--border); margin-bottom: 12px; }
.prev-para { font-size: 12px; color: var(--text-secondary); line-height: 1.6; white-space: pre-line; }
.prev-skills { display: flex; flex-wrap: wrap; gap: 6px; }
.prev-skill-tag { background: var(--bg); color: var(--text-primary); border: 1px solid var(--border); border-radius: 6px; font-size: 11px; font-weight: 600; padding: 3px 10px; }
.prev-entry { margin-bottom: 14px; }
.prev-entry-header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
.prev-entry-title { font-size: 13px; font-weight: 700; color: var(--text-primary); }
.prev-entry-sub { font-size: 11px; color: var(--text-muted); font-weight: 500; white-space: nowrap; }
.prev-entry-org { font-size: 12px; color: var(--accent); font-weight: 600; margin-top: 2px; }
.prev-cgpa { font-size: 11px; color: var(--text-secondary); margin-top: 2px; }
.prev-tech { font-size: 11px; color: var(--accent); font-weight: 600; margin-top: 2px; }
.prev-links { display: flex; gap: 12px; margin-top: 4px; }
.prev-links span { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--accent); font-weight: 500; }
.prev-cert { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.prev-cert-meta { font-size: 11px; color: var(--text-muted); }

.toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 10px; padding: 12px 24px; border-radius: 40px;
  font-size: 13.5px; font-weight: 600; box-shadow: 0 10px 30px rgba(15,23,42,0.1); z-index: 9999;
}
.toast-success { background: var(--emerald-soft); color: #065F46; border: 1px solid #A7F3D0; }
.toast-info { background: var(--accent-soft); color: var(--accent); border: 1px solid var(--accent-soft-border); }
.toast-close { background: none; border: none; cursor: pointer; color: inherit; display: flex; margin-left: 6px; opacity: 0.5; }

.preview-toggle { display: none; }

@media (max-width: 1024px) {
  .main-layout { grid-template-columns: 1fr; height: auto; }
  .form-panel { border-right: none; border-bottom: 1px solid var(--border); }
  .preview-sticky { position: static; height: auto; }
  .preview-toggle { display: flex; }
  .hidden-mobile { display: none; }
  .grid-2, .grid-3 { grid-template-columns: 1fr; }
  .topbar-actions .btn-ghost, .topbar-actions .btn-outline:not(.preview-toggle) { display: none; }
}

@media (max-width: 600px) {
  .topbar { padding: 0 16px; height: auto; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
  .topbar-actions { width: 100%; justify-content: flex-start; }
  .panel-scroll, .preview-scroll { padding: 16px; }
  .section-body { padding: 4px 14px 14px; }
  .preview-doc { padding: 24px; }
  .prev-name { font-size: 20px; }
}

/* ─────────────────────────────────────────────────────────────────────────────
   CRITICAL PRINT LAYOUT MEDIA OVERRIDES
   Hides the layout shells, headers, dashboards and strips down to the marked sheet.
   ───────────────────────────────────────────────────────────────────────────── */
@media print {
  @page {
    size: A4;
    margin: 0mm !important; /* Strips browser headers/footers */
  }

  /* Hide everything else outside the direct preview element */
  html, body {
    background: #ffffff !important;
    color: #000000 !important;
    width: 210mm;
    height: 297mm;
    overflow: visible !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Escape any outer layout components, dashboards, wrappers or nav elements */
  div, header, sidebar, section, nav, button, .topbar, .form-panel, .preview-label {
    display: none !important;
  }

  /* Specifically force display only on the preview card and its parent layout hierarchy */
  .app-root, 
  .main-layout, 
  .preview-panel, 
  .preview-sticky, 
  .preview-scroll, 
  .preview-doc,
  .preview-doc * {
    display: block !important;
    box-shadow: none !important;
    border: none !important;
    background: transparent !important;
    visibility: visible !important;
  }

  /* Force standard block positioning and clear out viewport containers */
  .app-root, .main-layout {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    height: auto !important;
    overflow: visible !important;
  }

  .preview-panel, .preview-sticky, .preview-scroll {
    position: static !important;
    width: 100% !important;
    height: auto !important;
    overflow: visible !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Re-apply precise container padding cleanly to standard A4 sheet dimensions */
  .preview-doc {
    padding: 20mm !important;
    margin: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    min-height: auto !important;
    border-radius: 0 !important;
  }

  /* Prevent sections or blocks from being awkwardly split across page margins */
  .prev-section, .prev-entry, .prev-cert {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }
}
`;
