'use client';

import { useState } from 'react';
import StudentDetailsForm from './StudentDetailsForm';
import AgreementView from './AgreementView';
import SignatureStep from './SignatureStep';
import SuccessScreen from './SuccessScreen';

export interface FormData {
  [key: string]: string;
}

const STEPS = [
  { label: 'Your Details', number: 1 },
  { label: 'Agreement', number: 2 },
  { label: 'Sign & Submit', number: 3 },
];

export default function FormWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pdfBase64, setPdfBase64] = useState<string>('');
  const [submitError, setSubmitError] = useState('');

  const handleDetailsComplete = (data: FormData) => {
    setFormData(data);
    setCurrentStep(2);
  };

  const handleAgreementAccepted = () => {
    setCurrentStep(3);
  };

  const handleSubmit = async (sigDataUrl: string) => {
    setSignatureDataUrl(sigDataUrl);
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          signatureDataUrl: sigDataUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      setPdfBase64(result.pdfBase64);
      setIsSuccess(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!pdfBase64) return;
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${pdfBase64}`;
    link.download = `agreement-${formData.fullName?.replace(/\s+/g, '-') || 'signed'}.pdf`;
    link.click();
  };

  const handleNewSubmission = () => {
    setCurrentStep(1);
    setFormData({});
    setSignatureDataUrl('');
    setIsSuccess(false);
    setPdfBase64('');
    setSubmitError('');
  };

  if (isSuccess) {
    return (
      <SuccessScreen
        formData={formData}
        onDownloadPdf={handleDownloadPdf}
        onNewSubmission={handleNewSubmission}
        hasPdf={!!pdfBase64}
      />
    );
  }

  return (
    <>
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-steps" data-step={currentStep}>
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.number;
            const isActive = currentStep === step.number;
            return (
              <div key={step.number} className="progress-step">
                <div
                  className={`step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                >
                  {isCompleted ? '✓' : step.number}
                </div>
                <span
                  className={`step-label ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Card */}
      <div className="form-card" key={currentStep}>
        {currentStep === 1 && (
          <StudentDetailsForm
            initialData={formData}
            onNext={handleDetailsComplete}
          />
        )}
        {currentStep === 2 && (
          <AgreementView
            onBack={() => setCurrentStep(1)}
            onAccept={handleAgreementAccepted}
          />
        )}
        {currentStep === 3 && (
          <SignatureStep
            studentName={formData.fullName || ''}
            onBack={() => setCurrentStep(2)}
            onSubmit={handleSubmit}
            error={submitError}
          />
        )}
      </div>

      {/* Submitting overlay */}
      {isSubmitting && (
        <div className="submit-overlay">
          <div className="spinner" />
          <p>Generating PDF and sending emails...</p>
        </div>
      )}
    </>
  );
}
