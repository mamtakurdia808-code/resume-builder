import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import html2pdf from "html2pdf.js";

const API_BASE = import.meta.env.VITE_API_URL;

/* ── API helper ───────────────────────────────────── */
const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

/* ── Helpers ──────────────────────────────────────── */
const safeArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return []; }
  }
  return [];
};

const getScoreColor = (score) => {
  if (score >= 80) return "#059669";
  if (score >= 60) return "#0d9488";
  if (score >= 40) return "#d97706";
  return "#e11d48";
};

const getScoreLabel = (score) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Work";
};

const getScoreBg = (score) => {
  if (score >= 80) return { bg: "#ecfdf5", border: "#a7f3d0", text: "#059669" };
  if (score >= 60) return { bg: "#f0fdfb", border: "#99f6e4", text: "#0d9488" };
  if (score >= 40) return { bg: "#fffbeb", border: "#fde68a", text: "#d97706" };
  return { bg: "#fff1f2", border: "#fecdd3", text: "#e11d48" };
};

const formatDate = (iso) => {
  if (!iso) return { date: "—", time: "" };
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
};

/* ── CSS ──────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .rd-root {
    font-family: 'Inter', sans-serif;
    background: #f0fafa;
    min-height: 100vh;
    color: #0d2b2b;
  }

  /* ── Top Nav Bar ─────────────────────────────────── */
  .rd-topbar {
    background: #ffffff;
    border-bottom: 1px solid #cde8e8;
    padding: 0 32px;
    height: 56px;
    display: flex;
    align-items: center;
    gap: 12px;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .rd-back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #5c8080;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 7px;
    transition: background 0.15s, color 0.15s;
  }

  .rd-back-btn:hover {
    background: #f0fdfb;
    color: #0d9488;
  }

  .rd-topbar-divider {
    width: 1px;
    height: 18px;
    background: #cde8e8;
  }

  .rd-topbar-crumb {
    font-size: 13px;
    color: #9dbdbd;
  }

  .rd-topbar-crumb-active {
    font-size: 13px;
    font-weight: 500;
    color: #0d2b2b;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 260px;
  }

  .rd-topbar-actions {
    margin-left: auto;
    display: flex;
    gap: 8px;
  }

  .rd-btn-outline {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border: 1px solid #cde8e8;
    border-radius: 8px;
    background: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #0d9488;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    white-space: nowrap;
  }

  .rd-btn-outline:hover {
    background: #f0fdfb;
    border-color: #0d9488;
  }

  .rd-btn-danger-outline {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border: 1px solid #fecdd3;
    border-radius: 8px;
    background: #fff1f2;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #e11d48;
    cursor: pointer;
    transition: background 0.15s;
    white-space: nowrap;
  }

  .rd-btn-danger-outline:hover {
    background: #ffe4e6;
  }

  /* ── Page Body ───────────────────────────────────── */
  .rd-body {
    max-width: 1100px;
    margin: 0 auto;
    padding: 36px 24px 64px;
  }

  /* ── Hero Score Card ─────────────────────────────── */
  .rd-hero {
    background: #ffffff;
    border: 1px solid #cde8e8;
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 32px;
    flex-wrap: wrap;
    position: relative;
    overflow: hidden;
  }

  .rd-hero::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, #0d9488, #14b8a6, #2dd4bf);
  }

  .rd-hero-gauge {
    position: relative;
    flex-shrink: 0;
  }

  .rd-gauge-svg {
    display: block;
    transform: rotate(-90deg);
  }

  .rd-gauge-bg {
    fill: none;
    stroke: #e0f2f1;
    stroke-width: 8;
  }

  .rd-gauge-fill {
    fill: none;
    stroke-width: 8;
    stroke-linecap: round;
    transition: stroke-dashoffset 1s cubic-bezier(.4,0,.2,1);
  }

  .rd-gauge-inner {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .rd-gauge-score {
    font-family: 'JetBrains Mono', monospace;
    font-size: 36px;
    font-weight: 600;
    line-height: 1;
    color: #0d2b2b;
  }

  .rd-gauge-pct {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    color: #5c8080;
    margin-top: 2px;
  }

  .rd-hero-meta {
    flex: 1;
    min-width: 200px;
  }

  .rd-hero-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #0d9488;
    margin: 0 0 8px;
  }

  .rd-hero-title {
    font-size: 22px;
    font-weight: 700;
    color: #0d2b2b;
    margin: 0 0 4px;
    letter-spacing: -0.3px;
  }

  .rd-hero-sub {
    font-size: 14px;
    color: #5c8080;
    margin: 0 0 16px;
  }

  .rd-hero-pills {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .rd-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 11px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 500;
    background: #f0fdfb;
    border: 1px solid #cde8e8;
    color: #0d6b63;
  }

  .rd-status-pill {
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.03em;
  }

  .rd-hero-date {
    margin-left: auto;
    text-align: right;
    flex-shrink: 0;
  }

  .rd-hero-date-val {
    font-size: 13px;
    font-weight: 500;
    color: #0d2b2b;
  }

  .rd-hero-date-time {
    font-size: 12px;
    color: #9dbdbd;
    margin-top: 2px;
  }

  /* ── Two-col layout ──────────────────────────────── */
  .rd-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  .rd-grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  /* ── Section Card ────────────────────────────────── */
  .rd-card {
    background: #ffffff;
    border: 1px solid #cde8e8;
    border-radius: 14px;
    overflow: hidden;
    page-break-inside: avoid;
  }

  .rd-card-full {
    background: #ffffff;
    border: 1px solid #cde8e8;
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 20px;
    page-break-inside: avoid;
  }

  .rd-card-header {
    padding: 18px 22px 14px;
    border-bottom: 1px solid #f0fafa;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .rd-card-icon {
    width: 30px;
    height: 30px;
    border-radius: 7px;
    background: #f0fdfb;
    border: 1px solid #cde8e8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
  }

  .rd-card-title {
    font-size: 14px;
    font-weight: 600;
    color: #0d2b2b;
    margin: 0;
  }

  .rd-card-count {
    margin-left: auto;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #9dbdbd;
    background: #f0fafa;
    padding: 2px 8px;
    border-radius: 999px;
    border: 1px solid #e0f0f0;
  }

  .rd-card-body {
    padding: 20px 22px;
    page-break-inside: avoid;
  }

  /* ── Score Breakdown Bars ────────────────────────── */
  .rd-score-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .rd-score-row:last-child {
    margin-bottom: 0;
  }

  .rd-score-row-label {
    font-size: 13px;
    font-weight: 500;
    color: #0d2b2b;
    width: 130px;
    flex-shrink: 0;
  }

  .rd-score-track {
    flex: 1;
    height: 8px;
    background: #e0f2f1;
    border-radius: 999px;
    overflow: hidden;
  }

  .rd-score-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 1s cubic-bezier(.4,0,.2,1);
  }

  .rd-score-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 600;
    width: 36px;
    text-align: right;
    flex-shrink: 0;
  }

  /* ── Keyword Chips ───────────────────────────────── */
  .rd-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 20px 22px;
  }

  .rd-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 11px;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 500;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.02em;
    transition: transform 0.1s ease;
  }

  .rd-chip:hover {
    transform: translateY(-1px);
  }

  .rd-chip-match {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    color: #047857;
  }

  .rd-chip-miss {
    background: #fff1f2;
    border: 1px solid #fecdd3;
    color: #be123c;
  }

  .rd-chip-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* ── Strength / Weakness / Suggestion Items ──────── */
  .rd-list {
    list-style: none;
    margin: 0;
    padding: 20px 22px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .rd-list-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 14px;
    line-height: 1.55;
    color: #1a3a3a;
  }

  .rd-list-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .rd-list-icon-strength {
    background: #ecfdf5;
    color: #059669;
  }

  .rd-list-icon-weakness {
    background: #fff7ed;
    color: #d97706;
  }

  .rd-list-icon-suggestion {
    background: #eff6ff;
    color: #2563eb;
  }

  /* ── Suggestion Cards ────────────────────────────── */
  .rd-suggestion-list {
    padding: 16px 22px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .rd-suggestion-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: #f8fffe;
    border: 1px solid #d1fae5;
    border-left: 3px solid #0d9488;
    border-radius: 8px;
    padding: 12px 14px;
  }

  .rd-suggestion-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    color: #0d9488;
    background: #f0fdfb;
    border: 1px solid #cde8e8;
    border-radius: 5px;
    padding: 2px 7px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .rd-suggestion-text {
    font-size: 13px;
    line-height: 1.6;
    color: #1a3a3a;
  }

  /* ── Empty chip state ────────────────────────────── */
  .rd-chips-empty {
    padding: 20px 22px;
    font-size: 13px;
    color: #9dbdbd;
    font-style: italic;
  }

  /* ── Loading / Error / 404 ───────────────────────── */
  .rd-center-state {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    text-align: center;
    padding: 40px 24px;
  }

  .rd-state-icon {
    font-size: 48px;
    opacity: 0.5;
    margin-bottom: 4px;
  }

  .rd-state-title {
    font-size: 20px;
    font-weight: 700;
    color: #0d2b2b;
    margin: 0;
  }

  .rd-state-desc {
    font-size: 14px;
    color: #5c8080;
    margin: 0;
    max-width: 320px;
  }

  .rd-state-btn {
    margin-top: 8px;
    padding: 9px 20px;
    background: #0d9488;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }

  .rd-state-btn:hover { background: #0f766e; }

  .rd-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #cde8e8;
    border-top-color: #0d9488;
    border-radius: 50%;
    animation: rd-spin 0.7s linear infinite;
  }

  @keyframes rd-spin { to { transform: rotate(360deg); } }

  /* ── Delete Modal ────────────────────────────────── */
  .rd-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.32);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 24px;
  }

  .rd-modal {
    background: #fff;
    border-radius: 14px;
    padding: 28px;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 24px 64px rgba(0,0,0,0.14);
  }

  .rd-modal-icon {
    width: 48px;
    height: 48px;
    background: #fff1f2;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-bottom: 16px;
  }

  .rd-modal-title {
    font-size: 18px;
    font-weight: 700;
    color: #0d2b2b;
    margin: 0 0 8px;
  }

  .rd-modal-body {
    font-size: 14px;
    color: #5c8080;
    margin: 0 0 24px;
    line-height: 1.6;
  }

  .rd-modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .rd-modal-cancel {
    padding: 9px 18px;
    border: 1px solid #cde8e8;
    border-radius: 8px;
    background: #fff;
    color: #5c8080;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    cursor: pointer;
  }

  .rd-modal-cancel:hover { background: #f0fafa; }

  .rd-modal-confirm {
    padding: 9px 18px;
    border: none;
    border-radius: 8px;
    background: #e11d48;
    color: #fff;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }

  .rd-modal-confirm:hover { background: #be123c; }
  .rd-modal-confirm:disabled { background: #fca5a5; cursor: not-allowed; }

  /* ── Responsive ──────────────────────────────────── */
  @media (max-width: 900px) {
    .rd-grid { grid-template-columns: 1fr; }
    .rd-grid-3 { grid-template-columns: 1fr; }
  }

  @media (max-width: 640px) {
    .rd-topbar { padding: 0 16px; }
    .rd-topbar-crumb, .rd-topbar-divider { display: none; }
    .rd-topbar-crumb-active { max-width: 140px; }
    .rd-body { padding: 20px 16px 48px; }
    .rd-hero { gap: 20px; padding: 24px 20px; }
    .rd-hero-date { display: none; }
    .rd-gauge-svg { width: 100px !important; height: 100px !important; }
    .rd-gauge-score { font-size: 28px; }
    .rd-score-row-label { width: 100px; font-size: 12px; }
    .rd-btn-outline span, .rd-btn-danger-outline span { display: none; }
  }

  .rd-card,
.rd-card-full,
.rd-hero,
.rd-suggestion-item,
.rd-score-row{
    break-inside: avoid;
    page-break-inside: avoid;
}

.rd-body{
    width:210mm;
    max-width:210mm;
    min-height:297mm;
    margin:auto;
    padding:12mm;
    background:white;
}
@media print {

  body{
      background:white !important;
  }

  .rd-topbar{
      display:none;
  }

  .rd-overlay{
      display:none;
  }

  .rd-root{
      background:white;
  }

  .rd-body{
      width:100%;
      max-width:100%;
      padding:10mm;
      margin:0;
  }

}
`;

/* ── Animated gauge ───────────────────────────────── */
const Gauge = ({ score }) => {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  const color = getScoreColor(score);

  useEffect(() => {
    const t = setTimeout(() => setOffset(circ - (score / 100) * circ), 120);
    return () => clearTimeout(t);
  }, [score, circ]);

  return (
    <div className="rd-hero-gauge" style={{ width: 130, height: 130 }}>
      <svg className="rd-gauge-svg" width="130" height="130" viewBox="0 0 130 130">
        <circle className="rd-gauge-bg" cx="65" cy="65" r={r} />
        <circle
          className="rd-gauge-fill"
          cx="65"
          cy="65"
          r={r}
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="rd-gauge-inner">
        <span className="rd-gauge-score" style={{ color }}>{score}</span>
        <span className="rd-gauge-pct">/ 100</span>
      </div>
    </div>
  );
};

/* ── Animated score bar ───────────────────────────── */
const ScoreBar = ({ label, value }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 200);
    return () => clearTimeout(t);
  }, [value]);
  const color = getScoreColor(value);
  return (
    <div className="rd-score-row">
      <span className="rd-score-row-label">{label}</span>
      <div className="rd-score-track">
        <div className="rd-score-fill" style={{ width: `${width}%`, background: color }} />
      </div>
      <span className="rd-score-num" style={{ color }}>{value}%</span>
    </div>
  );
};

/* ── Main Component ───────────────────────────────── */
export default function ATSReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const printRef = useRef();

  /* ── Fetch report ─────────────────────────────── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch(`/ats/reports/${id}`);

        setReport(data.report);
      } catch (err) {
        setError(err.message || "Failed to load report.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ── Auto-trigger download if ?download=true ──── */
  useEffect(() => {
    if (report && searchParams.get("download") === "true") {
      setTimeout(() => handleDownload(), 600);
    }
  }, [report]);

  /* ── Download PDF via html2canvas + jsPDF ──────── */
  const handleDownload = async () => {
  if (!printRef.current || downloading) return;

  setDownloading(true);

  try {
    const element = printRef.current;

    const opt = {
      margin: [8, 8, 8, 8],

      filename: `ATS-Report-${job_title || "report"}-${company_name || ""}`
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-]/g, "")
        .toLowerCase() + ".pdf",

      image: {
        type: "jpeg",
        quality: 1,
      },

      html2canvas: {
        scale: 3,
        useCORS: true,
        backgroundColor: "#f0fafa",
        scrollX: 0,
        scrollY: 0,
        letterRendering: true,
      },

      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },

      pagebreak: {
        mode: ["css", "legacy"],
        avoid: [
          ".rd-card",
          ".rd-card-full",
          ".rd-hero",
          ".rd-suggestion-item",
          ".rd-score-row",
        ],
      },
    };

    await html2pdf().set(opt).from(element).save();
  } catch (err) {
    console.error(err);
  } finally {
    setDownloading(false);
  }
};

  /* ── Delete ───────────────────────────────────── */
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/ats/reports/${id}`, { method: "DELETE" });
      navigate("/ats/reports", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to delete report.");
      setShowDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  /* ── Loading state ────────────────────────────── */
  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div className="rd-root">
          <div className="rd-center-state">
            <div className="rd-spinner" />
            <p className="rd-state-desc">Loading your ATS report…</p>
          </div>
        </div>
      </>
    );
  }

  /* ── Error state ──────────────────────────────── */
  if (error && !report) {
    return (
      <>
        <style>{css}</style>
        <div className="rd-root">
          <div className="rd-center-state">
            <div className="rd-state-icon">⚠️</div>
            <h2 className="rd-state-title">Something went wrong</h2>
            <p className="rd-state-desc">{error}</p>
            <button className="rd-state-btn" onClick={() => navigate("/ats/reports")}>
              ← Back to Reports
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ── 404 state ────────────────────────────────── */
  if (!report) {
    return (
      <>
        <style>{css}</style>
        <div className="rd-root">
          <div className="rd-center-state">
            <div className="rd-state-icon">📭</div>
            <h2 className="rd-state-title">Report not found</h2>
            <p className="rd-state-desc">This report may have been deleted or doesn't belong to your account.</p>
            <button className="rd-state-btn" onClick={() => navigate("/ats/reports")}>
              ← Back to Reports
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ── Destructure ──────────────────────────────── */
  const {
    resume_title,
    job_title,
    company_name,
    ats_score,
    keyword_match,
    formatting_score,
    skills_score,
    experience_score,
    education_score,
    matched_keywords,
    missing_keywords,
    strengths,
    weaknesses,
    suggestions,
    created_at,
  } = report;

  const matchedArr   = safeArray(matched_keywords);
  const missingArr   = safeArray(missing_keywords);
  const strengthsArr = safeArray(strengths);
  const weaknessArr  = safeArray(weaknesses);
  const suggestArr   = safeArray(suggestions);

  const { bg, border, text } = getScoreBg(ats_score);
  const { date, time } = formatDate(created_at);

  /* ── Render ───────────────────────────────────── */
  return (
    <>
      <style>{css}</style>
      <div className="rd-root">

        {/* ── Top Nav ── */}
        <div className="rd-topbar">
          <button className="rd-back-btn" onClick={() => navigate("/ats/reports")}>
            ← <span>Reports</span>
          </button>
          <div className="rd-topbar-divider" />
          <span className="rd-topbar-crumb">ATS Reports</span>
          <div className="rd-topbar-divider" />
          <span className="rd-topbar-crumb-active" title={`${job_title} at ${company_name}`}>
            {job_title} @ {company_name}
          </span>
          <div className="rd-topbar-actions">
            <button
              className="rd-btn-outline"
              onClick={handleDownload}
              disabled={downloading}
              style={{ opacity: downloading ? 0.7 : 1, cursor: downloading ? "not-allowed" : "pointer" }}
            >
              <span>{downloading ? "⏳" : "⬇"}</span>
              <span>{downloading ? "Generating…" : "Download PDF"}</span>
            </button>
            <button className="rd-btn-danger-outline" onClick={() => setShowDelete(true)}>
              <span>🗑</span> <span>Delete</span>
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div ref={printRef}>

    <div className="rd-body">

          {/* ── Hero ── */}
          <div className="rd-hero">
            <Gauge score={ats_score} />

            <div className="rd-hero-meta">
              <p className="rd-hero-eyebrow">ATS Score Report</p>
              <h1 className="rd-hero-title">{job_title}{company_name ? ` at ${company_name}` : ""}</h1>
              <p className="rd-hero-sub">Based on resume: <strong>{resume_title}</strong></p>
              <div className="rd-hero-pills">
                <span
                  className="rd-status-pill"
                  style={{ background: bg, border: `1px solid ${border}`, color: text }}
                >
                  {getScoreLabel(ats_score)}
                </span>
                {company_name && (
                  <span className="rd-pill">🏢 {company_name}</span>
                )}
                <span className="rd-pill">📄 {resume_title}</span>
              </div>
            </div>

            <div className="rd-hero-date">
              <div className="rd-hero-date-val">{date}</div>
              <div className="rd-hero-date-time">{time}</div>
            </div>
          </div>
    </div>

          {/* ── Score Breakdown ── */}
          <div className="rd-card-full">
            <div className="rd-card-header">
              <div className="rd-card-icon">📊</div>
              <h2 className="rd-card-title">Score Breakdown</h2>
            </div>
            <div className="rd-card-body">
              <ScoreBar label="Keyword Match"  value={keyword_match} />
              <ScoreBar label="Skills"         value={skills_score} />
              <ScoreBar label="Experience"     value={experience_score} />
              <ScoreBar label="Education"      value={education_score} />
              <ScoreBar label="Formatting"     value={formatting_score} />
            </div>
          </div>

          {/* ── Keywords row ── */}
          <div className="rd-grid">

            {/* Matched Keywords */}
            <div className="rd-card">
              <div className="rd-card-header">
                <div className="rd-card-icon">✅</div>
                <h2 className="rd-card-title">Matched Keywords</h2>
                <span className="rd-card-count">{matchedArr.length}</span>
              </div>
              {matchedArr.length > 0 ? (
                <div className="rd-chips">
                  {matchedArr.map((kw, i) => (
                    <span key={i} className="rd-chip rd-chip-match">
                      <span className="rd-chip-dot" style={{ background: "#059669" }} />
                      {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="rd-chips-empty">No matched keywords found.</p>
              )}
            </div>

            {/* Missing Keywords */}
            <div className="rd-card">
              <div className="rd-card-header">
                <div className="rd-card-icon">❌</div>
                <h2 className="rd-card-title">Missing Keywords</h2>
                <span className="rd-card-count">{missingArr.length}</span>
              </div>
              {missingArr.length > 0 ? (
                <div className="rd-chips">
                  {missingArr.map((kw, i) => (
                    <span key={i} className="rd-chip rd-chip-miss">
                      <span className="rd-chip-dot" style={{ background: "#e11d48" }} />
                      {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="rd-chips-empty">No missing keywords — great coverage!</p>
              )}
            </div>
          </div>

          {/* ── Strengths & Weaknesses ── */}
          <div className="rd-grid">

            {/* Strengths */}
            <div className="rd-card">
              <div className="rd-card-header">
                <div className="rd-card-icon">💪</div>
                <h2 className="rd-card-title">Strengths</h2>
                <span className="rd-card-count">{strengthsArr.length}</span>
              </div>
              {strengthsArr.length > 0 ? (
                <ul className="rd-list">
                  {strengthsArr.map((item, i) => (
                    <li key={i} className="rd-list-item">
                      <span className="rd-list-icon rd-list-icon-strength">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rd-chips-empty">No strengths data available.</p>
              )}
            </div>

            {/* Weaknesses */}
            <div className="rd-card">
              <div className="rd-card-header">
                <div className="rd-card-icon">⚠️</div>
                <h2 className="rd-card-title">Weaknesses</h2>
                <span className="rd-card-count">{weaknessArr.length}</span>
              </div>
              {weaknessArr.length > 0 ? (
                <ul className="rd-list">
                  {weaknessArr.map((item, i) => (
                    <li key={i} className="rd-list-item">
                      <span className="rd-list-icon rd-list-icon-weakness">!</span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rd-chips-empty">No weaknesses found — well done!</p>
              )}
            </div>
          </div>

          {/* ── Suggestions ── */}
          <div className="rd-card-full">
            <div className="rd-card-header">
              <div className="rd-card-icon">💡</div>
              <h2 className="rd-card-title">Suggestions to Improve Your Score</h2>
              <span className="rd-card-count">{suggestArr.length}</span>
            </div>
            {suggestArr.length > 0 ? (
              <div className="rd-suggestion-list">
                {suggestArr.map((item, i) => (
                  <div key={i} className="rd-suggestion-item">
                    <span className="rd-suggestion-num">#{String(i + 1).padStart(2, "0")}</span>
                    <p className="rd-suggestion-text">{item}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rd-chips-empty" style={{ padding: "20px 22px" }}>No suggestions — your resume is well-optimized!</p>
            )}
          </div>

        </div>{/* end rd-body */}

        {/* ── Delete Modal ── */}
        {showDelete && (
          <div className="rd-overlay" onClick={() => !deleting && setShowDelete(false)}>
            <div className="rd-modal" onClick={(e) => e.stopPropagation()}>
              <div className="rd-modal-icon">🗑️</div>
              <h2 className="rd-modal-title">Delete this report?</h2>
              <p className="rd-modal-body">
                The ATS report for <strong>{resume_title}</strong>
                {company_name ? <> at <strong>{company_name}</strong></> : ""} will be permanently
                removed. This cannot be undone.
              </p>
              <div className="rd-modal-actions">
                <button
                  className="rd-modal-cancel"
                  onClick={() => setShowDelete(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  className="rd-modal-confirm"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting…" : "Delete Report"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
