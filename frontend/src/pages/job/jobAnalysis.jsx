import { useState, useCallback } from "react";
import { analyzeJob } from "../../services/jobAnalyzeService";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --teal-950: #042f2e;
    --teal-900: #134e4a;
    --teal-800: #115e59;
    --teal-700: #0f766e;
    --teal-600: #0d9488;
    --teal-500: #14b8a6;
    --teal-400: #2dd4bf;
    --teal-300: #5eead4;
    --teal-100: #ccfbf1;
    --teal-50:  #f0fdfa;

    --slate-950: #020617;
    --slate-900: #0f172a;
    --slate-800: #1e293b;
    --slate-700: #334155;
    --slate-600: #475569;
    --slate-500: #64748b;
    --slate-400: #94a3b8;
    --slate-300: #cbd5e1;
    --slate-200: #e2e8f0;
    --slate-100: #f1f5f9;
    --slate-50:  #f8fafc;

    --amber-500: #f59e0b;
    --amber-100: #fef3c7;
    --emerald-500: #10b981;
    --emerald-100: #d1fae5;
    --violet-500: #8b5cf6;
    --violet-100: #ede9fe;
    --rose-500: #f43f5e;
    --rose-100: #ffe4e6;
    --sky-500: #0ea5e9;
    --sky-100: #e0f2fe;
    --orange-500: #f97316;
    --orange-100: #ffedd5;

    --font-sans: 'Inter', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;

    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 14px;
    --radius-xl: 20px;

    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05);
    --shadow-lg: 0 10px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06);
    --shadow-teal: 0 4px 20px rgba(20,184,166,0.18);

    --transition: 0.18s ease;
  }

  /* ── Layout ─────────────────────────────────────────────────── */
  .ja-root {
    font-family: var(--font-sans);
    background: var(--slate-50);
    min-height: 100vh;
    padding: 28px 24px 60px;
    box-sizing: border-box;
    color: var(--slate-900);
  }

  /* ── Page Header ─────────────────────────────────────────────── */
  .ja-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .ja-header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .ja-header-icon {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, var(--teal-600), var(--teal-400));
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: var(--shadow-teal);
  }
  .ja-header-icon svg {
    color: #fff;
  }
  .ja-title {
    font-size: 22px;
    font-weight: 700;
    color: var(--slate-900);
    margin: 0;
    letter-spacing: -0.3px;
  }
  .ja-subtitle {
    font-size: 13px;
    color: var(--slate-500);
    margin: 2px 0 0;
  }
  .ja-header-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--teal-50);
    border: 1px solid var(--teal-300);
    color: var(--teal-700);
    font-size: 12px;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 20px;
    letter-spacing: 0.2px;
  }
  .ja-header-badge-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--teal-500);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  /* ── Two-Column Grid ─────────────────────────────────────────── */
  .ja-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .ja-grid { grid-template-columns: 1fr; }
  }

  /* ── Card ────────────────────────────────────────────────────── */
  .ja-card {
    background: #fff;
    border: 1px solid var(--slate-200);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }
  .ja-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 18px 22px 14px;
    border-bottom: 1px solid var(--slate-100);
  }
  .ja-card-header-icon {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: var(--teal-50);
  }
  .ja-card-header-icon svg { color: var(--teal-600); }
  .ja-card-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--slate-800);
    margin: 0;
    letter-spacing: -0.1px;
  }
  .ja-card-desc {
    font-size: 12px;
    color: var(--slate-400);
    margin: 1px 0 0;
  }
  .ja-card-body {
    padding: 20px 22px 22px;
  }

  /* ── Textarea ────────────────────────────────────────────────── */
  .ja-textarea-wrap {
    position: relative;
  }
  .ja-textarea {
    width: 100%;
    min-height: 380px;
    resize: vertical;
    border: 1.5px solid var(--slate-200);
    border-radius: var(--radius-lg);
    padding: 14px 16px;
    font-family: var(--font-sans);
    font-size: 13.5px;
    line-height: 1.65;
    color: var(--slate-800);
    background: var(--slate-50);
    box-sizing: border-box;
    outline: none;
    transition: border-color var(--transition), box-shadow var(--transition);
  }
  .ja-textarea:focus {
    border-color: var(--teal-400);
    box-shadow: 0 0 0 3px rgba(20,184,166,0.12);
    background: #fff;
  }
  .ja-textarea::placeholder { color: var(--slate-400); }
  .ja-char-count {
    position: absolute;
    bottom: 10px;
    right: 14px;
    font-size: 11px;
    color: var(--slate-400);
    font-family: var(--font-mono);
    pointer-events: none;
  }
  .ja-textarea-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    font-size: 12px;
    color: var(--slate-400);
  }
  .ja-textarea-hint svg { color: var(--teal-500); flex-shrink: 0; }

  /* ── Buttons ─────────────────────────────────────────────────── */
  .ja-btn-row {
    display: flex;
    gap: 10px;
    margin-top: 18px;
    flex-wrap: wrap;
  }
  .ja-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border: none;
    border-radius: var(--radius-md);
    font-family: var(--font-sans);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    padding: 10px 18px;
    transition: all var(--transition);
    white-space: nowrap;
    letter-spacing: 0.1px;
  }
  .ja-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  .ja-btn-primary {
    background: linear-gradient(135deg, var(--teal-600), var(--teal-500));
    color: #fff;
    box-shadow: var(--shadow-teal);
  }
  .ja-btn-primary:not(:disabled):hover {
    background: linear-gradient(135deg, var(--teal-700), var(--teal-600));
    box-shadow: 0 6px 24px rgba(20,184,166,0.28);
    transform: translateY(-1px);
  }
  .ja-btn-ghost {
    background: var(--slate-100);
    color: var(--slate-700);
    border: 1px solid var(--slate-200);
  }
  .ja-btn-ghost:not(:disabled):hover {
    background: var(--slate-200);
    color: var(--slate-900);
  }
  .ja-btn-outline-teal {
    background: var(--teal-50);
    color: var(--teal-700);
    border: 1px solid var(--teal-300);
  }
  .ja-btn-outline-teal:not(:disabled):hover {
    background: var(--teal-100);
    border-color: var(--teal-400);
  }
  .ja-btn-spin {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Empty / Error States ────────────────────────────────────── */
  .ja-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 380px;
    text-align: center;
    gap: 12px;
    color: var(--slate-400);
    padding: 32px;
  }
  .ja-empty-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--slate-100);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ja-empty-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--slate-500);
    margin: 0;
  }
  .ja-empty-sub {
    font-size: 12.5px;
    color: var(--slate-400);
    margin: 0;
    max-width: 240px;
    line-height: 1.5;
  }
  .ja-error-banner {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: var(--rose-100);
    border: 1px solid #fecdd3;
    border-radius: var(--radius-md);
    padding: 12px 14px;
    margin-bottom: 14px;
    font-size: 13px;
    color: #9f1239;
  }
  .ja-error-banner svg { flex-shrink: 0; margin-top: 1px; }

  /* ── Analysis Sections ───────────────────────────────────────── */
  .ja-analysis-scroll {
    display: flex;
    flex-direction: column;
    gap: 0;
    max-height: 520px;
    overflow-y: auto;
    padding-right: 2px;
    scrollbar-width: thin;
    scrollbar-color: var(--slate-300) transparent;
  }
  .ja-analysis-scroll::-webkit-scrollbar { width: 4px; }
  .ja-analysis-scroll::-webkit-scrollbar-thumb { background: var(--slate-300); border-radius: 4px; }

  /* ── Info Row (Title, Company, Experience, Education) ────────── */
  .ja-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 16px;
  }
  @media (max-width: 600px) {
    .ja-info-grid { grid-template-columns: 1fr; }
  }
  .ja-info-item {
    background: var(--slate-50);
    border: 1px solid var(--slate-200);
    border-radius: var(--radius-md);
    padding: 10px 13px;
  }
  .ja-info-label {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--slate-400);
    margin-bottom: 4px;
  }
  .ja-info-value {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--slate-800);
    line-height: 1.3;
  }

  /* ── Section Block ───────────────────────────────────────────── */
  .ja-section {
    border-bottom: 1px solid var(--slate-100);
    padding: 14px 0;
  }
  .ja-section:last-child { border-bottom: none; }
  .ja-section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    cursor: pointer;
    user-select: none;
  }
  .ja-section-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .ja-section-label {
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    flex: 1;
  }
  .ja-section-count {
    font-size: 11px;
    font-weight: 600;
    color: var(--slate-400);
    background: var(--slate-100);
    padding: 2px 7px;
    border-radius: 10px;
    font-family: var(--font-mono);
  }
  .ja-chevron {
    color: var(--slate-400);
    transition: transform var(--transition);
  }
  .ja-chevron.open { transform: rotate(90deg); }

  /* ── Tag Pill ────────────────────────────────────────────────── */
  .ja-tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .ja-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    transition: transform var(--transition);
    cursor: default;
  }
  .ja-tag:hover { transform: scale(1.04); }

  /* tag color variants */
  .ja-tag-teal   { background: var(--teal-100); color: var(--teal-800); }
  .ja-tag-violet { background: var(--violet-100); color: #5b21b6; }
  .ja-tag-amber  { background: var(--amber-100); color: #92400e; }
  .ja-tag-emerald{ background: var(--emerald-100); color: #065f46; }
  .ja-tag-sky    { background: var(--sky-100); color: #0c4a6e; }
  .ja-tag-orange { background: var(--orange-100); color: #9a3412; }
  .ja-tag-slate  { background: var(--slate-100); color: var(--slate-700); }

  /* ── Responsibilities / Text List ────────────────────────────── */
  .ja-text-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .ja-text-list li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 12.5px;
    color: var(--slate-700);
    line-height: 1.5;
  }
  .ja-text-list li::before {
    content: "";
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--teal-400);
    flex-shrink: 0;
    margin-top: 6px;
  }

  /* ── AI Suggestion Block ─────────────────────────────────────── */
  .ja-ai-section {
    background: linear-gradient(135deg, var(--teal-950), var(--teal-900));
    border-radius: var(--radius-lg);
    padding: 16px 18px;
    margin-top: 16px;
  }
  .ja-ai-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
  }
  .ja-ai-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(20,184,166,0.2);
    border: 1px solid rgba(45,212,191,0.3);
    color: var(--teal-300);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 20px;
  }
  .ja-ai-sections {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .ja-ai-block {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: var(--radius-md);
    padding: 12px 14px;
  }
  .ja-ai-block-label {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--teal-400);
    margin-bottom: 8px;
  }
  .ja-ai-tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .ja-ai-tag {
    background: rgba(20,184,166,0.15);
    border: 1px solid rgba(45,212,191,0.25);
    color: var(--teal-200);
    font-size: 11.5px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 20px;
  }
  .ja-ai-summary {
    font-size: 12.5px;
    color: rgba(255,255,255,0.75);
    line-height: 1.6;
  }

  /* ── Export Buttons ──────────────────────────────────────────── */
  .ja-action-row {
    display: flex;
    gap: 10px;
    margin-top: 18px;
    flex-wrap: wrap;
  }

  /* ── Toast ───────────────────────────────────────────────────── */
  .ja-toast {
    position: fixed;
    bottom: 28px;
    right: 28px;
    display: flex;
    align-items: center;
    gap: 9px;
    background: var(--slate-900);
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    padding: 11px 18px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    z-index: 9999;
    animation: slideUp 0.22s ease;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ja-toast svg { color: var(--teal-400); }

  /* ── Divider ─────────────────────────────────────────────────── */
  .ja-divider {
    height: 1px;
    background: var(--slate-100);
    margin: 4px 0 16px;
  }

  /* ── Responsive ──────────────────────────────────────────────── */
  @media (max-width: 640px) {
    .ja-root { padding: 16px 12px 48px; }
    .ja-title { font-size: 18px; }
    .ja-btn { font-size: 12px; padding: 9px 14px; }
  }
`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, strokeWidth = 2 }) => {
  const icons = {
    scan: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>
        <path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
        <line x1="7" y1="12" x2="17" y2="12"/>
      </svg>
    ),
    fileText: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/>
      </svg>
    ),
    zap: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
      </svg>
    ),
    copy: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
    ),
    download: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    alertCircle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    info: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20,6 9,17 4,12"/>
      </svg>
    ),
    chevronRight: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9,18 15,12 9,6"/>
      </svg>
    ),
    brain: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.97-3 2.5 2.5 0 0 1-1.32-4.24 3 3 0 0 1 .34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.59-1.48Z"/>
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.97-3 2.5 2.5 0 0 0 1.32-4.24 3 3 0 0 0-.34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.59-1.48Z"/>
      </svg>
    ),
    sparkles: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
      </svg>
    ),
    tag: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/>
        <path d="M7 7h.01"/>
      </svg>
    ),
    briefcase: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    graduationCap: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    barChart: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
    target: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
      </svg>
    ),
    settings: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    award: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    folder: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    user: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    list: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  };
  return icons[name] || null;
};

// ─── Collapsible Section ──────────────────────────────────────────────────────
const Section = ({ label, icon, dotColor, labelColor, count, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="ja-section">
      <div className="ja-section-header" onClick={() => setOpen(o => !o)} role="button" tabIndex={0}
        onKeyDown={e => e.key === "Enter" && setOpen(o => !o)}>
        <span className="ja-section-dot" style={{ background: dotColor }} />
        <span className="ja-section-label" style={{ color: labelColor }}>{label}</span>
        {count !== undefined && <span className="ja-section-count">{count}</span>}
        <span className={`ja-chevron${open ? " open" : ""}`}>
          <Icon name="chevronRight" size={14} />
        </span>
      </div>
      {open && children}
    </div>
  );
};

// ─── Tag Cloud ────────────────────────────────────────────────────────────────
const TagCloud = ({ items, variant = "teal" }) => {
  if (!items || items.length === 0) return <span style={{ fontSize: 12, color: "var(--slate-400)" }}>None found</span>;
  return (
    <div className="ja-tag-cloud">
      {items.map((item, i) => (
        <span key={i} className={`ja-tag ja-tag-${variant}`}>{item}</span>
      ))}
    </div>
  );
};

// ─── Text List ────────────────────────────────────────────────────────────────
const TextList = ({ items }) => {
  if (!items || items.length === 0) return <span style={{ fontSize: 12, color: "var(--slate-400)" }}>None found</span>;
  return (
    <ul className="ja-text-list">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function JobAnalyzer() {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  }, []);

  const handleAnalyze = async () => {
    if (!jd.trim()) {
      setError("Please paste a job description before analyzing.");
      return;
    }
    setError("");
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await analyzeJob({
  jobDescription: jd,
});

setAnalysis(res.analysis);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Analysis failed. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyKeywords = () => {
    if (!analysis?.importantKeywords?.length) return;
    navigator.clipboard.writeText(analysis.importantKeywords.join(", "));
    showToast("Keywords copied to clipboard");
  };

  const handleExport = () => {
    if (!analysis) return;
    const lines = [
      `JOB ANALYSIS REPORT`,
      `Generated: ${new Date().toLocaleString()}`,
      ``,
      `JOB TITLE: ${analysis.jobTitle || "N/A"}`,
      `COMPANY: ${analysis.company || "N/A"}`,
      `EXPERIENCE REQUIRED: ${analysis.experienceRequired || "N/A"}`,
      `EDUCATION REQUIRED: ${analysis.educationRequired || "N/A"}`,
      ``,
      `REQUIRED SKILLS:\n${(analysis.requiredSkills || []).join(", ")}`,
      ``,
      `PREFERRED SKILLS:\n${(analysis.preferredSkills || []).join(", ")}`,
      ``,
      `TECHNICAL SKILLS:\n${(analysis.technicalSkills || []).join(", ")}`,
      ``,
      `SOFT SKILLS:\n${(analysis.softSkills || []).join(", ")}`,
      ``,
      `TOOLS & TECHNOLOGIES:\n${(analysis.toolsAndTechnologies || []).join(", ")}`,
      ``,
      `RESPONSIBILITIES:\n${(analysis.responsibilities || []).map((r, i) => `${i + 1}. ${r}`).join("\n")}`,
      ``,
      `IMPORTANT KEYWORDS:\n${(analysis.importantKeywords || []).join(", ")}`,
      ``,
      `--- AI SUGGESTIONS ---`,
      ``,
      `RECOMMENDED SKILLS:\n${(analysis.aiSuggestions?.recommendedResumeSkills || []).join(", ")}`,
      ``,
      `RECOMMENDED PROJECTS:\n${(analysis.aiSuggestions?.recommendedProjects || []).join(", ")}`,
      ``,
      `RECOMMENDED CERTIFICATIONS:\n${(analysis.aiSuggestions?.recommendedCertifications || []).join(", ")}`,
      ``,
      `RECOMMENDED SUMMARY:\n${analysis.aiSuggestions?.recommendedSummary || "N/A"}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `job-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Analysis exported successfully");
  };

  return (
    <>
      <style>{css}</style>
      <div className="ja-root">

        {/* ── Header ── */}
        <div className="ja-header">
          <div className="ja-header-left">
            <div className="ja-header-icon">
              <Icon name="scan" size={22} />
            </div>
            <div>
              <h1 className="ja-title">Job Analyzer</h1>
              <p className="ja-subtitle">Decode any job description before building your resume</p>
            </div>
          </div>
          <div className="ja-header-badge">
            <span className="ja-header-badge-dot" />
            AI-Powered
          </div>
        </div>

        {/* ── Two-Column Grid ── */}
        <div className="ja-grid">

          {/* ────── LEFT: Input ────── */}
          <div className="ja-card">
            <div className="ja-card-header">
              <div className="ja-card-header-icon">
                <Icon name="fileText" size={16} />
              </div>
              <div>
                <p className="ja-card-title">Job Description</p>
                <p className="ja-card-desc">Paste the full job posting here</p>
              </div>
            </div>
            <div className="ja-card-body">
              {error && (
                <div className="ja-error-banner">
                  <Icon name="alertCircle" size={16} />
                  <span>{error}</span>
                </div>
              )}
              <div className="ja-textarea-wrap">
                <textarea
                  className="ja-textarea"
                  value={jd}
                  onChange={e => setJd(e.target.value)}
                  placeholder="Paste the complete job description here — including responsibilities, requirements, qualifications, and skills…"
                />
                <span className="ja-char-count">{jd.length.toLocaleString()} chars</span>
              </div>
              <div className="ja-textarea-hint">
                <Icon name="info" size={13} />
                Include all sections for the most accurate analysis
              </div>
              <div className="ja-btn-row">
                <button
                  className="ja-btn ja-btn-primary"
                  onClick={handleAnalyze}
                  disabled={loading || !jd.trim()}
                >
                  {loading
                    ? <><span className="ja-btn-spin" /> Analyzing…</>
                    : <><Icon name="zap" size={15} /> Analyze Job</>
                  }
                </button>
                <button
                  className="ja-btn ja-btn-ghost"
                  onClick={() => { setJd(""); setAnalysis(null); setError(""); }}
                  disabled={loading}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* ────── RIGHT: Analysis ────── */}
          <div className="ja-card">
            <div className="ja-card-header">
              <div className="ja-card-header-icon">
                <Icon name="barChart" size={16} />
              </div>
              <div>
                <p className="ja-card-title">Analysis Results</p>
                <p className="ja-card-desc">
                  {analysis ? "Structured insights from the job description" : "Results will appear here after analysis"}
                </p>
              </div>
            </div>
            <div className="ja-card-body">
              {!analysis ? (
                <div className="ja-empty">
                  <div className="ja-empty-icon">
                    <Icon name="scan" size={24} />
                  </div>
                  <p className="ja-empty-title">No analysis yet</p>
                  <p className="ja-empty-sub">
                    Paste a job description on the left and click <strong>Analyze Job</strong> to get started.
                  </p>
                </div>
              ) : (
                <>
                  {/* ── Info Grid ── */}
                  <div className="ja-info-grid">
                    <div className="ja-info-item">
                      <div className="ja-info-label">Job Title</div>
                      <div className="ja-info-value">{analysis.jobTitle || "—"}</div>
                    </div>
                    <div className="ja-info-item">
                      <div className="ja-info-label">Company</div>
                      <div className="ja-info-value">{analysis.company || "—"}</div>
                    </div>
                    <div className="ja-info-item">
                      <div className="ja-info-label">Experience</div>
                      <div className="ja-info-value">{analysis.experienceRequired || "—"}</div>
                    </div>
                    <div className="ja-info-item">
                      <div className="ja-info-label">Education</div>
                      <div className="ja-info-value">{analysis.educationRequired || "—"}</div>
                    </div>
                  </div>

                  <div className="ja-divider" />

                  {/* ── Sections ── */}
                  <div className="ja-analysis-scroll">
                    <Section label="Required Skills" dotColor="var(--teal-500)" labelColor="var(--teal-700)"
                      count={analysis.requiredSkills?.length}>
                      <TagCloud items={analysis.requiredSkills} variant="teal" />
                    </Section>

                    <Section label="Preferred Skills" dotColor="var(--violet-500)" labelColor="#6d28d9"
                      count={analysis.preferredSkills?.length}>
                      <TagCloud items={analysis.preferredSkills} variant="violet" />
                    </Section>

                    <Section label="Technical Skills" dotColor="var(--sky-500)" labelColor="#0369a1"
                      count={analysis.technicalSkills?.length}>
                      <TagCloud items={analysis.technicalSkills} variant="sky" />
                    </Section>

                    <Section label="Soft Skills" dotColor="var(--emerald-500)" labelColor="#065f46"
                      count={analysis.softSkills?.length}>
                      <TagCloud items={analysis.softSkills} variant="emerald" />
                    </Section>

                    <Section label="Tools & Technologies" dotColor="var(--amber-500)" labelColor="#92400e"
                      count={analysis.toolsAndTechnologies?.length}>
                      <TagCloud items={analysis.toolsAndTechnologies} variant="amber" />
                    </Section>

                    <Section label="Responsibilities" dotColor="var(--orange-500)" labelColor="#9a3412"
                      count={analysis.responsibilities?.length} defaultOpen={false}>
                      <TextList items={analysis.responsibilities} />
                    </Section>

                    <Section label="Important Keywords" dotColor="var(--rose-500)" labelColor="#9f1239"
                      count={analysis.importantKeywords?.length}>
                      <TagCloud items={analysis.importantKeywords} variant="slate" />
                    </Section>
                  </div>

                  {/* ── AI Suggestions ── */}
                  <div className="ja-ai-section">
                    <div className="ja-ai-header">
                      <div className="ja-ai-badge">
                        <Icon name="sparkles" size={11} />
                        AI Suggestions
                      </div>
                    </div>
                    <div className="ja-ai-sections">
                      <div className="ja-ai-block">
                        <div className="ja-ai-block-label">
                          <Icon name="target" size={11} /> Recommended Resume Skills
                        </div>
                        <div className="ja-ai-tag-cloud">
                          {(analysis.aiSuggestions?.recommendedResumeSkills || []).map((s, i) => (
                            <span key={i} className="ja-ai-tag">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div className="ja-ai-block">
                        <div className="ja-ai-block-label">
                          <Icon name="folder" size={11} /> Recommended Projects
                        </div>
                        <div className="ja-ai-tag-cloud">
                          {(analysis.aiSuggestions?.recommendedProjects || []).map((p, i) => (
                            <span key={i} className="ja-ai-tag">{p}</span>
                          ))}
                        </div>
                      </div>
                      <div className="ja-ai-block">
                        <div className="ja-ai-block-label">
                          <Icon name="award" size={11} /> Recommended Certifications
                        </div>
                        <div className="ja-ai-tag-cloud">
                          {(analysis.aiSuggestions?.recommendedCertifications || []).map((c, i) => (
                            <span key={i} className="ja-ai-tag">{c}</span>
                          ))}
                        </div>
                      </div>
                      <div className="ja-ai-block">
                        <div className="ja-ai-block-label">
                          <Icon name="user" size={11} /> Recommended Summary
                        </div>
                        <p className="ja-ai-summary">
                          {analysis.aiSuggestions?.recommendedSummary || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ── Action Buttons ── */}
                  <div className="ja-action-row">
                    <button className="ja-btn ja-btn-outline-teal" onClick={handleCopyKeywords}>
                      <Icon name="copy" size={14} /> Copy Keywords
                    </button>
                    <button className="ja-btn ja-btn-ghost" onClick={handleExport}>
                      <Icon name="download" size={14} /> Export Analysis
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className="ja-toast">
          <Icon name="check" size={15} />
          {toast}
        </div>
      )}
    </>
  );
}