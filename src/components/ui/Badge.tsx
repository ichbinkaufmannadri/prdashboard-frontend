import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'default' | 'accent' | 'success' | 'danger' | 'muted' | 'purple';
  mono?: boolean;
  icon?: ReactNode;
}

const tones: Record<NonNullable<BadgeProps['tone']>, string> = {
  default: 'bg-elevated text-text border-border',
  accent: 'bg-accent-dim text-accent border-accent/30',
  success: 'bg-success/10 text-success border-success/30',
  danger: 'bg-danger/10 text-danger border-danger/30',
  muted: 'bg-elevated text-muted border-border',
  purple: 'bg-status-merged/10 text-status-merged border-status-merged/30',
};

export function Badge({
  tone = 'default',
  mono,
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 h-5 rounded border text-2xs font-medium',
        tones[tone],
        mono && 'font-mono',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
