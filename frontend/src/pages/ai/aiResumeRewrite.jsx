import { useState, useCallback, useEffect, useRef } from "react";
import api from "../../services/api";

const API_BASE = import.meta.env.VITE_API_URL;

// ─── helpers ────────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

// ─── styles ─────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f0fdfa",
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    color: "#0f2027",
    padding: "0",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 24px",
  },

  // ── Header
  pageHeader: { marginBottom: "32px" },
  breadcrumb: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  breadcrumbSep: { color: "#cbd5e1" },
  breadcrumbActive: { color: "#0d9488", fontWeight: "500" },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f2027",
    margin: "0 0 6px 0",
    letterSpacing: "-0.5px",
  },
  pageSubtitle: { fontSize: "15px", color: "#64748b", margin: "0" },
  accentDot: {
    display: "inline-block",
    width: "8px",
    height: "8px",
    background: "#0d9488",
    borderRadius: "50%",
    marginRight: "8px",
    verticalAlign: "middle",
  },

  // ── Cards
  card: {
    background: "#ffffff",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    padding: "24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  cardTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "16px",
  },
  cardTitleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },

  // ── Grids
  topGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },

  // ── Resume list
  resumeList: { display: "flex", flexDirection: "column", gap: "10px" },
  resumeOption: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    cursor: "pointer",
    transition: "all 0.15s ease",
    background: "#fff",
  },
  resumeOptionActive: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1.5px solid #0d9488",
    cursor: "pointer",
    transition: "all 0.15s ease",
    background: "#f0fdfa",
  },
  resumeIconBox: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "#f0fdfa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    flexShrink: 0,
  },
  resumeIconBoxActive: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "#ccfbf1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    flexShrink: 0,
  },
  resumeInfo: { flex: 1, minWidth: 0 },
  resumeName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0f2027",
    margin: "0 0 2px 0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  resumeMeta: { fontSize: "12px", color: "#94a3b8", margin: "0" },
  resumeCheck: {
    marginLeft: "auto",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: "#0d9488",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "11px",
    flexShrink: 0,
  },

  // ── Empty / loading states inside resume list
  resumeListEmpty: {
    textAlign: "center",
    padding: "24px 0",
    color: "#94a3b8",
    fontSize: "14px",
  },
  resumeListLoading: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  skeletonRow: {
    height: "60px",
    borderRadius: "10px",
    background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.2s infinite",
  },

  // ── Upload zone
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1.5px dashed #0d9488",
    background: "#f0fdfa",
    color: "#0d9488",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
  },
  uploadDropZone: {
    border: "2px dashed #99f6e4",
    borderRadius: "12px",
    padding: "28px 20px",
    textAlign: "center",
    background: "#f0fdfa",
    cursor: "pointer",
    transition: "all 0.15s",
    marginTop: "12px",
  },
  uploadDropZoneActive: {
    border: "2px dashed #0d9488",
    borderRadius: "12px",
    padding: "28px 20px",
    textAlign: "center",
    background: "#ccfbf1",
    cursor: "pointer",
    transition: "all 0.15s",
    marginTop: "12px",
  },
  uploadIcon: { fontSize: "28px", marginBottom: "8px" },
  uploadText: { fontSize: "14px", color: "#475569", margin: "0 0 4px 0" },
  uploadHint: { fontSize: "12px", color: "#94a3b8", margin: "0" },
  uploadProgress: {
    marginTop: "12px",
    height: "4px",
    borderRadius: "99px",
    background: "#e2e8f0",
    overflow: "hidden",
  },
  uploadProgressBar: {
    height: "100%",
    background: "linear-gradient(90deg, #0d9488, #0891b2)",
    borderRadius: "99px",
    transition: "width 0.3s ease",
  },

  // ── Section chips
  sectionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  sectionChip: {
    padding: "10px 12px",
    borderRadius: "9px",
    border: "1.5px solid #e2e8f0",
    fontSize: "13px",
    fontWeight: "500",
    color: "#475569",
    cursor: "pointer",
    background: "#fff",
    transition: "all 0.15s ease",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    textAlign: "left",
  },
  sectionChipActive: {
    padding: "10px 12px",
    borderRadius: "9px",
    border: "1.5px solid #0d9488",
    fontSize: "13px",
    fontWeight: "600",
    color: "#0d9488",
    cursor: "pointer",
    background: "#f0fdfa",
    transition: "all 0.15s ease",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    textAlign: "left",
  },
  sectionEmoji: { fontSize: "15px" },

  // ── Textarea / Input
  textareaLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
    display: "block",
  },
  textarea: {
    width: "100%",
    minHeight: "160px",
    resize: "vertical",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    padding: "14px",
    fontSize: "14px",
    color: "#1e293b",
    fontFamily: "inherit",
    lineHeight: "1.6",
    background: "#fafafa",
    outline: "none",
    transition: "border 0.15s",
    boxSizing: "border-box",
  },
  charCount: {
    fontSize: "12px",
    color: "#94a3b8",
    textAlign: "right",
    marginTop: "6px",
  },

  // ── Buttons
  actionRow: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
    flexWrap: "wrap",
  },
  btnPrimary: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "11px 22px",
    borderRadius: "9px",
    border: "none",
    background: "linear-gradient(135deg, #0d9488, #0891b2)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "opacity 0.15s, transform 0.1s",
    letterSpacing: "0.01em",
  },
  btnSecondary: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "11px 18px",
    borderRadius: "9px",
    border: "1.5px solid #e2e8f0",
    background: "#fff",
    color: "#475569",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  btnSuccess: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "11px 18px",
    borderRadius: "9px",
    border: "1.5px solid #10b981",
    background: "#ecfdf5",
    color: "#065f46",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  btnAccent: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "11px 18px",
    borderRadius: "9px",
    border: "none",
    background: "linear-gradient(135deg, #0d9488, #059669)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
  btnDisabled: {
    opacity: 0.42,
    cursor: "not-allowed",
    pointerEvents: "none",
  },

  // ── Output
  outputBox: {
    minHeight: "160px",
    background: "#f8fafc",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    padding: "14px",
    fontSize: "14px",
    color: "#1e293b",
    lineHeight: "1.7",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  outputEmpty: {
    minHeight: "160px",
    background: "#f8fafc",
    borderRadius: "10px",
    border: "1.5px dashed #cbd5e1",
    padding: "14px",
    fontSize: "14px",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "8px",
  },
  outputEmptyIcon: { fontSize: "32px", opacity: 0.5 },

  // ── Spinner
  spinnerWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "160px",
    gap: "14px",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #0d9488",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  spinnerText: { fontSize: "14px", color: "#64748b" },

  // ── Toggle
  toggleBar: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  toggleLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginRight: "2px",
  },
  toggleBtn: {
    padding: "5px 12px",
    borderRadius: "7px",
    border: "1.5px solid #e2e8f0",
    background: "#fff",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  toggleBtnActive: {
    padding: "5px 12px",
    borderRadius: "7px",
    border: "1.5px solid #0d9488",
    background: "#0d9488",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.15s",
  },

  // ── Comparison
  comparisonGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  comparisonPanel: {
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    overflow: "hidden",
  },
  comparisonHeader: {
    padding: "9px 14px",
    background: "#f1f5f9",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#475569",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  comparisonHeaderAfter: {
    padding: "9px 14px",
    background: "#f0fdfa",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#0d9488",
    borderBottom: "1px solid #ccfbf1",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  comparisonBody: {
    padding: "14px",
    fontSize: "13px",
    lineHeight: "1.7",
    color: "#1e293b",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    minHeight: "110px",
  },

  // ── Highlights
  highlightChunk: {
    background: "#ccfbf1",
    borderRadius: "3px",
    padding: "0 2px",
    color: "#065f46",
    fontWeight: "600",
  },

  // ── Improvement tags
  improvementsList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "7px",
    marginTop: "14px",
  },
  improvementTag: {
    padding: "4px 11px",
    borderRadius: "999px",
    background: "#f0fdfa",
    border: "1px solid #99f6e4",
    fontSize: "12px",
    color: "#0d9488",
    fontWeight: "500",
  },

  // ── Error
  errorBox: {
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    borderRadius: "10px",
    padding: "12px 14px",
    fontSize: "13px",
    color: "#be123c",
    marginTop: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  // ── Toast
  toast: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    padding: "12px 20px",
    borderRadius: "10px",
    background: "#0f2027",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },

  // ── No-resume guard
  guardBox: {
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: "10px",
    padding: "14px 16px",
    fontSize: "13px",
    color: "#92400e",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
};

// ─── constants ───────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "summary",      label: "Professional Summary", emoji: "👤" },
  { id: "project",      label: "Project Description",  emoji: "🗂️" },
  { id: "experience",   label: "Experience",            emoji: "🏢" },
  { id: "skills",       label: "Skills",                emoji: "⚡" },
  { id: "achievements", label: "Achievements",          emoji: "🏆" },
];

