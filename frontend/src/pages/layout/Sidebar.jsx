import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Color Palette - Premium AI SaaS Theme (Login Style)
const COLORS = {
  bg: '#F8FAFC',
  border: '#E2E8F0',
  primary: '#0D9488',
  primaryLight: '#F0FDFA',
  primaryBorder: '#99F6E4',
  secondary: '#2DD4BF',
  text: '#111827',
  textMuted: '#64748B',
  textSoft: '#94A3B8',
  hover: '#F1F5F9',
  danger: '#EF4444',
  sidebarBg: '#1E293B',
  sidebarBorder: '#334155',
  sidebarText: '#CBD5E1',
  sidebarTextMuted: '#94A3B8',
};

// Navigation Items Configuration
const NAV_ITEMS = [
  {
    group: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: GridIcon },
      { id: 'resume-builder', label: 'Resume Builder', path: '/dashboard/builder', icon: EditIcon },
      { id: 'my-resumes', label: 'My Resumes', path: '/resumes', icon: BookIcon },
      { id: 'templates', label: 'Templates', path: '/templates', icon: LayersIcon },
    ],
  },
  {
    group: 'Optimization',
    items: [
      { id: 'ats-checker', label: 'ATS Checker', path: '/ats-checker', icon: ScanIcon },
      { id: 'ats/reports', label: 'ATS Reports', path: '/ats/reports', icon: BarChartIcon },
    ],
  },
  {
    group: 'AI Tools',
    items: [
      { id: 'ai-review', label: 'AI Review', path: '/ai-review', icon: BrainIcon },
      { id: 'ai-rewrite', label: 'AI Rewrite', path: '/ai-rewrite', icon: PenIcon },
      { id: 'job-analyzer', label: 'Job Analyzer', path: '/job-analyzer', icon: BriefcaseIcon },
    ],
  },
  {
    group: 'Settings',
    items: [
      { id: 'profile', label: 'Profile', path: '/dashboard/profile', icon: UserIcon },
      { id: 'settings', label: 'Settings', path: '/dashboard/settings', icon: SettingsIcon },
    ],
  },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => {
    const userFromStorage = localStorage.getItem('user');
    return userFromStorage ? JSON.parse(userFromStorage) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname === path;
  };

  const sidebarWidth = collapsed ? 72 : 240;

  // Get user initials
  const getUserInitials = () => {
    if (!user?.fullName) return 'U';
    return user.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      {/* Backdrop - Mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.7)',
            zIndex: 40,
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: sidebarWidth,
          background: COLORS.sidebarBg,
          borderRight: `1px solid ${COLORS.sidebarBorder}`,
          boxShadow: '0 20px 60px -20px rgba(0,0,0,0.35)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          zIndex: 50,
          transform: mobileOpen ? 'translateX(0)' : undefined,
          overflow: 'hidden',
        }}
        className="sidebar-root"
      >
        {/* Logo Section */}
        <div
          style={{
            height: 72,
            display: 'flex',
            alignItems: 'center',
            padding: collapsed ? '0 18px' : '0 20px',
            borderBottom: `1px solid ${COLORS.sidebarBorder}`,
            gap: 10,
            overflow: 'hidden',
            background: `linear-gradient(135deg, ${COLORS.sidebarBg} 0%, rgba(13,148,136,0.05) 100%)`,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              flexShrink: 0,
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px rgba(13,148,136,0.25)`,
            }}
          >
            <ResumeLogoIcon />
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: 15.5,
                  color: '#F1F5F9',
                  letterSpacing: '-0.02em',
                }}
              >
                ResumeAI
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: COLORS.sidebarTextMuted,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginTop: -1,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Pro Dashboard
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '16px 10px',
          }}
        >
          {NAV_ITEMS.map((group) => (
            <div key={group.group} style={{ marginBottom: 28 }}>
              {!collapsed && (
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: COLORS.sidebarTextMuted,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '0 10px',
                    marginBottom: 8,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {group.group}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.path)}
                    title={collapsed ? item.label : undefined}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 10px',
                      borderRadius: 8,
                      border: 'none',
                      cursor: 'pointer',
                      background: active
                        ? `rgba(13,148,136,0.15)`
                        : 'transparent',
                      color: active ? COLORS.primary : COLORS.sidebarTextMuted,
                      boxShadow: active
                        ? `inset 0 0 0 1px ${COLORS.primaryBorder}`
                        : 'none',
                      transition: 'all 0.15s ease',
                      marginBottom: 2,
                      textAlign: 'left',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      position: 'relative',
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'rgba(13,148,136,0.08)';
                        e.currentTarget.style.color = COLORS.primary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = COLORS.sidebarTextMuted;
                      }
                    }}
                  >
                    {active && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '18%',
                          bottom: '18%',
                          width: 3,
                          borderRadius: '0 3px 3px 0',
                          background: `linear-gradient(180deg, ${COLORS.primary}, ${COLORS.secondary})`,
                          boxShadow: `0 0 12px ${COLORS.primary}`,
                        }}
                      />
                    )}
                    <span
                      style={{
                        flexShrink: 0,
                        opacity: active ? 1 : 0.55,
                        display: 'flex',
                      }}
                    >
                      <Icon />
                    </span>
                    {!collapsed && (
                      <span
                        style={{
                          fontSize: 13.5,
                          fontWeight: active ? 600 : 500,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          flex: 1,
                        }}
                      >
                        {item.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Section & Logout */}
        <div
          style={{
            padding: '10px',
            borderTop: `1px solid ${COLORS.sidebarBorder}`,
            background: `rgba(13,148,136,0.05)`,
          }}
        >
          {/* User Info */}
          {user && !collapsed && (
            <div
              style={{
                padding: '10px',
                borderRadius: 8,
                background: 'rgba(13,148,136,0.1)',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                border: `1px solid ${COLORS.primaryBorder}`,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {getUserInitials()}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#F1F5F9',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.fullName || 'User'}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: COLORS.sidebarTextMuted,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.email}
                </div>
              </div>
            </div>
          )}

          {/* Collapse Button */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            style={{
              width: '100%',
              padding: '9px',
              borderRadius: 8,
              background: 'rgba(13,148,136,0.08)',
              border: `1px solid ${COLORS.primaryBorder}`,
              color: COLORS.sidebarTextMuted,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `rgba(13,148,136,0.15)`;
              e.currentTarget.style.color = COLORS.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(13,148,136,0.08)';
              e.currentTarget.style.color = COLORS.sidebarTextMuted;
            }}
          >
            <ChevronIcon flipped={collapsed} />
            {!collapsed && (
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                }}
              >
                Collapse
              </span>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: COLORS.sidebarTextMuted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 10,
              marginTop: 4,
              transition: 'all 0.2s',
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
              e.currentTarget.style.color = COLORS.danger;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = COLORS.sidebarTextMuted;
            }}
          >
            <LogoutIcon />
            {!collapsed && (
              <span style={{ fontSize: 13.5, fontWeight: 500 }}>Logout</span>
            )}
          </button>
        </div>
      </aside>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .sidebar-root {
          font-family: 'Inter', sans-serif;
        }

        .sidebar-root::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-root::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-root::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 3px;
        }

        .sidebar-root::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }

        @media (max-width: 768px) {
          .sidebar-root {
            transform: ${mobileOpen ? 'translateX(0)' : 'translateX(-100%)'} !important;
            width: 240px !important;
          }
        }
      `}</style>
    </>
  );
}

