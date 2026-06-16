import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Plus, Eye, Edit2, Trash2, Loader } from 'lucide-react';
import DeleteResumeModal from '../../components/modals/DeleteResumeModal';

// Tailwind CSS Classes - Modern HR-Tech SaaS Theme
const STYLES = {
  // Main Container
  mainContainer: 'min-h-screen bg-slate-50',

  // Header
  headerContainer:
  "bg-white border-b border-slate-200 sticky top-0 z-10",

headerContent: "px-4 sm:px-6 lg:px-8 py-6",

headerInner:
  "flex flex-col md:flex-row md:items-center md:justify-between gap-4",

mainTitle:
  "text-3xl md:text-4xl font-bold text-slate-900",

resumeCount:
  "text-slate-500 mt-1",

  // Create Button
  createButton:
  "flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 w-full md:w-auto",
  // Main Content
  contentContainer: "w-full px-4 sm:px-6 lg:px-8 py-6",

  // Search Bar
  searchContainer:
  "mb-6",
  searchWrapper: "relative w-full max-w-2xl",
  searchIcon: 'absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400',
  searchInput: 'w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200',

  // Error Message
  errorContainer: 'mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3',
  errorDot: 'w-2 h-2 bg-red-500 rounded-full flex-shrink-0',

  // Loading State
  loadingContainer: 'flex flex-col items-center justify-center py-16',
  loadingIcon: 'text-teal-600 animate-spin mb-4',
  loadingText: 'text-slate-600',

  // Empty State
  emptyContainer:
  "flex flex-col items-center justify-center min-h-[450px] text-center",
  emptyIconBox:
  "inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-2xl mb-5",
  emptyIcon: 'text-slate-400',
  emptyTitle: 'text-xl font-semibold text-slate-900 mb-2',
  emptyDescription: 'text-slate-600 mb-6',
  emptyButton: 'inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 active:scale-95',

  // Grid
  grid: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6",

  // Card
  card:
  "bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden",
  cardHeader: 'h-1 bg-gradient-to-r from-teal-600 to-teal-500',
  cardContent: 'p-5',

  // Card Title
  cardTitle: 'text-lg font-semibold text-slate-900 mb-4 line-clamp-2 group-hover:text-teal-600 transition-colors',

  // Card Dates
  datesContainer: 'space-y-3 mb-6 text-sm',
  dateRow: 'flex items-center justify-between',
  dateLabel: 'text-slate-600 font-medium',
  dateValue: 'text-slate-900 font-semibold',

  // Card Divider
  divider: 'h-px bg-slate-200 mb-5',

  // Card Actions
  actionsContainer:
  "grid grid-cols-3 gap-2",

  // Action Buttons
  viewButton: 'flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-600 font-medium py-2.5 px-3 rounded-lg transition-all duration-200 border border-slate-200 hover:border-teal-300',
  editButton: 'flex-1 flex items-center justify-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-600 hover:text-teal-700 font-medium py-2.5 px-3 rounded-lg transition-all duration-200 border border-teal-200 hover:border-teal-300',
  deleteButton: 'flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-medium py-2.5 px-3 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300',

  // Button Text (hidden on mobile)
  buttonText:
  "hidden lg:inline",
};

