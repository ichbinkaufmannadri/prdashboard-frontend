import { cn } from '@/lib/cn';

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block w-4 h-4 border-2 border-muted border-r-transparent rounded-full animate-spin',
        className,
      )}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <Spinner className="w-6 h-6 border-accent border-r-transparent" />
    </div>
  );
}
