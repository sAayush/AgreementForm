'use client';

import { useState, useEffect } from 'react';
import { formFields, type FormField } from '@/config/formFields';
import type { FormData } from './FormWizard';

interface Props {
  initialData: FormData;
  onNext: (data: FormData) => void;
}

export default function StudentDetailsForm({ initialData, onNext }: Props) {
  const [data, setData] = useState<FormData>({ ...initialData });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill date field
  useEffect(() => {
    formFields.forEach((field) => {
      if (field.autoFill === 'date' && !data[field.name]) {
        setData((prev) => ({
          ...prev,
          [field.name]: new Date().toISOString().split('T')[0],
        }));
      }
    });
  }, []);

  const handleChange = (name: string, value: string) => {
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    formFields.forEach((field) => {
      const value = data[field.name]?.trim() || '';

      if (field.required && !value) {
        newErrors[field.name] = `${field.label} is required`;
      }

      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.name] = 'Please enter a valid email address';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(data);
    }
  };

  const renderField = (field: FormField) => {
    if (field.type === 'select' && field.options) {
      return (
        <select
          id={field.name}
          value={data[field.name] || ''}
          onChange={(e) => handleChange(field.name, e.target.value)}
        >
          <option value="">{field.placeholder || 'Select...'}</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        id={field.name}
        type={field.type}
        value={data[field.name] || ''}
        onChange={(e) => handleChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        className={errors[field.name] ? 'error' : ''}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="form-card-title">Your Details</h2>
      <p className="form-card-subtitle">
        Please fill in your information below. Fields marked with * are required.
      </p>

      <div className="form-grid">
        {formFields.map((field) => (
          <div
            key={field.name}
            className={`form-group ${
              field.type === 'date' || field.name === 'email' ? '' : ''
            }`}
          >
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            {renderField(field)}
            {errors[field.name] && (
              <span className="error-message">⚠ {errors[field.name]}</span>
            )}
          </div>
        ))}
      </div>

      <div className="button-row" style={{ justifyContent: 'flex-end' }}>
        <button type="submit" className="btn btn-primary">
          Continue →
        </button>
      </div>
    </form>
  );
}
