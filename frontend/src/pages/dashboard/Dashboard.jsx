import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─── Color & Design System Configuration ─────────────────────────────────────
const CONFIG = {
  colors: {
    primaryTeal: "#0D9488",
    primaryHover: "#0F766E",
    primaryLight: "#F0FDFA",
    primaryLightBorder: "#99F6E4",
    background: "#F8FAFC",
    cardBg: "#FFFFFF",
    border: "#E2E8F0",
    borderHover: "#CBD5E1",
    textPrimary: "#111827",
    textSecondary: "#475569",
    textMuted: "#64748B",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
  fonts: {
    body: "'DM Sans', sans-serif",
    brand: "'Syne', sans-serif",
  },
};

// ─── Component Styling Constants ─────────────────────────────────────────────
const globalCardStyle = {
  background: CONFIG.colors.cardBg,
  border: `1px solid ${CONFIG.colors.border}`,
  borderRadius: 16,
  padding: "24px",
  transition: "all 0.2s ease",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, change, positive, icon }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...globalCardStyle,
        borderColor: hovered ? CONFIG.colors.primaryLightBorder : CONFIG.colors.border,
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 8px 24px rgba(15,23,42,0.06)" : "none",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: CONFIG.colors.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", color: CONFIG.colors.primaryTeal }}>
          {icon}
        </div>
        <span style={{
          fontSize: 12, fontWeight: 600,
          color: positive ? CONFIG.colors.success : CONFIG.colors.warning,
          background: positive ? "#HN0FDFA" : "#FFFBEB", // Adjusted slightly fallback
          backgroundColor: positive ? "#ECFDF5" : "#FFFBEB",
          borderRadius: 20, padding: "2px 8px",
          fontFamily: CONFIG.fonts.body,
        }}>
          {change}
        </span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: CONFIG.colors.textPrimary, fontFamily: CONFIG.fonts.body, letterSpacing: "-0.03em", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: CONFIG.colors.textMuted, marginTop: 6, fontFamily: CONFIG.fonts.body, fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}

