import { Outlet } from 'react-router-dom';
import { Terminal } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Terminal className="w-5 h-5 text-accent" />
          <span className="font-mono text-sm font-medium text-text">
            pr<span className="text-accent">/</span>dash
          </span>
        </div>
        <Outlet />
      </div>
      <p className="mt-10 font-mono text-2xs text-subtle">
        one dashboard for github &amp; gitlab
      </p>
    </div>
  );
}
