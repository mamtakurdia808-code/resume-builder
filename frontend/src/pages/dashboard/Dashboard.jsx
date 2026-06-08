import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const STATS = [
  {
    id: "resumes", label: "Total Resumes", value: "7", change: "+2 this month",
    positive: true, icon: <DocIcon />, color: "#7c3aed",
    bg: "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(79,70,229,0.08))",
    border: "rgba(124,58,237,0.25)",
  },
  {
    id: "reports", label: "ATS Reports", value: "24", change: "+5 this week",
    positive: true, icon: <ScanIcon />, color: "#0ea5e9",
    bg: "linear-gradient(135deg,rgba(14,165,233,0.15),rgba(6,182,212,0.08))",
    border: "rgba(14,165,233,0.25)",
  },
  {
    id: "score", label: "Best ATS Score", value: "91%", change: "↑ from 76%",
    positive: true, icon: <TrophyIcon />, color: "#10b981",
    bg: "linear-gradient(135deg,rgba(16,185,129,0.15),rgba(5,150,105,0.08))",
    border: "rgba(16,185,129,0.25)",
  },
  {
    id: "profile", label: "Profile Completion", value: "68%", change: "3 steps left",
    positive: false, icon: <ProfileIcon />, color: "#f59e0b",
    bg: "linear-gradient(135deg,rgba(245,158,11,0.15),rgba(217,119,6,0.08))",
    border: "rgba(245,158,11,0.25)",
  },
];

const QUICK_ACTIONS = [
  { id: "create", label: "Create Resume", desc: "Start from scratch or template", icon: "✏️", color: "#7c3aed", bg: "rgba(124,58,237,0.12)", border: "rgba(124,58,237,0.25)" },
  { id: "upload", label: "Upload Resume", desc: "Import your existing resume", icon: "📤", color: "#0ea5e9", bg: "rgba(14,165,233,0.12)", border: "rgba(14,165,233,0.25)" },
  { id: "ats", label: "ATS Scan", desc: "Check resume compatibility", icon: "🔍", color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)" },
  { id: "analyze", label: "Analyze Job", desc: "Match resume to job posting", icon: "🎯", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
];

const RECENT_ACTIVITY = [
  { id: 1, type: "created", icon: "📄", title: "Software Engineer Resume", sub: "Created from 'Modern Tech' template", time: "Today, 10:32 AM", score: null, tag: "Created", tagColor: "#7c3aed" },
  { id: 2, type: "ats", icon: "✅", title: "ATS Scan — Product Manager Resume", sub: "Scored against 'Product Lead' job posting", time: "Yesterday, 3:14 PM", score: 87, tag: "ATS Scan", tagColor: "#10b981" },
  { id: 3, type: "updated", icon: "🔄", title: "Data Analyst Resume", sub: "Updated skills section & added 3 projects", time: "2 days ago", score: null, tag: "Updated", tagColor: "#0ea5e9" },
  { id: 4, type: "ats", icon: "✅", title: "ATS Scan — Frontend Developer", sub: "Scored 91% — top match!", time: "3 days ago", score: 91, tag: "ATS Scan", tagColor: "#10b981" },
  { id: 5, type: "created", icon: "📄", title: "UX Designer Portfolio Resume", sub: "Created from 'Creative Pro' template", time: "4 days ago", score: null, tag: "Created", tagColor: "#7c3aed" },
];

const RESUMES = [
  { id: 1, title: "Software Engineer Resume", updated: "Today", score: 87, status: "Optimized", template: "Modern Tech" },
  { id: 2, title: "Product Manager Resume", updated: "Yesterday", score: 74, status: "Fair", template: "Executive" },
  { id: 3, title: "Data Analyst Resume", updated: "2 days ago", score: 91, status: "Excellent", template: "Clean Pro" },
  { id: 4, title: "UX Designer Resume", updated: "4 days ago", score: 62, status: "Needs Work", template: "Creative Pro" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ stat, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), delay); }, [delay]);
  return (
    <div style={{
      background: stat.bg, border: `1px solid ${stat.border}`,
      borderRadius: 16, padding: "20px 22px",
      opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)",
      transition: "all 0.45s cubic-bezier(0.34,1.1,0.64,1)",
      cursor: "default", position: "relative", overflow: "hidden",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${stat.color}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: stat.color, opacity: 0.06 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: `${stat.color}22`, border: `1px solid ${stat.color}44`, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color }}>
          {stat.icon}
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: stat.positive ? "#4ade80" : "#fbbf24", background: stat.positive ? "rgba(74,222,128,0.1)" : "rgba(251,191,36,0.1)", border: `1px solid ${stat.positive ? "rgba(74,222,128,0.2)" : "rgba(251,191,36,0.2)"}`, borderRadius: 20, padding: "2px 8px" }}>
          {stat.change}
        </span>
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "-0.04em", lineHeight: 1 }}>
        {stat.value}
      </div>
      <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 5, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 500 }}>
        {stat.label}
      </div>
    </div>
  );
}

