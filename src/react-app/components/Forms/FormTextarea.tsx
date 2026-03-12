import React from 'react';

interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  disabled?: boolean;
  helpText?: string;
  maxLength?: number;
}

export function FormTextarea({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  required,
  rows = 4,
  disabled,
  helpText,
  maxLength,
}: FormTextareaProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        }`}
      />
      <div className="flex justify-between items-center mt-1">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : helpText ? (
          <p className="text-sm text-gray-500">{helpText}</p>
        ) : (
          <span></span>
        )}
        {maxLength && (
          <p className="text-xs text-gray-400">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
