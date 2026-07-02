import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { User, Lock, Eye, EyeOff, Terminal, ArrowRight } from 'lucide-react';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { toast } from '@/components/ui/Toast';
import { ApiError } from '@/types/api';
import { cn } from '@/lib/cn';

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const login = useMutation({
    mutationFn: () => authApi.login({ username: usernameOrEmail, password }),
    onSuccess: (data) => {
      setAuth(data);
      navigate('/dashboard');
    },
    onError: (err: unknown) => {
      toast(err instanceof ApiError ? err.message : 'Login failed', 'error');
    },
  });

  const canSubmit = usernameOrEmail.trim().length > 0 && password.length > 0;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Wordmark */}
      <div className="mb-8 text-center">
        <p className="font-mono text-xs text-subtle">
          <span className="text-accent">~</span> / login
        </p>
      </div>

      <Card className="p-6 space-y-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (canSubmit && !login.isPending) login.mutate();
          }}
          className="space-y-4"
        >
          {/* Username or email */}
          <div>
            <label
              htmlFor="identifier"
              className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide"
            >
              Username or email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle pointer-events-none" />
              <input
                id="identifier"
                type="text"
                autoComplete="username"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="username or you@example.com"
                className={cn(
                  'w-full h-10 pl-10 pr-3 rounded-md',
                  'bg-surface border border-border text-text text-sm',
                  'placeholder:text-subtle font-mono',
                  'transition-colors',
                  'hover:border-border-hover',
                  'focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent',
                )}
              />
            </div>
          </div>

          {/* Password with visibility toggle */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-muted mb-1.5 uppercase tracking-wide"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle pointer-events-none" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={cn(
                  'w-full h-10 pl-10 pr-11 rounded-md',
                  'bg-surface border border-border text-text text-sm',
                  'placeholder:text-subtle font-mono',
                  'transition-colors',
                  'hover:border-border-hover',
                  'focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent',
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                className={cn(
                  'absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center',
                  'text-subtle hover:text-text transition-colors',
                  'border-l border-border',
                )}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!canSubmit}
            loading={login.isPending}
            className="w-full mt-1"
          >
            {login.isPending ? (
              'Logging in...'
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                Login
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            )}
          </Button>
        </form>

        <div className="pt-4 border-t border-border text-center">
          <p className="text-xs text-muted">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-accent hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </Card>

      <p className="mt-6 text-center font-mono text-2xs text-subtle">
        # unified code review dashboard
      </p>
    </div>
  );
}