const PLACEHOLDERS = {
  summary:      "e.g. Results-driven software engineer with 5 years of experience building scalable web apps...",
  project:      "e.g. Built an internal dashboard for the finance team using React and Node.js...",
  experience:   "e.g. Led a team of 4 engineers to deliver a payment module on time...",
  skills:       "e.g. JavaScript, React, Node.js, SQL, Agile, Figma...",
  achievements: "e.g. Reduced page load time by 40% through caching and code splitting...",
};

const IMPROVEMENT_TAGS = [
  "Action verbs added",
  "Quantified impact",
  "Clearer structure",
  "Removed filler words",
  "ATS-optimized",
];

const ACCEPTED_TYPES = ".pdf,.doc,.docx";

// ─── sub-components ──────────────────────────────────────────────────────────
function HighlightedText({ text }) {
  if (!text) return null;
  const parts = text.split(
    /(\d+%?|\d+\+?|increased|reduced|improved|achieved|led|built|delivered|optimized|streamlined)/gi
  );
  return (
    <>
      {parts.map((p, i) =>
        /(\d+%?|\d+\+?|increased|reduced|improved|achieved|led|built|delivered|optimized|streamlined)/i.test(p)
          ? <span key={i} style={styles.highlightChunk}>{p}</span>
          : <span key={i}>{p}</span>
      )}
    </>
  );
}

