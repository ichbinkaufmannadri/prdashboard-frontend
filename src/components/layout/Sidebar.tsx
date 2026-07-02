import { NavLink } from 'react-router-dom';
import { LayoutGrid, Plug, LogOut, Terminal, History } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/api/auth';
import { cn } from '@/lib/cn';
import { Avatar } from '@/components/ui/Avatar';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/providers', label: 'Providers', icon: Plug },
  { to: '/history', label: 'History', icon: History },
];

export function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const clear = useAuthStore((s) => s.clear);

  const handleLogout = async () => {
    try {
      await authApi.logout(refreshToken ?? undefined);
    } catch {
      // Best-effort revocation — proceed with client cleanup even if the
      // backend call fails (network down, token already expired, etc.)
    }
    clear();
    window.location.href = '/login';
  };


  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 flex flex-col bg-surface border-r border-border">
      {/* Brand */}
      <div className="px-4 pt-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-accent" />
          <h1 className="font-mono text-sm text-text">pr-dash</h1>
        </div>
        <div className="mt-2 pl-6 font-mono text-2xs text-subtle space-y-0.5">
          <p>by Adri Firdiansyah Kaufmann</p>
          <p>2026</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-3 h-9 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-elevated text-text'
                  : 'text-muted hover:text-text hover:bg-elevated/60',
              )
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-border">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <Avatar alt={user?.username ?? '?'} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] text-text truncate">{user?.username}</p>
            <p className="text-2xs text-subtle truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-1 w-full flex items-center gap-2.5 px-3 h-8 rounded-md text-[13px] text-muted hover:text-danger hover:bg-elevated transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
