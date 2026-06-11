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

      {/* Summary */}
      {personal.summary && (
        <PreviewSection title="Professional Summary">
          <p className="prev-para">{personal.summary}</p>
        </PreviewSection>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <PreviewSection title="Skills">
          <div className="prev-skills">
            {skills.map((s, i) => <span key={i} className="prev-skill-tag">{s}</span>)}
          </div>
        </PreviewSection>
      )}

      {/* Experience */}
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

      {/* Education */}
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

      {/* Projects */}
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

      {/* Certifications */}
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
  const [resumeId, setResumeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedResumes, setSavedResumes] = useState([]);

  const notify = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Personal
  const updatePersonal = (key, val) =>
    setFormData(prev => ({ ...prev, personal: { ...prev.personal, [key]: val } }));

  // Education
  const addEducation = () =>
    setFormData(prev => ({ ...prev, education: [...prev.education, emptyEducation()] }));
  const removeEducation = (id) =>
    setFormData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  const updateEducation = (id, key, val) =>
    setFormData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [key]: val } : e),
    }));

  // Skills
  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || formData.skills.includes(s)) return;
    setFormData(prev => ({ ...prev, skills: [...prev.skills, s] }));
    setSkillInput("");
  };
  const removeSkill = (skill) =>
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));

  // Projects
  const addProject = () =>
    setFormData(prev => ({ ...prev, projects: [...prev.projects, emptyProject()] }));
  const removeProject = (id) =>
    setFormData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  const updateProject = (id, key, val) =>
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [key]: val } : p),
    }));

  // Experience
  const addExperience = () =>
    setFormData(prev => ({ ...prev, experience: [...prev.experience, emptyExperience()] }));
  const removeExperience = (id) =>
    setFormData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  const updateExperience = (id, key, val) =>
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, [key]: val } : e),
    }));

  // Certifications
  const addCertification = () =>
    setFormData(prev => ({ ...prev, certifications: [...prev.certifications, emptyCertification()] }));
  const removeCertification = (id) =>
    setFormData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }));
  const updateCertification = (id, key, val) =>
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === id ? { ...c, [key]: val } : c),
    }));

const handleSave = async () => {
  try {
    setLoading(true);

    const payload = {
      title:
        formData.personal?.fullName?.trim() || "My Resume",
      resume_data: formData,
    };

    let response;

    if (resumeId) {
      response = await updateResume(resumeId, payload);
    } else {
      response = await createResume(payload);

      if (response.data?.resume?.id) {
        setResumeId(response.data.resume.id);
      }
    }

    console.log("Resume Saved:", response.data);

    notify("Resume saved successfully!", "success");

    fetchResumes();
  } catch (error) {
    console.error("Save Error:", error);

    notify(
      error.response?.data?.message ||
        error.message ||
        "Failed to save resume",
      "info"
    );
  } finally {
    setLoading(false);
  }
};

  const handleClear = () => { setFormData(INITIAL_STATE); notify("Form cleared.", "info"); };
  const handleDownload = () => notify("PDF download coming soon!", "info");

  useEffect(() => {
  fetchResumes();
}, []);

