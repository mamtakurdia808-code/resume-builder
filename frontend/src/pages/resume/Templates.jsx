import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import {
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineEye,
  HiOutlineTemplate,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineRefresh,
  HiOutlineChevronDown,
  HiOutlineLockClosed,
  HiOutlineSparkles,
  HiOutlinePlusCircle,
  HiOutlineDownload,
  HiOutlineArrowLeft,
  HiOutlineCheck,
} from "react-icons/hi";

// ─── Import your template components ─────────────────────────────────────────
import ProfessionalTemplate from "../../components/templates/ProfessionalTemplate";
import ModernTemplate       from "../../components/templates/ModernTemplate";
import MinimalTemplate      from "../../components/templates/MinimalTemplate";
import ExecutiveTemplate from "../../components/templates/ExecutiveTemplate";
import CreativeTemplate from "../../components/templates/CreativeTemplate";

/**
 * TEMPLATE REGISTRY
 * Maps the `template_name` string stored in your DB → the React component.
 * Keys must match exactly what your backend returns in template.template_name.
 * Add new entries as you build more templates.
 */
const TEMPLATE_REGISTRY = {
  Professional:        ProfessionalTemplate,
  Modern:           ModernTemplate,
  Minimal:          MinimalTemplate,
  Executive: ExecutiveTemplate,
  Creative: CreativeTemplate,
};