function QuickActionCard({ action, delay, onClick }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), delay); }, [delay]);
  return (
    <button
      onClick={onClick}
      style={{
        background: action.bg, border: `1px solid ${action.border}`,
        borderRadius: 14, padding: "18px 20px",
        display: "flex", alignItems: "center", gap: 14,
        cursor: "pointer", width: "100%", textAlign: "left",
        opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(12px)",
        transition: "all 0.4s cubic-bezier(0.34,1.1,0.64,1)",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px) scale(1.01)"; e.currentTarget.style.boxShadow = `0 8px 24px ${action.color}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${action.color}18`, border: `1px solid ${action.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
        {action.icon}
      </div>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#e2e8f0", fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 2 }}>
          {action.label}
        </div>
        <div style={{ fontSize: 11.5, color: "#475569", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          {action.desc}
        </div>
      </div>
    </button>
  );
}

function ScorePill({ score }) {
  const color = score >= 85 ? "#10b981" : score >= 70 ? "#f59e0b" : "#ef4444";
  const label = score >= 85 ? "Excellent" : score >= 70 ? "Fair" : "Needs Work";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${color}18`, border: `2px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <span style={{ fontSize: 9, fontWeight: 800, color, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{score}</span>
      </div>
      <span style={{ fontSize: 11, color, fontWeight: 600 }}>{label}</span>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const displayName = user.full_name || "there";
  const firstName = displayName.split(" ")[0];
  const [mounted, setMounted] = useState(false);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#f1f5f9", minHeight: "100vh" }}>

      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg,rgba(124,58,237,0.12) 0%,rgba(79,70,229,0.08) 50%,rgba(14,165,233,0.06) 100%)",
        border: "1px solid rgba(124,58,237,0.15)",
        borderRadius: 18, padding: "24px 28px", marginBottom: 28,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16, position: "relative", overflow: "hidden",
        opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(16px)",
        transition: "all 0.5s cubic-bezier(0.34,1.1,0.64,1)",
      }}>
        {/* Decorative orb */}
        <div style={{ position: "absolute", right: -30, top: -30, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 20 }}>👋</span>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.03em" }}>
              {greeting}, {firstName}!
            </h2>
          </div>
          <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.5 }}>
            You have <span style={{ color: "#a78bfa", fontWeight: 700 }}>3 resumes</span> ready to send. Your best ATS score is <span style={{ color: "#10b981", fontWeight: 700 }}>91%</span> 🎉
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/builder")}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "11px 20px",
            background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
            border: "none", borderRadius: 11, cursor: "pointer",
            color: "#fff", fontWeight: 700, fontSize: 13.5,
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            boxShadow: "0 4px 18px rgba(124,58,237,0.4)", flexShrink: 0,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(124,58,237,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(124,58,237,0.4)"; }}
        >
          <span>✏️</span> Build New Resume
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 28 }}>
        {STATS.map((stat, i) => <StatCard key={stat.id} stat={stat} delay={i * 80} />)}
      </div>

      {/* Main content: Quick Actions + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20, marginBottom: 24 }} className="main-grid">
        {/* Quick Actions */}
        <div style={{
          background: "rgba(13,17,30,0.7)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 18, padding: "22px 20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", boxShadow: "0 0 6px rgba(124,58,237,0.6)" }} />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", letterSpacing: "-0.01em" }}>Quick Actions</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {QUICK_ACTIONS.map((action, i) => (
              <QuickActionCard key={action.id} action={action} delay={200 + i * 70} onClick={() => {}} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          background: "rgba(13,17,30,0.7)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 18, padding: "22px 20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0ea5e9", boxShadow: "0 0 6px rgba(14,165,233,0.6)" }} />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", letterSpacing: "-0.01em" }}>Recent Activity</h3>
            </div>
            <span style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600, cursor: "pointer" }}>View all</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={item.id} style={{
                display: "flex", gap: 14, padding: "13px 0",
                borderBottom: i < RECENT_ACTIVITY.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                cursor: "pointer", borderRadius: 8,
                transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{item.title}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: item.tagColor, background: `${item.tagColor}18`, border: `1px solid ${item.tagColor}33`, borderRadius: 20, padding: "1px 7px", flexShrink: 0 }}>{item.tag}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "#475569", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.sub}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#334155" }}>{item.time}</span>
                    {item.score && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: "1px 8px" }}>
                        {item.score}% ATS
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resume Table */}
      <div style={{
        background: "rgba(13,17,30,0.7)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 18, padding: "22px 24px", marginBottom: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px rgba(16,185,129,0.6)" }} />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", letterSpacing: "-0.01em" }}>My Resumes</h3>
          </div>
          <button style={{
            display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
            background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)",
            borderRadius: 9, cursor: "pointer", color: "#a78bfa",
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12.5, fontWeight: 600,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.12)"; }}
          >
            <span>+</span> New Resume
          </button>
        </div>

        {/* Table header */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 120px 100px 140px 120px",
          gap: 16, padding: "8px 12px", marginBottom: 4,
          fontSize: 10.5, fontWeight: 700, color: "#334155",
          letterSpacing: "0.06em", textTransform: "uppercase",
        }} className="resume-table-header">
          <span>Resume Name</span>
          <span>Template</span>
          <span>ATS Score</span>
          <span>Last Updated</span>
          <span style={{ textAlign: "right" }}>Actions</span>
        </div>

        {RESUMES.map((resume, i) => (
          <div key={resume.id} style={{
            display: "grid", gridTemplateColumns: "1fr 120px 100px 140px 120px",
            gap: 16, padding: "13px 12px",
            background: "transparent",
            borderRadius: 10,
            borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
            alignItems: "center", transition: "background 0.15s", cursor: "pointer",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            className="resume-row"
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>📄</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{resume.title}</div>
              </div>
            </div>
            <span style={{ fontSize: 12, color: "#475569" }}>{resume.template}</span>
            <ScorePill score={resume.score} />
            <span style={{ fontSize: 12, color: "#475569" }}>{resume.updated}</span>
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
              {[
                { label: "Edit", icon: "✏️", color: "#7c3aed" },
                { label: "Scan", icon: "🔍", color: "#10b981" },
              ].map(btn => (
                <button key={btn.label} style={{
                  padding: "5px 10px", borderRadius: 7, cursor: "pointer",
                  background: `${btn.color}18`, border: `1px solid ${btn.color}33`,
                  color: btn.color, fontSize: 11, fontWeight: 600,
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  display: "flex", alignItems: "center", gap: 4,
                  transition: "all 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = `${btn.color}28`}
                  onMouseLeave={e => e.currentTarget.style.background = `${btn.color}18`}
                >
                  <span style={{ fontSize: 12 }}>{btn.icon}</span> {btn.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ATS Tips banner */}
      <div style={{
        background: "linear-gradient(135deg,rgba(16,185,129,0.1),rgba(5,150,105,0.06))",
        border: "1px solid rgba(16,185,129,0.2)",
        borderRadius: 16, padding: "18px 24px",
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      }}>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>💡</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#e2e8f0", marginBottom: 3 }}>Pro Tip: Boost your ATS score by 20%</div>
          <div style={{ fontSize: 12.5, color: "#475569" }}>Add measurable achievements and job-specific keywords to each resume section. Avoid tables and graphics — ATS parsers can't read them.</div>
        </div>
        <button style={{
          padding: "9px 18px", borderRadius: 9, cursor: "pointer", flexShrink: 0,
          background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)",
          color: "#10b981", fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: 12.5, fontWeight: 700, transition: "all 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(16,185,129,0.25)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(16,185,129,0.15)"}
        >
          Learn More →
        </button>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .main-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .resume-table-header { display: none !important; }
          .resume-row { grid-template-columns: 1fr auto !important; }
          .resume-row > :nth-child(2), .resume-row > :nth-child(3), .resume-row > :nth-child(4) { display: none; }
        }
      `}</style>
    </div>
  );
}

// Icons
function DocIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>; }
function ScanIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>; }
function TrophyIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="11"/><path d="M17 11A5 5 0 0 0 7 11"/><path d="M5 7h14M5 7l1 5h12l1-5"/></svg>; }
function ProfileIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }