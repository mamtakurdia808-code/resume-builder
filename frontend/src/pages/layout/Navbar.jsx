import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ sidebarWidth, setMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const displayName = user.full_name || "User";
  const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const [dropOpen, setDropOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchModalRef = useRef(null);

  const allRoutes = [
    { icon: "🏠", label: "Dashboard", path: "/dashboard", desc: "Overview & stats" },
    { icon: "📄", label: "My Resumes", path: "/resumes", desc: "Manage your resumes" },
    { icon: "🎨", label: "Templates", path: "/templates", desc: "Browse resume templates" },
    { icon: "🔍", label: "ATS Checker", path: "/ats-checker", desc: "Check ATS compatibility" },
    { icon: "📊", label: "ATS Reports", path: "/ats/reports", desc: "View ATS analysis reports" },
    { icon: "🤖", label: "AI Review", path: "/ai-review", desc: "Get AI feedback on resume" },
    { icon: "✍️", label: "AI Rewrite", path: "/ai-rewrite", desc: "AI-powered resume rewriting" },
    { icon: "💼", label: "Job Analyzer", path: "/job-analyzer", desc: "Analyze job descriptions" },
    { icon: "👤", label: "Profile", path: "/dashboard/profile", desc: "View your profile" },
    { icon: "⚙️", label: "Settings", path: "/dashboard/settings", desc: "App preferences" },
  ];

  const filteredRoutes = searchQuery.trim()
    ? allRoutes.filter(r =>
        r.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.desc.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allRoutes;

  const openSearch = useCallback(() => {
    setSearchOpen(true);
    setSearchQuery("");
    setTimeout(() => searchInputRef.current?.focus(), 50);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery("");
  }, []);

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchOpen ? closeSearch() : openSearch();
      }
      if (e.key === "Escape") {
        closeSearch();
        setDropOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [searchOpen, openSearch, closeSearch]);

  // Outside-click for dropdown
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
      if (searchModalRef.current && !searchModalRef.current.contains(e.target)) closeSearch();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [closeSearch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const pageTitles = {
    "/dashboard": "Dashboard", "/resumes": "My Resumes", "/templates": "Templates",
    "/dashboard/profile": "Profile", "/dashboard/settings": "Settings",
    "/dashboard/builder": "Resume Builder", "/ats-checker": "ATS Checker",
    "/ats/reports": "ATS Reports", "/ai-review": "AI Review",
    "/ai-rewrite": "AI Rewrite", "/job-analyzer": "Job Analyzer",
  };

  const getPageTitle = (pathname) => {
    if (pathname.startsWith("/resumes/edit/")) return "Edit Resume";
    if (pathname.startsWith("/resumes/")) return "View Resume";
    return pageTitles[pathname] || "Dashboard";
  };

  const pageTitle = getPageTitle(location.pathname);

  const dropdownStyle = {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 16px 40px rgba(15,23,42,0.12), 0 4px 12px rgba(15,23,42,0.06)",
    animation: "dropIn 0.18s cubic-bezier(0.16,1,0.3,1)",
  };

  return (
    <>
      <header
        className="navbar-root"
        style={{
          position: "fixed", top: 0, right: 0, left: 0,
          height: 64,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(226,232,240,0.8)",
          display: "flex", alignItems: "center",
          padding: "0 20px 0 0",
          zIndex: 30,
          boxShadow: "0 1px 0 rgba(226,232,240,0.6), 0 2px 8px rgba(15,23,42,0.04)",
          transition: "padding-left 0.3s cubic-bezier(0.4,0,0.2,1)",
          paddingLeft: `calc(${sidebarWidth}px + 24px)`,
        }}
      >
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="mobile-menu-btn"
          style={{
            display: "none", background: "none", border: "none",
            color: "#64748B", cursor: "pointer", padding: "6px",
            borderRadius: "10px", marginRight: 8, transition: "all 0.2s ease",
          }}
        >
          <HamburgerIcon />
        </button>

        {/* Page title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700, fontSize: 15.5, color: "#0F172A",
            letterSpacing: "-0.025em", margin: 0, lineHeight: 1.2,
          }}>
            {pageTitle}
          </h1>
          <p style={{
            fontSize: 11, color: "#94A3B8",
            fontFamily: "'DM Sans', sans-serif",
            margin: "2px 0 0 0", whiteSpace: "nowrap", fontWeight: 500,
            letterSpacing: "0.01em",
          }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>

          {/* Search trigger */}
          <button
            onClick={openSearch}
            className="search-btn"
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "11px", padding: "7px 12px",
              color: "#94A3B8", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12.5, fontWeight: 500,
              transition: "all 0.2s ease",
              minWidth: 140,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#F0FDFA";
              e.currentTarget.style.borderColor = "#5EEAD4";
              e.currentTarget.style.color = "#0D9488";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.08)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#F8FAFC";
              e.currentTarget.style.borderColor = "#E2E8F0";
              e.currentTarget.style.color = "#94A3B8";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <SearchIcon />
            <span className="search-label">Search pages…</span>
            <span style={{
              fontSize: 10, background: "#FFFFFF",
              border: "1px solid #E2E8F0", borderRadius: "6px",
              padding: "2px 5px", color: "#94A3B8",
              fontFamily: "monospace", letterSpacing: "0.02em",
              marginLeft: "auto",
            }}>⌘K</span>
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 28, background: "#E2E8F0", margin: "0 2px" }} />

          {/* Profile dropdown */}
          <div ref={dropRef} style={{ position: "relative" }}>
            <button
              onClick={() => setDropOpen(o => !o)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: dropOpen ? "#F0FDFA" : "transparent",
                border: `1.5px solid ${dropOpen ? "#5EEAD4" : "transparent"}`,
                borderRadius: "12px", padding: "4px 8px 4px 4px",
                cursor: "pointer", transition: "all 0.2s ease",
                boxShadow: dropOpen ? "0 0 0 3px rgba(13,148,136,0.1)" : "none",
              }}
              onMouseEnter={e => {
                if (!dropOpen) {
                  e.currentTarget.style.background = "#F8FAFC";
                  e.currentTarget.style.borderColor = "#E2E8F0";
                }
              }}
              onMouseLeave={e => {
                if (!dropOpen) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "transparent";
                }
              }}
            >
              {/* Avatar */}
              <div style={{ position: "relative" }}>
                {user.profile_picture ? (
                  <img
                    src={`${BASE_URL}${user.profile_picture}`}
                    alt={displayName}
                    style={{
                      width: 34, height: 34, borderRadius: "10px",
                      objectFit: "cover",
                      border: "2px solid #E2E8F0",
                      display: "block",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div style={{
                  width: 34, height: 34, borderRadius: "10px",
                  background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                  color: "#fff",
                  display: user.profile_picture ? "none" : "flex",
                  alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 12.5,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.03em",
                  boxShadow: "0 2px 6px rgba(13,148,136,0.3)",
                }}>
                  {initials || "U"}
                </div>
                {/* Online dot */}
                <div style={{
                  position: "absolute", bottom: -1, right: -1,
                  width: 9, height: 9, borderRadius: "50%",
                  background: "#22C55E",
                  border: "2px solid #fff",
                }} />
              </div>

              <span className="profile-name" style={{
                fontSize: 13, fontWeight: 600, color: "#0F172A",
                fontFamily: "'DM Sans', sans-serif",
                maxWidth: 88, overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {displayName.split(" ")[0]}
              </span>
              <ChevronDownIcon
                strokeColor={dropOpen ? "#0D9488" : "#94A3B8"}
                rotated={dropOpen}
              />
            </button>

            {dropOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 10px)", right: 0,
                width: "min(230px, calc(100vw - 20px))",
                ...dropdownStyle,
              }}>
                {/* User header */}
                <div style={{
                  padding: "14px 16px 12px",
                  background: "linear-gradient(135deg, #F0FDFA 0%, #F8FAFC 100%)",
                  borderBottom: "1px solid #E2E8F0",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: "11px",
                      background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
                      color: "#fff", display: "flex", alignItems: "center",
                      justifyContent: "center", fontWeight: 700, fontSize: 13,
                      fontFamily: "'DM Sans', sans-serif",
                      boxShadow: "0 2px 8px rgba(13,148,136,0.25)",
                      flexShrink: 0,
                    }}>
                      {initials || "U"}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayName}</div>
                      <div style={{ fontSize: 11, color: "#64748B", marginTop: 1, fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email || "user@example.com"}</div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: "6px 6px" }}>
                  {[
                    { icon: "👤", label: "My Profile", desc: "View profile", action: () => navigate("/dashboard/profile") },
                    { icon: "⚙️", label: "Settings", desc: "Preferences", action: () => navigate("/dashboard/settings") },
                    { icon: "❓", label: "Help & Support", desc: "Get assistance", action: () => navigate ("/dashboard/helpsupport") },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={() => { setDropOpen(false); item.action(); }}
                      style={{
                        width: "100%", padding: "8px 10px",
                        background: "transparent", border: "none",
                        cursor: "pointer", color: "#475569",
                        display: "flex", alignItems: "center", gap: 10,
                        borderRadius: "9px",
                        fontFamily: "'DM Sans', sans-serif",
                        transition: "all 0.15s ease", textAlign: "left",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#F0FDFA"; e.currentTarget.style.color = "#0D9488"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
                    >
                      <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.3 }}>{item.label}</div>
                        <div style={{ fontSize: 10.5, color: "#94A3B8", lineHeight: 1.3 }}>{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div style={{ borderTop: "1px solid #F1F5F9", padding: "6px 6px 6px" }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%", padding: "8px 10px",
                      background: "transparent", border: "none",
                      cursor: "pointer", color: "#EF4444",
                      display: "flex", alignItems: "center", gap: 10,
                      borderRadius: "9px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 600, transition: "all 0.15s ease", textAlign: "left",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{ fontSize: 15 }}>🚪</span>
                    <div>
                      <div style={{ fontSize: 12.5, lineHeight: 1.3 }}>Sign Out</div>
                      <div style={{ fontSize: 10.5, color: "#FCA5A5", lineHeight: 1.3 }}>End your session</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <style>{`
          @keyframes dropIn {
            from { opacity: 0; transform: translateY(-8px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0)   scale(1); }
          }
          @keyframes searchIn {
            from { opacity: 0; transform: translateY(-16px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0)    scale(1); }
          }
          @keyframes overlayIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @media (max-width: 768px) {
            .navbar-root { padding-left: 16px !important; }
            .mobile-menu-btn { display: flex !important; }
            .search-label { display: none !important; }
            .search-btn { min-width: unset !important; padding: 7px 10px !important; }
          }
          @media (max-width: 480px) {
            .profile-name { display: none !important; }
          }
        `}</style>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 999,
            background: "rgba(15,23,42,0.45)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex", alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "14vh",
            animation: "overlayIn 0.15s ease",
          }}
        >
          <div
            ref={searchModalRef}
            style={{
              width: "min(560px, calc(100vw - 32px))",
              background: "#FFFFFF",
              borderRadius: "18px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 24px 64px rgba(15,23,42,0.18), 0 8px 24px rgba(15,23,42,0.1)",
              overflow: "hidden",
              animation: "searchIn 0.2s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {/* Search input */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "14px 16px",
              borderBottom: "1px solid #F1F5F9",
            }}>
              <SearchIcon size={17} color="#0D9488" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search pages, features…"
                style={{
                  flex: 1, border: "none", outline: "none",
                  fontSize: 15, fontWeight: 500, color: "#0F172A",
                  fontFamily: "'DM Sans', sans-serif",
                  background: "transparent",
                  caretColor: "#0D9488",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    background: "#F1F5F9", border: "none", borderRadius: "6px",
                    cursor: "pointer", color: "#64748B", padding: "2px 7px",
                    fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Clear
                </button>
              )}
              <span style={{
                fontSize: 10.5, color: "#94A3B8",
                border: "1px solid #E2E8F0", borderRadius: "6px",
                padding: "3px 7px", fontFamily: "monospace",
                flexShrink: 0,
              }}>Esc</span>
            </div>

            {/* Results */}
            <div style={{ maxHeight: 340, overflowY: "auto", padding: "8px 8px" }}>
              {filteredRoutes.length === 0 ? (
                <div style={{
                  textAlign: "center", padding: "32px 0",
                  color: "#94A3B8", fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
                  No results for "<strong style={{ color: "#475569" }}>{searchQuery}</strong>"
                </div>
              ) : (
                filteredRoutes.map(route => (
                  <button
                    key={route.path}
                    onClick={() => { navigate(route.path); closeSearch(); }}
                    style={{
                      width: "100%", display: "flex", alignItems: "center",
                      gap: 12, padding: "9px 10px", borderRadius: "10px",
                      border: "none", background: "transparent",
                      cursor: "pointer", textAlign: "left",
                      transition: "all 0.12s ease",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#F0FDFA"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{
                      fontSize: 17, width: 34, height: 34,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "#F8FAFC", borderRadius: "9px",
                      flexShrink: 0,
                    }}>{route.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{route.label}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{route.desc}</div>
                    </div>
                    <span style={{
                      marginLeft: "auto", fontSize: 10.5, color: "#CBD5E1",
                      border: "1px solid #E2E8F0", borderRadius: "6px",
                      padding: "2px 6px", fontFamily: "monospace", flexShrink: 0,
                    }}>↵</span>
                  </button>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div style={{
              borderTop: "1px solid #F1F5F9",
              padding: "8px 16px",
              display: "flex", alignItems: "center", gap: 12,
              background: "#FAFBFC",
            }}>
              {[["↵", "Navigate"], ["Esc", "Close"], ["⌘K", "Toggle"]].map(([key, hint]) => (
                <span key={key} style={{
                  display: "flex", alignItems: "center", gap: 4,
                  fontSize: 10.5, color: "#94A3B8", fontFamily: "'DM Sans', sans-serif",
                }}>
                  <kbd style={{
                    background: "#F1F5F9", border: "1px solid #E2E8F0",
                    borderRadius: "5px", padding: "1px 6px",
                    fontSize: 10, fontFamily: "monospace", color: "#475569",
                  }}>{key}</kbd>
                  {hint}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SearchIcon({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ChevronDownIcon({ strokeColor = "#94A3B8", rotated = false }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: "transform 0.2s ease, stroke 0.2s ease", transform: rotated ? "rotate(180deg)" : "none" }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
