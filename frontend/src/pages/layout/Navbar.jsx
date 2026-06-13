import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ sidebarWidth, setMobileOpen }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const displayName = user.full_name || "User";
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

  const notifications = [
    { id: 1, icon: "✅", title: "ATS scan complete", desc: "Your resume scored 87%", time: "2m ago", unread: true },
    { id: 2, icon: "📄", title: "Resume updated", desc: "Software Engineer Resume v2", time: "1h ago", unread: true },
    { id: 3, icon: "💡", title: "New templates added", desc: "12 new ATS-friendly templates", time: "3h ago", unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  const dropdownStyle = {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(15,23,42,0.12), 0 2px 8px rgba(15,23,42,0.06)",
    animation: "dropIn 0.18s ease",
  };

  return (
    <header style={{
      position: "fixed", top: 0, right: 0, left: 0,
      height: 64,
      background: "#FFFFFF",
      borderBottom: "1px solid #E2E8F0",
      display: "flex", alignItems: "center",
      padding: "0 24px 0 0",
      zIndex: 30,
      boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
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
          color: "#94A3B8", cursor: "pointer", padding: 6, borderRadius: 8,
          marginRight: 8,
        }}
      >
        <HamburgerIcon />
      </button>

      {/* Page title */}
      <div style={{ flex: 1 }}>
        <h1 style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700, fontSize: 16, color: "#0F172A",
          letterSpacing: "-0.02em",
        }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 11.5, color: "#94A3B8", fontFamily: "'Inter', sans-serif" }}>
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
          borderRadius: 8, padding: "7px 14px",
          color: "#94A3B8", cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
          fontSize: 12.5, transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.borderColor = "#CBD5E1"; e.currentTarget.style.color = "#64748B"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#94A3B8"; }}
          className="search-btn"
        >
          <SearchIcon />
          <span>Search…</span>
          <span style={{ fontSize: 10, background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 5, padding: "1px 5px", color: "#94A3B8" }}>⌘K</span>
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setNotifOpen(o => !o); setDropOpen(false); }}
            style={{
              width: 38, height: 38, borderRadius: 8,
              background: notifOpen ? "rgba(99,102,241,0.08)" : "#F8FAFC",
              border: `1px solid ${notifOpen ? "rgba(99,102,241,0.25)" : "#E2E8F0"}`,
              cursor: "pointer", color: "#64748B", display: "flex",
              alignItems: "center", justifyContent: "center",
              position: "relative", transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (!notifOpen) { e.currentTarget.style.background = "#F1F5F9"; }}}
            onMouseLeave={e => { if (!notifOpen) { e.currentTarget.style.background = "#F8FAFC"; }}}
          >
            <BellIcon />
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: 7, right: 7,
                width: 7, height: 7, borderRadius: "50%",
                background: "#6366F1",
                border: "1.5px solid #FFFFFF",
              }} />
            )}
          </button>

          {notifOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              width: 310, ...dropdownStyle,
            }}>
              <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", fontFamily: "'Inter', sans-serif" }}>Notifications</span>
                {unreadCount > 0 && <span style={{ fontSize: 11, color: "#6366F1", fontWeight: 600, cursor: "pointer" }}>Mark all read</span>}
              </div>
              {notifications.map(n => (
                <div key={n.id} style={{
                  padding: "12px 16px", display: "flex", gap: 12, alignItems: "flex-start",
                  background: n.unread ? "rgba(99,102,241,0.03)" : "transparent",
                  borderBottom: "1px solid #F8FAFC",
                  cursor: "pointer", transition: "background 0.12s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                  onMouseLeave={e => e.currentTarget.style.background = n.unread ? "rgba(99,102,241,0.03)" : "transparent"}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{n.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "#0F172A", fontFamily: "'Inter', sans-serif" }}>{n.title}</div>
                    <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 1 }}>{n.desc}</div>
                  </div>
                  <div style={{ fontSize: 10.5, color: "#CBD5E1", whiteSpace: "nowrap", marginTop: 1 }}>{n.time}</div>
                </div>
              ))}
              <div style={{ padding: "10px 16px", textAlign: "center", background: "#FAFAFA" }}>
                <span style={{ fontSize: 12, color: "#6366F1", fontWeight: 600, cursor: "pointer" }}>View all notifications</span>
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div ref={dropRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setDropOpen(o => !o); setNotifOpen(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: dropOpen ? "rgba(99,102,241,0.06)" : "#F8FAFC",
              border: `1px solid ${dropOpen ? "rgba(99,102,241,0.2)" : "#E2E8F0"}`,
              borderRadius: 8, padding: "5px 10px 5px 5px",
              cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (!dropOpen) { e.currentTarget.style.background = "#F1F5F9"; }}}
            onMouseLeave={e => { if (!dropOpen) { e.currentTarget.style.background = "#F8FAFC"; }}}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "#fff",
              fontFamily: "'Inter', sans-serif",
            }}>
              {initials || "U"}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155", fontFamily: "'Inter', sans-serif", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {displayName.split(" ")[0]}
            </span>
            <ChevronDownIcon />
          </button>

          {dropOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              width: 210, ...dropdownStyle,
            }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid #F1F5F9" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", fontFamily: "'Inter', sans-serif" }}>{displayName}</div>
                <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 2 }}>{user.email || "user@example.com"}</div>
                <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)", borderRadius: 6, padding: "2px 8px" }}>
                  <span style={{ fontSize: 10, color: "#6366F1", fontWeight: 700 }}>⚡ PRO PLAN</span>
                </div>
              </div>
              {[
                { icon: "👤", label: "My Profile", action: () => navigate("/dashboard/profile") },
                { icon: "⚙️", label: "Settings", action: () => {} },
                { icon: "💳", label: "Billing", action: () => {} },
                { icon: "❓", label: "Help & Support", action: () => {} },
              ].map(item => (
                <button key={item.label} onClick={() => { setDropOpen(false); item.action(); }} style={{
                  width: "100%", padding: "9px 16px", background: "transparent",
                  border: "none", cursor: "pointer", color: "#475569",
                  display: "flex", alignItems: "center", gap: 10, fontSize: 13,
                  fontFamily: "'Inter', sans-serif", fontWeight: 500,
                  transition: "all 0.12s", textAlign: "left",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#0F172A"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
                >
                  <span style={{ fontSize: 14 }}>{item.icon}</span> {item.label}
                </button>
              ))}
              <div style={{ borderTop: "1px solid #F1F5F9" }}>
                <button onClick={handleLogout} style={{
                  width: "100%", padding: "9px 16px", background: "transparent",
                  border: "none", cursor: "pointer", color: "#EF4444",
                  display: "flex", alignItems: "center", gap: 10, fontSize: 13,
                  fontFamily: "'Inter', sans-serif", fontWeight: 600,
                  transition: "all 0.12s", textAlign: "left",
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
        @keyframes dropIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:none; } }
        @media (max-width: 768px) {
          .navbar-root { padding-left: 16px !important; }
          .mobile-menu-btn { display: flex !important; }
          .search-btn span:not(:first-child) { display: none !important; }
        }
      `}</style>
    </header>
  );
}

function SearchIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function BellIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function ChevronDownIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>; }
function HamburgerIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>; }