/** Returns the component for a given template, falling back to ProfessionalTemplate. */
function resolveTemplate(templateName) {
  return TEMPLATE_REGISTRY[templateName] || ProfessionalTemplate;
}

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  teal:         "#0D9488",
  tealLight:    "#14B8A6",
  tealDark:     "#0F766E",
  tealGhost:    "#F0FDFA",
  tealMid:      "#CCFBF1",
  ink:          "#0F172A",
  inkMid:       "#334155",
  inkSoft:      "#64748B",
  inkFaint:     "#94A3B8",
  border:       "#E2E8F0",
  borderLight:  "#F1F5F9",
  surface:      "#FFFFFF",
  surfaceAlt:   "#F8FAFC",
  gold:         "#F59E0B",
  goldLight:    "#FEF3C7",
  success:      "#10B981",
  successLight: "#D1FAE5",
  error:        "#EF4444",
  errorLight:   "#FEE2E2",
  radius:       "12px",
  radiusSm:     "8px",
  radiusLg:     "16px",
  shadow:       "0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.06)",
  shadowMd:     "0 4px 12px rgba(15,23,42,0.08), 0 12px 32px rgba(15,23,42,0.08)",
  shadowLg:     "0 8px 24px rgba(15,23,42,0.12), 0 24px 48px rgba(15,23,42,0.10)",
  transition:   "all 0.2s cubic-bezier(0.4,0,0.2,1)",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight:  "100vh",
    background: T.surfaceAlt,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color:      T.ink,
  },
  header: {
    background:   T.surface,
    borderBottom: `1px solid ${T.border}`,
    padding:      "32px 24px 28px",
  },
  headerInner: { maxWidth: "1280px", margin: "0 auto" },
  headerEyebrow: {
    display:       "inline-flex",
    alignItems:    "center",
    gap:           "6px",
    background:    T.tealGhost,
    color:         T.teal,
    fontSize:      "12px",
    fontWeight:    600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    padding:       "4px 12px",
    borderRadius:  "999px",
    marginBottom:  "14px",
    border:        `1px solid ${T.tealMid}`,
  },
  headerTitle: {
    fontSize:      "clamp(24px, 4vw, 32px)",
    fontWeight:    800,
    color:         T.ink,
    lineHeight:    1.15,
    margin:        "0 0 8px",
    letterSpacing: "-0.02em",
  },
  headerSub: { fontSize: "15px", color: T.inkSoft, margin: 0, lineHeight: 1.6 },
  toolbar: {
    background:   T.surface,
    borderBottom: `1px solid ${T.border}`,
    padding:      "16px 24px",
    position:     "sticky",
    top:          0,
    zIndex:       20,
    boxShadow:    "0 2px 8px rgba(15,23,42,0.04)",
  },
  toolbarInner: {
    maxWidth:   "1280px",
    margin:     "0 auto",
    display:    "flex",
    flexWrap:   "wrap",
    gap:        "12px",
    alignItems: "center",
  },
  searchWrap: { position: "relative", flex: "1 1 240px", minWidth: "200px" },
  searchIcon: {
    position:       "absolute",
    left:           "12px",
    top:            "50%",
    transform:      "translateY(-50%)",
    color:          T.inkFaint,
    pointerEvents:  "none",
    fontSize:       "16px",
  },
  searchInput: {
    width:        "100%",
    padding:      "10px 12px 10px 38px",
    border:       `1.5px solid ${T.border}`,
    borderRadius: T.radiusSm,
    fontSize:     "14px",
    color:        T.ink,
    background:   T.surface,
    outline:      "none",
    transition:   T.transition,
    boxSizing:    "border-box",
  },
  filterWrap:      { display: "flex", gap: "8px", flexWrap: "wrap" },
  filterChip: (active) => ({
    padding:      "8px 16px",
    borderRadius: "999px",
    fontSize:     "13px",
    fontWeight:   600,
    cursor:       "pointer",
    border:       active ? `1.5px solid ${T.teal}` : `1.5px solid ${T.border}`,
    background:   active ? T.teal : T.surface,
    color:        active ? "#fff" : T.inkMid,
    transition:   T.transition,
    whiteSpace:   "nowrap",
  }),
  gridSection: { maxWidth: "1280px", margin: "0 auto", padding: "28px 24px 48px" },
  resultsBar:  {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
    marginBottom:   "20px",
  },
  resultsCount: { fontSize: "13px", color: T.inkSoft, fontWeight: 500 },
  grid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap:                 "24px",
  },
  card: {
    background:     T.surface,
    borderRadius:   T.radiusLg,
    border:         `1.5px solid ${T.border}`,
    overflow:       "hidden",
    boxShadow:      T.shadow,
    transition:     T.transition,
    cursor:         "pointer",
    display:        "flex",
    flexDirection:  "column",
  },
  cardThumbWrap: {
    position:     "relative",
    aspectRatio:  "3/4",
    background:   T.surfaceAlt,
    overflow:     "hidden",
  },
  cardThumb: {
    width:      "100%",
    height:     "100%",
    objectFit:  "cover",
    display:    "block",
    transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
  },
  cardThumbPlaceholder: {
    width:           "100%",
    height:          "100%",
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    background:      `linear-gradient(135deg, ${T.tealGhost} 0%, ${T.tealMid} 100%)`,
  },
  cardOverlay: {
    position:        "absolute",
    inset:           0,
    background:      "rgba(15,23,42,0.55)",
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             "10px",
    opacity:         0,
    transition:      T.transition,
  },
  overlayBtn: (variant) => ({
    padding:        "9px 18px",
    borderRadius:   T.radiusSm,
    fontSize:       "13px",
    fontWeight:     600,
    border:         "none",
    cursor:         "pointer",
    display:        "flex",
    alignItems:     "center",
    gap:            "6px",
    transition:     T.transition,
    background:     variant === "primary" ? T.teal : "rgba(255,255,255,0.12)",
    color:          "#fff",
    backdropFilter: variant === "secondary" ? "blur(8px)" : "none",
  }),
  premiumBadge: {
    position:     "absolute",
    top:          "10px",
    right:        "10px",
    background:   `linear-gradient(135deg, ${T.gold}, #d97706)`,
    color:        "#fff",
    fontSize:     "10px",
    fontWeight:   700,
    letterSpacing:"0.05em",
    padding:      "3px 8px",
    borderRadius: "999px",
    display:      "flex",
    alignItems:   "center",
    gap:          "4px",
    boxShadow:    "0 2px 6px rgba(245,158,11,0.4)",
  },
  cardBody: {
    padding:       "16px",
    flex:          1,
    display:       "flex",
    flexDirection: "column",
    gap:           "8px",
  },
  cardMeta: {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
    gap:            "8px",
  },
  categoryBadge: {
    fontSize:      "11px",
    fontWeight:    600,
    letterSpacing: "0.05em",
    color:         T.teal,
    background:    T.tealGhost,
    padding:       "3px 10px",
    borderRadius:  "999px",
    border:        `1px solid ${T.tealMid}`,
  },
  cardName:    { fontSize: "16px", fontWeight: 700, color: T.ink, margin: 0, letterSpacing: "-0.01em" },
  cardDesc:    { fontSize: "13px", color: T.inkSoft, margin: 0, lineHeight: 1.55, flex: 1 },
  cardActions: { display: "flex", gap: "8px", marginTop: "4px" },
  cardBtn: (variant) => ({
    flex:            variant === "primary" ? 1 : "none",
    padding:         "9px 14px",
    borderRadius:    T.radiusSm,
    fontSize:        "13px",
    fontWeight:      600,
    border:          variant === "primary" ? "none" : `1.5px solid ${T.border}`,
    cursor:          "pointer",
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             "6px",
    transition:      T.transition,
    background:      variant === "primary" ? T.teal : T.surface,
    color:           variant === "primary" ? "#fff" : T.inkMid,
  }),

  // ── Full-screen live preview overlay ──────────────────────────────────────
  livePreviewOverlay: {
    position:   "fixed",
    inset:      0,
    zIndex:     200,
    background: "#1E293B",
    display:    "flex",
    flexDirection: "column",
    animation:  "fadeIn 0.2s ease",
    overflow:   "hidden",
  },
  livePreviewTopbar: {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
    padding:        "12px 20px",
    background:     "#0F172A",
    borderBottom:   "1px solid rgba(255,255,255,0.08)",
    flexShrink:     0,
    gap:            "12px",
    flexWrap:       "wrap",
  },
  livePreviewTopbarLeft: {
    display:    "flex",
    alignItems: "center",
    gap:        "12px",
  },
  livePreviewTopbarTitle: {
    fontSize:   "14px",
    fontWeight: 600,
    color:      "#F8FAFC",
    margin:     0,
  },
  livePreviewTopbarSub: {
    fontSize: "12px",
    color:    "#64748B",
    margin:   0,
  },
  livePreviewTopbarRight: {
    display:    "flex",
    alignItems: "center",
    gap:        "10px",
  },
  livePreviewContent: {
    flex:       1,
    overflowY:  "auto",
    padding:    "32px 16px",
    display:    "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    background: "#1E293B",
  },
  livePreviewPaper: {
    background:   "#fff",
    width:        "210mm",
    minHeight:    "297mm",
    boxShadow:    "0 8px 40px rgba(0,0,0,0.4)",
    borderRadius: "2px",
    overflow:     "hidden",
  },
  livePreviewLoadingWrap: {
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center",
    minHeight:      "60vh",
    gap:            "16px",
    color:          "#94A3B8",
    fontSize:       "14px",
  },
  livePreviewErrorWrap: {
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center",
    minHeight:      "60vh",
    gap:            "12px",
    color:          "#F87171",
    fontSize:       "14px",
    textAlign:      "center",
    padding:        "24px",
  },

  // Status pill shown in topbar
  appliedPill: {
    display:      "inline-flex",
    alignItems:   "center",
    gap:          "5px",
    background:   T.successLight,
    color:        T.success,
    fontSize:     "12px",
    fontWeight:   600,
    padding:      "4px 10px",
    borderRadius: "999px",
  },

  // Generic modals
  backdrop: {
    position:        "fixed",
    inset:           0,
    background:      "rgba(15,23,42,0.6)",
    backdropFilter:  "blur(4px)",
    zIndex:          100,
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    padding:         "16px",
    animation:       "fadeIn 0.18s ease",
  },
  modal: (wide) => ({
    background:    T.surface,
    borderRadius:  T.radiusLg,
    boxShadow:     T.shadowLg,
    width:         "100%",
    maxWidth:      wide ? "780px" : "460px",
    maxHeight:     "90vh",
    overflow:      "hidden",
    display:       "flex",
    flexDirection: "column",
    animation:     "slideUp 0.22s cubic-bezier(0.4,0,0.2,1)",
  }),
  modalHeader: {
    padding:        "20px 24px 16px",
    borderBottom:   `1px solid ${T.border}`,
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
    gap:            "12px",
    flexShrink:     0,
  },
  modalTitle:  { fontSize: "17px", fontWeight: 700, color: T.ink, margin: 0, letterSpacing: "-0.01em" },
  modalClose: {
    width:        "32px",
    height:       "32px",
    borderRadius: T.radiusSm,
    border:       `1.5px solid ${T.border}`,
    background:   T.surface,
    cursor:       "pointer",
    display:      "flex",
    alignItems:   "center",
    justifyContent: "center",
    color:        T.inkSoft,
    transition:   T.transition,
    flexShrink:   0,
  },
  modalBody:   { padding: "24px", overflowY: "auto", flex: 1 },
  modalFooter: {
    padding:        "16px 24px",
    borderTop:      `1px solid ${T.border}`,
    display:        "flex",
    justifyContent: "flex-end",
    gap:            "10px",
    flexShrink:     0,
  },
  previewGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" },
  previewImgWrap: {
    background:   T.surfaceAlt,
    borderRadius: T.radiusSm,
    overflow:     "hidden",
    aspectRatio:  "3/4",
    border:       `1px solid ${T.border}`,
  },
  previewImg:  { width: "100%", height: "100%", objectFit: "cover" },
  previewInfo: { display: "flex", flexDirection: "column", gap: "14px" },
  infoRow:     { display: "flex", flexDirection: "column", gap: "4px" },
  infoLabel:   { fontSize: "11px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: T.inkFaint },
  infoValue:   { fontSize: "15px", color: T.ink, fontWeight: 500 },
  infoDesc:    { fontSize: "14px", color: T.inkSoft, lineHeight: 1.65 },
  applyField:  { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" },
  applyLabel:  { fontSize: "13px", fontWeight: 600, color: T.inkMid },
  selectWrap:  { position: "relative" },
  select: {
    width:        "100%",
    padding:      "11px 40px 11px 14px",
    border:       `1.5px solid ${T.border}`,
    borderRadius: T.radiusSm,
    fontSize:     "14px",
    color:        T.ink,
    background:   T.surface,
    appearance:   "none",
    outline:      "none",
    cursor:       "pointer",
    transition:   T.transition,
    boxSizing:    "border-box",
  },
  selectArrow: {
    position:      "absolute",
    right:         "12px",
    top:           "50%",
    transform:     "translateY(-50%)",
    color:         T.inkFaint,
    pointerEvents: "none",
  },
  applyTemplateSummary: {
    background:   T.tealGhost,
    border:       `1px solid ${T.tealMid}`,
    borderRadius: T.radiusSm,
    padding:      "12px 14px",
    display:      "flex",
    alignItems:   "center",
    gap:          "10px",
    marginBottom: "20px",
  },
  applyTemplateName: { fontSize: "14px", fontWeight: 600, color: T.tealDark },
  applyTemplateDesc: { fontSize: "12px", color: T.teal, marginTop: "2px" },
  btn: (variant, disabled) => ({
    padding:    "10px 22px",
    borderRadius: T.radiusSm,
    fontSize:   "14px",
    fontWeight: 600,
    border:
      variant === "outline" ? `1.5px solid ${T.border}`
      : variant === "ghost" ? "none"
      : "none",
    cursor:     disabled ? "not-allowed" : "pointer",
    display:    "inline-flex",
    alignItems: "center",
    gap:        "8px",
    transition: T.transition,
    opacity:    disabled ? 0.5 : 1,
    background:
      variant === "primary"  ? T.teal
      : variant === "ghost"  ? "transparent"
      : T.surfaceAlt,
    color:
      variant === "primary" ? "#fff"
      : variant === "ghost" ? T.inkSoft
      : T.inkMid,
  }),
  // Dark button for overlay topbar
  btnDark: (variant) => ({
    padding:      "9px 18px",
    borderRadius: T.radiusSm,
    fontSize:     "13px",
    fontWeight:   600,
    border:       variant === "outline" ? "1.5px solid rgba(255,255,255,0.15)" : "none",
    cursor:       "pointer",
    display:      "inline-flex",
    alignItems:   "center",
    gap:          "7px",
    transition:   T.transition,
    background:   variant === "primary" ? T.teal : "rgba(255,255,255,0.06)",
    color:        "#F1F5F9",
  }),
  centerState: {
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center",
    padding:        "80px 24px",
    gap:            "16px",
    textAlign:      "center",
  },
  stateIcon: {
    width:          "56px",
    height:         "56px",
    borderRadius:   "50%",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    fontSize:       "24px",
    marginBottom:   "4px",
  },
  stateTitle: { fontSize: "17px", fontWeight: 700, color: T.ink, margin: 0 },
  stateSub:   { fontSize: "14px", color: T.inkSoft, margin: 0, maxWidth: "320px" },
  skeleton: {
    background:     `linear-gradient(90deg, ${T.borderLight} 25%, ${T.border} 50%, ${T.borderLight} 75%)`,
    backgroundSize: "200% 100%",
    animation:      "shimmer 1.4s infinite",
    borderRadius:   T.radiusSm,
  },
  toast: (type) => ({
    position:     "fixed",
    bottom:       "24px",
    right:        "24px",
    zIndex:       300,
    background:   type === "success" ? T.success : T.error,
    color:        "#fff",
    padding:      "14px 18px",
    borderRadius: T.radiusSm,
    fontSize:     "14px",
    fontWeight:   600,
    display:      "flex",
    alignItems:   "center",
    gap:          "10px",
    boxShadow:    T.shadowMd,
    animation:    "slideInRight 0.25s cubic-bezier(0.4,0,0.2,1)",
    maxWidth:     "360px",
  }),
  spinner: {
    width:          "16px",
    height:         "16px",
    border:         "2.5px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius:   "50%",
    animation:      "spin 0.7s linear infinite",
    flexShrink:     0,
  },
  spinnerDark: {
    width:          "18px",
    height:         "18px",
    border:         `2.5px solid ${T.border}`,
    borderTopColor: T.teal,
    borderRadius:   "50%",
    animation:      "spin 0.7s linear infinite",
    flexShrink:     0,
  },
  noResumeBanner: {
    background:    T.errorLight,
    border:        `1px solid #FECACA`,
    borderRadius:  T.radiusSm,
    padding:       "16px",
    display:       "flex",
    flexDirection: "column",
    gap:           "12px",
    alignItems:    "flex-start",
  },
  noResumeText: { fontSize: "13px", fontWeight: 500, color: "#B91C1C", margin: 0, lineHeight: 1.55 },
};

// ─── Keyframes ────────────────────────────────────────────────────────────────
const KEYFRAMES = `
@keyframes fadeIn      { from { opacity:0 } to { opacity:1 } }
@keyframes slideUp     { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
@keyframes slideInRight{ from { opacity:0; transform:translateX(60px) } to { opacity:1; transform:translateX(0) } }
@keyframes spin        { to { transform:rotate(360deg) } }
@keyframes shimmer     { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
@media print {
  .live-preview-topbar { display: none !important; }
  body { margin: 0; }
}
`;

const BASE_URL   = import.meta.env.VITE_API_URL;
const CATEGORIES = ["All", "Professional", "ATS", "Minimal", "Executive", "Creative", "Classic"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const safeArray = (v) => (Array.isArray(v) ? v : []);

function useHover() {
  const [hovered, setHovered] = useState(false);
  return [hovered, { onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false) }];
}

// ─── Tiny shared components ───────────────────────────────────────────────────
function Spinner({ dark }) {
  return <span style={dark ? styles.spinnerDark : styles.spinner} aria-hidden="true" />;
}

function Toast({ message, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={styles.toast(type)} role="alert" aria-live="polite">
      {type === "success"
        ? <HiOutlineCheckCircle size={18} />
        : <HiOutlineExclamationCircle size={18} />}
      {message}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ ...styles.card, cursor: "default" }}>
      <div style={{ ...styles.skeleton, aspectRatio: "3/4", borderRadius: 0 }} />
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ ...styles.skeleton, height: "16px", width: "60%", borderRadius: "4px" }} />
        <div style={{ ...styles.skeleton, height: "13px", width: "90%", borderRadius: "4px" }} />
        <div style={{ ...styles.skeleton, height: "13px", width: "75%", borderRadius: "4px" }} />
        <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
          <div style={{ ...styles.skeleton, height: "36px", flex: 1, borderRadius: T.radiusSm }} />
          <div style={{ ...styles.skeleton, height: "36px", width: "80px", borderRadius: T.radiusSm }} />
        </div>
      </div>
    </div>
  );
}