const fetchResumes = async () => {
  try {
    const data = await getAllResumes();

    if (data.success) {
      setSavedResumes(data.resumes);
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
    <>
      <style>{CSS}</style>
      <div className="app-root">
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-brand">
            <span className="topbar-logo"><FiZap size={18} /></span>
            <span className="topbar-name">ResumeAI</span>
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

              <SectionCard
  icon={FiSave}
  title="Saved Resumes"
  color="color-blue"
>
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

              {/* Personal */}
              <SectionCard icon={FiUser} title="Personal Information" color="color-blue">
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

              {/* Education */}
              <SectionCard icon={FiBook} title="Education" color="color-purple">
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

              {/* Skills */}
              <SectionCard icon={FiZap} title="Skills" color="color-green">
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

              {/* Projects */}
              <SectionCard icon={FiCode} title="Projects" color="color-orange">
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

              {/* Experience */}
              <SectionCard icon={FiBriefcase} title="Experience" color="color-teal">
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

              {/* Certifications */}
              <SectionCard icon={FiAward} title="Certifications" color="color-pink">
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
                <button
  onClick={handleSave}
  className="btn btn-accent"
  disabled={loading}
>
  <FiSave size={14} />
  {loading ? "Saving..." : "Save"}
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
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f1117;
    --surface: #161b27;
    --surface2: #1d2436;
    --border: rgba(255,255,255,0.07);
    --border-hover: rgba(255,255,255,0.14);
    --text-primary: #e8ecf4;
    --text-secondary: #8b96b0;
    --text-muted: #545e78;
    --accent: #4f7ef8;
    --accent-soft: rgba(79,126,248,0.15);
    --accent-hover: #3d6ae0;
    --green: #34c48b;
    --green-soft: rgba(52,196,139,0.15);
    --purple: #a78bfa;
    --purple-soft: rgba(167,139,250,0.15);
    --orange: #fb923c;
    --orange-soft: rgba(251,146,60,0.15);
    --teal: #2dd4bf;
    --teal-soft: rgba(45,212,191,0.15);
    --pink: #f472b6;
    --pink-soft: rgba(244,114,182,0.15);
    --red: #f87171;
    --red-soft: rgba(248,113,113,0.12);
    --radius: 10px;
    --radius-sm: 6px;
    --shadow: 0 4px 24px rgba(0,0,0,0.35);
    --topbar-h: 56px;
    --font: 'DM Sans', sans-serif;
    --font-mono: 'DM Mono', monospace;
    --transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
  }

  body { font-family: var(--font); background: var(--bg); color: var(--text-primary); }

  .app-root { min-height: 100vh; display: flex; flex-direction: column; background: var(--bg); }

  /* ── Topbar ── */
  .topbar {
    height: var(--topbar-h);
    background: rgba(22,27,39,0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    position: sticky;
    top: 0;
    z-index: 100;
    gap: 12px;
  }
  .topbar-brand { display: flex; align-items: center; gap: 8px; }
  .topbar-logo {
    width: 30px; height: 30px;
    background: linear-gradient(135deg, var(--accent), #7c3aed);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
  }
  .topbar-name { font-size: 15px; font-weight: 700; letter-spacing: -0.3px; color: var(--text-primary); }
  .topbar-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

  /* ── Buttons ── */
  .btn {
    display: flex; align-items: center; gap: 6px;
    font-family: var(--font); font-size: 13px; font-weight: 500;
    padding: 7px 13px; border-radius: var(--radius-sm);
    cursor: pointer; border: none; transition: var(--transition);
    white-space: nowrap;
  }
  .btn-accent { background: var(--accent); color: #fff; }
  .btn-accent:hover { background: var(--accent-hover); }
  .btn-outline { background: transparent; color: var(--text-secondary); border: 1px solid var(--border-hover); }
  .btn-outline:hover { background: var(--surface2); color: var(--text-primary); }
  .btn-ghost { background: transparent; color: var(--text-secondary); border: 1px solid transparent; }
  .btn-ghost:hover { background: var(--surface2); color: var(--text-primary); }
  .full-btn { width: 100%; justify-content: center; padding: 10px; }

  /* ── Layout ── */
  .main-layout {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: calc(100vh - var(--topbar-h));
    overflow: hidden;
  }

  .form-panel {
    border-right: 1px solid var(--border);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .panel-scroll {
    overflow-y: auto;
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    scrollbar-width: thin;
    scrollbar-color: var(--surface2) transparent;
  }

  .preview-panel {
    overflow: hidden;
    display: flex;
    flex-direction: column;
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
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--text-muted);
    padding: 10px 20px 8px;
    border-bottom: 1px solid var(--border);
  }
  .preview-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #1a1f2e;
    scrollbar-width: thin;
    scrollbar-color: var(--surface2) transparent;
  }

  /* ── Section Card ── */
  .section-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .section-card:hover { border-color: var(--border-hover); }
  .section-header {
    width: 100%;
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 16px;
    background: none; border: none; cursor: pointer;
    transition: background 0.15s;
  }
  .section-header:hover { background: rgba(255,255,255,0.03); }
  .section-title-group { display: flex; align-items: center; gap: 10px; }
  .section-icon-wrap {
    width: 28px; height: 28px;
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
  }
  .color-blue { background: var(--accent-soft); color: var(--accent); }
  .color-purple { background: var(--purple-soft); color: var(--purple); }
  .color-green { background: var(--green-soft); color: var(--green); }
  .color-orange { background: var(--orange-soft); color: var(--orange); }
  .color-teal { background: var(--teal-soft); color: var(--teal); }
  .color-pink { background: var(--pink-soft); color: var(--pink); }
  .section-title { font-size: 14px; font-weight: 600; color: var(--text-primary); }
  .chevron { color: var(--text-muted); transition: transform 0.2s; }
  .section-body { padding: 4px 16px 16px; display: flex; flex-direction: column; gap: 12px; }

  /* ── Grid ── */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }

  /* ── Fields ── */
  .field-wrap { display: flex; flex-direction: column; gap: 5px; }
  .field-label { font-size: 12px; font-weight: 500; color: var(--text-secondary); }
  .required-dot { color: var(--red); margin-left: 3px; }
  .input-wrap { position: relative; }
  .input-icon {
    position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
    color: var(--text-muted); pointer-events: none;
  }
  .field-input {
    width: 100%; background: var(--surface2);
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    color: var(--text-primary); font-family: var(--font); font-size: 13px;
    padding: 8px 10px; outline: none; transition: var(--transition);
  }
  .field-input.has-icon { padding-left: 30px; }
  .field-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
  .field-input::placeholder { color: var(--text-muted); }
  .field-textarea {
    width: 100%; background: var(--surface2);
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    color: var(--text-primary); font-family: var(--font); font-size: 13px;
    padding: 8px 10px; outline: none; transition: var(--transition);
    resize: vertical; min-height: 72px; line-height: 1.5;
  }
  .field-textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft); }
  .field-textarea::placeholder { color: var(--text-muted); }

  /* ── Dynamic entries ── */
  .dynamic-entry {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 12px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .entry-header {
    display: flex; align-items: center; justify-content: space-between;
  }
  .entry-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

  /* ── Add / Remove ── */
  .add-btn {
    display: flex; align-items: center; gap: 6px;
    font-family: var(--font); font-size: 13px; font-weight: 500;
    color: var(--accent); background: var(--accent-soft);
    border: 1px dashed rgba(79,126,248,0.3);
    border-radius: var(--radius-sm);
    padding: 8px 14px; cursor: pointer; width: 100%;
    justify-content: center; transition: var(--transition);
    margin-top: 4px;
  }
  .add-btn:hover { background: rgba(79,126,248,0.25); border-color: var(--accent); }
  .remove-btn {
    display: flex; align-items: center; justify-content: center;
    width: 28px; height: 28px;
    background: var(--red-soft); color: var(--red);
    border: 1px solid rgba(248,113,113,0.2);
    border-radius: var(--radius-sm); cursor: pointer; transition: var(--transition);
  }
  .remove-btn:hover { background: rgba(248,113,113,0.2); }

  /* ── Skills ── */
  .skill-input-row { display: flex; gap: 8px; }
  .skill-input { flex: 1; }
  .skill-add-btn { padding: 8px 12px; flex-shrink: 0; border-radius: var(--radius-sm); }
  .skill-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 4px; }
  .skill-chip {
    display: flex; align-items: center; gap: 5px;
    background: var(--accent-soft); color: var(--accent);
    border: 1px solid rgba(79,126,248,0.25);
    border-radius: 20px; font-size: 12px; font-weight: 500;
    padding: 4px 10px 4px 12px;
    animation: chip-pop 0.18s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes chip-pop { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .chip-remove {
    display: flex; align-items: center; justify-content: center;
    width: 16px; height: 16px;
    background: rgba(79,126,248,0.2); color: var(--accent);
    border: none; border-radius: 50%; cursor: pointer; transition: var(--transition);
  }
  .chip-remove:hover { background: var(--red-soft); color: var(--red); }
  .empty-hint { font-size: 12px; color: var(--text-muted); font-style: italic; }

  /* ── Form footer ── */
  .form-footer-btns { display: flex; flex-direction: column; gap: 8px; padding: 4px 0 8px; }

  /* ── Preview ── */
  .preview-doc {
    background: #ffffff;
    color: #1a1a2e;
    border-radius: var(--radius);
    padding: 28px 32px;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    line-height: 1.5;
    box-shadow: 0 8px 40px rgba(0,0,0,0.4);
    min-height: 600px;
  }
  .prev-header { text-align: center; padding-bottom: 14px; border-bottom: 2px solid #2563eb; margin-bottom: 14px; }
  .prev-name { font-size: 22px; font-weight: 800; color: #1e293b; letter-spacing: -0.5px; line-height: 1.2; }
  .prev-title { font-size: 11px; font-weight: 500; color: #2563eb; margin-top: 3px; text-transform: uppercase; letter-spacing: 0.08em; }
  .prev-contacts {
    display: flex; flex-wrap: wrap; gap: 6px 14px;
    justify-content: center; margin-top: 8px;
  }
  .prev-contacts span {
    display: flex; align-items: center; gap: 4px;
    font-size: 9px; color: #475569;
  }
  .prev-section { margin-bottom: 14px; }
  .prev-section-title { font-size: 11px; font-weight: 700; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
  .prev-section-divider { height: 1.5px; background: #dbeafe; margin-bottom: 8px; }
  .prev-para { font-size: 9.5px; color: #374151; line-height: 1.6; }
  .prev-skills { display: flex; flex-wrap: wrap; gap: 5px; }
  .prev-skill-tag {
    background: #eff6ff; color: #1d4ed8;
    border: 1px solid #bfdbfe;
    border-radius: 4px; font-size: 8.5px; font-weight: 500;
    padding: 2px 8px;
  }
  .prev-entry { margin-bottom: 9px; }
  .prev-entry-header { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
  .prev-entry-title { font-size: 10px; font-weight: 700; color: #1e293b; }
  .prev-entry-sub { font-size: 8.5px; color: #64748b; white-space: nowrap; }
  .prev-entry-org { font-size: 9px; color: #2563eb; font-weight: 500; margin-top: 1px; }
  .prev-cgpa { font-size: 9px; color: #64748b; margin-top: 2px; }
  .prev-tech { font-size: 9px; color: #7c3aed; font-weight: 500; margin-top: 2px; }
  .prev-links { display: flex; gap: 10px; margin-top: 3px; }
  .prev-links span { display: flex; align-items: center; gap: 3px; font-size: 8.5px; color: #2563eb; }
  .prev-cert { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
  .prev-cert-meta { font-size: 8.5px; color: #64748b; }

  /* ── Toast ── */
  .toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; gap: 10px;
    padding: 11px 18px; border-radius: 30px;
    font-size: 13px; font-weight: 500;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    animation: toast-in 0.25s cubic-bezier(0.34,1.56,0.64,1);
    z-index: 9999; backdrop-filter: blur(12px);
    white-space: nowrap;
  }
  .toast-success { background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.25); }
  .toast-info { background: rgba(79,126,248,0.15); color: var(--accent); border: 1px solid rgba(79,126,248,0.25); }
  .toast-icon { display: flex; }
  .toast-close { background: none; border: none; cursor: pointer; color: inherit; display: flex; margin-left: 4px; opacity: 0.6; }
  .toast-close:hover { opacity: 1; }
  @keyframes toast-in { from { transform: translateX(-50%) translateY(20px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }

  /* ── Responsive ── */
  .preview-toggle { display: none; }

  @media (max-width: 900px) {
    .main-layout { grid-template-columns: 1fr; height: auto; overflow: visible; }
    .form-panel { border-right: none; border-bottom: 1px solid var(--border); }
    .preview-panel { }
    .preview-sticky { position: static; height: auto; }
    .preview-toggle { display: flex; }
    .hidden-mobile { display: none; }
    .grid-2 { grid-template-columns: 1fr; }
    .grid-3 { grid-template-columns: 1fr; }
    .topbar-actions .btn-ghost { display: none; }
    .topbar-actions .btn-outline:not(.preview-toggle) { display: none; }
  }

  @media (max-width: 480px) {
    .topbar { padding: 0 12px; }
    .panel-scroll { padding: 12px; }
    .section-body { padding: 4px 12px 12px; }
    .preview-scroll { padding: 12px; }
    .preview-doc { padding: 16px 14px; }
    .prev-name { font-size: 17px; }
  }

  @media (min-width: 1400px) {
    .main-layout { grid-template-columns: 1.1fr 0.9fr; }
    .panel-scroll { padding: 24px; }
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--surface2); border-radius: 10px; }
`;