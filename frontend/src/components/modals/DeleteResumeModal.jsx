import React, { useState } from 'react';
import { AlertCircle, Loader } from 'lucide-react';

// Tailwind CSS Classes
const STYLES = {
  // Backdrop
  backdrop: 'fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-200',
  // Modal Container
  container: 'fixed inset-0 z-50 flex items-center justify-center p-4',
  // Modal Box
  modal: 'bg-white rounded-xl shadow-2xl max-w-sm w-full animate-in fade-in zoom-in-95 duration-200',
  // Header
  header: 'flex items-center gap-4 p-6 border-b border-slate-200',
  // Icon Container
  iconContainer: 'flex items-center justify-center w-12 h-12 bg-red-100 rounded-full',
  icon: 'text-red-600',
  // Header Text
  headerTitle: 'text-xl font-bold text-slate-900',
  headerSubtitle: 'text-sm text-slate-500',
  // Content
  content: 'p-6',
  contentLabel: 'text-slate-600 mb-2',
  contentTitle: 'font-semibold text-slate-900 mb-4 break-words',
  contentDescription: 'text-sm text-slate-500',
  // Footer
  footer: 'flex gap-3 p-6 border-t border-slate-200 bg-slate-50',
  // Buttons
  cancelButton: 'flex-1 py-2.5 px-4 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200',
  deleteButton: 'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200',
  deleteButtonLoader: 'animate-spin',
};

export default function DeleteResumeModal({ isOpen, resumeTitle, onConfirm, onCancel }) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={STYLES.backdrop}
        onClick={onCancel}
      />

      {/* Modal */}
      <div className={STYLES.container}>
        <div className={STYLES.modal}>
          {/* Header */}
          <div className={STYLES.header}>
            <div className={STYLES.iconContainer}>
              <AlertCircle size={24} className={STYLES.icon} />
            </div>
            <div>
              <h2 className={STYLES.headerTitle}>Delete Resume?</h2>
              <p className={STYLES.headerSubtitle}>This action cannot be undone</p>
            </div>
          </div>

          {/* Content */}
          <div className={STYLES.content}>
            <p className={STYLES.contentLabel}>
              Are you sure you want to delete
            </p>
            <p className={STYLES.contentTitle}>
              "{resumeTitle}"
            </p>
            <p className={STYLES.contentDescription}>
              This will permanently remove your resume and all associated data. This action cannot be reversed.
            </p>
          </div>

          {/* Footer */}
          <div className={STYLES.footer}>
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className={STYLES.cancelButton}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className={STYLES.deleteButton}
            >
              {isDeleting ? (
                <>
                  <Loader size={18} className={STYLES.deleteButtonLoader} />
                  Deleting...
                </>
              ) : (
                'Delete Resume'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