// ─── Template Card ────────────────────────────────────────────────────────────
function TemplateCard({ template, onPreview, onUse }) {
  const [hovered, hoverProps] = useHover();
  const hasThumb = !!template.thumbnail;
  return (
    <article
      style={{
        ...styles.card,
        borderColor: hovered ? T.teal : T.border,
        boxShadow:   hovered ? T.shadowMd : T.shadow,
        transform:   hovered ? "translateY(-3px)" : "translateY(0)",
      }}
      {...hoverProps}
      role="article"
      aria-label={`${template.template_name} template`}
    >
      <div style={styles.cardThumbWrap}>
        {hasThumb && (
          <img
            src={`${BASE_URL}${template.thumbnail}`}
            alt={`${template.template_name} preview`}
            style={{ ...styles.cardThumb, transform: hovered ? "scale(1.04)" : "scale(1)" }}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const ph = e.currentTarget.nextElementSibling;
              if (ph) ph.style.display = "flex";
            }}
          />
        )}
        <div style={{ ...styles.cardThumbPlaceholder, display: hasThumb ? "none" : "flex" }}>
          <HiOutlineTemplate size={48} color={T.teal} opacity={0.5} />
        </div>
        <div style={{ ...styles.cardOverlay, opacity: hovered ? 1 : 0 }} aria-hidden="true">
          <button
            style={styles.overlayBtn("secondary")}
            onClick={(e) => { e.stopPropagation(); onPreview(template); }}
            tabIndex={hovered ? 0 : -1}
          >
            <HiOutlineEye size={14} /> Preview
          </button>
          <button
            style={styles.overlayBtn("primary")}
            onClick={(e) => { e.stopPropagation(); onUse(template); }}
            tabIndex={hovered ? 0 : -1}
          >
            Use This
          </button>
        </div>
        {template.is_premium && (
          <div style={styles.premiumBadge}>
            <HiOutlineSparkles size={10} /> Pro
          </div>
        )}
      </div>
      <div style={styles.cardBody}>
        <div style={styles.cardMeta}>
          <span style={styles.categoryBadge}>{template.category}</span>
          {template.is_premium && (
            <span style={{ color: T.gold, fontSize: "12px", display: "flex", alignItems: "center", gap: "3px" }}>
              <HiOutlineLockClosed size={12} /> Premium
            </span>
          )}
        </div>
        <h3 style={styles.cardName}>{template.template_name}</h3>
        <p style={styles.cardDesc}>{template.description}</p>
        <div style={styles.cardActions}>
          <button style={styles.cardBtn("primary")} onClick={() => onUse(template)} aria-label={`Use ${template.template_name}`}>
            Use Template
          </button>
          <button style={styles.cardBtn("outline")} onClick={() => onPreview(template)} aria-label={`Preview ${template.template_name}`}>
            <HiOutlineEye size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Thumbnail Preview Modal (static, no resume data) ────────────────────────
