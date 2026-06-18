import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Loader2, FileText, ChevronDown } from 'lucide-react';

const ATSChecker = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await api.get('/resumes');
        setResumes(data.resumes || []);
      } catch (err) {
        console.error("Failed to fetch resumes:", err);
      }
    };
    fetchResumes();
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/ats/analyze', { 
        resumeId: selectedResumeId, 
        jobDescription 
      });
      setAnalysis(data);
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const CSS = `
  /* --- Global Base Styles & Pallete --- */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

:root {
  --bg-dark: #1E293B;
  --bg-light: #F8FAFC;
  --brand-teal: #0D9488;
  --brand-teal-light: #2DD4BF;
  --text-main: #111827;
  --text-muted: #64748b;
}

html, body, #root {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  height: 100% !important;
  box-sizing: border-box;
  background: var(--bg-dark);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* --- Animations --- */
@keyframes drift {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-22px, -28px); }
}
@keyframes scanline {
  0% { top: 6%; opacity: 0; }
  8% { opacity: 1; }
  48% { top: 90%; opacity: 1; }
  56% { opacity: 0; }
  100% { top: 6%; opacity: 0; }
}

/* --- Layout --- */
.login-root {
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  align-items: center;
  background: var(--bg-dark);
  font-family: "Inter", sans-serif;
  position: relative;
  overflow-x: hidden;
}

.stage-panel {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 56px 64px;
  z-index: 1;
}

.right-panel {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px;
  background: var(--bg-light);
  position: relative;
  z-index: 1;
  box-shadow: -40px 0 80px -40px rgba(0,0,0,0.35);
}

.form-container { width: 100%; max-width: 440px; }

/* --- UI Elements --- */
.form-group { margin-bottom: 24px; }
.form-label { display: block; font-weight: 600; color: var(--text-main); margin-bottom: 12px; font-size: 14px; }
.form-control { 
  width: 100%; padding: 14px; border: 1px solid #cbd5e1; 
  border-radius: 10px; background: #fff; font-size: 14px; 
}
.textarea-large { height: 240px; resize: none; }

.btn-analyze {
  width: 100%; padding: 16px; background-color: var(--brand-teal);
  color: white; border: none; border-radius: 10px; font-weight: bold;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.btn-analyze:hover { background-color: #0f766e; }
.btn-analyze:disabled { background-color: #94a3b8; cursor: not-allowed; }

/* --- Teal Accents & Decorations --- */
.bg-glow-a {
  position: fixed; top: -180px; left: -160px; width: 480px; height: 480px;
  border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle, rgba(13,148,136,0.16) 0%, transparent 70%);
  animation: drift 18s ease-in-out infinite;
}
.bg-glow-b {
  position: fixed; bottom: -200px; right: -120px; width: 520px; height: 520px;
  border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 70%);
  animation: drift 22s ease-in-out infinite reverse;
}
.bg-dots {
  position: fixed; inset: 0; pointer-events: none; opacity: 0.05;
  background-image: radial-gradient(circle, #FFFFFF 1px, transparent 1px);
  background-size: 26px 26px;
}

/* --- Mockup Elements --- */
.resume-card {
  position: relative; width: 246px; background: #FFFFFF;
  border-radius: 14px; padding: 20px; box-shadow: 0 28px 60px -18px rgba(0,0,0,0.55);
  overflow: hidden; transform: rotate(-3deg);
}
.scanline {
  position: absolute; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent, var(--brand-teal-light) 35%, var(--brand-teal-light) 65%, transparent);
  box-shadow: 0 0 18px 3px rgba(45,212,191,0.55);
  animation: scanline 4.5s ease-in-out infinite;
}

/* --- Responsive --- */
@media (max-width: 990px) {
  .login-root { grid-template-columns: 1fr; }
  .stage-panel { display: none !important; }
  .right-panel { padding: 40px 22px; min-height: 100vh; box-shadow: none; }
}`

  return (
    <>
    <style>{CSS}</style>
    <div className="ats-page-container">
      <header className="ats-header">
        <h1 className="ats-title">ATS Resume Optimizer</h1>
        <p className="ats-subtitle">Analyze your documents for top-tier hiring systems.</p>
      </header>

      <div className="ats-content-grid">
        {/* Left Section: Inputs */}
        <section className="ats-card">
          <div className="form-group">
            <label className="form-label">Select Saved Resume</label>
            <div className="select-wrapper">
              <select 
                value={selectedResumeId} 
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="form-control"
              >
                <option value="">Choose a resume...</option>
                {resumes.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Job Description</label>
            <textarea
              className="form-control textarea-large"
              placeholder="Paste the job description here to compare..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <button 
            className="btn-analyze" 
            onClick={handleAnalyze}
            disabled={loading || !selectedResumeId || !jobDescription}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Analyze Resume'}
          </button>
        </section>

        {/* Right Section: Results */}
        <section className="ats-card">
          {!analysis ? (
            <div className="results-placeholder">
              <FileText size={48} className="icon-fade" />
              <p>Select a resume and paste a job description to generate your ATS score.</p>
            </div>
          ) : (
            <div className="results-content">
              <h3 className="results-title">Match Report</h3>
              <div className="score-box">
                <span className="score-value">{analysis.score}%</span>
              </div>
              <p>Your resume matches {analysis.score}% of the job requirements.</p>
            </div>
          )}
        </section>
      </div>
    </div>
    </>
  );
};

export default ATSChecker;