import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const STATS = [
  {
    id: "resumes", label: "Total Resumes", value: "7", change: "+2 this month",
    positive: true, icon: <DocIcon />, color: "#6366F1",
    bg: "#FFFFFF", border: "#E2E8F0",
  },
  {
    id: "reports", label: "ATS Reports", value: "24", change: "+5 this week",
    positive: true, icon: <ScanIcon />, color: "#8B5CF6",
    bg: "#FFFFFF", border: "#E2E8F0",
  },
  {
    id: "score", label: "Best ATS Score", value: "91%", change: "↑ from 76%",
    positive: true, icon: <TrophyIcon />, color: "#10B981",
    bg: "#FFFFFF", border: "#E2E8F0",
  },
  {
    id: "profile", label: "Profile Completion", value: "68%", change: "3 steps left",
    positive: false, icon: <ProfileIcon />, color: "#F59E0B",
    bg: "#FFFFFF", border: "#E2E8F0",
  },
];

const QUICK_ACTIONS = [
  { id: "create", label: "Create Resume", desc: "Start from scratch or template", icon: "✏️", color: "#6366F1", bg: "rgba(99,102,241,0.06)", border: "#E0E0FD" },
  { id: "upload", label: "Upload Resume", desc: "Import your existing resume", icon: "📤", color: "#8B5CF6", bg: "rgba(139,92,246,0.06)", border: "#EDE9FE" },
  { id: "ats", label: "ATS Scan", desc: "Check resume compatibility", icon: "🔍", color: "#10B981", bg: "rgba(16,185,129,0.06)", border: "#D1FAE5" },
  { id: "analyze", label: "Analyze Job", desc: "Match resume to job posting", icon: "🎯", color: "#F59E0B", bg: "rgba(245,158,11,0.06)", border: "#FEF3C7" },
];

const RECENT_ACTIVITY = [
  { id: 1, type: "created", icon: "📄", title: "Software Engineer Resume", sub: "Created from 'Modern Tech' template", time: "Today, 10:32 AM", score: null, tag: "Created", tagColor: "#6366F1", tagBg: "rgba(99,102,241,0.08)" },
  { id: 2, type: "ats", icon: "✅", title: "ATS Scan — Product Manager Resume", sub: "Scored against 'Product Lead' job posting", time: "Yesterday, 3:14 PM", score: 87, tag: "ATS Scan", tagColor: "#10B981", tagBg: "rgba(16,185,129,0.08)" },
  { id: 3, type: "updated", icon: "🔄", title: "Data Analyst Resume", sub: "Updated skills section & added 3 projects", time: "2 days ago", score: null, tag: "Updated", tagColor: "#8B5CF6", tagBg: "rgba(139,92,246,0.08)" },
  { id: 4, type: "ats", icon: "✅", title: "ATS Scan — Frontend Developer", sub: "Scored 91% — top match!", time: "3 days ago", score: 91, tag: "ATS Scan", tagColor: "#10B981", tagBg: "rgba(16,185,129,0.08)" },
  { id: 5, type: "created", icon: "📄", title: "UX Designer Portfolio Resume", sub: "Created from 'Creative Pro' template", time: "4 days ago", score: null, tag: "Created", tagColor: "#6366F1", tagBg: "rgba(99,102,241,0.08)" },
];

