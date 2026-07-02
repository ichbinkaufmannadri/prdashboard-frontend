import { RepoGroup } from './RepoGroup';
import { ProviderIcon } from '@/components/ProviderIcon';
import type { ProviderType } from '@/types/enums';
import type { RepoGroupDTO } from '@/types/domain';

interface ProviderSectionProps {
  provider: ProviderType;
  repos: RepoGroupDTO[];
}

export function ProviderSection({ provider, repos }: ProviderSectionProps) {
  if (repos.length === 0) return null;

  const total = repos.reduce((sum, r) => sum + r.pullRequests.length, 0);
  const label = provider.toLowerCase();

  return (
    <section className="space-y-3">
      <div className="flex items-baseline gap-2">
        <ProviderIcon provider={provider} className="w-3.5 h-3.5" />
        <h2 className="font-mono text-sm text-muted">
          <span className="text-subtle">[</span>
          {label}
          <span className="text-subtle">]</span>
        </h2>
        <span className="font-mono text-2xs text-subtle">
          {total} open · {repos.length} {repos.length === 1 ? 'repo' : 'repos'}
        </span>
      </div>
      <div className="space-y-3">
        {repos.map((repo) => (
          <RepoGroup key={repo.repoFullName} group={repo} />
        ))}
      </div>
    </section>
  );
}
