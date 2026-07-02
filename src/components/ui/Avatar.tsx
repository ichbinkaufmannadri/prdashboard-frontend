import { cn } from '@/lib/cn';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  xs: 'w-5 h-5 text-2xs',
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

export function Avatar({ src, alt, size = 'sm', className }: AvatarProps) {
  const initials = alt
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-elevated text-muted font-medium overflow-hidden border border-border',
        sizes[size],
        className,
      )}
      title={alt}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span>{initials || '?'}</span>
      )}
    </span>
  );
}