const RESUMES = [
  { id: 1, title: "Software Engineer Resume", updated: "Today", score: 87, status: "Optimized", template: "Modern Tech" },
  { id: 2, title: "Product Manager Resume", updated: "Yesterday", score: 74, status: "Fair", template: "Executive" },
  { id: 3, title: "Data Analyst Resume", updated: "2 days ago", score: 91, status: "Excellent", template: "Clean Pro" },
  { id: 4, title: "UX Designer Resume", updated: "4 days ago", score: 62, status: "Needs Work", template: "Creative Pro" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
const card = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
};

function StatCard({ stat, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), delay); }, [delay]);
  return (
    <div style={{
      ...card,
      padding: "20px 22px",
      opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(12px)",
      transition: "opacity 0.4s ease, transform 0.4s ease, box-shadow 0.2s ease",
      cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 16px rgba(15,23,42,0.1)`; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(15,23,42,0.06)"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${stat.color}12`, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color }}>
          {stat.icon}
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600,
          color: stat.positive ? "#10B981" : "#F59E0B",
          background: stat.positive ? "#ECFDF5" : "#FFFBEB",
          border: `1px solid ${stat.positive ? "#A7F3D0" : "#FDE68A"}`,
          borderRadius: 20, padding: "2px 8px",
          fontFamily: "'Inter', sans-serif",
        }}>
          {stat.change}
        </span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.04em", lineHeight: 1 }}>
        {stat.value}
      </div>
      <div style={{ fontSize: 12.5, color: "#94A3B8", marginTop: 5, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
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
        borderRadius: 10, padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 12,
        cursor: "pointer", width: "100%", textAlign: "left",
        opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(8px)",
        transition: "opacity 0.35s ease, transform 0.35s ease, box-shadow 0.15s ease",
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 12px ${action.color}18`; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${action.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
        {action.icon}
      </div>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#0F172A", fontFamily: "'Inter', sans-serif", marginBottom: 2 }}>
          {action.label}
        </div>
        <div style={{ fontSize: 11.5, color: "#94A3B8", fontFamily: "'Inter', sans-serif" }}>
          {action.desc}
        </div>
      </div>
    </button>
  );
}

function ScorePill({ score }) {
  const color = score >= 85 ? "#10B981" : score >= 70 ? "#F59E0B" : "#EF4444";
  const bg = score >= 85 ? "#ECFDF5" : score >= 70 ? "#FFFBEB" : "#FEF2F2";
  const label = score >= 85 ? "Excellent" : score >= 70 ? "Fair" : "Needs Work";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 9, fontWeight: 700, color, fontFamily: "'Inter', sans-serif" }}>{score}</span>
      </div>
      <span style={{ fontSize: 11, color, fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>{label}</span>
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

  const font = "'Inter', sans-serif";

  return (
    <div style={{ fontFamily: font, color: "#111827" }}>

      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg,#6366F1 0%,#8B5CF6 100%)",
        borderRadius: 14, padding: "24px 28px", marginBottom: 24,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16, position: "relative", overflow: "hidden",
        opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(12px)",
        transition: "opacity 0.45s ease, transform 0.45s ease",
        boxShadow: "0 8px 32px rgba(99,102,241,0.28)",
      }}>
        {/* Subtle pattern overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 80% -20%, rgba(255,255,255,0.12) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 20 }}>👋</span>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
              {greeting}, {firstName}!
            </h2>
          </div>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>
            You have <span style={{ color: "#FFFFFF", fontWeight: 700 }}>3 resumes</span> ready to send. Your best ATS score is <span style={{ color: "#A7F3D0", fontWeight: 700 }}>91%</span> 🎉
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/builder")}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
            background: "#FFFFFF",
            border: "none", borderRadius: 9, cursor: "pointer",
            color: "#6366F1", fontWeight: 700, fontSize: 13.5, fontFamily: font,
            boxShadow: "0 2px 8px rgba(15,23,42,0.12)", flexShrink: 0,
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,23,42,0.18)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,23,42,0.12)"; }}
        >
          <span>✏️</span> Build New Resume
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 24 }}>
        {STATS.map((stat, i) => <StatCard key={stat.id} stat={stat} delay={i * 70} />)}
      </div>

      {/* Quick Actions + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 18, marginBottom: 20 }} className="main-grid">
        {/* Quick Actions */}
        <div style={{ ...card, padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366F1" }} />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.01em" }}>Quick Actions</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {QUICK_ACTIONS.map((action, i) => (
              <QuickActionCard key={action.id} action={action} delay={180 + i * 60} onClick={() => {}} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ ...card, padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8B5CF6" }} />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.01em" }}>Recent Activity</h3>
            </div>
            <span style={{ fontSize: 12, color: "#6366F1", fontWeight: 600, cursor: "pointer" }}>View all</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={item.id} style={{
                display: "flex", gap: 12, padding: "11px 8px",
                borderBottom: i < RECENT_ACTIVITY.length - 1 ? "1px solid #F1F5F9" : "none",
                cursor: "pointer", borderRadius: 8, transition: "background 0.12s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ width: 32, height: 32, borderRadius: 9, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{item.title}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: item.tagColor, background: item.tagBg, borderRadius: 20, padding: "1px 7px", flexShrink: 0 }}>{item.tag}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "#94A3B8", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.sub}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#CBD5E1" }}>{item.time}</span>
                    {item.score && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981", background: "#ECFDF5", borderRadius: 20, padding: "1px 8px" }}>
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
      <div style={{ ...card, padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.01em" }}>My Resumes</h3>
          </div>
          <button style={{
            display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
            background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)",
            borderRadius: 8, cursor: "pointer", color: "#6366F1",
            fontFamily: font, fontSize: 12.5, fontWeight: 600,
            transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.14)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; }}
          >
            <span>+</span> New Resume
          </button>
        </div>

        {/* Table header */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 120px 100px 140px 120px",
          gap: 16, padding: "8px 12px", marginBottom: 4,
          fontSize: 10.5, fontWeight: 600, color: "#CBD5E1",
          letterSpacing: "0.06em", textTransform: "uppercase",
          borderBottom: "1px solid #F1F5F9",
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
            gap: 16, padding: "12px 12px",
            borderRadius: 8,
            borderTop: i > 0 ? "1px solid #F8FAFC" : "none",
            alignItems: "center", transition: "background 0.12s", cursor: "pointer",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            className="resume-row"
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(99,102,241,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>📄</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{resume.title}</div>
            </div>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>{resume.template}</span>
            <ScorePill score={resume.score} />
            <span style={{ fontSize: 12, color: "#94A3B8" }}>{resume.updated}</span>
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
              {[
                { label: "Edit", color: "#6366F1", bg: "rgba(99,102,241,0.08)", hoverBg: "rgba(99,102,241,0.14)" },
                { label: "Scan", color: "#10B981", bg: "rgba(16,185,129,0.08)", hoverBg: "rgba(16,185,129,0.14)" },
              ].map(btn => (
                <button key={btn.label} style={{
                  padding: "5px 10px", borderRadius: 6, cursor: "pointer",
                  background: btn.bg, border: "none",
                  color: btn.color, fontSize: 11, fontWeight: 600,
                  fontFamily: font, transition: "all 0.12s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = btn.hoverBg}
                  onMouseLeave={e => e.currentTarget.style.background = btn.bg}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ATS Tips banner */}
      <div style={{
        background: "#ECFDF5",
        border: "1px solid #A7F3D0",
        borderRadius: 12, padding: "18px 22px",
        display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(16,185,129,0.12)", border: "1px solid #A7F3D0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>💡</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#065F46", marginBottom: 3 }}>Pro Tip: Boost your ATS score by 20%</div>
          <div style={{ fontSize: 12.5, color: "#6B7280" }}>Add measurable achievements and job-specific keywords to each resume section. Avoid tables and graphics — ATS parsers can't read them.</div>
        </div>
        <button style={{
          padding: "8px 16px", borderRadius: 8, cursor: "pointer", flexShrink: 0,
          background: "#10B981", border: "none",
          color: "#FFFFFF", fontFamily: font,
          fontSize: 12.5, fontWeight: 600, transition: "all 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#059669"}
          onMouseLeave={e => e.currentTarget.style.background = "#10B981"}
        >
          Learn More →
        </button>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
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