function PreviewModal({ template, onClose, onUse }) {
  const ref   = useRef(null);
  const [narrow, setNarrow] = useState(window.innerWidth < 620);
  useEffect(() => {
    ref.current?.focus();
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < 620));
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return (
    <div style={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true">
      <div style={styles.modal(true)} ref={ref} tabIndex={-1}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Template Preview</h2>
          <button style={styles.modalClose} onClick={onClose} aria-label="Close"><HiOutlineX size={16} /></button>
        </div>
        <div style={styles.modalBody}>
          <div style={narrow ? { display: "flex", flexDirection: "column", gap: "20px" } : styles.previewGrid}>
            <div style={styles.previewImgWrap}>
              {template.thumbnail
                ? <img src={`${BASE_URL}${template.thumbnail}`} alt={template.template_name} style={styles.previewImg} />
                : <div style={{ ...styles.cardThumbPlaceholder, height: "100%" }}><HiOutlineTemplate size={64} color={T.teal} opacity={0.4} /></div>}
            </div>
            <div style={styles.previewInfo}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Template</span>
                <span style={styles.infoValue}>{template.template_name}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Category</span>
                <span style={styles.categoryBadge}>{template.category}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Access</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: template.is_premium ? T.gold : T.success }}>
                  {template.is_premium ? "⭐ Premium" : "✓ Free"}
                </span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Description</span>
                <p style={{ ...styles.infoDesc, margin: 0 }}>{template.description}</p>
              </div>
              <div style={{ background: T.tealGhost, borderRadius: T.radiusSm, padding: "14px", border: `1px solid ${T.tealMid}`, marginTop: "auto" }}>
                <p style={{ margin: 0, fontSize: "13px", color: T.tealDark, lineHeight: 1.6 }}>
                  ATS-friendly and optimised for modern recruitment software. Clean layout with clear section hierarchy.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div style={styles.modalFooter}>
          <button style={styles.btn("outline")} onClick={onClose}>Close</button>
          <button style={styles.btn("primary")} onClick={() => { onClose(); onUse(template); }}>Use This Template</button>
        </div>
      </div>
    </div>
  );
}

