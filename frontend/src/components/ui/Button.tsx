import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-aero',
  secondary: 'bg-white/70 text-ink border border-sky-aero/40 hover:bg-white',
  danger: 'bg-red-500 text-white border border-white/30 hover:bg-red-400',
};

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full ' +
    'font-display font-bold text-sm transition-all ' +
    'disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button className={`${base} ${variantClasses[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}