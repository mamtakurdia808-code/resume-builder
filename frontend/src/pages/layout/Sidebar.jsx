import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  {
    group: "Main",
    items: [
      { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: <GridIcon /> },
      { id: "builder", label: "Resume Builder", path: "/dashboard/builder", icon: <EditIcon /> },
      { id: "ats", label: "ATS Checker", path: "/dashboard/ats", icon: <ScanIcon /> },
      { id: "analyzer", label: "Job Analyzer", path: "/dashboard/analyzer", icon: <BriefcaseIcon /> },
    ],
  },
  {
    group: "Resources",
    items: [
      { id: "templates", label: "Templates", path: "/dashboard/templates", icon: <LayersIcon />, badge: "12" },
      { id: "profile", label: "Profile", path: "/dashboard/profile", icon: <UserIcon /> },
    ],
  },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const isActive = (path) =>
    path === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  const sidebarWidth = collapsed ? 72 : 240;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            zIndex: 40, backdropFilter: "blur(4px)",
          }}
        />
      )}

      <aside style={{
        position: "fixed", top: 0, left: 0, bottom: 0,
        width: sidebarWidth,
        background: "rgba(9,11,20,0.97)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        zIndex: 50,
        transform: mobileOpen ? "translateX(0)" : undefined,
        boxShadow: "4px 0 24px rgba(0,0,0,0.4)",
        overflow: "hidden",
      }}
        className="sidebar-root"
      >
        {/* Logo */}
        <div style={{
          height: 64, display: "flex", alignItems: "center",
          padding: collapsed ? "0 18px" : "0 20px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          gap: 10, overflow: "hidden",
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(124,58,237,0.4)",
          }}>
            <ResumeLogoIcon />
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
              <div style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontWeight: 800, fontSize: 15.5,
                background: "linear-gradient(90deg,#a78bfa,#818cf8)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}>ResumeAI</div>
              <div style={{ fontSize: 10, color: "#334155", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginTop: -1 }}>
                Pro Dashboard
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "12px 10px" }}>
          {NAV_ITEMS.map((group) => (
            <div key={group.group} style={{ marginBottom: 24 }}>
              {!collapsed && (
                <div style={{
                  fontSize: 10, fontWeight: 700, color: "#1e293b",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  padding: "0 8px", marginBottom: 6,
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                }}>
                  {group.group}
                </div>
              )}
              {group.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.path)}
                    title={collapsed ? item.label : undefined}
                    style={{
                      width: "100%", display: "flex", alignItems: "center",
                      gap: 10, padding: collapsed ? "10px 12px" : "10px 12px",
                      borderRadius: 10, border: "none", cursor: "pointer",
                      background: active
                        ? "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(79,70,229,0.15))"
                        : "transparent",
                      color: active ? "#c4b5fd" : "#475569",
                      transition: "all 0.18s ease",
                      marginBottom: 2, textAlign: "left",
                      justifyContent: collapsed ? "center" : "flex-start",
                      position: "relative",
                      boxShadow: active ? "inset 0 0 0 1px rgba(124,58,237,0.25)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#94a3b8"; }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }
                    }}
                  >
                    {active && (
                      <div style={{
                        position: "absolute", left: 0, top: "20%", bottom: "20%",
                        width: 3, borderRadius: "0 3px 3px 0",
                        background: "linear-gradient(180deg,#a78bfa,#818cf8)",
                      }} />
                    )}
                    <span style={{ flexShrink: 0, opacity: active ? 1 : 0.6, display: "flex" }}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span style={{
                        fontSize: 13.5, fontWeight: active ? 600 : 500,
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        whiteSpace: "nowrap", overflow: "hidden", flex: 1,
                      }}>
                        {item.label}
                      </span>
                    )}
                    {!collapsed && item.badge && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: "#7c3aed",
                        background: "rgba(124,58,237,0.15)",
                        border: "1px solid rgba(124,58,237,0.25)",
                        borderRadius: 6, padding: "1px 6px",
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button
            onClick={() => setCollapsed(c => !c)}
            style={{
              width: "100%", padding: "9px", borderRadius: 10,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              cursor: "pointer", color: "#475569",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 8, transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#94a3b8"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "#475569"; }}
          >
            <ChevronIcon flipped={collapsed} />
            {!collapsed && <span style={{ fontSize: 12, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 500 }}>Collapse</span>}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              width: "100%", padding: "10px 12px", borderRadius: 10,
              background: "transparent", border: "none",
              cursor: "pointer", color: "#475569",
              display: "flex", alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 10, marginTop: 4, transition: "all 0.2s",
              fontFamily: "'Plus Jakarta Sans',sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#f87171"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
          >
            <LogoutIcon />
            {!collapsed && <span style={{ fontSize: 13.5, fontWeight: 500 }}>Logout</span>}
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-root {
            transform: ${mobileOpen ? "translateX(0)" : "translateX(-100%)"} !important;
            width: 240px !important;
          }
        }
      `}</style>
    </>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────
function ResumeLogoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="9" rx="1.5" fill="white" opacity="0.95"/>
      <rect x="3" y="14" width="7" height="2" rx="1" fill="white" opacity="0.6"/>
      <rect x="3" y="18" width="5" height="2" rx="1" fill="white" opacity="0.35"/>
      <path d="M14 7h6M14 11h4M14 15h6M14 19h3" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
    </svg>
  );
}
function GridIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>; }
function EditIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function ScanIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>; }
function BriefcaseIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12"/><path d="M2 13h20"/></svg>; }
function LayersIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>; }
function UserIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function LogoutIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
function ChevronIcon({ flipped }) { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: flipped ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}><polyline points="15 18 9 12 15 6"/></svg>; }