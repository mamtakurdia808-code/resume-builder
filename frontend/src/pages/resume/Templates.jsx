import React, { useState, useMemo } from "react";
import { 
  FiSearch, FiCheck, FiEye, FiLayout, FiSliders, 
  FiAward, FiZap 
} from "react-icons/fi";

// Mock Template Dataset
const TEMPLATE_DATA = [
  {
    id: "modern",
    name: "Modern Template",
    description: "A tech-forward, high-impact design featuring bold modern typography and structural dividers.",
    category: "Tech",
    atsScore: "95% ATS Match",
    isPopular: true,
    accentColor: "#0D9488",
  },
  {
    id: "professional",
    name: "Professional Template",
    description: "Classic corporate layout balanced with elegant geometric spacing. Ideal for finance and traditional roles.",
    category: "Corporate",
    atsScore: "98% ATS Match",
    isPopular: false,
    accentColor: "#1E3A8A",
  },
  {
    id: "ats-friendly",
    name: "ATS Friendly Template",
    description: "Ultra-optimized single-column parsing layout built explicitly to clear stringent HR screening filters.",
    category: "Standard",
    atsScore: "100% ATS Optimized",
    isPopular: true,
    accentColor: "#111827",
  },
  {
    id: "minimal",
    name: "Minimal Template",
    description: "Stripped-back luxury minimalist aesthetic prioritizing stark white space and pristine legibility.",
    category: "Standard",
    atsScore: "92% ATS Match",
    isPopular: false,
    accentColor: "#475569",
  },
  {
    id: "executive",
    name: "Executive Template",
    description: "Designed for senior leadership paths, emphasizing milestone timelines and corporate achievements.",
    category: "Corporate",
    atsScore: "94% ATS Match",
    isPopular: false,
    accentColor: "#701A75",
  },
  {
    id: "creative",
    name: "Creative Template",
    description: "Asymmetrical artistic layouts utilizing progressive tints. Built to stand out in agency markets.",
    category: "Creative",
    atsScore: "88% ATS Match",
    isPopular: false,
    accentColor: "#EC4899",
  }
];

const CATEGORIES = ["All", "Tech", "Corporate", "Standard", "Creative"];