function SkeletonRows({ count = 3 }) {
  return (
    <div style={styles.resumeListLoading}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={styles.skeletonRow} />
      ))}
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────
export default function AIResumeRewrite() {
  // resume list
  const [resumes, setResumes]           = useState([]);
  const [resumesLoading, setResumesLoading] = useState(true);
  const [resumesError, setResumesError] = useState("");

  // selection
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedSection, setSelectedSection] = useState("summary");

  // rewrite
  const [inputText, setInputText]       = useState("");
  const [outputText, setOutputText]     = useState("");
  const [rewriting, setRewriting]       = useState(false);
  const [rewriteError, setRewriteError] = useState("");
  const [viewMode, setViewMode]         = useState("after");

  // upload
  const [showUpload, setShowUpload]     = useState(false);
  const [dragOver, setDragOver]         = useState(false);
  const [uploadFile, setUploadFile]     = useState(null);
  const [uploading, setUploading]       = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError]   = useState("");
  const fileInputRef                    = useRef(null);

  // ui
  const [copied, setCopied]             = useState(false);
  const [toast, setToast]               = useState("");

  // ── fetch resumes on mount

  const fetchResumes = useCallback(async () => {
  try {
    setResumesLoading(true);
    setResumesError("");

    const { data } = await api.get("/resumes");

    if (data.success) {
      setResumes(data.resumes || []);
    }
  } catch (error) {
    console.error(error);
    setResumesError("Failed to load resumes.");
  } finally {
    setResumesLoading(false);
  }
}, []);

