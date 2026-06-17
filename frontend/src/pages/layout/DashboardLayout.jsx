import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const sidebarWidth = isMobile
  ? 0
  : collapsed
    ? 72
    : 240;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; background: #F8FAFC; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(13, 148, 136, 0.15); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(13, 148, 136, 0.3); }
  `;

  return (
    <>
      <style>{css}</style>
      <div style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
        <Navbar
          sidebarWidth={sidebarWidth}
          setMobileOpen={setMobileOpen}
        />

        {/* Main content area */}
        <main
  style={{
    marginLeft: sidebarWidth,
    paddingTop: 66,
    minHeight: "100vh",
    width: `calc(100vw - ${sidebarWidth}px)`,
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    background: "#F8FAFC",
    overflowX: "hidden",
  }}
>
          <div
  style={{
    padding: isMobile ? "12px" : "48px 32px 64px",
    maxWidth: 1200,
    margin: "0 auto",
  }}
>
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}