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

  const sidebarWidth = isMobile ? 0 : (collapsed ? 72 : 240);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; background: #080d18; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.14); }
  `;

  return (
    <>
      <style>{css}</style>
      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 20% 0%,rgba(124,58,237,0.07) 0%,transparent 50%), radial-gradient(ellipse at 80% 100%,rgba(14,165,233,0.05) 0%,transparent 50%), #080d18",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
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
        <main style={{
          paddingLeft: sidebarWidth,
          paddingTop: 64,
          minHeight: "100vh",
          transition: "padding-left 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}>
          <div style={{ padding: "28px 28px 40px", maxWidth: 1400, margin: "0 auto" }}>
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}