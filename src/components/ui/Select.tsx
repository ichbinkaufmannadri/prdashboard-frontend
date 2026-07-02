import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, className, children, id, ...props }, ref) => {
    const selectId = id ?? props.name;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full h-10 pl-3 pr-10 rounded-md appearance-none cursor-pointer',
              'bg-surface border border-border text-text text-sm',
              'transition-colors',
              'hover:border-border-hover',
              'focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent',
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <div
            aria-hidden
            className="absolute right-0 top-0 bottom-0 w-9 flex items-center justify-center border-l border-border pointer-events-none group-hover:border-border-hover transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5 text-muted group-hover:text-text transition-colors" />
          </div>
        </div>
      </div>
    );
  },
);
Select.displayName = 'Select';