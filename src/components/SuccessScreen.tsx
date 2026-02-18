'use client';

import type { FormData } from './FormWizard';

interface Props {
  formData: FormData;
  onDownloadPdf: () => void;
  onNewSubmission: () => void;
  hasPdf: boolean;
}

export default function SuccessScreen({
  formData,
  onDownloadPdf,
  onNewSubmission,
  hasPdf,
}: Props) {
  return (
    <div className="form-card">
      <div className="success-screen">
        <div className="success-icon">✅</div>
        <h2>Agreement Signed Successfully!</h2>
        <p>
          Your signed agreement has been submitted and a confirmation email has
          been sent to <strong>{formData.email}</strong>.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          A copy has also been sent to the admin for records.
        </p>

        <div className="success-details">
          <h3>Submission Summary</h3>
          <div className="success-detail-row">
            <span className="detail-label">Name</span>
            <span className="detail-value">{formData.fullName}</span>
          </div>
          <div className="success-detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{formData.email}</span>
          </div>
          {formData.course && (
            <div className="success-detail-row">
              <span className="detail-label">Course</span>
              <span className="detail-value">{formData.course}</span>
            </div>
          )}
          <div className="success-detail-row">
            <span className="detail-label">Date Signed</span>
            <span className="detail-value">
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="success-detail-row">
            <span className="detail-label">Status</span>
            <span
              className="detail-value"
              style={{ color: 'var(--success-color)' }}
            >
              ✓ Completed
            </span>
          </div>
        </div>

        <div className="success-actions">
          {hasPdf && (
            <button className="btn btn-primary" onClick={onDownloadPdf}>
              📄 Download PDF
            </button>
          )}
          <button className="btn btn-secondary" onClick={onNewSubmission}>
            📝 New Submission
          </button>
        </div>
      </div>
    </div>
  );
}
