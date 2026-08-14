import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...rest }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="font-display text-xs font-bold text-sky-deep uppercase tracking-widest"
      >
        {label}
      </label>

      <input
        id={inputId}
        className={`input-aero w-full px-4 py-2.5 text-sm placeholder:text-chrome-dark/60 ${className}`}
        {...rest}
      />

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}