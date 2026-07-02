import { cn } from '@/lib/cn';
import type { ProviderType } from '@/types/enums';

interface ProviderIconProps {
  provider: ProviderType;
  className?: string;
}

export function ProviderIcon({ provider, className }: ProviderIconProps) {
  switch (provider) {
    case 'GITHUB':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={cn('shrink-0', className)}
          aria-label="GitHub"
        >
          <path d="M12 .3a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.75.09-.73.09-.73 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.81 1.3 3.5.99.1-.78.42-1.3.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.31-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.87.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.81 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .3" />
        </svg>
      );

    case 'GITLAB':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={cn('shrink-0 text-[#FC6D26]', className)}
          aria-label="GitLab"
        >
          <path d="m23.6 9.6-.03-.09-3.3-8.6a.86.86 0 0 0-1.63.04L16.44 8.6H7.57L5.36.95a.86.86 0 0 0-1.63-.04l-3.3 8.6-.04.08a6.1 6.1 0 0 0 2.02 7.04l.01.01.03.02 5 3.74 2.47 1.87 1.5 1.14a1 1 0 0 0 1.23 0l1.5-1.14 2.47-1.87 5.03-3.76.02-.02A6.1 6.1 0 0 0 23.6 9.6z" />
        </svg>
      );

    case 'AZURE':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={cn('shrink-0 text-[#0078D4]', className)}
          aria-label="Azure DevOps"
        >
          <path d="M0 8.877 2.247 5.91l8.405-3.416V.022l7.37 5.393L2.966 8.338v8.4L0 15.833V8.877zm24-4.939v14.396l-5.665 4.643-9.158-3.014v3.014l-5.892-7.246 15.209 1.186V5.014L24 3.938z" />
        </svg>
      );
  }
}