import React, { useState, useEffect, useRef } from "react";
import { 
  FiMail, FiPhone, FiMapPin, FiLinkedin, FiGithub, 
  FiGlobe, FiArrowLeft, FiPrinter, FiDownload 
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { getResumeById } from "../../services/resumeService";

// PDF Generation Libraries
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function PreviewSection({ title, children }) {
  return (
    <div className="prev-section break-inside-avoid">
      <h2 className="prev-section-title">{title}</h2>
      <div className="prev-section-divider" />
      {children}
    </div>
  );
}

export default function ResumePreview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const resumeRef = useRef(null);
  
  const [data, setData] = useState(null);
  const [resumeTitle, setResumeTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadResume = async () => {
      if (!id) {
        setError("No resume ID found in the URL parameter path.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await getResumeById(id);
        const responseData = response?.data ? response.data : response;
        
        if (responseData && (responseData.resume || responseData.success)) {
          const resumeRow = responseData.resume;
          setResumeTitle(resumeRow.title || "Untitled Resume");
          
          let targetData = resumeRow.resume_data;
          if (typeof targetData === "string") {
            try { targetData = JSON.parse(targetData); } catch (e) {}
          }
          setData(targetData || {});
        } else {
          setError("Resume data could not be retrieved from the database.");
        }
      } catch (err) {
        setError("Failed to fetch resume data from database.");
      } finally {
        setLoading(false);
      }
    };
    loadResume();
  }, [id]);

  // Download PDF using html2canvas and jsPDF libraries
  const handleDownloadPDF = async () => {
  const element = document.getElementById("printable-resume-sheet");
  if (!element) return;

  try {
    setDownloading(true);

    // Temporarily force the element to exactly 794px for capture
    const originalWidth = element.style.width;
    const originalMaxWidth = element.style.maxWidth;
    element.style.width = "794px";
    element.style.maxWidth = "794px";

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      scrollY: -window.scrollY,
      width: 794,
      windowWidth: 794,
    });

    // Restore original styles
    element.style.width = originalWidth;
    element.style.maxWidth = originalMaxWidth;

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;   // A4 width in mm
    const pageHeight = 297;  // A4 height in mm

    // Fix: calculate image height based on A4 width exactly
    const imgHeight = (canvas.height / canvas.width) * pageWidth;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${resumeTitle}.pdf`);
  } catch (err) {
    console.error(err);
  } finally {
    setDownloading(false);
  }
};

  if (loading) {
    return (
      <div className="preview-page-wrapper flex-center">
        <div className="status-message">
          <div className="spinner"></div>
          <p>Fetching data from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="preview-page-wrapper flex-center">
        <div className="error-card">
          <p className="error-text">{error}</p>
          <button onClick={() => navigate("/resumes")} className="btn-action btn-accent-action mx-auto">
            <FiArrowLeft size={16} /> Return to Resumes
          </button>
        </div>
      </div>
    );
  }

  // Fallbacks to safely access deep object properties
  const personal = data?.personal || {};
  const education = data?.education || [];
  const skills = data?.skills || [];
  const projects = data?.projects || [];
  const experience = data?.experience || [];
  const certifications = data?.certifications || [];

  return (
    <>
      <style>{PREVIEW_STYLES}</style>
      
      <div className="preview-page-wrapper">
        
        {/* Actions Navbar */}
        <header className="preview-topbar print:hidden">
          <div className="topbar-left">
            <button onClick={() => navigate("/resumes")} className="btn-back">
              <FiArrowLeft size={16} />
              <span>Back to Resumes</span>
            </button>
            <span className="preview-doc-title">| {resumeTitle}</span>
          </div>

          <div className="topbar-right-actions">
            <button 
              onClick={handleDownloadPDF} 
              className="btn-action btn-accent-action"
              disabled={downloading}
            >
              <FiDownload size={15} /> {downloading ? "Generating..." : "Save PDF"}
            </button>
          </div>
        </header>

        {/* Canvas Scroll Container */}
        <div className="canvas-scroll-container">
          <div id="printable-resume-sheet" ref={resumeRef} className="preview-doc-canvas">
            
            {/* Personal Details Header Section */}
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

            {/* Professional Summary Section */}
            {personal.summary && (
              <PreviewSection title="Professional Summary">
                <p className="prev-para text-justify">{personal.summary}</p>
              </PreviewSection>
            )}

            {/* Skills Section */}
            {skills.length > 0 && (
              <PreviewSection title="Skills">
                <div className="prev-skills">
                  {skills.map((s, i) => (
                    <span key={i} className="prev-skill-tag">{s}</span>
                  ))}
                </div>
              </PreviewSection>
            )}

            {/* Experience Section */}
            {experience.some(e => e.company || e.role) && (
              <PreviewSection title="Experience">
                {experience.filter(e => e.company || e.role).map((exp, index) => (
                  <div key={exp.id || index} className="prev-entry break-inside-avoid">
                    <div className="prev-entry-header">
                      <span className="prev-entry-title">{exp.role || "Role"}</span>
                      <span className="prev-entry-sub">
                        {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ""}
                      </span>
                    </div>
                    {exp.company && <p className="prev-entry-org">{exp.company}</p>}
                    {exp.responsibilities && (
                      <p className="prev-para text-justify">{exp.responsibilities}</p>
                    )}
                  </div>
                ))}
              </PreviewSection>
            )}

            {/* Education Section */}
            {education.some(e => e.degree || e.university) && (
              <PreviewSection title="Education">
                {education.filter(e => e.degree || e.university).map((edu, index) => (
                  <div key={edu.id || index} className="prev-entry break-inside-avoid">
                    <div className="prev-entry-header">
                      <span className="prev-entry-title">{edu.degree || "Degree"}</span>
                      <span className="prev-entry-sub">
                        {edu.startYear}{edu.endYear ? ` – ${edu.endYear}` : ""}
                      </span>
                    </div>
                    <p className="prev-entry-org-sub">
                      {[edu.college, edu.university].filter(Boolean).join(", ")}
                    </p>
                    {edu.cgpa && <p className="prev-cgpa">CGPA / Score: {edu.cgpa}</p>}
                  </div>
                ))}
              </PreviewSection>
            )}

            {/* ADDED: Projects Section */}
            {projects.some(p => p.title) && (
              <PreviewSection title="Projects">
                {projects.filter(p => p.title).map((proj, index) => (
                  <div key={proj.id || index} className="prev-entry break-inside-avoid">
                    <div className="prev-entry-header">
                      <span className="prev-entry-title">{proj.title}</span>
                    </div>
                    {proj.technologies && (
                      <p className="prev-tech">Technologies: <span style={{ fontWeight: 'normal', color: '#64748B', fontStyle: 'italic' }}>{proj.technologies}</span></p>
                    )}
                    {proj.description && <p className="prev-para text-justify">{proj.description}</p>}
                    <div className="prev-links print:hidden">
                      {proj.github && <span><FiGithub size={11} /> {proj.github}</span>}
                      {proj.demo && <span><FiGlobe size={11} /> {proj.demo}</span>}
                    </div>
                  </div>
                ))}
              </PreviewSection>
            )}

            {/* ADDED: Certifications Section */}
            {certifications.some(c => c.name) && (
              <PreviewSection title="Certifications">
                {certifications.filter(c => c.name).map((cert, index) => (
                  <div key={cert.id || index} className="prev-cert break-inside-avoid">
                    <span className="prev-entry-title">{cert.name}</span>
                    <span className="prev-cert-meta">{cert.organization}{cert.year ? `, ${cert.year}` : ""}</span>
                  </div>
                ))}
              </PreviewSection>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

const PREVIEW_STYLES = `
  .preview-page-wrapper { min-height: 100vh; background-color: #F1F5F9; display: flex; flex-direction: column; font-family: 'DM Sans', sans-serif; }
  .flex-center { display: flex; align-items: center; justify-content: center; }
  .preview-topbar { height: 64px; background: #ffffff; border-bottom: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; position: sticky; top: 0; }
  .topbar-left { display: flex; align-items: center; gap: 12px; }
  .btn-back { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #475569; background: transparent; border: none; cursor: pointer; }
  .btn-back:hover { color: #111827; }
  .preview-doc-title { font-size: 14px; color: #94A3B8; font-weight: 500; }
  .topbar-right-actions { display: flex; align-items: center; gap: 12px; }
  .btn-action { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 600; padding: 8px 16px; border-radius: 10px; cursor: pointer; transition: all 0.2s ease; }
  .btn-accent-action { background: #0D9488; color: #ffffff; border: 1px solid transparent; }
  .btn-accent-action:hover { background: #0F766E; }
  .btn-outline-action { background: #ffffff; color: #475569; border: 1px solid #E2E8F0; }
  .btn-outline-action:hover { background: #F1F5F9; border-color: #CBD5E1; }

  .canvas-scroll-container { flex: 1; padding: 40px 24px; display: flex; justify-content: center; align-items: flex-start; }
  .preview-doc-canvas{
    width:794px;
    min-height:1123px;
    max-width:794px;
    background:#fff;
    margin:auto;
    padding: 48px 56px;
    box-sizing: border-box;
}

  .prev-header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #0D9488; margin-bottom: 20px; }
  .prev-name { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 700; color: #111827; letter-spacing: -0.02em; line-height: 1.2; text-transform: uppercase; }
  .prev-title { font-size: 13px; font-weight: 700; color: #0D9488; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
  .prev-contacts { display: flex; flex-wrap: wrap; gap: 8px 16px; justify-content: center; margin-top: 12px; }
  .prev-contacts span { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #475569; }
  
  .prev-section { margin-bottom: 20px; }
  .prev-section-title { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 800; color: #111827; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
  .prev-section-divider { height: 1px; background: #E2E8F0; margin-bottom: 12px; }
  
  .prev-para { font-size: 12px; color: #475569; line-height: 1.6; white-space: pre-line; text-align: justify; }
  .prev-skills { display: flex; flex-wrap: wrap; gap: 6px; }
  .prev-skill-tag { background: #F8FAFC; color: #111827; border: 1px solid #E2E8F0; border-radius: 6px; font-size: 11px; font-weight: 600; padding: 3px 10px; }
  
  .prev-entry { margin-bottom: 14px; }
  .prev-entry-header { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  .prev-entry-title { font-size: 13px; font-weight: 700; color: #111827; }
  .prev-entry-sub { font-size: 11px; color: #64748B; font-weight: 500; white-space: nowrap; }
  .prev-entry-org { font-size: 12px; color: #0D9488; font-weight: 600; margin-top: 2px; }
  .prev-entry-org-sub { font-size: 12px; color: #475569; font-weight: 500; margin-top: 2px; }
  .prev-cgpa { font-size: 11px; color: #475569; margin-top: 2px; }
  .prev-tech { font-size: 11px; color: #0D9488; font-weight: 600; margin-top: 2px; }
  
  .prev-links { display: flex; gap: 12px; margin-top: 4px; }
  .prev-links span { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #0D9488; font-weight: 500; }
  .prev-cert { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
  .prev-cert-meta { font-size: 11px; color: #64748B; }

  .status-message { text-align: center; color: #475569; }
  .spinner { border: 3px solid #E2E8F0; border-top: 3px solid #0D9488; border-radius: 50%; width: 24px; height: 24px; animation: spin 0.8s linear infinite; margin: 0 auto 12px; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  
  .error-card { background: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #E2E8F0; text-align: center; max-width: 360px; }
  .error-text { color: #EF4444; font-weight: 600; margin-bottom: 16px; }

  @media print {
    @page { size: A4; margin: 0mm; }
    body, html { background: #ffffff !important; margin: 0 !important; padding: 0 !important; }
    .preview-page-wrapper { background: #ffffff !important; display: block !important; }
    .canvas-scroll-container { padding: 0 !important; display: block !important; }
    .preview-doc-canvas { box-shadow: none !important; border: none !important; padding: 20mm !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
    .break-inside-avoid { break-inside: avoid !important; page-break-inside: avoid !important; }
  }
`;
