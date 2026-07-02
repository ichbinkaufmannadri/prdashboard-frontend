import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/api/auth';
import { ApiError } from '@/types/api';

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authApi.register(form);
      // Auto-login after successful register
      const jwt = await authApi.login({
        username: form.username,
        password: form.password,
      });
      setAuth({
        accessToken: jwt.accessToken,
        refreshToken: jwt.refreshToken,
        user: jwt.user,
      });
      navigate('/providers', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h1 className="text-lg font-semibold text-text">Create account</h1>
      <p className="mt-1 text-sm text-muted">Takes about ten seconds.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <Input
          name="username"
          label="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          autoComplete="username"
          autoFocus
          required
          minLength={3}
        />
        <Input
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          autoComplete="email"
          required
        />
        <Input
          name="fullName"
          label="Full name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          autoComplete="name"
        />
        <Input
          name="password"
          type="password"
          label="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          autoComplete="new-password"
          required
          minLength={8}
          hint="At least 8 characters."
        />

        {error && (
          <p className="text-sm text-danger font-mono text-[13px]">! {error}</p>
        )}

        <Button type="submit" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted text-center">
        Already have one?{' '}
        <Link to="/login" className="text-accent hover:text-accent-hover">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
