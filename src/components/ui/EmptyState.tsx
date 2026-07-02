import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  prompt?: string;
  message: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Terminal-styled empty state. Renders a monospace line with a $ prompt and
 * a blinking cursor — one of the app's signature visual moments.
 */
export function EmptyState({ prompt = '$', message, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-start gap-4 p-8 border border-dashed border-border rounded-lg bg-surface/60',
        className,
      )}
    >
      <div className="font-mono text-sm text-muted flex items-baseline">
        <span className="text-accent mr-2">{prompt}</span>
        <span>{message}</span>
        <span
          aria-hidden
          className="inline-block w-[6px] h-[13px] ml-1 bg-accent animate-blink"
        />
      </div>
      {action}
    </div>
  );
}