// ─── Resume Picker Modal ──────────────────────────────────────────────────────
// Step 1: user picks which resume to preview with this template.
function ResumePickerModal({ template, resumes, loadingResumes, onClose, onConfirm }) {
  const safeResumes = safeArray(resumes);
  const [selectedId, setSelectedId] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus();
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div style={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true" aria-label="Pick resume">
      <div style={styles.modal(false)} ref={ref} tabIndex={-1}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Select a Resume</h2>
          <button style={styles.modalClose} onClick={onClose} aria-label="Close"><HiOutlineX size={16} /></button>
        </div>
        <div style={styles.modalBody}>
          {/* Template summary */}
          <div style={styles.applyTemplateSummary}>
            <HiOutlineTemplate size={22} color={T.teal} />
            <div>
              <div style={styles.applyTemplateName}>{template.template_name}</div>
              <div style={styles.applyTemplateDesc}>{template.category} · {template.is_premium ? "Premium" : "Free"}</div>
            </div>
          </div>

          <div style={styles.applyField}>
            <label style={styles.applyLabel} htmlFor="resume-select-picker">
              Which resume should use this template?
            </label>

            {loadingResumes && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: T.inkSoft, fontSize: "14px", padding: "10px 0" }}>
                <Spinner dark /> Loading your resumes…
              </div>
            )}

            {!loadingResumes && safeResumes.length === 0 && (
              <div style={styles.noResumeBanner}>
                <p style={styles.noResumeText}>You don't have any resumes yet. Create one first.</p>
                <button style={{ ...styles.btn("primary"), fontSize: "13px", padding: "8px 16px" }}
                  onClick={() => { onClose(); window.location.href = "/resume/new"; }}>
                  <HiOutlinePlusCircle size={15} /> Create Resume
                </button>
              </div>
            )}

            {!loadingResumes && safeResumes.length > 0 && (
              <div style={styles.selectWrap}>
                <select
                  id="resume-select-picker"
                  style={styles.select}
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                >
                  <option value="">— Choose a resume —</option>
                  {safeResumes.map((r) => (
                    <option key={r.id} value={r.id}>{r.title || r.name || `Resume #${r.id}`}</option>
                  ))}
                </select>
                <div style={styles.selectArrow}><HiOutlineChevronDown size={16} /></div>
              </div>
            )}
          </div>

          {selectedId && (
            <div style={{ padding: "11px 14px", borderRadius: T.radiusSm, background: T.tealGhost, fontSize: "13px", color: T.tealDark, fontWeight: 500, display: "flex", alignItems: "center", gap: "8px", border: `1px solid ${T.tealMid}` }}>
              <HiOutlineEye size={15} />
              You'll see a live preview of this template with your resume data before anything is saved.
            </div>
          )}
        </div>
        <div style={styles.modalFooter}>
          <button style={styles.btn("ghost")} onClick={onClose}>Cancel</button>
          <button
            style={styles.btn("primary", !selectedId)}
            onClick={() => selectedId && onConfirm(selectedId)}
            disabled={!selectedId}
          >
            Preview →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Live Preview Overlay ─────────────────────────────────────────────────────
