import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { dashboardApi, type DashboardFilter } from '@/api/dashboard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageSpinner } from '@/components/ui/Spinner';
import { Select } from '@/components/ui/Select';
import { ProviderIcon } from '@/components/ProviderIcon';
import { PRCard } from '@/features/dashboard/PRCard';
import { cn } from '@/lib/cn';
import type { ProviderGroupDTO, RepoGroupDTO } from '@/types/domain';
import type { ProviderType } from '@/types/enums';
import { ALL_PROVIDER_TYPES } from '@/types/enums';

type Filter = 'all' | ProviderType;

export function DashboardPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['dashboard', filter],
    queryFn: () =>
      dashboardApi.get(filter === 'all' ? 'all' : (filter.toLowerCase() as DashboardFilter)),
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="font-mono text-xs text-subtle mb-1">
            <span className="text-accent">~</span> / dashboard
          </p>
          <h1 className="text-xl font-semibold text-text">Open pull requests</h1>
          <p className="mt-1 text-sm text-muted">
            Every open PR you're involved in — author, reviewer, or assignee.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-40">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as Filter)}
            >
              <option value="all">all providers</option>
              {ALL_PROVIDER_TYPES.map((p) => (
                <option key={p} value={p}>
                  {p.toLowerCase()}
                </option>
              ))}
            </Select>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            leftIcon={<RefreshCw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : !data || data.providers.length === 0 ? (
        <EmptyState message="no open PRs. connect a provider or push some code." />
      ) : (
        <div className="space-y-8">
          {data.providers.map((group) => (
            <ProviderSection key={group.providerType} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProviderSection({ group }: { group: ProviderGroupDTO }) {
  const totalPrs = group.repos.reduce((sum, r) => sum + r.pullRequests.length, 0);

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <ProviderIcon provider={group.providerType} className="w-4 h-4" />
        <h2 className="font-mono text-sm text-text">
          [{group.providerType.toLowerCase()}]
        </h2>
        <span className="font-mono text-2xs text-subtle">
          · {totalPrs} PR{totalPrs === 1 ? '' : 's'} in {group.repos.length} repo
          {group.repos.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="space-y-5">
        {group.repos.map((repo) => (
          <RepoBlock key={repo.repoFullName} repo={repo} />
        ))}
      </div>
    </section>
  );
}

function RepoBlock({ repo }: { repo: RepoGroupDTO }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 pl-1">
        {repo.repoUrl ? (
          <a
            href={repo.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-muted hover:text-accent"
          >
            {repo.repoFullName}
          </a>
        ) : (
          <span className="font-mono text-xs text-muted">{repo.repoFullName}</span>
        )}
        <span className="font-mono text-2xs text-subtle">
          · {repo.pullRequests.length}
        </span>
      </div>
      <Card className="divide-y divide-border overflow-hidden">
        {repo.pullRequests.map((pr) => (
          <PRCard key={pr.id} pr={pr} />
        ))}
      </Card>
    </div>
  );
}