'use client';

import { useState, useRef, useEffect } from 'react';
import { agreementConfig } from '@/config/agreement';

interface Props {
  onBack: () => void;
  onAccept: () => void;
}

export default function AgreementView({ onBack, onAccept }: Props) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        setHasScrolledToBottom(true);
      }
    };

    // If content is short enough to not scroll, mark as scrolled
    if (el.scrollHeight <= el.clientHeight + 20) {
      setHasScrolledToBottom(true);
    }

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <h2 className="form-card-title">Review Agreement</h2>
      <p className="form-card-subtitle">
        Please read the full agreement carefully before proceeding.
        {!hasScrolledToBottom && ' Scroll to the bottom to continue.'}
      </p>

      <div className="agreement-wrapper" ref={scrollRef}>
        <div className="agreement-meta">
          <strong>{agreementConfig.title}</strong>
          <br />
          Last updated: {agreementConfig.lastUpdated}
        </div>

        {agreementConfig.sections.map((section, index) => (
          <div key={index} className="agreement-section">
            <h3>{section.heading}</h3>
            <p>{section.content}</p>
          </div>
        ))}
      </div>

      <label className="agreement-checkbox">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          disabled={!hasScrolledToBottom}
        />
        <span>
          I have read and understood the full agreement and agree to be bound by
          its terms and conditions.
        </span>
      </label>

      <div className="button-row">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          ← Back
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!isChecked}
          onClick={onAccept}
        >
          I Agree — Continue →
        </button>
      </div>
    </div>
  );
}
