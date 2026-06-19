import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

/* ── API helpers ──────────────────────────────────── */
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

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  .ats-reports-root {
    font-family: 'Inter', sans-serif;
    background: #f0fafa;
    min-height: 100vh;
    padding: 32px 24px;
    color: #0d2b2b;
    box-sizing: border-box;
  }

  /* ── Page Header ─────────────────────────────── */
  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 32px;
    flex-wrap: wrap;
  }

  .page-title-group {}

  .page-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #0d9488;
    margin: 0 0 6px 0;
  }

  .page-title {
    font-size: 28px;
    font-weight: 700;
    color: #0d2b2b;
    margin: 0 0 4px 0;
    letter-spacing: -0.5px;
  }

  .page-subtitle {
    font-size: 14px;
    color: #5c8080;
    margin: 0;
  }

  /* ── Statistics Cards ────────────────────────── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 28px;
  }

  .stat-card {
    background: #ffffff;
    border: 1px solid #cde8e8;
    border-radius: 12px;
    padding: 20px;
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }

  .stat-card:hover {
    box-shadow: 0 4px 20px rgba(13, 148, 136, 0.1);
    transform: translateY(-1px);
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #0d9488, #14b8a6);
  }

  .stat-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: #f0fdfb;
    border: 1px solid #cde8e8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    margin-bottom: 12px;
  }

  .stat-value {
    font-size: 30px;
    font-weight: 700;
    color: #0d2b2b;
    line-height: 1;
    margin-bottom: 4px;
    letter-spacing: -1px;
  }

  .stat-value span {
    font-size: 16px;
    font-weight: 500;
    color: #5c8080;
    letter-spacing: 0;
  }

  .stat-label {
    font-size: 12px;
    color: #5c8080;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  /* ── Controls Bar ────────────────────────────── */
  .controls-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    align-items: center;
  }

  .search-wrapper {
    position: relative;
    flex: 1;
    min-width: 200px;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #5c8080;
    font-size: 14px;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 9px 12px 9px 36px;
    border: 1px solid #cde8e8;
    border-radius: 8px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    background: #ffffff;
    color: #0d2b2b;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    box-sizing: border-box;
  }

  .search-input:focus {
    border-color: #0d9488;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.12);
  }

  .search-input::placeholder {
    color: #9dbdbd;
  }

  .filter-select {
    padding: 9px 32px 9px 12px;
    border: 1px solid #cde8e8;
    border-radius: 8px;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    background: #ffffff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235c8080' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 10px center;
    color: #0d2b2b;
    outline: none;
    appearance: none;
    cursor: pointer;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .filter-select:focus {
    border-color: #0d9488;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.12);
  }

  .results-count {
    font-size: 13px;
    color: #5c8080;
    white-space: nowrap;
    align-self: center;
    margin-left: auto;
  }

  /* ── Table ───────────────────────────────────── */
  .table-container {
    background: #ffffff;
    border: 1px solid #cde8e8;
    border-radius: 12px;
    overflow: hidden;
  }

  .reports-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  .reports-table thead {
    background: #f0fdfb;
    border-bottom: 1px solid #cde8e8;
  }

  .reports-table th {
    padding: 12px 16px;
    text-align: left;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #5c8080;
    white-space: nowrap;
  }

  .reports-table td {
    padding: 14px 16px;
    border-bottom: 1px solid #f0fafa;
    vertical-align: middle;
    color: #0d2b2b;
  }

  .reports-table tbody tr:last-child td {
    border-bottom: none;
  }

  .reports-table tbody tr {
    transition: background 0.12s ease;
  }

  .reports-table tbody tr:hover {
    background: #f7fefe;
  }

  .resume-name {
    font-weight: 600;
    color: #0d2b2b;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .job-info {}

  .job-title-cell {
    font-weight: 500;
    color: #0d2b2b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
  }

  .company-cell {
    font-size: 12px;
    color: #5c8080;
    margin-top: 2px;
  }

  /* ── Score Ring ──────────────────────────────── */
  .score-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .score-ring-wrap {
    position: relative;
    width: 42px;
    height: 42px;
    flex-shrink: 0;
  }

  .score-ring-svg {
    width: 42px;
    height: 42px;
    transform: rotate(-90deg);
  }

  .score-ring-bg {
    fill: none;
    stroke: #e0f2f1;
    stroke-width: 3;
  }

  .score-ring-fill {
    fill: none;
    stroke-width: 3;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.6s ease;
  }

  .score-ring-text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    color: #0d2b2b;
  }

  .score-label {
    font-size: 18px;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    color: #0d2b2b;
  }

  /* ── Status Badge ────────────────────────────── */
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  .status-badge::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }

  .status-excellent {
    background: #ecfdf5;
    color: #059669;
    border: 1px solid #a7f3d0;
  }

  .status-excellent::before { background: #059669; }

  .status-good {
    background: #f0fdfb;
    color: #0d9488;
    border: 1px solid #99f6e4;
  }

  .status-good::before { background: #0d9488; }

  .status-fair {
    background: #fffbeb;
    color: #d97706;
    border: 1px solid #fde68a;
  }

  .status-fair::before { background: #d97706; }

  .status-poor {
    background: #fff1f2;
    color: #e11d48;
    border: 1px solid #fecdd3;
  }

  .status-poor::before { background: #e11d48; }

  /* ── Date ────────────────────────────────────── */
  .date-cell {
    font-size: 13px;
    color: #5c8080;
    white-space: nowrap;
  }

  .date-cell strong {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #0d2b2b;
  }

  /* ── Action Buttons ──────────────────────────── */
  .actions-cell {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .btn-icon {
    width: 32px;
    height: 32px;
    border-radius: 7px;
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
    background: none;
  }

  .btn-icon:active { transform: scale(0.92); }

  .btn-view {
    border-color: #cde8e8;
    color: #0d9488;
    background: #f0fdfb;
  }

  .btn-view:hover {
    background: #0d9488;
    border-color: #0d9488;
    color: #fff;
  }

  .btn-download {
    border-color: #cde8e8;
    color: #0d9488;
    background: #f0fdfb;
  }

  .btn-download:hover {
    background: #0f766e;
    border-color: #0f766e;
    color: #fff;
  }

  .btn-delete {
    border-color: #fecdd3;
    color: #e11d48;
    background: #fff1f2;
  }

  .btn-delete:hover {
    background: #e11d48;
    border-color: #e11d48;
    color: #fff;
  }

  /* ── Empty State ─────────────────────────────── */
  .empty-state {
    text-align: center;
    padding: 64px 24px;
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.4;
  }

  .empty-title {
    font-size: 18px;
    font-weight: 600;
    color: #0d2b2b;
    margin: 0 0 8px;
  }

  .empty-desc {
    font-size: 14px;
    color: #5c8080;
    margin: 0;
  }

  /* ── Loading ─────────────────────────────────── */
  .loading-row td {
    text-align: center;
    padding: 56px;
    color: #5c8080;
    font-size: 14px;
  }

  .spinner {
    display: inline-block;
    width: 28px;
    height: 28px;
    border: 3px solid #cde8e8;
    border-top-color: #0d9488;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-bottom: 12px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── Error Banner ────────────────────────────── */
  .error-banner {
    background: #fff1f2;
    border: 1px solid #fecdd3;
    border-radius: 10px;
    padding: 14px 18px;
    font-size: 14px;
    color: #be123c;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* ── Mobile Cards ────────────────────────────── */
  .mobile-cards {
    display: none;
    flex-direction: column;
    gap: 12px;
  }

  .report-card {
    background: #ffffff;
    border: 1px solid #cde8e8;
    border-radius: 12px;
    padding: 16px;
    position: relative;
    overflow: hidden;
  }

  .report-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .report-card-title {
    font-weight: 600;
    font-size: 15px;
    color: #0d2b2b;
    margin: 0 0 2px;
  }

  .report-card-job {
    font-size: 12px;
    color: #5c8080;
    margin: 0;
  }

  .report-card-score {
    font-family: 'JetBrains Mono', monospace;
    font-size: 24px;
    font-weight: 700;
    line-height: 1;
  }

  .report-card-meta {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }

  .report-card-date {
    font-size: 12px;
    color: #5c8080;
    margin-left: auto;
  }

  .report-card-actions {
    display: flex;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid #f0fafa;
  }

  .btn-card-action {
    flex: 1;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #cde8e8;
    background: #f0fdfb;
    color: #0d9488;
    font-size: 12px;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    transition: background 0.15s ease;
  }

  .btn-card-action:hover { background: #ccfbf1; }

  .btn-card-delete {
    border-color: #fecdd3;
    background: #fff1f2;
    color: #e11d48;
  }

  .btn-card-delete:hover { background: #ffe4e6; }

  /* ── Delete Modal ────────────────────────────── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 24px;
  }

  .modal {
    background: #ffffff;
    border-radius: 14px;
    padding: 28px;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  }

  .modal-icon {
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

  .modal-title {
    font-size: 18px;
    font-weight: 700;
    color: #0d2b2b;
    margin: 0 0 8px;
  }

  .modal-body {
    font-size: 14px;
    color: #5c8080;
    margin: 0 0 24px;
    line-height: 1.6;
  }

  .modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .btn-cancel {
    padding: 9px 18px;
    border: 1px solid #cde8e8;
    border-radius: 8px;
    background: #fff;
    color: #5c8080;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }

  .btn-cancel:hover { background: #f0fafa; }

  .btn-confirm-delete {
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

  .btn-confirm-delete:hover { background: #be123c; }
  .btn-confirm-delete:disabled {
    background: #fca5a5;
    cursor: not-allowed;
  }

  /* ── Responsive ──────────────────────────────── */
  @media (max-width: 900px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .ats-reports-root {
      padding: 20px 16px;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .stat-card {
      padding: 14px;
    }

    .stat-value {
      font-size: 22px;
    }

    .table-container {
      display: none;
    }

    .mobile-cards {
      display: flex;
    }

    .controls-bar {
      gap: 8px;
    }

    .filter-select {
      flex: 1;
    }

    .results-count {
      width: 100%;
      margin-left: 0;
    }
  }
`;

/* ── Helpers ──────────────────────────────────────── */
const getScoreColor = (score) => {
  if (score >= 80) return "#059669";
  if (score >= 60) return "#0d9488";
  if (score >= 40) return "#d97706";
  return "#e11d48";
};

const getScoreStatus = (score) => {
  if (score >= 80) return { label: "Excellent", cls: "status-excellent" };
  if (score >= 60) return { label: "Good", cls: "status-good" };
  if (score >= 40) return { label: "Fair", cls: "status-fair" };
  return { label: "Needs Work", cls: "status-poor" };
};

const formatDate = (iso) => {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
};

/* ── Score Ring ──────────────────────────────────── */
const ScoreRing = ({ score }) => {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = getScoreColor(score);

  return (
    <div className="score-ring-wrap">
      <svg className="score-ring-svg" viewBox="0 0 42 42">
        <circle className="score-ring-bg" cx="21" cy="21" r={r} />
        <circle
          className="score-ring-fill"
          cx="21"
          cy="21"
          r={r}
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-ring-text">{score}</div>
    </div>
  );
};



/* ── Main Component ───────────────────────────────── */
export default function ATSReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ── Fetch all reports ────────────────────────── */
  const loadReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/ats/reports");
      setReports(data.reports || []);
    } catch (err) {
      setError(err.message || "Failed to load ATS reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  /* ── Stats ──────────────────────────────────── */
  const stats = useMemo(() => {
    if (!reports.length) return { avg: 0, highest: 0, total: 0, thisMonth: 0 };
    const avg = Math.round(reports.reduce((s, r) => s + r.ats_score, 0) / reports.length);
    const highest = Math.max(...reports.map((r) => r.ats_score));
    const now = new Date();
    const thisMonth = reports.filter((r) => {
      const d = new Date(r.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    return { avg, highest, total: reports.length, thisMonth };
  }, [reports]);

  /* ── Filter + Sort ──────────────────────────── */
  const filtered = useMemo(() => {
    let arr = [...reports];
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (r) =>
          r.resume_title.toLowerCase().includes(q) ||
          r.job_title.toLowerCase().includes(q) ||
          r.company_name.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case "highest": arr.sort((a, b) => b.ats_score - a.ats_score); break;
      case "lowest": arr.sort((a, b) => a.ats_score - b.ats_score); break;
      case "oldest": arr.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); break;
      default: arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break;
    }
    return arr;
  }, [reports, search, sortBy]);

  /* ── Delete report ────────────────────────────── */
  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await apiFetch(`/ats/reports/${id}`, { method: "DELETE" });
      setReports((prev) => prev.filter((r) => r.id !== id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message || "Failed to delete report.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  /* ── Render ─────────────────────────────────── */
  return (
    <>
      <style>{css}</style>
      <div className="ats-reports-root">

        {/* Header */}
        <div className="page-header">
          <div className="page-title-group">
            <p className="page-eyebrow">ResumeAI · Analytics</p>
            <h1 className="page-title">ATS Reports</h1>
            <p className="page-subtitle">Every scan, scored and stored — track your progress over time.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{loading ? "—" : stats.avg}<span>%</span></div>
            <div className="stat-label">Average ATS Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-value">{loading ? "—" : stats.highest}<span>%</span></div>
            <div className="stat-label">Highest ATS Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📄</div>
            <div className="stat-value">{loading ? "—" : stats.total}</div>
            <div className="stat-label">Total Reports</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-value">{loading ? "—" : stats.thisMonth}</div>
            <div className="stat-label">Reports This Month</div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="error-banner">
            <span>⚠️</span>
            <span>{error}</span>
            <button
              onClick={loadReports}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "1px solid #fecdd3",
                borderRadius: "6px",
                padding: "4px 10px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#be123c",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="controls-bar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search by resume, job title, or company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Score</option>
            <option value="lowest">Lowest Score</option>
          </select>
          {!loading && (
            <span className="results-count">
              {filtered.length} {filtered.length === 1 ? "report" : "reports"}
            </span>
          )}
        </div>

        {/* Desktop Table */}
        <div className="table-container">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Resume</th>
                <th>ATS Score</th>
                <th>Job · Company</th>
                <th>Status</th>
                <th>Generated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="loading-row">
                  <td colSpan={6}>
                    <div className="spinner" />
                    <div>Loading reports…</div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>
                      <p className="empty-title">No reports found</p>
                      <p className="empty-desc">
                        {search ? "Try a different search term." : "Run your first ATS scan to see results here."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const status = getScoreStatus(r.ats_score);
                  const { date, time } = formatDate(r.created_at);
                  return (
                    <tr key={r.id}>
                      <td>
                        <div className="resume-name" title={r.resume_title}>{r.resume_title}</div>
                      </td>
                      <td>
                        <div className="score-cell">
                          <ScoreRing score={r.ats_score} />
                          <span className="score-label" style={{ color: getScoreColor(r.ats_score) }}>
                            {r.ats_score}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="job-title-cell" title={r.job_title}>{r.job_title}</div>
                        <div className="company-cell">{r.company_name}</div>
                      </td>
                      <td>
                        <span className={`status-badge ${status.cls}`}>{status.label}</span>
                      </td>
                      <td>
                        <div className="date-cell">
                          <strong>{date}</strong>
                          {time}
                        </div>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="btn-icon btn-view"
                            title="View Report"
                            onClick={() => navigate(`/ats/reports/${r.id}`)}
                          >
                            👁️
                          </button>
                          <button
                            className="btn-icon btn-download"
                            title="Download PDF"
                            onClick={() => navigate(`/ats/reports/${r.id}?download=true`)}
                          >
                            ⬇️
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            title="Delete"
                            onClick={() => setDeleteTarget(r)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="mobile-cards">
          {loading ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#5c8080" }}>
              <div className="spinner" style={{ margin: "0 auto 12px" }} />
              <div style={{ fontSize: "14px" }}>Loading reports…</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p className="empty-title">No reports found</p>
              <p className="empty-desc">
                {search ? "Try a different search term." : "Run your first ATS scan to see results here."}
              </p>
            </div>
          ) : (
            filtered.map((r) => {
              const status = getScoreStatus(r.ats_score);
              const { date } = formatDate(r.created_at);
              return (
                <div className="report-card" key={r.id}>
                  <div className="report-card-header">
                    <div>
                      <p className="report-card-title">{r.resume_title}</p>
                      <p className="report-card-job">{r.job_title} · {r.company_name}</p>
                    </div>
                    <div
                      className="report-card-score"
                      style={{ color: getScoreColor(r.ats_score) }}
                    >
                      {r.ats_score}%
                    </div>
                  </div>
                  <div className="report-card-meta">
                    <span className={`status-badge ${status.cls}`}>{status.label}</span>
                    <span className="report-card-date">{date}</span>
                  </div>
                  <div className="report-card-actions">
                    <button
                      className="btn-card-action"
                      onClick={() => navigate(`/ats/reports/${r.id}`)}
                    >
                      👁 View
                    </button>
                    <button
                      className="btn-card-action"
                      onClick={() => navigate(`/ats/reports/${r.id}?download=true`)}
                    >
                      ⬇ PDF
                    </button>
                    <button
                      className="btn-card-action btn-card-delete"
                      onClick={() => setDeleteTarget(r)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Delete Modal */}
        {deleteTarget && (
          <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icon">🗑️</div>
              <h2 className="modal-title">Delete this report?</h2>
              <p className="modal-body">
                The ATS report for <strong>{deleteTarget.resume_title}</strong> at{" "}
                <strong>{deleteTarget.company_name}</strong> will be permanently removed. This
                cannot be undone.
              </p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setDeleteTarget(null)}>
                  Cancel
                </button>
                <button
                  className="btn-confirm-delete"
                  onClick={() => handleDelete(deleteTarget.id)}
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