function QuickActionCard({ label, desc, icon, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      style={{
        ...globalCardStyle,
        padding: "16px",
        display: "flex", alignItems: "center", gap: 16,
        cursor: "pointer", width: "100%", textAlign: "left",
        background: hovered ? CONFIG.colors.primaryLight : CONFIG.colors.cardBg,
        borderColor: hovered ? CONFIG.colors.primaryLightBorder : CONFIG.colors.border,
        boxShadow: hovered ? "0 8px 24px rgba(15,23,42,0.04)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ width: 42, height: 42, borderRadius: 12, background: CONFIG.colors.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: CONFIG.colors.primaryTeal, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: CONFIG.colors.textPrimary, fontFamily: CONFIG.fonts.body, marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 12, color: CONFIG.colors.textMuted, fontFamily: CONFIG.fonts.body }}>
          {desc}
        </div>
      </div>
    </button>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const displayName = user.full_name || "Guest";
  const firstName = displayName.split(" ")[0];

  // Core state containing resumes
  const [resumes, setResumes] = useState([
    { id: 1, title: "Senior Software Engineer Resume", updated: "Today", score: 87, status: "Excellent Match", template: "Minimal Tech" },
    { id: 2, title: "Product Manager Strategy Lead", updated: "Yesterday", score: 74, status: "Good Match", template: "SaaS Executive" },
    { id: 3, title: "Data Analyst Analyst Resume", updated: "2 days ago", score: 91, status: "Excellent Match", template: "Stripe Clean" },
  ]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Welcome back" : hour < 17 ? "Good afternoon" : "Good evening";

  // Navigation handlers
  const handleCreateResume = () => navigate("/dashboard/builder");

  return (
    <div style={{ fontFamily: CONFIG.fonts.body, color: CONFIG.colors.textPrimary, backgroundColor: CONFIG.colors.background, minHeight: "100vh", padding: "4px 0" }}>
      
      {/* Premium Hero Welcome Section */}
      <div style={{
        ...globalCardStyle,
        borderRadius: 20,
        padding: "28px 32px",
        marginBottom: 24,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 20,
        boxShadow: "0 4px 20px rgba(15,23,42,0.03)",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{
              background: CONFIG.colors.primaryLight,
              border: `1px solid ${CONFIG.colors.primaryLightBorder}`,
              color: CONFIG.colors.primaryTeal,
              fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
              fontFamily: CONFIG.fonts.brand, letterSpacing: "0.03em"
            }}>
              RESUMEAI PLATFORM
            </span>
          </div>
          <h2 style={{ fontFamily: CONFIG.fonts.brand, fontSize: 26, fontWeight: 700, color: CONFIG.colors.textPrimary, margin: 0, letterSpacing: "-0.02em" }}>
            {greeting}, {firstName}!
          </h2>
          <p style={{ fontSize: 14, color: CONFIG.colors.textSecondary, marginTop: 4, marginBottom: 0, lineHeight: 1.5 }}>
            Continue building ATS-optimized resumes and land more interviews. You have <span style={{ color: CONFIG.colors.primaryTeal, fontWeight: 600 }}>{resumes.length} active documents</span>.
          </p>
        </div>
        
        <button
          onClick={handleCreateResume}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "11px 22px",
            background: CONFIG.colors.primaryTeal,
            border: "none", borderRadius: 10, cursor: "pointer",
            color: "#FFFFFF", fontWeight: 600, fontSize: 14, fontFamily: CONFIG.fonts.body,
            boxShadow: "0 2px 8px rgba(13,148,136,0.16)", flexShrink: 0,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = CONFIG.colors.primaryHover; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = CONFIG.colors.primaryTeal; e.currentTarget.style.transform = "none"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Build New Resume
        </button>
      </div>

      {/* Analytics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Resumes" value={resumes.length} change="+2 this month" positive={true} icon={<DocIcon />} />
        <StatCard label="ATS Checks Completed" value="38" change="+12 this week" positive={true} icon={<ScanIcon />} />
        <StatCard label="Job Match Optimization" value="94%" change="↑ 4% growth" positive={true} icon={<MatchIcon />} />
        <StatCard label="Profile Strength" value="85%" change="Complete" positive={true} icon={<StrengthIcon />} />
      </div>

      {/* Main Dashboard Interactive Split Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20, marginBottom: 24 }} className="dashboard-grid">
        
        {/* Left Column Container */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* Quick Actions Component */}
          <div style={globalCardStyle}>
            <h3 style={{ fontFamily: CONFIG.fonts.brand, fontSize: 15, fontWeight: 700, color: CONFIG.colors.textPrimary, marginTop: 0, marginBottom: 16 }}>
              Quick Tools
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="quick-actions-subgrid">
              <QuickActionCard label="Create Resume" desc="Start from modern standard layout" icon="✏️" onClick={handleCreateResume} />
              <QuickActionCard label="ATS Scan" desc="Check strict syntax matchers" icon="🔍" onClick={() => {}} />
              <QuickActionCard label="Analyze Job" desc="Compare with production postings" icon="🎯" onClick={() => {}} />
              <QuickActionCard label="Browse Templates" desc="Explore parsed layouts blueprints" icon="📑" onClick={() => {}} />
            </div>
          </div>

          {/* Progress Architecture Monitor */}
          <div style={globalCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontFamily: CONFIG.fonts.brand, fontSize: 15, fontWeight: 700, color: CONFIG.colors.textPrimary, margin: 0 }}>
                Primary Profile Strength
              </h3>
              <span style={{
                background: CONFIG.colors.primaryLight,
                border: `1px solid ${CONFIG.colors.primaryLightBorder}`,
                color: CONFIG.colors.primaryTeal,
                fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 8
              }}>
                85% Operational
              </span>
            </div>
            <div style={{ width: "100%", height: 8, background: CONFIG.colors.border, borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: "85%", height: "100%", background: CONFIG.colors.primaryTeal, borderRadius: 99 }} />
            </div>
            <p style={{ margin: "10px 0 0 0", fontSize: 12.5, color: CONFIG.colors.textMuted }}>
              Add a verified target structural portfolio node link to unlock full ATS parsing automation tiering metrics.
            </p>
          </div>
        </div>

        {/* Right Column: Standout High-impact ATS Widget & Activity Timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* ATS Score Visualization Widget */}
          <div style={{ ...globalCardStyle, display: "flex", alignItems: "center", gap: 24, background: "linear-gradient(to bottom right, #FFFFFF, #FAFAFA)" }}>
            {/* Minimal SVG Native Circular Progress */}
            <div style={{ position: "relative", width: 84, height: 84, flexShrink: 0 }}>
              <svg width="84" height="84" viewBox="0 0 36 36">
                <path stroke={CONFIG.colors.border} strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path stroke={CONFIG.colors.primaryTeal} strokeWidth="3" strokeDasharray="87, 100" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 18, fontWeight: 700, color: CONFIG.colors.textPrimary, fontFamily: CONFIG.fonts.body }}>
                87%
              </div>
            </div>
            <div>
              <span style={{ background: CONFIG.colors.primaryLight, border: `1px solid ${CONFIG.colors.primaryLightBorder}`, color: CONFIG.colors.primaryTeal, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6 }}>
                Excellent Match
              </span>
              <h4 style={{ fontSize: 15, fontWeight: 600, color: CONFIG.colors.textPrimary, margin: "6px 0 2px 0" }}>Top Scan Architecture</h4>
              <p style={{ margin: 0, fontSize: 12, color: CONFIG.colors.textSecondary, lineHeight: 1.4 }}>Your active template matches industry metrics thresholds for tech hiring pipelines.</p>
            </div>
          </div>

          {/* Clean Analytics Timeline Activity Logger */}
          <div style={globalCardStyle}>
            <h3 style={{ fontFamily: CONFIG.fonts.brand, fontSize: 15, fontWeight: 700, color: CONFIG.colors.textPrimary, marginTop: 0, marginBottom: 16 }}>
              Recent Telemetry Logs
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "ATS compiler sequence scan complete", sub: "Score verified at 87% index structural", time: "10m ago", color: CONFIG.colors.success },
                { label: "Target production matrix resume updated", sub: "Section node 'Skills Framework' synchronized", time: "2h ago", color: CONFIG.colors.primaryTeal },
                { label: "New parsed layout design criteria applied", sub: "Transitioned to Minimal Tech architecture profile", time: "1d ago", color: CONFIG.colors.textMuted }
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: CONFIG.colors.textSecondary, fontWeight: 500 }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: CONFIG.colors.textMuted }}>{item.sub}</div>
                  </div>
                  <span style={{ fontSize: 11, color: CONFIG.colors.textMuted, whiteSpace: "nowrap" }}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Conditionally Rendered Core Data Node Area (Data Grid vs Empty State) */}
      {resumes.length === 0 ? (
        /* Standout Native Premium Empty State Layout Design */
        <div style={{ ...globalCardStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: CONFIG.colors.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: CONFIG.colors.primaryTeal, marginBottom: 16 }}>
            📭
          </div>
          <h3 style={{ fontFamily: CONFIG.fonts.brand, fontSize: 18, fontWeight: 700, color: CONFIG.colors.textPrimary, margin: "0 0 6px 0" }}>
            No resumes yet
          </h3>
          <p style={{ margin: "0 0 20px 0", fontSize: 14, color: CONFIG.colors.textSecondary, maxWidth: 380, lineHeight: 1.5 }}>
            Create your first ATS-optimized resume blueprints and initialize production target tracking today.
          </p>
          <button
            onClick={handleCreateResume}
            style={{
              padding: "10px 20px", background: CONFIG.colors.primaryTeal, color: "#FFFFFF",
              border: "none", borderRadius: 10, fontWeight: 600, fontSize: 13.5, cursor: "pointer",
              transition: "background 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = CONFIG.colors.primaryHover}
            onMouseLeave={e => e.currentTarget.style.background = CONFIG.colors.primaryTeal}
          >
            Create Resume
          </button>
        </div>
      ) : (
        /* Redesigned Minimal Production Data Table Layout */
        <div style={{ ...globalCardStyle, padding: "20px 0" }}>
          <div style={{ padding: "0 24px 16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontFamily: CONFIG.fonts.brand, fontSize: 15, fontWeight: 700, color: CONFIG.colors.textPrimary, margin: 0 }}>
              Stored Resume Ecosystem Profiles ({resumes.length})
            </h3>
          </div>

          <div style={{ overflowX: "auto" }}>
            <div style={{ minWidth: 700 }}>
              {/* Header Grid Row */}
              <div style={{
                display: "grid", gridTemplateColumns: "2.5fr 1.2fr 1fr 1.2fr 1.2fr",
                padding: "10px 24px", borderBottom: `1px solid ${CONFIG.colors.border}`,
                fontSize: 11, fontWeight: 600, color: CONFIG.colors.textMuted, letterSpacing: "0.05em", textTransform: "uppercase"
              }}>
                <span>Document Framework Title</span>
                <span>Template File</span>
                <span>ATS Parsing Index</span>
                <span>Telemetry Delta</span>
                <span style={{ textAlign: "right" }}>Management Node</span>
              </div>

              {/* Dynamic Map Data Generator List */}
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  style={{
                    display: "grid", gridTemplateColumns: "2.5fr 1.2fr 1fr 1.2fr 1.2fr",
                    padding: "16px 24px", alignItems: "center",
                    borderBottom: `1px solid ${CONFIG.colors.background}`,
                    transition: "background 0.15s ease",
                  }}
                  className="table-row-hover"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: CONFIG.colors.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: CONFIG.colors.primaryTeal }}>📄</div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: CONFIG.colors.textPrimary }}>{resume.title}</span>
                  </div>
                  <span style={{ fontSize: 13, color: CONFIG.colors.textSecondary }}>{resume.template}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: resume.score >= 85 ? CONFIG.colors.success : CONFIG.colors.warning }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: CONFIG.colors.textPrimary }}>{resume.score}%</span>
                  </div>
                  <span style={{ fontSize: 13, color: CONFIG.colors.textMuted }}>{resume.updated}</span>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button style={{ padding: "6px 12px", border: `1px solid ${CONFIG.colors.border}`, background: "#FFFFFF", borderRadius: 8, color: CONFIG.colors.textSecondary, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Edit</button>
                    <button style={{ padding: "6px 12px", border: "none", background: CONFIG.colors.primaryLight, borderRadius: 8, color: CONFIG.colors.primaryTeal, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Scan</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Embedded High-Fidelity Custom Layout Style Overrides */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        
        .table-row-hover:hover {
          background-color: ${CONFIG.colors.primaryLight}40 !important;
        }
        
        @media (max-width: 960px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .quick-actions-subgrid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ─── Native Platform Clean SVGs Icons Components ─────────────────────────────
function DocIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>; }
function ScanIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/></svg>; }
function MatchIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>; }
function StrengthIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>; }
