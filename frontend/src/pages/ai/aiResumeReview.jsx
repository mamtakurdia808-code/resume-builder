import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { uploadResume, getAllResumes } from "../../services/resumeService";
import api from "../../services/api";

// ─── Design Tokens ──────────────────────────────────────────────────────────
const tokens = {
  teal900: "#0d3d3a",
  teal700: "#0f5c57",
  teal500: "#14b8a0",
  teal400: "#2dd4bf",
  teal200: "#99f6e4",
  teal100: "#ccfbf1",
  teal50:  "#f0fdfa",
  slate900: "#0f172a",
  slate800: "#1e293b",
  slate700: "#334155",
  slate600: "#475569",
  slate400: "#94a3b8",
  slate300: "#cbd5e1",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",
  slate50:  "#f8fafc",
  white:    "#ffffff",
  amber500: "#f59e0b",
  amber100: "#fef3c7",
  red500:   "#ef4444",
  red100:   "#fee2e2",
  green500: "#22c55e",
  green100: "#dcfce7",
  violet500:"#8b5cf6",
  violet100:"#ede9fe",
  blue500:  "#3b82f6",
  blue100:  "#dbeafe",
  orange500:"#f97316",
  orange100:"#ffedd5",
  pink500:  "#ec4899",
  pink100:  "#fce7f3",
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: "100vh",
    background: `linear-gradient(160deg, ${tokens.teal50} 0%, ${tokens.white} 50%, ${tokens.slate50} 100%)`,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: tokens.slate900,
  },
  header: {
    background: tokens.white,
    borderBottom: `1px solid ${tokens.slate200}`,
    padding: "20px 40px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    position: "sticky",
    top: 0,
    boxShadow: "0 1px 8px rgba(20,184,166,0.06)",
  },
  headerIcon: {
    width: 40, height: 40, borderRadius: 10,
    background: `linear-gradient(135deg, ${tokens.teal500}, ${tokens.teal700})`,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  headerTitle: { fontSize: 20, fontWeight: 700, color: tokens.slate900, letterSpacing: "-0.3px", margin: 0 },
  headerSub:   { fontSize: 13, color: tokens.slate400, margin: 0 },
  headerBadge: {
    marginLeft: "auto",
    background: tokens.teal100, color: tokens.teal700,
    fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20,
    letterSpacing: "0.3px", textTransform: "uppercase",
  },
  headerNav: {
    display: "flex", gap: 4, marginLeft: "auto",
    background: tokens.slate100, borderRadius: 10, padding: 4,
  },
  navTab: (active) => ({
    padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
    cursor: "pointer", border: "none", transition: "all 0.18s",
    background: active ? tokens.white : "transparent",
    color: active ? tokens.slate900 : tokens.slate400,
    boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
  }),
  main: { maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" },
  stepBar: {
    display: "flex", alignItems: "center", marginBottom: 40,
    background: tokens.white, borderRadius: 14,
    border: `1px solid ${tokens.slate200}`,
    padding: "18px 28px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.04)", position: "relative", zIndex: 1,
  },
  stepNum: (active, done) => ({
    width: 30, height: 30, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 700, flexShrink: 0, transition: "all 0.3s",
    background: done ? tokens.teal500 : active
      ? `linear-gradient(135deg, ${tokens.teal500}, ${tokens.teal700})` : tokens.slate100,
    color: done || active ? tokens.white : tokens.slate400,
  }),
  stepLabel: (active, done) => ({
    fontSize: 13, fontWeight: active || done ? 600 : 400,
    color: active || done ? tokens.slate900 : tokens.slate400,
    transition: "color 0.3s", marginLeft: 10,
  }),
  stepDivider: {
    height: 2, flex: 1, background: tokens.slate200,
    margin: "0 12px", borderRadius: 2, overflow: "hidden",
  },
  stepDividerFill: (done) => ({
    height: "100%", width: done ? "100%" : "0%",
    background: `linear-gradient(90deg, ${tokens.teal500}, ${tokens.teal400})`,
    transition: "width 0.5s ease",
  }),
  sectionTitle: {
    fontSize: 12, fontWeight: 700, color: tokens.slate400,
    textTransform: "uppercase", letterSpacing: "1px",
    marginBottom: 16, marginTop: 0,
  },
  uploadArea: (drag) => ({
    border: `2px dashed ${drag ? tokens.teal400 : tokens.slate300}`,
    borderRadius: 16, padding: "40px 32px", textAlign: "center",
    background: drag ? tokens.teal50 : tokens.white,
    cursor: "pointer", transition: "all 0.2s", marginBottom: 28, position: "relative",
  }),
  uploadIcon: {
    width: 56, height: 56, borderRadius: 14, background: tokens.teal50,
    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
  },
  uploadTitle: { fontSize: 16, fontWeight: 700, color: tokens.slate800, margin: "0 0 6px" },
  uploadSub:   { fontSize: 13, color: tokens.slate400, margin: "0 0 18px" },
  uploadBtn: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: `linear-gradient(135deg, ${tokens.teal500}, ${tokens.teal700})`,
    color: tokens.white, border: "none", borderRadius: 10, padding: "10px 22px",
    fontSize: 14, fontWeight: 600, cursor: "pointer",
    boxShadow: `0 3px 10px rgba(20,184,166,0.25)`,
  },
  uploadingRow: {
    display: "flex", alignItems: "center", gap: 12,
    background: tokens.teal50, border: `1px solid ${tokens.teal200}`,
    borderRadius: 12, padding: "14px 18px", marginBottom: 20,
  },
  uploadProgress: { flex: 1, height: 6, background: tokens.slate200, borderRadius: 10, overflow: "hidden" },
  uploadProgressFill: {
    height: "100%", width: "60%",
    background: `linear-gradient(90deg, ${tokens.teal500}, ${tokens.teal400})`,
    borderRadius: 10, animation: "progressPulse 1.2s ease-in-out infinite",
  },
  dividerRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, background: tokens.slate200 },
  dividerText: { fontSize: 12, color: tokens.slate400, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" },
  pickerGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 14, marginBottom: 32,
  },
  resumeCard: (selected) => ({
    background: tokens.white,
    border: `2px solid ${selected ? tokens.teal500 : tokens.slate200}`,
    borderRadius: 14, padding: "20px 22px", cursor: "pointer",
    transition: "all 0.2s", position: "relative", outline: "none",
    boxShadow: selected ? `0 0 0 3px ${tokens.teal100}` : "0 1px 4px rgba(0,0,0,0.04)",
  }),
  resumeCardTitle: { fontSize: 15, fontWeight: 600, color: tokens.slate900, margin: "0 0 4px" },
  resumeCardMeta:  { fontSize: 12, color: tokens.slate400, margin: 0 },
  resumeCardActions: {
    display: "flex", gap: 8, marginTop: 14, paddingTop: 14,
    borderTop: `1px solid ${tokens.slate100}`,
  },
  cardBtn: (color, bg) => ({
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    fontSize: 12, fontWeight: 600, padding: "7px 10px", borderRadius: 8,
    cursor: "pointer", border: `1px solid ${color}33`,
    background: bg, color, transition: "all 0.15s",
  }),
  resumeCheckmark: (selected) => ({
    position: "absolute", top: 14, right: 14, width: 20, height: 20,
    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.2s",
    background: selected ? tokens.teal500 : tokens.slate200,
  }),
  analyzeBtn: {
    background: `linear-gradient(135deg, ${tokens.teal500}, ${tokens.teal700})`,
    color: tokens.white, border: "none", borderRadius: 12, padding: "14px 32px",
    fontSize: 15, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 10,
    boxShadow: `0 4px 14px rgba(20,184,166,0.3)`, transition: "all 0.2s",
  },
  analyzeBtnDisabled: {
    background: tokens.slate200, color: tokens.slate400,
    border: "none", borderRadius: 12, padding: "14px 32px",
    fontSize: 15, fontWeight: 600, cursor: "not-allowed",
    display: "flex", alignItems: "center", gap: 10,
  },
  loadingWrap: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "80px 40px", gap: 24,
    background: tokens.white, borderRadius: 20, border: `1px solid ${tokens.slate200}`,
  },
  pulseRing: {
    width: 72, height: 72, borderRadius: "50%",
    background: `linear-gradient(135deg, ${tokens.teal500}, ${tokens.teal400})`,
    display: "flex", alignItems: "center", justifyContent: "center",
    animation: "aiPulse 1.6s ease-in-out infinite",
  },
  loadingTitle: { fontSize: 20, fontWeight: 700, color: tokens.slate900, margin: 0, textAlign: "center" },
  loadingStepRow: (active) => ({
    fontSize: 13, color: active ? tokens.teal500 : tokens.slate300,
    fontWeight: active ? 600 : 400, display: "flex", alignItems: "center",
    gap: 8, transition: "color 0.4s",
  }),
  scoreCard: {
    background: `linear-gradient(135deg, ${tokens.teal700} 0%, ${tokens.teal900} 100%)`,
    borderRadius: 20, padding: "36px 40px",
    display: "flex", alignItems: "center", gap: 40,
    marginBottom: 28, color: tokens.white, position: "relative", overflow: "hidden", zIndex: 1,
  },
  scoreBg: {
    position: "absolute", top: -30, right: -30, width: 200, height: 200,
    borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none",
  },
  scoreCircle: {
    width: 110, height: 110, borderRadius: "50%",
    background: "rgba(255,255,255,0.10)", border: "3px solid rgba(255,255,255,0.2)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  scoreNum:     { fontSize: 36, fontWeight: 800, lineHeight: 1, letterSpacing: "-1px" },
  scoreOf:      { fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 },
  scoreLabel:   { fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: tokens.teal400, marginBottom: 6, marginTop: 0 },
  scoreName:    { fontSize: 24, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.3px" },
  scoreSummary: { fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: 0 },
  statNum: (color) => ({ fontSize: 22, fontWeight: 800, color, margin: 0, lineHeight: 1 }),
  statLabel:    { fontSize: 11, color: "rgba(255,255,255,0.45)", margin: "2px 0 0" },
  reviewGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 18, marginBottom: 28,
  },
  reviewCard: {
    background: tokens.white, borderRadius: 16, padding: "22px",
    border: `1px solid ${tokens.slate200}`,
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s", zIndex: 1,
  },
  reviewCardHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  reviewCardIconWrap: (bg) => ({
    width: 36, height: 36, borderRadius: 9, background: bg,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  }),
  reviewCardTitle: { fontSize: 14, fontWeight: 700, color: tokens.slate900, margin: 0 },
  reviewCardBadge: (color, bg) => ({
    fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase",
    color, background: bg, padding: "2px 8px", borderRadius: 20, marginLeft: "auto", flexShrink: 0,
  }),
  reviewList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 },
  listDot: (color) => ({ width: 7, height: 7, borderRadius: "50%", background: color, marginTop: 5, flexShrink: 0 }),
  listItemText: { fontSize: 13, color: tokens.slate700, lineHeight: 1.55 },
  chipWrap: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: (color, bg) => ({
    fontSize: 12, fontWeight: 500, color, background: bg,
    padding: "5px 12px", borderRadius: 20, border: `1px solid ${color}22`,
  }),
  recruiterCard: {
    background: tokens.white, borderRadius: 16, padding: "24px 28px",
    border: `1px solid ${tokens.slate200}`, marginBottom: 20,
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)", zIndex: 1, position: "relative",
  },
  recruiterQuote: {
    fontSize: 15, color: tokens.slate700, lineHeight: 1.7,
    borderLeft: `4px solid ${tokens.teal400}`, paddingLeft: 18,
    margin: "12px 0 0", fontStyle: "italic",
  },
  toolbar: {
    display: "flex", gap: 12, flexWrap: "wrap",
    marginTop: 32, paddingTop: 28, borderTop: `1px solid ${tokens.slate200}`,
  },
  toolbarPrimary: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "11px 22px", borderRadius: 10,
    fontSize: 14, fontWeight: 600, cursor: "pointer",
    border: "none",
    background: `linear-gradient(135deg, ${tokens.teal500}, ${tokens.teal700})`,
    color: tokens.white, boxShadow: `0 3px 10px rgba(20,184,166,0.25)`, transition: "all 0.18s",
  },
  toolbarTeal: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "11px 22px", borderRadius: 10,
    fontSize: 14, fontWeight: 600, cursor: "pointer",
    border: `1px solid ${tokens.teal100}`,
    background: tokens.teal50, color: tokens.teal700, transition: "all 0.18s",
  },
  toolbarOutline: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "11px 22px", borderRadius: 10,
    fontSize: 14, fontWeight: 600, cursor: "pointer",
    border: `1px solid ${tokens.slate200}`,
    background: tokens.white, color: tokens.slate700, transition: "all 0.18s",
  },
  errorBanner: {
    background: tokens.red100, color: tokens.red500,
    borderRadius: 10, padding: "12px 18px",
    fontSize: 14, marginBottom: 20, fontWeight: 500,
  },
  successBanner: {
    background: tokens.green100, color: tokens.green500,
    borderRadius: 10, padding: "12px 18px",
    fontSize: 14, marginBottom: 20, fontWeight: 500,
    display: "flex", alignItems: "center", gap: 8,
  },
  toast: {
    position: "fixed", bottom: 28, right: 28,
    background: tokens.teal700, color: tokens.white,
    padding: "12px 20px", borderRadius: 12,
    fontSize: 14, fontWeight: 500, zIndex: 9999,
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    display: "flex", alignItems: "center", gap: 10,
    animation: "slideUp 0.3s ease",
  },
  // History styles
  historyList: { display: "flex", flexDirection: "column", gap: 12 },
  historyCard: {
    background: tokens.white, borderRadius: 14, padding: "18px 22px",
    border: `1px solid ${tokens.slate200}`,
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    display: "flex", alignItems: "center", gap: 16, cursor: "pointer",
    transition: "all 0.18s",
  },
  historyIconWrap: {
    width: 40, height: 40, borderRadius: 10, background: tokens.teal50,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  historyMeta: { flex: 1, minWidth: 0 },
  historyTitle: { fontSize: 14, fontWeight: 600, color: tokens.slate900, margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  historyDate:  { fontSize: 12, color: tokens.slate400, margin: 0 },
  historyBadge: {
    fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
    background: tokens.teal100, color: tokens.teal700, textTransform: "uppercase", letterSpacing: "0.3px", flexShrink: 0,
  },
  historyDelete: {
    width: 32, height: 32, borderRadius: 8, display: "flex",
    alignItems: "center", justifyContent: "center",
    background: "transparent", border: `1px solid ${tokens.slate200}`,
    cursor: "pointer", color: tokens.slate400, transition: "all 0.15s", flexShrink: 0,
  },
  emptyState: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "60px 40px", gap: 16,
    background: tokens.white, borderRadius: 20,
    border: `2px dashed ${tokens.slate200}`, textAlign: "center",
  },
  emptyIcon: {
    width: 64, height: 64, borderRadius: 16, background: tokens.teal50,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  emptyTitle: { fontSize: 18, fontWeight: 700, color: tokens.slate800, margin: 0 },
  emptyDesc:  { fontSize: 14, color: tokens.slate400, margin: 0, maxWidth: 340, lineHeight: 1.6 },
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const iconsMap = {
  brain:      (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.14Z"/></svg>,
  check:      (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  thumbsUp:   (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>,
  thumbsDown: (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/></svg>,
  user:       (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  spell:      (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>,
  layout:     (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>,
  robot:      (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><circle cx="8" cy="16" r="1" fill={c}/><circle cx="16" cy="16" r="1" fill={c}/></svg>,
  zap:        (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  target:     (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  briefcase:  (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  refresh:    (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  copy:       (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  download:   (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  file:       (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/></svg>,
  chevron:    (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  sparkle:    (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill={c}><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/></svg>,
  upload:     (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  plus:       (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash:      (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  clock:      (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  eye:        (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  arrowLeft:  (sz, c) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
};
const Icon = ({ name, size = 18, color = "currentColor" }) =>
  iconsMap[name] ? iconsMap[name](size, color) : null;

// ─── Constants ────────────────────────────────────────────────────────────────
const LOADING_STEPS = [
  "Parsing your resume structure…",
  "Evaluating experience & impact…",
  "Scanning for ATS compatibility…",
  "Identifying skill gaps…",
  "Drafting recruiter perspective…",
  "Compiling final review…",
];

const SECTION_CONFIG = {
  strengths:                { label: "Strengths",            icon: "thumbsUp",   iconBg: tokens.green100,  iconColor: tokens.green500,  badge: "Positive", badgeColor: tokens.green500,  badgeBg: tokens.green100,  dotColor: tokens.green500,  type: "list" },
  weaknesses:               { label: "Areas to Improve",     icon: "thumbsDown", iconBg: tokens.red100,    iconColor: tokens.red500,    badge: "Critical", badgeColor: tokens.red500,    badgeBg: tokens.red100,    dotColor: tokens.red500,    type: "list" },
  grammar_suggestions:      { label: "Grammar & Language",   icon: "spell",      iconBg: tokens.amber100,  iconColor: tokens.amber500,  badge: "Polish",   badgeColor: tokens.amber500,  badgeBg: tokens.amber100,  dotColor: tokens.amber500,  type: "list" },
  formatting_suggestions:   { label: "Formatting",           icon: "layout",     iconBg: tokens.blue100,   iconColor: tokens.blue500,   badge: "Visual",   badgeColor: tokens.blue500,   badgeBg: tokens.blue100,   dotColor: tokens.blue500,   type: "list" },
  ats_suggestions:          { label: "ATS Optimization",     icon: "robot",      iconBg: tokens.violet100, iconColor: tokens.violet500, badge: "ATS",      badgeColor: tokens.violet500, badgeBg: tokens.violet100, dotColor: tokens.violet500, type: "list" },
  action_verbs_suggestions: { label: "Action Verb Upgrades", icon: "zap",        iconBg: tokens.orange100, iconColor: tokens.orange500, badge: "Impact",   badgeColor: tokens.orange500, badgeBg: tokens.orange100, dotColor: tokens.orange500, type: "chips" },
  missing_skills:           { label: "Missing Skills",       icon: "target",     iconBg: tokens.pink100,   iconColor: tokens.pink500,   badge: "Gap",      badgeColor: tokens.pink500,   badgeBg: tokens.pink100,   dotColor: tokens.pink500,   type: "chips" },
  career_advice:            { label: "Career Advice",        icon: "briefcase",  iconBg: tokens.teal100,   iconColor: tokens.teal700,   badge: "Guidance", badgeColor: tokens.teal700,   badgeBg: tokens.teal100,   dotColor: tokens.teal500,   type: "list" },
};

const getScoreLabel = (score) => {
  if (score >= 85) return { label: "Outstanding", color: tokens.teal400 };
  if (score >= 70) return { label: "Strong",       color: "#67e8f9" };
  if (score >= 55) return { label: "Decent",       color: tokens.amber500 };
  return                   { label: "Needs Work",  color: "#f87171" };
};

const fmt = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// ─── ReviewCard ────────────────────────────────────────────────────────────
const ReviewCard = ({ sectionKey, data }) => {
  const cfg = SECTION_CONFIG[sectionKey];
  if (!cfg || !data) return null;
  const items = Array.isArray(data) ? data : [data];
  if (!items.length) return null;

  return (
    <div style={S.reviewCard} className="review-card-hover">
      <div style={S.reviewCardHeader}>
        <div style={S.reviewCardIconWrap(cfg.iconBg)}>
          <Icon name={cfg.icon} size={17} color={cfg.iconColor} />
        </div>
        <p style={S.reviewCardTitle}>{cfg.label}</p>
        <span style={S.reviewCardBadge(cfg.badgeColor, cfg.badgeBg)}>{cfg.badge}</span>
      </div>
      {cfg.type === "chips" ? (
        <div style={S.chipWrap}>
          {items.map((item, i) => <span key={i} style={S.chip(cfg.iconColor, cfg.iconBg)}>{item}</span>)}
        </div>
      ) : (
        <ul style={S.reviewList}>
          {items.map((item, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={S.listDot(cfg.dotColor)} />
              <span style={S.listItemText}>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────
export default function AIResumeReview() {
  const [activeView, setActiveView]         = useState("analyze"); // "analyze" | "history"
  const [resumes, setResumes]               = useState([]);
  const [reviews, setReviews]               = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [step, setStep]                     = useState(1);         // 1=pick, 2=loading, 3=results
  const [review, setReview]                 = useState(null);      // current displayed review object
  const [loadingStep, setLoadingStep]       = useState(0);
  const [toast, setToast]                   = useState(null);
  const [error, setError]                   = useState(null);
  const [successMsg, setSuccessMsg]         = useState(null);
  const [uploading, setUploading]           = useState(false);
  const [analyzing, setAnalyzing]           = useState(false);
  const [drag, setDrag]                     = useState(false);
  const fileInputRef                        = useRef(null);
  const loadingTimerRef                     = useRef(null);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const fetchResumes = async () => {
  try {
    const { data } = await getAllResumes();
    setResumes(data.resumes || []);
  } catch (err) {
    console.error(err);
  }
};

  const fetchReviews = useCallback(async () => {
    try {
      const { data } = await api.get("/ai/reviews");
      setReviews(data.reviews || []);
    } catch {
      setReviews([]);
    }
  }, []);

  useEffect(() => {
    fetchResumes();
    fetchReviews();
  }, [fetchResumes, fetchReviews]);

  // ── Loading step animation ─────────────────────────────────────────────────
  useEffect(() => {
    if (step === 2) {
      setLoadingStep(0);
      let i = 0;
      loadingTimerRef.current = setInterval(() => {
        i += 1;
        if (i < LOADING_STEPS.length) setLoadingStep(i);
        else clearInterval(loadingTimerRef.current);
      }, 900);
    } else {
      clearInterval(loadingTimerRef.current);
    }
    return () => clearInterval(loadingTimerRef.current);
  }, [step]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const clearAlerts = () => { setError(null); setSuccessMsg(null); };

  // ── Drag & Drop ───────────────────────────────────────────────────────────
  const onDragOver  = (e) => { e.preventDefault(); setDrag(true); };
  const onDragLeave = ()  => setDrag(false);
  const onDrop      = (e) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  // ── Upload ─────────────────────────────────────────────────────────────────
  const handleUpload = async (file) => {
    if (!file) return;
    clearAlerts();
    setUploading(true);
    try {
      const form = new FormData();
      form.append("resume", file);
      form.append("title", file.name);
      await uploadResume(form);
      setSuccessMsg(`"${file.name}" uploaded successfully!`);
      await fetchResumes();
    } catch (err) {
      const msg = err?.response?.data?.message || "Upload failed. Please try again.";
      setError(msg);
    } finally {
      setUploading(false);
      // Reset file input so the same file can be re-uploaded if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── Analyze ────────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!selectedResume || analyzing) return;
    clearAlerts();
    setAnalyzing(true);
    setStep(2);
    try {
      const { data } = await api.post("/ai/review", {
        resume_id:   selectedResume.id,
        review_type: "full",
      });

      // Safely unpack ai_response — backend may return object or JSON string
      let aiResponse = data.review?.ai_response ?? data.review ?? {};
      if (typeof aiResponse === "string") {
        try { aiResponse = JSON.parse(aiResponse); } catch (_) {}
      }

      setReview({ ...data.review, ai_response: aiResponse });
      await fetchReviews();
      setStep(3);
    } catch (err) {
      const msg = err?.response?.data?.message || "Analysis failed. Please try again.";
      setError(msg);
      setStep(1);
    } finally {
      setAnalyzing(false);
    }
  };

  // ── View a historical review ───────────────────────────────────────────────
  const handleViewHistoryReview = async (id) => {
    clearAlerts();
    try {
      const { data } = await api.get(`/ai/reviews/${id}`);
      let aiResponse = data.review?.ai_response ?? {};
      if (typeof aiResponse === "string") {
        try { aiResponse = JSON.parse(aiResponse); } catch (_) {}
      }
      setReview({ ...data.review, ai_response: aiResponse });
      setStep(3);
      setActiveView("analyze");
    } catch {
      setError("Could not load that review. Please try again.");
    }
  };

  // ── Delete a review ────────────────────────────────────────────────────────
  const handleDeleteReview = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/ai/reviews/${id}`);
      showToast("Review deleted.");
      // If we're currently viewing the deleted review, go back to step 1
      if (review?.id === id) { setReview(null); setStep(1); }
      await fetchReviews();
    } catch {
      setError("Delete failed. Please try again.");
    }
  };

  // ── Reset to pick step ─────────────────────────────────────────────────────
  const handleAnalyzeAgain = () => {
    setReview(null);
    setStep(1);
    clearAlerts();
  };

  // ── Copy review text to clipboard ─────────────────────────────────────────
  const handleCopyReview = () => {
    if (!review?.ai_response) return;
    const r = review.ai_response;
    const text = [
      `Resume Review — ${review.resume_title || ""}`,
      `Overall Score: ${r.overall_rating ?? r.overall_score ?? "N/A"}/100`,
      `Summary: ${r.overall_summary || ""}`,
      r.strengths?.length      ? `\nStrengths:\n${r.strengths.map((s) => `• ${s}`).join("\n")}` : "",
      r.weaknesses?.length     ? `\nAreas to Improve:\n${r.weaknesses.map((s) => `• ${s}`).join("\n")}` : "",
      r.ats_suggestions?.length? `\nATS Suggestions:\n${r.ats_suggestions.map((s) => `• ${s}`).join("\n")}` : "",
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(text).then(() => showToast("Copied to clipboard!"));
  };

  // ── Export as text file ────────────────────────────────────────────────────
  const handleExport = () => {
    if (!review?.ai_response) return;
    const r = review.ai_response;
    const lines = [
      `RESUME REVIEW REPORT`,
      `Resume: ${review.resume_title || "Unknown"}`,
      `Date: ${review.created_at ? new Date(review.created_at).toLocaleString() : ""}`,
      `Score: ${r.overall_rating ?? r.overall_score ?? "N/A"}/100`,
      ``,
      `SUMMARY`,
      r.overall_summary || "",
      ``,
      ...(r.recruiter_feedback ? [`RECRUITER'S PERSPECTIVE`, r.recruiter_feedback, ``] : []),
      ...(r.strengths?.length  ? [`STRENGTHS`, ...r.strengths.map((s) => `• ${s}`), ``] : []),
      ...(r.weaknesses?.length ? [`AREAS TO IMPROVE`, ...r.weaknesses.map((s) => `• ${s}`), ``] : []),
      ...(r.ats_suggestions?.length ? [`ATS SUGGESTIONS`, ...r.ats_suggestions.map((s) => `• ${s}`), ``] : []),
      ...(r.missing_skills?.length  ? [`MISSING SKILLS`, ...r.missing_skills.map((s) => `• ${s}`), ``] : []),
      ...(r.career_advice?.length   ? [`CAREER ADVICE`, ...r.career_advice.map((s) => `• ${s}`), ``] : []),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `resume-review-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported!");
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div style={S.page}>
      <style>{`
        @keyframes aiPulse {
          0%   { box-shadow: 0 0 0 0   rgba(20,184,166,0.5); }
          70%  { box-shadow: 0 0 0 20px rgba(20,184,166,0); }
          100% { box-shadow: 0 0 0 0   rgba(20,184,166,0); }
        }
        @keyframes progressPulse {
          0%,100% { opacity:1; }
          50%     { opacity:0.5; }
        }
        @keyframes slideUp {
          from { transform:translateY(16px); opacity:0; }
          to   { transform:translateY(0);    opacity:1; }
        }
        @keyframes fadeIn {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0);   }
        }
        * { box-sizing: border-box; }
        .resume-card-hover:hover {
          border-color: ${tokens.teal400} !important;
          box-shadow: 0 4px 16px rgba(20,184,166,0.12) !important;
          transform: translateY(-1px);
        }
        .review-card-hover:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.08) !important; }
        .action-btn:hover { opacity:0.85; transform:translateY(-1px); }
        .history-card-hover:hover {
          border-color: ${tokens.teal300} !important;
          box-shadow: 0 4px 14px rgba(20,184,166,0.1) !important;
        }
        .history-delete-btn:hover { background: ${tokens.red100} !important; color: ${tokens.red500} !important; border-color: ${tokens.red100} !important; }
        .card-action-btn:hover { opacity: 0.8; }
      `}</style>

      {/* ── Header ── */}
      <header style={S.header}>
        <div style={S.headerIcon}>
          <Icon name="brain" size={20} color={tokens.white} />
        </div>
        <div>
          <p style={S.headerTitle}>AI Resume Review</p>
          <p style={S.headerSub}>Powered by Gemini · Get instant, recruiter-grade feedback</p>
        </div>
        {/* Nav tabs */}
        <div style={S.headerNav}>
          <button
            style={S.navTab(activeView === "analyze")}
            onClick={() => { setActiveView("analyze"); clearAlerts(); }}
          >
            <Icon name="sparkle" size={13} color={activeView === "analyze" ? tokens.teal500 : tokens.slate400} />
            {" "}Analyze
          </button>
          <button
            style={S.navTab(activeView === "history")}
            onClick={() => { setActiveView("history"); clearAlerts(); }}
          >
            <Icon name="clock" size={13} color={activeView === "history" ? tokens.teal500 : tokens.slate400} />
            {" "}History {reviews.length > 0 && `(${reviews.length})`}
          </button>
        </div>
      </header>

      <main style={S.main}>

        {/* ════════════════════════════════════════
            HISTORY VIEW
            ════════════════════════════════════════ */}
        {activeView === "history" && (
          <div style={{ animation: "fadeIn 0.35s ease" }}>
            {error && <div style={S.errorBanner}>⚠ {error}</div>}

            <p style={S.sectionTitle}>Review History ({reviews.length})</p>

            {reviews.length === 0 ? (
              <div style={S.emptyState}>
                <div style={S.emptyIcon}>
                  <Icon name="clock" size={28} color={tokens.teal500} />
                </div>
                <p style={S.emptyTitle}>No reviews yet</p>
                <p style={S.emptyDesc}>
                  Analyze a resume to see your review history here.
                  Each review is saved so you can revisit feedback anytime.
                </p>
              </div>
            ) : (
              <div style={S.historyList}>
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="history-card-hover"
                    style={{ ...S.historyCard, border: `1px solid ${tokens.slate200}` }}
                    onClick={() => handleViewHistoryReview(rev.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleViewHistoryReview(rev.id)}
                  >
                    <div style={S.historyIconWrap}>
                      <Icon name="file" size={18} color={tokens.teal500} />
                    </div>
                    <div style={S.historyMeta}>
                      <p style={S.historyTitle}>{rev.resume_title || "Untitled Resume"}</p>
                      <p style={S.historyDate}>
                        <Icon name="clock" size={11} color={tokens.slate400} />
                        {" "}{fmt(rev.created_at)}
                      </p>
                    </div>
                    <span style={S.historyBadge}>{rev.review_type || "full"}</span>
                    <button
                      className="history-delete-btn"
                      style={S.historyDelete}
                      onClick={(e) => handleDeleteReview(rev.id, e)}
                      title="Delete review"
                    >
                      <Icon name="trash" size={15} color="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════
            ANALYZE VIEW
            ════════════════════════════════════════ */}
        {activeView === "analyze" && (
          <>
            {/* Step bar */}
            <div style={S.stepBar}>
              {["Choose Resume", "Analyze", "View Review"].map((label, idx) => {
                const num    = idx + 1;
                const active = step === num;
                const done   = step > num;
                return (
                  <div key={num} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={S.stepNum(active, done)}>
                        {done ? <Icon name="check" size={13} color={tokens.white} /> : num}
                      </div>
                      <span style={S.stepLabel(active, done)}>{label}</span>
                    </div>
                    {idx < 2 && (
                      <div style={{ ...S.stepDivider, flex: 1, margin: "0 12px" }}>
                        <div style={S.stepDividerFill(done)} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ─── STEP 1 — Choose / Upload Resume ─── */}
            {step === 1 && (
              <div style={{ animation: "fadeIn 0.35s ease" }}>
                {error      && <div style={S.errorBanner}>⚠ {error}</div>}
                {successMsg && (
                  <div style={S.successBanner}>
                    <Icon name="check" size={16} color={tokens.green500} />
                    {successMsg}
                  </div>
                )}

                <p style={S.sectionTitle}>Upload a New Resume</p>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={(e) => handleUpload(e.target.files?.[0])}
                />

                {uploading ? (
                  <div style={S.uploadingRow}>
                    <Icon name="file" size={20} color={tokens.teal500} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: tokens.slate700 }}>
                        Uploading resume…
                      </p>
                      <div style={S.uploadProgress}>
                        <div style={S.uploadProgressFill} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={S.uploadArea(drag)}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                  >
                    <div style={S.uploadIcon}>
                      <Icon name="upload" size={26} color={tokens.teal500} />
                    </div>
                    <p style={S.uploadTitle}>Drop your resume here</p>
                    <p style={S.uploadSub}>PDF, DOC, or DOCX · Max 10 MB</p>
                    <button
                      style={S.uploadBtn}
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    >
                      <Icon name="plus" size={15} color={tokens.white} />
                      Browse File
                    </button>
                  </div>
                )}

                {/* Divider */}
                <div style={S.dividerRow}>
                  <div style={S.dividerLine} />
                  <span style={S.dividerText}>
                    {resumes.length > 0 ? "or pick a saved resume" : "no saved resumes yet"}
                  </span>
                  <div style={S.dividerLine} />
                </div>

                {/* Empty state when no resumes */}
                {resumes.length === 0 && !uploading && (
                  <div style={S.emptyState}>
                    <div style={S.emptyIcon}>
                      <Icon name="file" size={28} color={tokens.teal500} />
                    </div>
                    <p style={S.emptyTitle}>No resumes uploaded yet</p>
                    <p style={S.emptyDesc}>
                      Upload your first resume above and we'll extract the text
                      and run an AI-powered review for you.
                    </p>
                  </div>
                )}

                {/* Saved resume cards */}
                {resumes.length > 0 && (
                  <>
                    <p style={S.sectionTitle}>Saved Resumes ({resumes.length})</p>
                    <div style={S.pickerGrid}>
                      {resumes.map((r) => (
                        <div
                          key={r.id}
                          className="resume-card-hover"
                          style={S.resumeCard(selectedResume?.id === r.id)}
                          onClick={() => { setSelectedResume(r); clearAlerts(); }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && setSelectedResume(r)}
                        >
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: 8,
                              background: tokens.teal50,
                              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}>
                              <Icon name="file" size={17} color={tokens.teal500} />
                            </div>
                            <div style={{ paddingRight: 28, minWidth: 0 }}>
                              <p style={S.resumeCardTitle}>{r.title || "Untitled Resume"}</p>
                              <p style={S.resumeCardMeta}>
                                {r.created_at && `Uploaded ${fmt(r.created_at)}`}
                                {r.updated_at && r.updated_at !== r.created_at
                                  ? ` · Updated ${fmt(r.updated_at)}`
                                  : ""}
                              </p>
                            </div>
                          </div>

                          {/* Card actions */}
                          <div style={S.resumeCardActions} onClick={(e) => e.stopPropagation()}>
                            <button
                              className="card-action-btn"
                              style={S.cardBtn(tokens.teal700, tokens.teal50)}
                              onClick={() => { setSelectedResume(r); clearAlerts(); }}
                            >
                              <Icon name="sparkle" size={12} color={tokens.teal700} />
                              Analyze
                            </button>
                            <button
                              className="card-action-btn"
                              style={S.cardBtn(tokens.slate600, tokens.slate50)}
                              onClick={() => {
                                setActiveView("history");
                                clearAlerts();
                              }}
                            >
                              <Icon name="clock" size={12} color={tokens.slate600} />
                              Reviews
                            </button>
                          </div>

                          {/* Selection checkmark */}
                          <div style={S.resumeCheckmark(selectedResume?.id === r.id)}>
                            {selectedResume?.id === r.id && (
                              <Icon name="check" size={11} color={tokens.white} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Analyze CTA */}
                {resumes.length > 0 && (
                  <button
                    className="action-btn"
                    style={selectedResume && !analyzing ? S.analyzeBtn : S.analyzeBtnDisabled}
                    onClick={handleAnalyze}
                    disabled={!selectedResume || analyzing}
                  >
                    <Icon name="sparkle" size={15} color={selectedResume ? tokens.white : tokens.slate400} />
                    {selectedResume
                      ? `Analyze "${selectedResume.title || "Resume"}"`
                      : "Select a resume to analyze"}
                    {selectedResume && <Icon name="chevron" size={15} color={tokens.white} />}
                  </button>
                )}
              </div>
            )}

            {/* ─── STEP 2 — AI Loading ─── */}
            {step === 2 && (
              <div style={S.loadingWrap}>
                <div style={S.pulseRing}>
                  <Icon name="brain" size={30} color={tokens.white} />
                </div>
                <p style={S.loadingTitle}>AI is reviewing your resume…</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
                  {LOADING_STEPS.map((lbl, i) => (
                    <div key={i} style={S.loadingStepRow(i === loadingStep)}>
                      <span>{i < loadingStep ? "✓" : i === loadingStep ? "›" : "·"}</span>
                      <span>{lbl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── STEP 3 — Review Results ─── */}
            {step === 3 && review && (() => {
              const r         = review.ai_response || {};
              const score     = r?.overall_rating ?? r?.overall_score ?? 0;
              const scoreInfo = getScoreLabel(score);

              return (
                <div style={{ animation: "fadeIn 0.4s ease" }}>
                  {/* Back button */}
                  <button
                    className="action-btn"
                    style={{ ...S.toolbarOutline, marginBottom: 20, display: "inline-flex" }}
                    onClick={handleAnalyzeAgain}
                  >
                    <Icon name="arrowLeft" size={15} color={tokens.slate700} />
                    Back to resumes
                  </button>

                  {/* Score header */}
                  <div style={S.scoreCard}>
                    <div style={S.scoreBg} />
                    <div style={{
                      position: "absolute", bottom: -50, right: 80,
                      width: 140, height: 140, borderRadius: "50%",
                      background: "rgba(255,255,255,0.03)", pointerEvents: "none",
                    }} />
                    <div style={S.scoreCircle}>
                      <span style={{ ...S.scoreNum, color: scoreInfo.color }}>{score}</span>
                      <span style={S.scoreOf}>/ 100</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={S.scoreLabel}>Overall Resume Score</p>
                      <p style={S.scoreName}>{scoreInfo.label}</p>
                      <p style={S.scoreSummary}>
                        {review.resume_title ? `"${review.resume_title}" · ` : ""}
                        {r.overall_summary || "Analyzed across 8 dimensions. See detailed feedback below."}
                      </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14, flexShrink: 0, textAlign: "right" }}>
                      {[
                        { label: "Strengths",   value: (r.strengths   || []).length, color: tokens.teal400 },
                        { label: "Issues",      value: (r.weaknesses  || []).length, color: "#f87171"       },
                        { label: "Suggestions", value: (r.ats_suggestions || []).length + (r.grammar_suggestions || []).length, color: "#fbbf24" },
                      ].map((stat) => (
                        <div key={stat.label}>
                          <p style={S.statNum(stat.color)}>{stat.value}</p>
                          <p style={S.statLabel}>{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recruiter feedback */}
                  {r.recruiter_feedback && (
                    <div style={S.recruiterCard}>
                      <div style={S.reviewCardHeader}>
                        <div style={S.reviewCardIconWrap(tokens.teal100)}>
                          <Icon name="user" size={17} color={tokens.teal700} />
                        </div>
                        <p style={S.reviewCardTitle}>Recruiter's Perspective</p>
                        <span style={S.reviewCardBadge(tokens.teal700, tokens.teal100)}>Insider View</span>
                      </div>
                      <p style={S.recruiterQuote}>{r.recruiter_feedback}</p>
                    </div>
                  )}

                  {/* 8 section cards */}
                  <p style={S.sectionTitle}>Detailed Feedback</p>
                  <div style={S.reviewGrid}>
                    {Object.keys(SECTION_CONFIG).map((key) => (
                      <ReviewCard key={key} sectionKey={key} data={r[key]} />
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={S.toolbar}>
                    <button className="action-btn" style={S.toolbarPrimary} onClick={handleAnalyzeAgain}>
                      <Icon name="refresh" size={15} color={tokens.white} />
                      Analyze Another
                    </button>
                    <button className="action-btn" style={S.toolbarTeal} onClick={handleCopyReview}>
                      <Icon name="copy" size={15} color={tokens.teal700} />
                      Copy Review
                    </button>
                    <button className="action-btn" style={S.toolbarOutline} onClick={handleExport}>
                      <Icon name="download" size={15} color={tokens.slate700} />
                      Export as Text
                    </button>
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div style={S.toast}>
          <Icon name="check" size={15} color={tokens.teal400} />
          {toast}
        </div>
      )}
    </div>
  );
}