export default function Templates() {
  const [selectedTemplateId, setSelectedTemplateId] = useState("modern");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [previewId, setPreviewId] = useState(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // Filter logic
  const filteredTemplates = useMemo(() => {
    return TEMPLATE_DATA.filter((template) => {
      const matchesSearch = 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        activeCategory === "All" || template.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // Clean, Spacious Design System Variables
  const colors = {
    bg: "#F8FAFC",
    surface: "#FFFFFF",
    border: "#E2E8F0",
    textPrimary: "#111827",
    textSecondary: "#475569",
    textMuted: "#64748B",
    accent: "#0D9488",
    accentLight: "#F0FDFA",
    accentBorder: "#99F6E4"
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.bg, color: colors.textPrimary, fontFamily: "sans-serif", paddingBottom: "80px" }}>

      {/* Main Container */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        
        {/* Hub Title Block */}
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ margin: 0, fontSize: "32px", fontWeight: 800, letterSpacing: "-0.5px" }}>Choose Your Baseline Engine</h2>
          <p style={{ margin: "12px 0 0 0", fontSize: "16px", color: colors.textSecondary, lineHeight: "1.6", maxWidth: "600px" }}>
            Deploy professional templates tested rigorously against corporate HR scanners and automated formatting parameters.
          </p>
        </div>

        {/* Control Panel: Search Bar & Category Filters */}
        <div style={{ backgroundColor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "16px", padding: "20px", marginBottom: "40px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
          
          {/* Search Input Box */}
          <div style={{ position: "relative", flex: "1", minWidth: "300px" }}>
            <FiSearch style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: colors.textMuted, width: "18px", height: "18px" }} />
            <input
              type="text"
              placeholder="Search templates by metadata or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", boxSizing: "border-box", backgroundColor: colors.bg, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "14px 16px 14px 44px", fontSize: "14px", color: colors.textPrimary, outline: "none" }}
            />
          </div>

          {/* Filter Row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "bold", color: colors.textMuted, textTransform: "uppercase", letterSpacing: "1px", marginRight: "8px" }}>
              <FiSliders />
              <span>Filters:</span>
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  border: activeCategory === cat ? `1px solid ${colors.accent}` : `1px solid ${colors.border}`,
                  backgroundColor: activeCategory === cat ? colors.accent : colors.surface,
                  color: activeCategory === cat ? "#FFFFFF" : colors.textSecondary,
                  transition: "all 0.2s ease"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid Layout */}
        {filteredTemplates.length > 0 ? (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", 
            gap: "40px" // Increased gap to ensure zero congestion
          }}>
            {filteredTemplates.map((template) => {
              const isSelected = selectedTemplateId === template.id;
              const isHovered = hoveredCardId === template.id;

              return (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplateId(template.id)}
                  onMouseEnter={() => setHoveredCardId(template.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  style={{ 
      minHeight: "100vh", 
      backgroundColor: colors.bg, 
      color: colors.textPrimary, 
      fontFamily: "'DM Sans', sans-serif", // Matching your Navbar font
      paddingBottom: "80px",
      paddingTop: "88px", // 64px (Navbar height) + 24px (breathing room)
    }}
                >
                  {/* Badges Overlay */}
                  <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {template.isPopular && (
                      <span style={{ backgroundColor: "#F59E0B", color: "#FFFFFF", fontSize: "10px", fontWeight: "black", padding: "6px 12px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <FiAward /> Popular
                      </span>
                    )}
                    <span style={{ backgroundColor: "rgba(255,255,255,0.9)", border: `1px solid ${colors.border}`, color: colors.textPrimary, fontSize: "10px", fontWeight: "bold", padding: "6px 12px", borderRadius: "20px" }}>
                      {template.category}
                    </span>
                  </div>

                  {/* Top Right Active Radial Check Indicator */}
                  {isSelected && (
                    <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 10, backgroundColor: colors.accent, color: "#FFFFFF", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(13,148,136,0.3)" }}>
                      <FiCheck style={{ strokeWidth: 3 }} />
                    </div>
                  )}

                  {/* Thumbnail Workspace Container */}
                  <div style={{ 
                    position: "relative", 
                    padding: "40px 40px 20px 40px", 
                    backgroundColor: "#F1F5F9", 
                    borderBottom: `1px solid ${colors.border}`,
                    display: "flex",
                    justifyContent: "center"
                  }}>
                    {/* Visual Mock Canvas Sheet */}
                    <div style={{ 
                      width: "100%", 
                      maxWidth: "210px",
                      height: "270px", 
                      backgroundColor: "#FFFFFF", 
                      borderRadius: "8px", 
                      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                      padding: "20px",
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px"
                    }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", borderBottom: `1px solid ${template.accentColor}20`, paddingBottom: "12px" }}>
                        <div style={{ height: "10px", width: "60%", backgroundColor: template.accentColor, borderRadius: "2px" }}></div>
                        <div style={{ height: "6px", width: "40%", backgroundColor: "#E2E8F0", borderRadius: "2px" }}></div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                        <div style={{ height: "8px", width: "35%", backgroundColor: `${template.accentColor}30`, borderRadius: "2px" }}></div>
                        <div style={{ height: "5px", width: "100%", backgroundColor: "#F1F5F9", borderRadius: "2px" }}></div>
                        <div style={{ height: "5px", width: "90%", backgroundColor: "#F1F5F9", borderRadius: "2px" }}></div>
                        <div style={{ height: "8px", width: "25%", backgroundColor: `${template.accentColor}30`, borderRadius: "2px", marginTop: "8px" }}></div>
                        <div style={{ height: "5px", width: "100%", backgroundColor: "#F1F5F9", borderRadius: "2px" }}></div>
                      </div>
                    </div>

                    {/* Action Overlay Controls Frame on Hover */}
                    <div style={{ 
                      position: "absolute", 
                      inset: 0, 
                      backgroundColor: "rgba(17,24,39,0.4)", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      gap: "12px", 
                      padding: "0 24px",
                      opacity: isHovered ? 1 : 0,
                      pointerEvents: isHovered ? "auto" : "none",
                      transition: "opacity 0.25s ease"
                    }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setPreviewId(template.id); }}
                        style={{ flex: 1, backgroundColor: "#FFFFFF", color: colors.textPrimary, border: "none", borderRadius: "10px", padding: "12px 0", fontSize: "13px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                      >
                        <FiEye /> Preview
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedTemplateId(template.id); }}
                        style={{ flex: 1, backgroundColor: template.accentColor, color: "#FFFFFF", border: "none", borderRadius: "10px", padding: "12px 0", fontSize: "13px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                      >
                        Use Template
                      </button>
                    </div>
                  </div>

                  {/* Informational Text Metadata Card Body */}
                  <div style={{ padding: "28px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
                      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>{template.name}</h3>
                      <span style={{ backgroundColor: "#ECFDF5", border: `1px solid #A7F3D0`, color: "#065F46", fontSize: "10px", fontWeight: "extrabold", padding: "4px 8px", borderRadius: "6px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                        {template.atsScore}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "14px", color: colors.textSecondary, lineHeight: "1.6", flex: 1 }}>
                      {template.description}
                    </p>
                    
                    <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: `1px solid ${colors.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "11px", fontWeight: "bold", color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.5px" }}>Engine Engine Blueprint</span>
                      <span style={{ fontSize: "13px", fontWeight: "bold", color: isSelected ? colors.accent : colors.textMuted }}>
                        {isSelected ? "Active Base Layout" : "Select Layout"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search Fallback */
          <div style={{ textAlign: "center", padding: "64px 24px", backgroundColor: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "16px", maxWidth: "500px", margin: "0 auto" }}>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>No templates matches found</h3>
            <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: colors.textSecondary }}>Modify your active filter keys or search query parameters.</p>
            <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} style={{ marginTop: "16px", background: "none", border: "none", color: colors.accent, fontWeight: "bold", textDecoration: "underline", cursor: "pointer" }}>
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Preview Dialog Modal Overlay */}
      {previewId && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(11,18,37,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "20px" }}>
          <div style={{ backgroundColor: colors.surface, width: "100%", maxWidth: "500px", borderRadius: "20px", overflow: "hidden", border: `1px solid ${colors.border}`, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <div style={{ padding: "24px", borderBottom: `1px solid ${colors.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>{TEMPLATE_DATA.find(t => t.id === previewId)?.name}</h3>
                <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: colors.textMuted }}>Full Resolution Blueprint Overview</p>
              </div>
              <button onClick={() => setPreviewId(null)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: colors.textMuted }}>✕</button>
            </div>
            <div style={{ padding: "40px", backgroundColor: colors.bg, display: "flex", justifyContent: "center" }}>
              <div style={{ width: "200px", height: "260px", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}></div>
            </div>
            <div style={{ padding: "20px 24px", borderTop: `1px solid ${colors.border}`, display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button onClick={() => setPreviewId(null)} style={{ padding: "10px 20px", borderRadius: "10px", border: `1px solid ${colors.border}`, backgroundColor: "#FFFFFF", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>Close</button>
              <button 
                onClick={() => { setSelectedTemplateId(previewId); setPreviewId(null); }}
                style={{ padding: "10px 20px", borderRadius: "10px", border: "none", backgroundColor: colors.accent, color: "#FFFFFF", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}
              >
                Apply Layout Base
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}