import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

// ─── Configuration & Components ─────────────────────────────────────────────
const CONFIG = {
  colors: {
    primaryTeal: "#0D9488",
    primaryLight: "#F0FDFA",
    primaryLightBorder: "#99F6E4",
    background: "#F8FAFC",
    cardBg: "#FFFFFF",
    border: "#E2E8F0",
    textPrimary: "#111827",
    textSecondary: "#475569",
    textMuted: "#64748B",
    success: "#10B981",
    warning: "#F59E0B",
  },
  fonts: { body: "'DM Sans', sans-serif", brand: "'Syne', sans-serif" },
};

const globalCardStyle = {
  background: CONFIG.colors.cardBg,
  border: `1px solid ${CONFIG.colors.border}`,
  borderRadius: 16,
  padding: "24px",
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ label, value, icon }) {
  return (
    <div style={globalCardStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: CONFIG.colors.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", color: CONFIG.colors.primaryTeal }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: CONFIG.colors.textPrimary }}>{value}</div>
      <div style={{ fontSize: 13, color: CONFIG.colors.textMuted, marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/dashboard');
        if (data.success) {
          setDashboardData(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Could not load dashboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Safe Guard Clauses
  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ padding: 24, color: 'red' }}>{error}</div>;
  if (!dashboardData) return <div>No data available.</div>;

  // Now it is safe to destructure
  const { stats, recentResumes, recentATSReports } = dashboardData;
  const firstName = dashboardData.user?.full_name?.split(" ")[0] || "User";

  return (
    <div style={{ fontFamily: CONFIG.fonts.body, backgroundColor: CONFIG.colors.background, minHeight: "100vh", padding: "24px" }}>
      
      {/* Header */}
      <div style={{ ...globalCardStyle, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontFamily: CONFIG.fonts.brand, fontSize: 24, margin: 0 }}>Welcome back, {firstName}!</h2>
          <p style={{ color: CONFIG.colors.textMuted }}>Manage your career assets from one place.</p>
        </div>
        <button onClick={() => navigate("/dashboard/builder")} style={{ padding: "12px 24px", background: CONFIG.colors.primaryTeal, border: "none", borderRadius: 10, color: "#fff", fontWeight: 600, cursor: "pointer" }}>
          Build New Resume
        </button>
      </div>

      {/* Analytics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Resumes" value={stats.totalResumes} icon={<DocIcon />} />
        <StatCard label="ATS Reports" value={stats.totalATSReports} icon={<ScanIcon />} />
        <StatCard label="Avg ATS Score" value={`${stats.averageATSScore}%`} icon={<StrengthIcon />} />
        <StatCard label="AI Reviews" value={stats.totalAIReviews} icon={<MatchIcon />} />
      </div>

      {/* Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={globalCardStyle}>
          <h3 style={{ marginTop: 0 }}>Recent Resumes</h3>
          {recentResumes.map(r => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #eee" }}>
              <span>{r.title}</span>
              <button onClick={() => navigate(`/resumes/edit/${r.id}`)} style={{ background: 'none', border: 'none', color: CONFIG.colors.primaryTeal, cursor: 'pointer' }}>Edit</button>
            </div>
          ))}
        </div>

        <div style={globalCardStyle}>
          <h3 style={{ marginTop: 0 }}>Recent ATS Reports</h3>
          {recentATSReports.map(a => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #eee" }}>
              <span>{a.job_title}</span>
              <span style={{ fontWeight: 700 }}>{a.ats_score}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function DocIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>; }
function ScanIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/></svg>; }
function MatchIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>; }
function StrengthIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>; }
