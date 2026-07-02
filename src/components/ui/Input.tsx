import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  mono?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, mono, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-10 px-3 rounded-md',
            'bg-surface border border-border text-text placeholder:text-subtle',
            'transition-colors',
            'hover:border-border-hover',
            'focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-danger focus:border-danger focus:ring-danger',
            mono && 'font-mono text-[13px]',
            className,
          )}
          {...props}
        />
        {(hint || error) && (
          <p className={cn('mt-1.5 text-xs', error ? 'text-danger' : 'text-subtle')}>
            {error ?? hint}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';
