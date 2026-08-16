import { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextArea({ label, error, className = '', id, ...rest }: TextAreaProps) {
  const generatedId = useId();
  const textAreaId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={textAreaId}
        className="font-display text-xs font-bold text-sky-deep uppercase tracking-widest"
      >
        {label}
      </label>

      <textarea
        id={textAreaId}
        className={`input-aero w-full px-4 py-2.5 text-sm min-h-[90px] resize-y ${className}`}
        {...rest}
      />

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}