// Full-screen dark overlay. Fetches resume data, renders it with the chosen
// template component. "Apply Template" persists to DB. "Download PDF" prints.
function LivePreviewOverlay({ template, resumeId, onClose, onApplied, authHeader }) {
  const [resumeData,  setResumeData]  = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [fetchError,  setFetchError]  = useState(null);
  const [applying,    setApplying]    = useState(false);
  const [applied,     setApplied]     = useState(false);
  const [photoUrl,    setPhotoUrl]    = useState(null);
  const fileInputRef = useRef(null);                   

  const TemplateComponent = resolveTemplate(template.template_name);

  const photoTemplates = ["Modern", "Executive", "Creative"];

  const showPhotoUpload = photoTemplates.includes(template.template_name);

  // Handle local photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
  };

  // Merge uploaded photo into resumeData before passing to template
  const resumeWithPhoto = resumeData
  ? {
      ...resumeData,
      personal: {                          // ← was "personalInfo"
        ...resumeData.personal,
        photo: photoUrl || resumeData.personal?.photo || "",
      },
    }
  : null;

  // Fetch resume data
  useEffect(() => {
  let cancelled = false;
  (async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const { data } = await axios.get(`${BASE_URL}/resumes/${resumeId}`, { headers: authHeader }); // ← this was missing!

      const raw = data?.resume || data;
      const r = raw?.resume_data || raw;

      const normalized = {
  personal: {                                    // ← was "personalInfo"
    fullName: r.personal?.fullName || "",        // ← was name/full_name
    title:    r.personal?.title    || "",
    email:    r.personal?.email    || "",
    phone:    r.personal?.phone    || "",
    location: r.personal?.location || "",
    photo:    r.personal?.photo    || "",
    portfolio: r.personal?.portfolio || r.personal?.website || "",
    linkedin: r.personal?.linkedin || "",
    github:   r.personal?.github   || "",
    summary:  r.personal?.summary  || "",
  },
  skills:         Array.isArray(r.skills)         ? r.skills         : [],
  experience:     Array.isArray(r.experience)     ? r.experience     : [],
  projects:       Array.isArray(r.projects)       ? r.projects       : [],
  education:      Array.isArray(r.education)      ? r.education      : [],
  certifications: Array.isArray(r.certifications) ? r.certifications : [],
  languages:      Array.isArray(r.languages)      ? r.languages      : [],
  achievements:   Array.isArray(r.achievements)   ? r.achievements   : [],
};

      if (!cancelled) setResumeData(normalized);
    } catch (err) {
      if (!cancelled) setFetchError(err?.response?.data?.message || "Failed to load resume data.");
    } finally {
      if (!cancelled) setLoading(false);
    }
  })();
  return () => { cancelled = true; };
}, [resumeId]);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape" && !applying) onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, applying]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleApply = async () => {
    setApplying(true);
    try {
      const { data } = await axios.put(
        `${BASE_URL}/templates/apply`,
        { resume_id: Number(resumeId), template_id: template.id },
        { headers: { ...authHeader, "Content-Type": "application/json" } }
      );
      // Accept any truthy success flag OR any 2xx (no explicit success field)
      if (data?.success !== false) {
        setApplied(true);
        onApplied({ type: "success", message: data?.message || "Template applied successfully!" });
      } else {
        throw new Error(data?.message || "Apply failed");
      }
    } catch (err) {
      onApplied({ type: "error", message: err?.response?.data?.message || "Failed to apply template." });
    } finally {
      setApplying(false);
    }
  };

  const handleDownload = () => window.print();

  return (
  <div style={styles.livePreviewOverlay} role="dialog" aria-modal="true" aria-label="Live resume preview">
    
    {/* ── Top bar ── */}
    <div className="live-preview-topbar" style={styles.livePreviewTopbar}>
      
      {/* Left: Back + title */}
      <div style={styles.livePreviewTopbarLeft}>
        <button style={styles.btnDark("outline")} onClick={onClose} disabled={applying}>
          <HiOutlineArrowLeft size={15} /> Back
        </button>
        <div>
          <p style={styles.livePreviewTopbarTitle}>
            {template.template_name} Template
            {resumeData && ` · ${resumeData.personal?.fullName || "Your Resume"}`}
          </p>
          <p style={styles.livePreviewTopbarSub}>
            {applied ? "Changes saved to your resume" : "Preview only — nothing is saved yet"}
          </p>
        </div>
      </div>

      {/* Right: Photo + Applied pill + Download + Apply */}
      <div style={styles.livePreviewTopbarRight}>

        {/* Hidden file input */}
{showPhotoUpload && (
  <>
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      onChange={handlePhotoChange}
    />

    <button
      style={{
        ...styles.btnDark("outline"),
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
      }}
      onClick={() => fileInputRef.current?.click()}
      disabled={loading || !!fetchError}
      title="Upload profile photo"
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt="photo"
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ) : (
        <span style={{ fontSize: "15px" }}>📷</span>
      )}
      {photoUrl ? "Change Photo" : "Add Photo"}
    </button>
  </>
)}

        {applied && (
          <span style={styles.appliedPill}>
            <HiOutlineCheck size={13} /> Applied
          </span>
        )}

        <button
          style={styles.btnDark("outline")}
          onClick={handleDownload}
          disabled={loading || !!fetchError}
        >
          <HiOutlineDownload size={15} /> Download PDF
        </button>

        {!applied && (
          <button
            style={{
              ...styles.btnDark("primary"),
              opacity: applying || loading || !!fetchError ? 0.6 : 1,
            }}
            onClick={handleApply}
            disabled={applying || loading || !!fetchError}
          >
            {applying ? <><Spinner /> Applying…</> : "Apply Template"}
          </button>
        )}
      </div>
    </div>

    {/* ── Content area ── */}
    <div style={styles.livePreviewContent}>
      {loading && (
        <div style={styles.livePreviewLoadingWrap}>
          <Spinner dark />
          <span>Loading your resume…</span>
        </div>
      )}

      {!loading && fetchError && (
        <div style={styles.livePreviewErrorWrap}>
          <HiOutlineExclamationCircle size={32} color="#F87171" />
          <p style={{ margin: 0, fontWeight: 600, color: "#F87171" }}>Couldn't load resume</p>
          <p style={{ margin: 0, color: "#94A3B8", fontSize: "13px" }}>{fetchError}</p>
          <button style={styles.btnDark("outline")} onClick={onClose}>Go Back</button>
        </div>
      )}

      {/* ← Use resumeWithPhoto here, not resumeData */}
      {!loading && !fetchError && resumeWithPhoto && (
        <div style={styles.livePreviewPaper}>
          <TemplateComponent resume={resumeWithPhoto} />
        </div>
      )}
    </div>

  </div>
);
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Templates() {
  const [templates,        setTemplates]        = useState([]);
  const [resumes,          setResumes]          = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [loadingResumes,   setLoadingResumes]   = useState(true);
  const [templateError,    setTemplateError]    = useState(null);

  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");

  // Modal / overlay state
  const [previewTemplate,   setPreviewTemplate]   = useState(null); // thumbnail preview modal
  const [pickerTemplate,    setPickerTemplate]    = useState(null); // resume picker modal
  const [livePreview,       setLivePreview]       = useState(null); // { template, resumeId }

  const [toast, setToast] = useState(null);

  const token      = localStorage.getItem("token");
  const authHeader = { Authorization: `Bearer ${token}` };

  // ── Fetch templates ────────────────────────────────────────────────────────
  const fetchTemplates = useCallback(async () => {
    setLoadingTemplates(true);
    setTemplateError(null);
    try {
      const { data } = await axios.get(`${BASE_URL}/templates`, { headers: authHeader });
      setTemplates(safeArray(data?.templates));
      console.log("Templates:", data);
    } catch (err) {
      setTemplateError(err?.response?.data?.message || "Failed to load templates.");
      setTemplates([]);
    } finally {
      setLoadingTemplates(false);
    }
  }, []);

  // ── Fetch resumes ──────────────────────────────────────────────────────────
  const fetchResumes = useCallback(async () => {
  setLoadingResumes(true);

  try {
    const { data } = await axios.get(`${BASE_URL}/resumes`, {
      headers: authHeader,
    });

    console.log("API Response:", data);

    setResumes(data.resumes || []);
  } catch (err) {
    console.error(err);
    setResumes([]);
  } finally {
    setLoadingResumes(false);
  }
}, []);

useEffect(() => {
  fetchTemplates();
  fetchResumes();
}, [fetchTemplates, fetchResumes]);

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = safeArray(templates).filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      t.template_name?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q);
    const matchCat = category === "All" || t.category === category;
    return matchSearch && matchCat;
  });

  // ── Flow: "Use Template" → picker → live preview ──────────────────────────
  const handleUseTemplate = (template) => {
    setPickerTemplate(template);
  };

  const handlePickerConfirm = (resumeId) => {
    setPickerTemplate(null);
    setLivePreview({ template: pickerTemplate, resumeId });
  };

  // Called by LivePreviewOverlay after DB apply (success or error)
  const handleApplied = (toastPayload) => {
    setToast(toastPayload);
    // Keep the overlay open so user can still download PDF / see the result
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{KEYFRAMES}</style>

      <div style={styles.page}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerInner}>
            <div style={styles.headerEyebrow}><HiOutlineTemplate size={12} /> Resume Templates</div>
            <h1 style={styles.headerTitle}>Choose Your Template</h1>
            <p style={styles.headerSub}>Pick a professional layout and apply it to any of your resumes in one click.</p>
          </div>
        </header>

        {/* Toolbar */}
        <div style={styles.toolbar} role="search">
          <div style={styles.toolbarInner}>
            <div style={styles.searchWrap}>
              <span style={styles.searchIcon}><HiOutlineSearch /></span>
              <input
                style={styles.searchInput}
                type="search"
                placeholder="Search templates…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search templates"
                onFocus={(e) => (e.target.style.borderColor = T.teal)}
                onBlur={(e)  => (e.target.style.borderColor = T.border)}
              />
            </div>
            <div style={styles.filterWrap} role="group" aria-label="Filter by category">
              {CATEGORIES.map((cat) => (
                <button key={cat} style={styles.filterChip(category === cat)} onClick={() => setCategory(cat)} aria-pressed={category === cat}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <main style={styles.gridSection}>
          {!loadingTemplates && !templateError && (
            <div style={styles.resultsBar}>
              <span style={styles.resultsCount}>
                {filtered.length} template{filtered.length !== 1 ? "s" : ""}
                {category !== "All" ? ` in ${category}` : ""}
                {search ? ` matching "${search}"` : ""}
              </span>
            </div>
          )}

          {loadingTemplates && (
            <div style={styles.grid}>{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
          )}

          {!loadingTemplates && templateError && (
            <div style={styles.centerState}>
              <div style={{ ...styles.stateIcon, background: T.errorLight, color: T.error }}><HiOutlineExclamationCircle size={26} /></div>
              <h2 style={styles.stateTitle}>Couldn't load templates</h2>
              <p style={styles.stateSub}>{templateError}</p>
              <button style={styles.btn("primary")} onClick={fetchTemplates}><HiOutlineRefresh size={15} /> Retry</button>
            </div>
          )}

          {!loadingTemplates && !templateError && safeArray(templates).length === 0 && (
            <div style={styles.centerState}>
              <div style={{ ...styles.stateIcon, background: T.tealGhost, color: T.teal }}><HiOutlineTemplate size={26} /></div>
              <h2 style={styles.stateTitle}>No templates available</h2>
              <p style={styles.stateSub}>No templates have been added yet. Check back soon.</p>
            </div>
          )}

          {!loadingTemplates && !templateError && safeArray(templates).length > 0 && filtered.length === 0 && (
            <div style={styles.centerState}>
              <div style={{ ...styles.stateIcon, background: T.tealGhost, color: T.teal }}><HiOutlineTemplate size={26} /></div>
              <h2 style={styles.stateTitle}>No templates found</h2>
              <p style={styles.stateSub}>Try clearing your search or selecting a different category.</p>
              <button style={styles.btn("outline")} onClick={() => { setSearch(""); setCategory("All"); }}>Clear filters</button>
            </div>
          )}

          {!loadingTemplates && !templateError && filtered.length > 0 && (
            <div style={styles.grid}>
              {safeArray(filtered).map((t) => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  onPreview={setPreviewTemplate}
                  onUse={handleUseTemplate}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ── Thumbnail preview modal (static) ── */}
      {previewTemplate && (
        <PreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={(t) => { setPreviewTemplate(null); handleUseTemplate(t); }}
        />
      )}

      {/* ── Resume picker modal ── */}
      {pickerTemplate && (
        <ResumePickerModal
          template={pickerTemplate}
          resumes={safeArray(resumes)}
          loadingResumes={loadingResumes}
          onClose={() => setPickerTemplate(null)}
          onConfirm={handlePickerConfirm}
        />
      )}

      {/* ── Full-screen live preview overlay ── */}
      {livePreview && (
        <LivePreviewOverlay
          template={livePreview.template}
          resumeId={livePreview.resumeId}
          authHeader={authHeader}
          onClose={() => setLivePreview(null)}
          onApplied={handleApplied}
        />
      )}

      {/* ── Toast ── */}
      {toast && <Toast type={toast.type} message={toast.message} onDone={() => setToast(null)} />}
    </>
  );
}