// ──────────────────── Icons ────────────────────────
function ResumeLogoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="9" rx="1.5" fill="white" opacity="0.95" />
      <rect x="3" y="14" width="7" height="2" rx="1" fill="white" opacity="0.6" />
      <rect x="3" y="18" width="5" height="2" rx="1" fill="white" opacity="0.35" />
      <path d="M14 7h6M14 11h4M14 15h6M14 19h3" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6.5a2.5 2.5 0 0 1-2.5-2.5v-15a2.5 2.5 0 0 1 2.5-2.5z" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
      <line x1="7" y1="12" x2="17" y2="12" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3c-1.105 0-2 1.119-2 2.5S7.895 8 9 8m0 0c1.105 0 2-1.119 2-2.5S10.105 3 9 3m0 0v6m6-6c1.105 0 2 1.119 2 2.5S16.105 8 15 8m0 0c-1.105 0-2-1.119-2-2.5S13.895 3 15 3m0 0v6m-6 4c0 1.657-1.343 3-3 3s-3-1.343-3-3m0 0v5m12-5c0 1.657 1.343 3 3 3s3-1.343 3-3m0 0v5" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17.25V21h3.75L17.81 9.94m-5.25-5.25l3.536-3.536a2 2 0 0 1 2.828 0l2.83 2.83a2 2 0 0 1 0 2.828l-3.536 3.535m-5.25-5.25l5.25 5.25" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="12" />
      <path d="M2 13h20" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function ChevronIcon({ flipped }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: flipped ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function SettingsIcon(){
  return(
    <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-600 hover:text-gray-900">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.754c-.29.218-.443.565-.4.92.01.074.015.15.015.225 0 .075-.004.15-.015.225-.044.354.11.7.4.92l1.003.753a1.125 1.125 0 0 1 .26 1.43l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.216-.456c-.356-.133-.751-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.754c.29-.218.443-.565.4-.92a5.58 5.58 0 0 1-.015-.225c0-.075.004-.15.015-.225.044-.354-.11-.7-.4-.92l-1.004-.753a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.49l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
  );
}