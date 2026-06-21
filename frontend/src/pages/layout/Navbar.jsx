import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ sidebarWidth, setMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const displayName = user.full_name || "User";

  const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");
  
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const [dropOpen, setDropOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };


  const dropdownStyle = {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
    animation: "dropIn 0.2s ease",
    transition: "all 0.2s ease",
  };

  const pageTitles = {
  "/dashboard": "Dashboard",
  "/resumes": "My Resumes",
  "/templates": "Templates",
  "/dashboard/profile": "Profile",
  "/dashboard/settings": "Settings",
  "/dashboard/builder": "Resume Builder",
  "/ats-checker": "ATS Checker",
  "/ats/reports": "ATS Reports",
  "/ai-review": "AI Review",
  "/ai-rewrite": "AI Rewrite",
  "/job-analyzer": "Job Analyzer",
};

const pageTitle = pageTitles[location.pathname] || "Dashboard";

// const existing = JSON.parse(localStorage.getItem("user") || "{}");

// localStorage.setItem(
//   "user",
//   JSON.stringify({
//     ...existing,
//     profile_picture: updated.profile_picture,
//     full_name: updated.full_name,
//   })
// );

  return (
    <header style={{
      position: "fixed", top: 0, right: 0, left: 0,
      height: 64,
      background: "#FFFFFF",
      borderBottom: "1px solid #E2E8F0",
      display: "flex", alignItems: "center",
      padding: "0 24px 0 0",
      zIndex: 30,
      boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
      transition: "padding-left 0.3s cubic-bezier(0.4,0,0.2,1)",
      paddingLeft: `calc(${sidebarWidth}px + 24px)`,
    }}
      className="navbar-root"
    >
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(o => !o)}
        className="mobile-menu-btn"
        style={{
          display: "none", background: "none", border: "none",
          color: "#64748B", cursor: "pointer", padding: 6, borderRadius: "12px",
          marginRight: 8, transition: "all 0.2s ease"
        }}
      >
        <HamburgerIcon />
      </button>

      {/* Page title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700, fontSize: 16, color: "#111827",
          letterSpacing: "-0.02em",
          margin: 0
        }}>
          {pageTitle}
        </h1>
        <p style={{ fontSize: 11.5, color: "#64748B", fontFamily: "'DM Sans', sans-serif", margin: "2px 0 0 0", whiteSpace: "nowrap"}}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Search */}
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderRadius: "12px", padding: "7px 14px",
          color: "#64748B", cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12.5, transition: "all 0.2s ease",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#F0FDFA"; e.currentTarget.style.borderColor = "#99F6E4"; e.currentTarget.style.color = "#0D9488"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#64748B"; }}
          className="search-btn"
        >
          <SearchIcon />
          <span>Search…</span>
          <span style={{ fontSize: 10, background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "5px", padding: "1px 5px", color: "#64748B" }}>⌘K</span>
        </button>

        {/* Profile dropdown */}
        <div ref={dropRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setDropOpen(o => !o); setNotifOpen(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: dropOpen ? "#F0FDFA" : "#F8FAFC",
              border: `1px solid ${dropOpen ? "#99F6E4" : "#E2E8F0"}`,
              borderRadius: "12px", padding: "5px 10px 5px 5px",
              cursor: "pointer", transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { if (!dropOpen) { e.currentTarget.style.background = "#F0FDFA"; e.currentTarget.style.borderColor = "#99F6E4"; }}}
            onMouseLeave={e => { if (!dropOpen) { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.borderColor = "#E2E8F0"; }}}
          >
            {user.profile_picture ? (
  <img
    src={`${BASE_URL}${user.profile_picture}`}
    alt={displayName}
    style={{
      width: 36,
      height: 36,
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid #E2E8F0",
    }}
    onError={(e) => {
      e.target.style.display = "none";
      e.target.nextSibling.style.display = "flex";
    }}
  />
) : null}

<div
  style={{
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#0D9488",
    color: "#fff",
    display: user.profile_picture ? "none" : "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 13,
  }}
>
  {initials || "U"}
</div>
            <span className="profile-name" style={{ fontSize: 13, fontWeight: 600, color: "#111827", fontFamily: "'DM Sans', sans-serif", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {displayName.split(" ")[0]}
            </span>
            <ChevronDownIcon strokeColor={dropOpen ? "#0D9488" : "#64748B"} />
          </button>

          {dropOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              width: "min(220px, calc(100vw - 20px))" , ...dropdownStyle,
            }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", fontFamily: "'DM Sans', sans-serif" }}>{displayName}</div>
                <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>{user.email || "user@example.com"}</div>
              </div>
              {[
                { icon: "👤", label: "My Profile", action: () => navigate("/dashboard/profile") },
                { icon: "⚙️", label: "Settings", action: () => navigate("/dashboard/settings") },
                { icon: "❓", label: "Help & Support", action: () => {} },
              ].map(item => (
                <button key={item.label} onClick={() => { setDropOpen(false); item.action(); }} style={{
                  width: "100%", padding: "9px 16px", background: "transparent",
                  border: "none", cursor: "pointer", color: "#475569",
                  display: "flex", alignItems: "center", gap: 10, fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                  transition: "all 0.2s ease", textAlign: "left",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#111827"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
                >
                  <span style={{ fontSize: 14 }}>{item.icon}</span> {item.label}
                </button>
              ))}
              <div style={{ borderTop: "1px solid #E2E8F0" }}>
                <button onClick={handleLogout} style={{
                  width: "100%", padding: "9px 16px", background: "transparent",
                  border: "none", cursor: "pointer", color: "#EF4444",
                  display: "flex", alignItems: "center", gap: 10, fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                  transition: "all 0.2s ease", textAlign: "left",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span>🚪</span> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
  @keyframes dropIn {
    from { opacity:0; transform:translateY(-6px); }
    to { opacity:1; transform:none; }
  }

  @media (max-width: 768px) {
    .navbar-root { padding-left: 16px !important; }
    .mobile-menu-btn { display: flex !important; }
    .search-btn span:not(:first-child) { display: none !important; }
  }

  @media (max-width: 480px) {
    .profile-name {
      display: none !important;
    }
  }
`}</style>
    </header>
  );
}

function SearchIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function ChevronDownIcon({ strokeColor = "#94A3B8" }) { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s ease" }}><polyline points="6 9 12 15 18 9"/></svg>; }
function HamburgerIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>; }