export default function MyResumes() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    resumeId: null,
    resumeTitle: '',
  });

  // Fetch all resumes
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/resumes');
        
        // Handle both array and object responses
        const resumesData = Array.isArray(response.data) 
          ? response.data 
          : response.data.resumes || [];
        
        console.log('Resumes fetched:', resumesData);
        setResumes(resumesData);
        setFilteredResumes(resumesData);
      } catch (err) {
        console.error('Error fetching resumes:', err);
        setError(
          err.response?.data?.message || 'Failed to fetch resumes. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = resumes.filter((resume) =>
      resume.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredResumes(filtered);
  }, [searchQuery, resumes]);

  // Handle create resume
  const handleCreateResume = () => {
    navigate('/resumes/create');
  };

  // Handle view resume
  const handleViewResume = (resumeId) => {
    navigate(`/resumes/${resumeId}`);
  };

  // Handle edit resume
  const handleEditResume = (resumeId) => {
    navigate(`/resumes/edit/${resumeId}`);
  };

  // Handle delete resume
  const handleDeleteResume = (resumeId, resumeTitle) => {
    setDeleteModal({
      isOpen: true,
      resumeId,
      resumeTitle,
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/resumes/${deleteModal.resumeId}`);
      setResumes((prev) =>
        prev.filter((resume) => resume.id !== deleteModal.resumeId)
      );
      setFilteredResumes((prev) =>
        prev.filter((resume) => resume.id !== deleteModal.resumeId)
      );
      setDeleteModal({ isOpen: false, resumeId: null, resumeTitle: '' });
      // Optional: Show success message
      setError(null);
    } catch (err) {
      console.error('Error deleting resume:', err);
      setError('Failed to delete resume. Please try again.');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (err) {
      console.error('Date formatting error:', err);
      return 'N/A';
    }
  };

  return (
    <div className={STYLES.mainContainer}>
      {/* Header */}
      <div className={STYLES.headerContainer}>
        <div className={STYLES.headerContent}>
  <div className="max-w-[1400px] mx-auto">
    <div className={STYLES.headerInner}>
            <div className="flex-1">
              <h1 className={STYLES.mainTitle}>
                My Resumes
              </h1>
              <p className={STYLES.resumeCount}>
                {resumes.length} {resumes.length === 1 ? 'resume' : 'resumes'}
              </p>
            </div>
            <button
              onClick={handleCreateResume}
              className={`${STYLES.createButton} w-full md:w-auto`}
            >
              <Plus size={20} />
              Create Resume
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={STYLES.contentContainer}>
  <div className="max-w-[1400px] mx-auto">
        {/* Search Bar */}
        <div className={STYLES.searchContainer}>
  <div className="flex justify-start">
    <div className={STYLES.searchWrapper}>
            <Search
              size={20}
              className={STYLES.searchIcon}
            />
            <input
              type="text"
              placeholder="Search resumes by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={STYLES.searchInput}
            />
          </div>
        </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={STYLES.errorContainer}>
            <div className={STYLES.errorDot} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className={STYLES.loadingContainer}>
            <Loader size={40} className={STYLES.loadingIcon} />
            <p className={STYLES.loadingText}>Loading your resumes...</p>
          </div>
        ) : filteredResumes.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center min-h-[450px] text-center">
            <div className={STYLES.emptyIconBox}>
              <Plus size={32} className={STYLES.emptyIcon} />
            </div>
            <h3 className={STYLES.emptyTitle}>
              {searchQuery ? 'No resumes found' : 'No resumes yet'}
            </h3>
            <p className={STYLES.emptyDescription}>
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Create your first resume to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateResume}
                className={STYLES.emptyButton}
              >
                <Plus size={18} />
                Create Resume
              </button>
            )}
          </div>
        ) : (
          // Resume Grid
          <div className={STYLES.grid}>
            {filteredResumes.map((resume) => (
              <div
                key={resume.id}
                className={STYLES.card}
              >
                {/* Card Header */}
                <div className={STYLES.cardHeader} />

                {/* Card Content */}
                <div className={STYLES.cardContent}>
                  {/* Title */}
                  <h3 className={STYLES.cardTitle}>
                    {resume.title || 'Untitled Resume'}
                  </h3>

                  {/* Dates */}
                  <div className={STYLES.datesContainer}>
                    <div className={STYLES.dateRow}>
                      <span className={STYLES.dateLabel}>Created:</span>
                      <span className={STYLES.dateValue}>
                        {formatDate(resume.created_at)}
                      </span>
                    </div>
                    <div className={STYLES.dateRow}>
                      <span className={STYLES.dateLabel}>Updated:</span>
                      <span className={STYLES.dateValue}>
                        {formatDate(resume.updated_at)}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={STYLES.divider} />

                  {/* Actions */}
                  <div className={STYLES.actionsContainer}>
                    {/* View Button */}
                    <button
                      onClick={() => handleViewResume(resume.id)}
                      className={STYLES.viewButton}
                      title="View resume"
                    >
                      <Eye size={16} />
                      <span className={STYLES.buttonText}>View</span>
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleEditResume(resume.id)}
                      className={STYLES.editButton}
                      title="Edit resume"
                    >
                      <Edit2 size={16} />
                      <span className={STYLES.buttonText}>Edit</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() =>
                        handleDeleteResume(resume.id, resume.title)
                      }
                      className={STYLES.deleteButton}
                      title="Delete resume"
                    >
                      <Trash2 size={16} />
                      <span className={STYLES.buttonText}>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
      </div>

      {/* Delete Resume Modal */}
      {deleteModal.isOpen && (
        <DeleteResumeModal
          isOpen={deleteModal.isOpen}
          resumeTitle={deleteModal.resumeTitle}
          onConfirm={handleDeleteConfirm}
          onCancel={() =>
            setDeleteModal({ isOpen: false, resumeId: null, resumeTitle: '' })
          }
        />
      )}
    </div>
  );
}