useEffect(() => {
  fetchResumes();
}, [fetchResumes]);

  // ── upload resume
  const handleFileSelect = (file) => {
    if (!file) return;
    setUploadFile(file);
    setUploadError("");
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    setUploadProgress(10);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("resume", uploadFile);

      // simulate progress ticks
      const tick = setInterval(() => {
        setUploadProgress((p) => (p < 80 ? p + 15 : p));
      }, 300);

      const res = await fetch(`${API_BASE}/resumes/upload`, {
        method: "POST",
        headers: authHeaders(), // no Content-Type — browser sets multipart boundary
        body: formData,
      });

      clearInterval(tick);
      setUploadProgress(100);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Upload failed (${res.status})`);
      }

      showToast("✓ Resume uploaded successfully");
      setUploadFile(null);
      setShowUpload(false);
      setUploadProgress(0);
      await fetchResumes(); // refresh list
    } catch (e) {
      setUploadError(e.message || "Upload failed. Please try again.");
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  // ── rewrite
  const callRewrite = useCallback(async () => {
    if (!inputText.trim()) {
      setRewriteError("Please enter content to rewrite.");
      return;
    }
    if (!selectedResume) {
      setRewriteError("Please select a resume first.");
      return;
    }
    setRewriteError("");
    setRewriting(true);
    setOutputText("");

    try {
      const res = await fetch(`${API_BASE}/ai/rewrite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          resume_id: selectedResume,
          section:   selectedSection,
          content:   inputText.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Request failed (${res.status})`);
      }

      const json = await res.json();
      // controller returns { success, data: { rewritten } }
      setOutputText(json.data?.rewritten ?? json.rewritten ?? "");
      setViewMode("compare");
    } catch (e) {
      setRewriteError(e.message || "Something went wrong. Please try again.");
    } finally {
      setRewriting(false);
    }
  }, [inputText, selectedSection, selectedResume]);

  // ── copy / replace
  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true);
      showToast("✓ Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReplace = () => {
    if (!outputText) return;
    setInputText(outputText);
    setOutputText("");
    setViewMode("after");
    showToast("✓ Text replaced in input");
  };

  // ── toast
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  };

  // ── drag handlers
  const onDragOver  = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = ()  => setDragOver(false);
  const onDrop      = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const hasOutput = !!outputText;

  // ── format date helper
  const fmtDate = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch { return ""; }
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes shimmer  {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 768px) {
          .top-grid, .main-grid, .cmp-grid { grid-template-columns: 1fr !important; }
          .sec-grid { grid-template-columns: 1fr 1fr !important; }
          .action-row { flex-direction: column; }
          .action-row button { width: 100%; justify-content: center; }
        }
      `}</style>

      <div style={styles.container}>

        {/* ── Page header */}
        <div style={styles.pageHeader}>
          <div style={styles.breadcrumb}>
            <span>Dashboard</span>
            <span style={styles.breadcrumbSep}>›</span>
            <span>AI Tools</span>
            <span style={styles.breadcrumbSep}>›</span>
            <span style={styles.breadcrumbActive}>Resume Rewrite</span>
          </div>
          <h1 style={styles.pageTitle}>
            <span style={styles.accentDot} />
            AI Resume Rewrite
          </h1>
          <p style={styles.pageSubtitle}>
            Select a resume section, paste your content, and get an AI-improved version instantly.
          </p>
        </div>

        {/* ── Guard: no resume selected */}
        {!resumesLoading && resumes.length === 0 && !resumesError && (
          <div style={styles.guardBox}>
            📄 You have no resumes yet. Upload one below to get started.
          </div>
        )}

        {/* ── Top row */}
        <div style={styles.topGrid} className="top-grid">

          {/* Resume chooser */}
          <div style={styles.card}>
            <div style={styles.cardTitleRow}>
              <span style={styles.cardTitle}>Choose Resume</span>
              <button
                style={styles.uploadBtn}
                onClick={() => { setShowUpload((v) => !v); setUploadError(""); setUploadFile(null); }}
              >
                {showUpload ? "✕ Cancel" : "⬆ Upload Resume"}
              </button>
            </div>

            {/* Upload panel */}
            {showUpload && (
              <>
                <div
                  style={dragOver ? styles.uploadDropZoneActive : styles.uploadDropZone}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div style={styles.uploadIcon}>📂</div>
                  <p style={styles.uploadText}>
                    {uploadFile ? uploadFile.name : "Drag & drop or click to choose a file"}
                  </p>
                  <p style={styles.uploadHint}>PDF, DOC, DOCX — max 5 MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_TYPES}
                    style={{ display: "none" }}
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />
                </div>

                {uploadProgress > 0 && (
                  <div style={styles.uploadProgress}>
                    <div style={{ ...styles.uploadProgressBar, width: `${uploadProgress}%` }} />
                  </div>
                )}

                {uploadError && (
                  <div style={styles.errorBox}>
                    <span>⚠️</span> {uploadError}
                  </div>
                )}

                {uploadFile && !uploading && (
                  <div style={{ ...styles.actionRow }} className="action-row">
                    <button style={styles.btnPrimary} onClick={handleUpload}>
                      ⬆ Upload
                    </button>
                  </div>
                )}

                {uploading && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px" }}>
                    <div style={{ ...styles.spinner, width: "20px", height: "20px", borderWidth: "2px" }} />
                    <span style={{ fontSize: "13px", color: "#64748b" }}>Uploading…</span>
                  </div>
                )}
              </>
            )}

            {/* Resume list */}
            {resumesLoading ? (
              <SkeletonRows count={3} />
            ) : resumesError ? (
              <div style={styles.errorBox}>
                <span>⚠️</span> {resumesError}
                <button
                  style={{ ...styles.btnSecondary, marginLeft: "auto", padding: "5px 12px", fontSize: "12px" }}
                  onClick={fetchResumes}
                >
                  Retry
                </button>
              </div>
            ) : resumes.length === 0 ? (
              <div style={styles.resumeListEmpty}>No resumes found. Upload one above.</div>
            ) : (
              <div style={styles.resumeList}>
                {resumes.map((r) => {
                  const rid    = r._id ?? r.id;
                  const active = selectedResume === rid;
                  return (
                    <div
                      key={rid}
                      style={active ? styles.resumeOptionActive : styles.resumeOption}
                      onClick={() => setSelectedResume(rid)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setSelectedResume(rid)}
                    >
                      <div style={active ? styles.resumeIconBoxActive : styles.resumeIconBox}>
                        📄
                      </div>
                      <div style={styles.resumeInfo}>
                        <p style={styles.resumeName}>{r.filename ?? r.originalname ?? r.title ?? r.name ?? "Resume"}</p>
                        <p style={styles.resumeMeta}>
                          {r.updatedAt ? `Updated ${fmtDate(r.updatedAt)}` : r.createdAt ? `Added ${fmtDate(r.createdAt)}` : ""}
                        </p>
                      </div>
                      {active && <div style={styles.resumeCheck}>✓</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section chooser */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Select Section</div>
            <div style={styles.sectionGrid} className="sec-grid">
              {SECTIONS.map((s) => {
                const active = selectedSection === s.id;
                return (
                  <button
                    key={s.id}
                    style={active ? styles.sectionChipActive : styles.sectionChip}
                    onClick={() => setSelectedSection(s.id)}
                  >
                    <span style={styles.sectionEmoji}>{s.emoji}</span>
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Main: Input + Output */}
        <div style={styles.mainGrid} className="main-grid">

          {/* Input */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Current Content</div>
            <label style={styles.textareaLabel} htmlFor="resumeInput">
              Paste your existing {SECTIONS.find((s) => s.id === selectedSection)?.label} text
            </label>
            <textarea
              id="resumeInput"
              style={styles.textarea}
              placeholder={PLACEHOLDERS[selectedSection]}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onFocus={(e) => { e.target.style.border = "1.5px solid #0d9488"; }}
              onBlur={(e)  => { e.target.style.border = "1.5px solid #e2e8f0"; }}
            />
            <div style={styles.charCount}>{inputText.length} characters</div>

            {rewriteError && (
              <div style={styles.errorBox}>
                <span>⚠️</span> {rewriteError}
              </div>
            )}

            <div style={styles.actionRow} className="action-row">
              <button
                style={{
                  ...styles.btnPrimary,
                  ...(rewriting || !inputText.trim() || !selectedResume ? styles.btnDisabled : {}),
                }}
                onClick={callRewrite}
                disabled={rewriting || !inputText.trim() || !selectedResume}
              >
                {rewriting ? "✨ Rewriting…" : "✨ Rewrite"}
              </button>
              <button
                style={{
                  ...styles.btnSecondary,
                  ...(!hasOutput || rewriting ? styles.btnDisabled : {}),
                }}
                onClick={callRewrite}
                disabled={!hasOutput || rewriting}
              >
                🔄 Regenerate
              </button>
            </div>
          </div>

          {/* Output */}
          <div style={styles.card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
              <div style={styles.cardTitle}>AI Improved Version</div>
              {hasOutput && (
                <div style={styles.toggleBar}>
                  <span style={styles.toggleLabel}>View</span>
                  {["before", "after", "compare"].map((m) => (
                    <button
                      key={m}
                      style={viewMode === m ? styles.toggleBtnActive : styles.toggleBtn}
                      onClick={() => setViewMode(m)}
                    >
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {rewriting ? (
              <div style={styles.spinnerWrap}>
                <div style={styles.spinner} />
                <span style={styles.spinnerText}>Rewriting your content…</span>
              </div>
            ) : !hasOutput ? (
              <div style={styles.outputEmpty}>
                <span style={styles.outputEmptyIcon}>🤖</span>
                <span>Your AI-improved version will appear here</span>
              </div>
            ) : viewMode === "compare" ? (
              <div style={styles.comparisonGrid} className="cmp-grid">
                <div style={styles.comparisonPanel}>
                  <div style={styles.comparisonHeader}><span>📄</span> Before</div>
                  <div style={styles.comparisonBody}>{inputText}</div>
                </div>
                <div style={styles.comparisonPanel}>
                  <div style={styles.comparisonHeaderAfter}><span>✨</span> After</div>
                  <div style={styles.comparisonBody}>
                    <HighlightedText text={outputText} />
                  </div>
                </div>
              </div>
            ) : viewMode === "before" ? (
              <div style={styles.outputBox}>{inputText}</div>
            ) : (
              <div style={styles.outputBox}>
                <HighlightedText text={outputText} />
              </div>
            )}

            {hasOutput && (
              <>
                <div style={styles.improvementsList}>
                  {IMPROVEMENT_TAGS.map((tag) => (
                    <span key={tag} style={styles.improvementTag}>✓ {tag}</span>
                  ))}
                </div>
                <div style={styles.actionRow} className="action-row">
                  <button
                    style={copied ? styles.btnSuccess : styles.btnSecondary}
                    onClick={handleCopy}
                  >
                    {copied ? "✓ Copied!" : "📋 Copy"}
                  </button>
                  <button style={styles.btnAccent} onClick={handleReplace}>
                    ↩ Replace Existing Text
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  );
}