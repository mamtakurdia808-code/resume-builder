import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  FileText,
  Loader2,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function MyResumes() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchResumes();
  }, []);

  useEffect(() => {
    const filtered = resumes.filter((resume) =>
      resume.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredResumes(filtered);
  }, [search, resumes]);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/resumes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResumes(response.data.resumes || []);
      setFilteredResumes(response.data.resumes || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/resumes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete resume");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="resume-page-container">
      {/* Scope-isolated standard CSS styles inside the same file */}
      <style>{`
        .resume-page-container {
        box-sizing: border-box;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto; /* Ensures no extra top/bottom margin is pulling or pushing space */
        padding: 8px 24px 32px 24px; /* Reduced the top padding from 32px to 8px */
        font-family: system-ui, -apple-system, sans-serif;
        display: flex;
        flex-direction: column;
        gap: 32px;
        }

        /* Header Card */
        .header-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          flex-wrap: wrap;
        }

        .title-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .title-block h1 {
          font-size: 32px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .subtitle {
          font-size: 15px;
          color: #64748b;
          margin: 0;
        }

        .resume-count {
          font-size: 12px;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 4px;
        }

        /* Custom Create Button */
        .btn-create {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: #0d9488;
          color: #ffffff;
          font-weight: 600;
          font-size: 14px;
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.1s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          white-space: nowrap;
        }

        .btn-create:hover {
          background-color: #0f766e;
        }

        /* Divider & Search Input Layout */
        .header-divider {
          border-top: 1px solid #f1f5f9;
          margin-top: 24px;
          padding-top: 24px;
        }

        .search-wrapper {
          position: relative;
          max-w: 360px;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 16px 10px 42px;
          font-size: 14px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          background-color: #f8fafc;
          outline: none;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          background-color: #ffffff;
          border-color: #0d9488;
          box-shadow: 0 0 0 4px rgba(13, 148, 136, 0.1);
        }

        /* Grid Framework Layout */
        .resume-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        /* Grid Cards Elements */
        .resume-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .resume-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }

        .card-top-bar {
          height: 4px;
          background-color: #0d9488;
        }

        .card-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 16px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .card-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        .card-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }

        .card-label {
          color: #94a3b8;
        }

        .card-value {
          font-weight: 500;
          color: #334155;
        }

        /* Actions Bar Layout */
        .card-divider {
          border-top: 1px solid #f1f5f9;
          padding-top: 16px;
          margin-top: auto;
        }

        .actions-group {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .btn-action {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-view {
          background-color: #f1f5f9;
          color: #475569;
          border-color: #e2e8f0;
        }
        .btn-view:hover { background-color: #e2e8f0; }

        .btn-edit {
          background-color: #f0fdfa;
          color: #0f766e;
          border-color: #ccfbf1;
        }
        .btn-edit:hover { background-color: #ccfbf1; }

        .btn-delete {
          background-color: #fef2f2;
          color: #b91c1c;
          border-color: #fee2e2;
        }
        .btn-delete:hover { background-color: #fee2e2; }

        /* General States CSS */
        .error-banner {
          background-color: #fef2f2;
          border: 1px solid #fee2e2;
          color: #991b1b;
          font-size: 14px;
          border-radius: 10px;
          padding: 16px;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 64px 0;
          color: #0d9488;
        }

        .empty-container {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 64px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .empty-icon-box {
          width: 64px;
          height: 64px;
          border-radius: 14px;
          background-color: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          color: #94a3b8;
        }

        .empty-title {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .empty-text {
          font-size: 14px;
          color: #64748b;
          margin: 8px 0 0 0;
          max-width: 280px;
        }

        .animate-spin {
          animation: spin-kf 1s linear infinite;
        }

        @keyframes spin-kf {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Mobile Adjustments */
        @media (max-width: 640px) {
          .header-top {
            flex-direction: column;
            align-items: stretch;
          }
          .search-wrapper {
            max-width: 100%;
          }
        }
      `}</style>

      {/* Header */}
      <div className="header-card">
        <div className="header-top">
          <div className="title-block">
            <h1>My Resumes</h1>
            <p className="subtitle">
              Manage and organize all your resumes in one place
            </p>
            <p className="resume-count">
              {resumes.length} {resumes.length === 1 ? "Resume" : "Resumes"}
            </p>
          </div>

          <button
            onClick={() => navigate("/resumes/create")}
            className="btn-create"
          >
            <Plus size={18} />
            Create Resume
          </button>
        </div>

        <div className="header-divider">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search resumes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Error State Banner */}
      {error && <div className="error-banner">{error}</div>}

      {/* Logic Rendering Pipeline */}
      {loading ? (
        <div className="loading-container">
          <Loader2 size={36} className="animate-spin" />
        </div>
      ) : filteredResumes.length === 0 ? (
        /* Empty State */
        <div className="empty-container">
          <div className="empty-icon-box">
            <FileText size={32} />
          </div>
          <h2 className="empty-title">
            {search ? "No Resumes Found" : "No Resumes Yet"}
          </h2>
          <p className="empty-text">
            {search
              ? "Try using a different search term."
              : "Create your first resume and start building your professional profile."}
          </p>
          {!search && (
            <button
              onClick={() => navigate("/resumes/create")}
              className="btn-create"
              style={{ marginTop: "24px" }}
            >
              <Plus size={16} />
              Create Resume
            </button>
          )}
        </div>
      ) : (
        /* Clean Responsive Card Grid Layout */
        <div className="resume-grid">
          {filteredResumes.map((resume) => (
            <div key={resume.id} className="resume-card">
              <div className="card-top-bar" />

              <div className="card-content">
                <h3 className="card-title" title={resume.title}>
                  {resume.title}
                </h3>

                <div className="card-details">
                  <div className="card-row">
                    <span className="card-label">Created</span>
                    <span className="card-value">
                      {formatDate(resume.created_at)}
                    </span>
                  </div>

                  <div className="card-row">
                    <span className="card-label">Updated</span>
                    <span className="card-value">
                      {formatDate(resume.updated_at)}
                    </span>
                  </div>
                </div>

                <div className="card-divider">
                  <div className="actions-group">
                    <button
                      onClick={() => navigate(`/resumes/${resume.id}`)}
                      className="btn-action btn-view"
                      title="View Resume"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => navigate(`/resumes/edit/${resume.id}`)}
                      className="btn-action btn-edit"
                      title="Edit Resume"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={() => deleteResume(resume.id)}
                      className="btn-action btn-delete"
                      title="Delete Resume"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}