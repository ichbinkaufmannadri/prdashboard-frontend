import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...props }, ref) => (
    <div className="w-full">
      <textarea
        ref={ref}
        className={cn(
          'w-full min-h-[88px] p-3 rounded-md resize-y',
          'bg-surface border border-border text-text placeholder:text-subtle text-sm',
          'transition-colors',
          'hover:border-border-hover',
          'focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent',
          error && 'border-danger focus:border-danger focus:ring-danger',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  ),
);
Textarea.displayName = 'Textarea';
