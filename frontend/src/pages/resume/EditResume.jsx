import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Save,
  X,
  Plus,
  Trash2,
  Loader2,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Link2
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditResume() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  // Form State structured exactly like your INITIAL_STATE
  const [formData, setFormData] = useState({
    personal: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
      summary: ""
    },
    education: [],
    skills: [],
    projects: [],
    experience: [],
    certifications: []
  });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 4000);
  };

  // Safe data fetching matching your state structure
  const fetchResumeDetails = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/resumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data?.success && response.data?.resume) {
        const dbResume = response.data.resume;
        setTitle(dbResume.title || "Untitled Resume");
        
        const dbData = dbResume.resume_data || {};
        const activePersonal = dbData.personal || dbData.personalInfo || {};
        
        setFormData({
          personal: {
            fullName: activePersonal.fullName || "",
            title: activePersonal.title || "",
            email: activePersonal.email || "",
            phone: activePersonal.phone || "",
            location: activePersonal.location || "",
            linkedin: activePersonal.linkedin || "",
            github: activePersonal.github || "",
            portfolio: activePersonal.portfolio || "",
            summary: activePersonal.summary || ""
          },
          education: Array.isArray(dbData.education) ? dbData.education : [],
          skills: Array.isArray(dbData.skills) ? dbData.skills : [],
          projects: Array.isArray(dbData.projects) ? dbData.projects : [],
          experience: Array.isArray(dbData.experience) ? dbData.experience : [],
          certifications: Array.isArray(dbData.certifications) ? dbData.certifications : []
        });
      } else {
        showToast("error", "Resume data could not be found.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      showToast("error", "Failed to load resume details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchResumeDetails();
  }, [id, fetchResumeDetails]);

  // State Updates for Personal Info
  const updatePersonal = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  // State Updates for Array Items (Education, Experience, etc.)
  const handleArrayItemChange = (section, itemId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((item) => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (section, blueprint) => {
    const newItem = { id: Date.now(), ...blueprint };
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const removeArrayItem = (section, itemId) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== itemId)
    }));
  };

  // Skill Chip Handling
  const [skillInput, setSkillInput] = useState("");
  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput("");
    }
  };
  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  // Submit Changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      
      await axios.put(`${API_URL}/resumes/${id}`, {
        title: title,
        resume_data: formData 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showToast("success", "Resume saved successfully!");
      setTimeout(() => navigate("/resumes"), 1000);
    } catch (err) {
      console.error("Save Error:", err);
      showToast("error", "Failed to update resume.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-resume-container">
      <style>{`
        .edit-resume-container { box-sizing: border-box; width: 100%; max-width: 1000px; margin: 0 auto; padding: 8px 24px 48px 24px; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; gap: 28px; }
        .top-action-bar { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
        .back-nav-link { display: inline-flex; align-items: center; gap: 8px; color: #64748b; font-size: 14px; font-weight: 600; cursor: pointer; background: none; border: none; padding: 0; }
        .back-nav-link:hover { color: #0f172a; }
        .global-title-input { font-size: 28px; font-weight: 700; color: #0f172a; border: 1px dashed transparent; background: transparent; padding: 4px 8px; border-radius: 6px; width: 100%; max-width: 400px; outline: none; }
        .global-title-input:focus { border-color: #cbd5e1; background: #ffffff; }
        .resume-form-core { display: flex; flex-direction: column; gap: 28px; }
        .form-section-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); overflow: hidden; }
        .section-header-accent { height: 4px; background-color: #0d9488; }
        .section-body { padding: 28px; }
        .section-title-wrapper { display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; margin-bottom: 24px; }
        .section-title-wrapper h2 { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0; }
        .section-icon { color: #0d9488; }
        .input-grid-matrix { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
        .input-wrapper-block { display: flex; flex-direction: column; gap: 6px; position: relative; }
        .span-full-cols { grid-column: 1 / -1; }
        .input-wrapper-block label { font-size: 13px; font-weight: 600; color: #475569; display: flex; align-items: center; gap: 6px; }
        .label-icon { color: #94a3b8; }
        .form-field-ctrl { width: 100%; box-sizing: border-box; padding: 10px 14px; font-size: 14px; border: 1px solid #cbd5e1; border-radius: 8px; background-color: #f8fafc; outline: none; transition: all 0.2s ease; }
        .form-field-ctrl:focus { background-color: #ffffff; border-color: #0d9488; box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.08); }
        textarea.form-field-ctrl { resize: vertical; min-height: 90px; font-family: inherit; }
        .iterable-repeater-list { display: flex; flex-direction: column; gap: 24px; }
        .repeater-item-row { position: relative; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; padding-top: 32px; }
        .btn-remove-node { position: absolute; top: 12px; right: 12px; background: none; border: none; color: #94a3b8; cursor: pointer; padding: 4px; border-radius: 6px; }
        .btn-remove-node:hover { color: #ef4444; background-color: #fee2e2; }
        .btn-add-node { display: inline-flex; align-items: center; gap: 6px; background: none; border: 1px dashed #cbd5e1; color: #0d9488; font-weight: 600; font-size: 13px; padding: 10px 16px; border-radius: 8px; cursor: pointer; margin-top: 16px; }
        .btn-add-node:hover { background-color: #f0fdfa; border-color: #0d9488; }
        .skill-input-container { display: flex; gap: 10px; margin-bottom: 16px; }
        .chips-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill-token { display: inline-flex; align-items: center; gap: 6px; background-color: #f1f5f9; color: #334155; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 500; border: 1px solid #e2e8f0; }
        .btn-token-kill { background: none; border: none; color: #94a3b8; cursor: pointer; display: flex; align-items: center; padding: 0; }
        .btn-token-kill:hover { color: #ef4444; }
        .form-footer-action-panel { display: flex; justify-content: flex-end; align-items: center; gap: 14px; border-top: 1px solid #e2e8f0; padding-top: 24px; }
        .btn-base { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; font-size: 14px; padding: 10px 22px; border-radius: 10px; cursor: pointer; border: 1px solid transparent; }
        .btn-primary-action { background-color: #0d9488; color: #ffffff; }
        .btn-primary-action:hover:not(:disabled) { background-color: #0f766e; }
        .btn-primary-action:disabled { opacity: 0.6; }
        .btn-secondary-action { background-color: #ffffff; border-color: #cbd5e1; color: #475569; }
        .btn-secondary-action:hover { background-color: #f8fafc; }
        .toast-system-banner { position: fixed; bottom: 24px; right: 24px; padding: 14px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); z-index: 9999; display: flex; align-items: center; gap: 8px; }
        .toast-success { background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
        .toast-error { background-color: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; }
        .animate-spin { animation: spin-kf 1s linear infinite; }
        @keyframes spin-kf { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {toast.show && (
        <div className={`toast-system-banner toast-${toast.type}`}>
          {toast.type === "success" ? "✓" : "⚠"} {toast.message}
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "96px 0", color: "#0d9488" }}>
          <Loader2 size={42} className="animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="resume-form-core">
          <div className="top-action-bar">
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
              <button type="button" onClick={() => navigate("/resumes")} className="back-nav-link">
                <ArrowLeft size={16} /> Back to MyResumePage
              </button>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="global-title-input"
                placeholder="Enter Resume Title..."
                required
              />
            </div>
          </div>

          {/* PERSONAL INFO */}
          <div className="form-section-card">
            <div className="section-header-accent" />
            <div className="section-body">
              <div className="section-title-wrapper">
                <User size={18} className="section-icon" />
                <h2>Personal Information</h2>
              </div>
              <div className="input-grid-matrix">
                <div className="input-wrapper-block">
                  <label><User size={14} className="label-icon"/> Full Name</label>
                  <input
                    type="text"
                    value={formData.personal.fullName}
                    onChange={(e) => updatePersonal("fullName", e.target.value)}
                    className="form-field-ctrl"
                    required
                  />
                </div>
                <div className="input-wrapper-block">
                  <label><Briefcase size={14} className="label-icon"/> Professional Title</label>
                  <input
                    type="text"
                    value={formData.personal.title}
                    onChange={(e) => updatePersonal("title", e.target.value)}
                    className="form-field-ctrl"
                  />
                </div>
                <div className="input-wrapper-block">
                  <label><Mail size={14} className="label-icon"/> Email Address</label>
                  <input
                    type="email"
                    value={formData.personal.email}
                    onChange={(e) => updatePersonal("email", e.target.value)}
                    className="form-field-ctrl"
                    required
                  />
                </div>
                <div className="input-wrapper-block">
                  <label><Phone size={14} className="label-icon"/> Phone</label>
                  <input
                    type="text"
                    value={formData.personal.phone}
                    onChange={(e) => updatePersonal("phone", e.target.value)}
                    className="form-field-ctrl"
                  />
                </div>
                <div className="input-wrapper-block">
                  <label><MapPin size={14} className="label-icon"/> Location</label>
                  <input
                    type="text"
                    value={formData.personal.location}
                    onChange={(e) => updatePersonal("location", e.target.value)}
                    className="form-field-ctrl"
                  />
                </div>
                <div className="input-wrapper-block">
                  <label><Link2 size={14} className="label-icon"/> LinkedIn URL</label>
                  <input
                    type="text"
                    value={formData.personal.linkedin}
                    onChange={(e) => updatePersonal("linkedin", e.target.value)}
                    className="form-field-ctrl"
                  />
                </div>
                <div className="input-wrapper-block">
                  <label><Link2 size={14} className="label-icon"/> GitHub URL</label>
                  <input
                    type="text"
                    value={formData.personal.github}
                    onChange={(e) => updatePersonal("github", e.target.value)}
                    className="form-field-ctrl"
                  />
                </div>
                <div className="input-wrapper-block">
                  <label><Globe size={14} className="label-icon"/> Portfolio URL</label>
                  <input
                    type="text"
                    value={formData.personal.portfolio}
                    onChange={(e) => updatePersonal("portfolio", e.target.value)}
                    className="form-field-ctrl"
                  />
                </div>
                <div className="input-wrapper-block span-full-cols">
                  <label>Professional Summary</label>
                  <textarea
                    value={formData.personal.summary}
                    onChange={(e) => updatePersonal("summary", e.target.value)}
                    className="form-field-ctrl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* EDUCATION */}
          <div className="form-section-card">
            <div className="section-header-accent" />
            <div className="section-body">
              <div className="section-title-wrapper">
                <GraduationCap size={18} className="section-icon" />
                <h2>Education</h2>
              </div>
              <div className="iterable-repeater-list">
                {formData.education.map((edu) => (
                  <div key={edu.id} className="repeater-item-row">
                    <button type="button" onClick={() => removeArrayItem("education", edu.id)} className="btn-remove-node">
                      <Trash2 size={16} />
                    </button>
                    <div className="input-grid-matrix">
                      <div className="input-wrapper-block">
                        <label>Degree</label>
                        <input
                          type="text"
                          value={edu.degree || ""}
                          onChange={(e) => handleArrayItemChange("education", edu.id, "degree", e.target.value)}
                          className="form-field-ctrl"
                          required
                        />
                      </div>
                      <div className="input-wrapper-block">
                        <label>College</label>
                        <input
                          type="text"
                          value={edu.college || ""}
                          onChange={(e) => handleArrayItemChange("education", edu.id, "college", e.target.value)}
                          className="form-field-ctrl"
                        />
                      </div>
                      <div className="input-wrapper-block">
                        <label>University</label>
                        <input
                          type="text"
                          value={edu.university || ""}
                          onChange={(e) => handleArrayItemChange("education", edu.id, "university", e.target.value)}
                          className="form-field-ctrl"
                        />
                      </div>
                      <div className="input-wrapper-block">
                        <label>Start Year</label>
                        <input
                          type="text"
                          value={edu.startYear || ""}
                          onChange={(e) => handleArrayItemChange("education", edu.id, "startYear", e.target.value)}
                          className="form-field-ctrl"
                        />
                      </div>
                      <div className="input-wrapper-block">
                        <label>End Year</label>
                        <input
                          type="text"
                          value={edu.endYear || ""}
                          onChange={(e) => handleArrayItemChange("education", edu.id, "endYear", e.target.value)}
                          className="form-field-ctrl"
                        />
                      </div>
                      <div className="input-wrapper-block">
                        <label>CGPA</label>
                        <input
                          type="text"
                          value={edu.cgpa || ""}
                          onChange={(e) => handleArrayItemChange("education", edu.id, "cgpa", e.target.value)}
                          className="form-field-ctrl"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addArrayItem("education", { degree: "", college: "", university: "", startYear: "", endYear: "", cgpa: "" })}
                className="btn-add-node"
              >
                <Plus size={14} /> Add Education
              </button>
            </div>
          </div>

          {/* SKILLS */}
          <div className="form-section-card">
            <div className="section-header-accent" />
            <div className="section-body">
              <div className="section-title-wrapper">
                <Wrench size={18} className="section-icon" />
                <h2>Skills</h2>
              </div>
              <div className="skill-input-container">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="Type a skill and press Enter..."
                  className="form-field-ctrl"
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={addSkill} className="btn-base btn-primary-action" style={{ padding: "10px 16px" }}>
                  <Plus size={16} />
                </button>
              </div>
              <div className="chips-cloud">
                {formData.skills.map((skill, i) => (
                  <span key={i} className="skill-token">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="btn-token-kill">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* PROJECTS */}
          <div className="form-section-card">
            <div className="section-header-accent" />
            <div className="section-body">
              <div className="section-title-wrapper">
                <FolderGit2 size={18} className="section-icon" />
                <h2>Projects</h2>
              </div>
              <div className="iterable-repeater-list">
                {formData.projects.map((proj) => (
                  <div key={proj.id} className="repeater-item-row">
                    <button type="button" onClick={() => removeArrayItem("projects", proj.id)} className="btn-remove-node">
                      <Trash2 size={16} />
                    </button>
                    <div className="input-grid-matrix">
                      <div className="input-wrapper-block">
                        <label>Project Title</label>
                        <input
                          type="text"
                          value={proj.title || ""}
                          onChange={(e) => handleArrayItemChange("projects", proj.id, "title", e.target.value)}
                          className="form-field-ctrl"
                          required
                        />
                      </div>
                      <div className="input-wrapper-block">
                        <label>Technologies</label>
                        <input
                          type="text"
                          value={proj.technologies || ""}
                          onChange={(e) => handleArrayItemChange("projects", proj.id, "technologies", e.target.value)}
                          className="form-field-ctrl"
                        />
                      </div>
                      <div className="input-wrapper-block">
                        <label><Link2 size={14} className="label-icon"/> GitHub Link</label>
                        <input
                          type="text"
                          value={proj.github || ""}
                          onChange={(e) => handleArrayItemChange("projects", proj.id, "github", e.target.value)}
                          className="form-field-ctrl"
                        />
                      </div>
                      <div className="input-wrapper-block">
                        <label><Globe size={14} className="label-icon"/> Demo Link</label>
                        <input
                          type="text"
                          value={proj.demo || ""}
                          onChange={(e) => handleArrayItemChange("projects", proj.id, "demo", e.target.value)}
                          className="form-field-ctrl"
                        />
                      </div>
                      <div className="input-wrapper-block span-full-cols">
                        <label>Description</label>
                        <textarea
                          value={proj.description || ""}
                          onChange={(e) => handleArrayItemChange("projects", proj.id, "description", e.target.value)}
                          className="form-field-ctrl"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addArrayItem("projects", { title: "", technologies: "", description: "", github: "", demo: "" })}
                className="btn-add-node"
              >
                <Plus size={14} /> Add Project
              </button>
            </div>
          </div>

          {/* EXPERIENCE */}
          <div className="form-section-card">
            <div className="section-header-accent" />
            <div className="section-body">
              <div className="section-title-wrapper">
                <Briefcase size={18} className="section-icon" />
                <h2>Experience</h2>
              </div>
              <div className="iterable-repeater-list">
                {formData.experience.map((exp) => (
                  <div key={exp.id} className="repeater-item-row">
                    <button type="button" onClick={() => removeArrayItem("experience", exp.id)} className="btn-remove-node">
                      <Trash2 size={16} />
                    </button>
                    <div className="input-grid-matrix">
                      <div className="input-wrapper-block">
                        <label>Company</label>
                        <input
                          type="text"
                          value={exp.company || ""}
                          onChange={(e) => handleArrayItemChange("experience", exp.id, "company", e.target.value)}
                          className="form-field-ctrl"
                          required
                        />
                      </div>
                      <div className="input-wrapper-block">
                        <label>Role</label>
                        <input
                          type="text"
                          value={exp.role || ""}
                          onChange={(e) => handleArrayItemChange("experience", exp.id, "role", e.target.value)}
                          className="form-field-ctrl"
                          required
                        />
                      </div>
                      <div className="input-wrapper-block">
                        <label>Start Date</label>
                        <input
                          type="text"
                          value={exp.startDate || ""}
                          onChange={(e) => handleArrayItemChange("experience", exp.id, "startDate", e.target.value)}
                          className="form-field-ctrl"
                        />
                      </div>
                      <div className="input-wrapper-block">
                        <label>End Date</label>
                        <input
                          type="text"
                          value={exp.endDate || ""}
                          onChange={(e) => handleArrayItemChange("experience", exp.id, "endDate", e.target.value)}
                          className="form-field-ctrl"
                        />
                      </div>
                      <div className="input-wrapper-block span-full-cols">
                        <label>Responsibilities</label>
                        <textarea
                          value={exp.responsibilities || ""}
                          onChange={(e) => handleArrayItemChange("experience", exp.id, "responsibilities", e.target.value)}
                          className="form-field-ctrl"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addArrayItem("experience", { company: "", role: "", startDate: "", endDate: "", responsibilities: "" })}
                className="btn-add-node"
              >
                <Plus size={14} /> Add Experience
              </button>
            </div>
          </div>

          {/* CERTIFICATIONS */}
          <div className="form-section-card">
            <div className="section-header-accent" />
            <div className="section-body">
              <div className="section-title-wrapper">
                <Award size={18} className="section-icon" />
                <h2>Certifications</h2>
              </div>
              <div className="iterable-repeater-list">
                {formData.certifications.map((cert) => (
                  <div key={cert.id} className="repeater-item-row">
                    <button type="button" onClick={() => removeArrayItem("certifications", cert.id)} className="btn-remove-node">
                      <Trash2 size={16} />
                    </button>
                    <div className="input-grid-matrix">
                      <div className="input-wrapper-block">
                        <label>Certification Name</label>
                        <input
                          type="text"
                          value={cert.name || ""}
                          onChange={(e) => handleArrayItemChange("certifications", cert.id, "name", e.target.value)}
                          className="form-field-ctrl"
                          required
                        />
                      </div>
                      <div className="input-wrapper-block">
                        <label>Organization</label>
                        <input
                          type="text"
                          value={cert.organization || ""}
                          onChange={(e) => handleArrayItemChange("certifications", cert.id, "organization", e.target.value)}
                          className="form-field-ctrl"
                        />
                      </div>
                      <div className="input-wrapper-block">
                        <label>Year</label>
                        <input
                          type="text"
                          value={cert.year || ""}
                          onChange={(e) => handleArrayItemChange("certifications", cert.id, "year", e.target.value)}
                          className="form-field-ctrl"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addArrayItem("certifications", { name: "", organization: "", year: "" })}
                className="btn-add-node"
              >
                <Plus size={14} /> Add Certification
              </button>
            </div>
          </div>

          {/* PANEL ACTIONS */}
          <div className="form-footer-action-panel">
            <button
              type="button"
              onClick={() => navigate("/resumes")}
              className="btn-base btn-secondary-action"
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="btn-base btn-primary-action" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}