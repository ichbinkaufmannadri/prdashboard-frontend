import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { GitBranch, GitMerge, RefreshCw } from 'lucide-react';
import { involvedApi } from '@/api/involved';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageSpinner } from '@/components/ui/Spinner';
import { ProviderIcon } from '@/components/ProviderIcon';
import { RelativeTime } from '@/components/RelativeTime';
import { StatusBadge } from '@/components/StatusBadge';
import { ReviewStatusBadge } from '@/components/ReviewStatusBadge';
import { cn } from '@/lib/cn';
import type { PullRequestDTO } from '@/types/domain';
import type { ViewerRole } from '@/types/enums';

type Filter = 'all' | 'open' | 'merged' | 'closed';

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'all' },
  { value: 'open', label: 'open' },
  { value: 'merged', label: 'merged' },
  { value: 'closed', label: 'closed' },
];

const roleLabel: Record<ViewerRole, string> = {
  AUTHOR: 'author',
  REVIEWER: 'reviewer',
  ASSIGNEE: 'assignee',
  NONE: '',
};

export function HistoryPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['involved'],
    queryFn: involvedApi.list,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    switch (filter) {
      case 'open': return data.filter(pr => pr.status === 'OPEN' || pr.status === 'DRAFT');
      case 'merged': return data.filter(pr => pr.status === 'MERGED');
      case 'closed': return data.filter(pr => pr.status === 'CLOSED');
      default: return data;
    }
  }, [data, filter]);

  const counts = useMemo(() => {
    if (!data) return { all: 0, open: 0, merged: 0, closed: 0 };
    return {
      all: data.length,
      open: data.filter(pr => pr.status === 'OPEN' || pr.status === 'DRAFT').length,
      merged: data.filter(pr => pr.status === 'MERGED').length,
      closed: data.filter(pr => pr.status === 'CLOSED').length,
    };
  }, [data]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="font-mono text-xs text-subtle mb-1">
            <span className="text-accent">~</span> / history
          </p>
          <h1 className="text-xl font-semibold text-text">Your PRs</h1>
          <p className="mt-1 text-sm text-muted">
            Every PR/MR you're author, reviewer, or assignee on across all your connected providers.
          </p>
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

      <div className="flex items-center gap-1 mb-6 p-1 bg-surface border border-border rounded-md w-fit">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'px-3 h-7 font-mono text-[13px] rounded transition-colors flex items-center gap-1.5',
              filter === f.value
                ? 'bg-elevated text-text'
                : 'text-muted hover:text-text',
            )}
          >
            {f.label}
            <span className="text-subtle text-2xs">{counts[f.value]}</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState message={
          data && data.length === 0
            ? "you're not involved in any PRs yet."
            : `no PRs in state '${filter}'.`
        } />
      ) : (
        <Card className="divide-y divide-border overflow-hidden">
          {filtered.map((pr) => (
            <PRRow key={pr.id} pr={pr} />
          ))}
        </Card>
      )}
    </div>
  );
}

function PRRow({ pr }: { pr: PullRequestDTO }) {
  const role = pr.viewerRole && pr.viewerRole !== 'NONE' ? roleLabel[pr.viewerRole] : null;

  return (
    <Link
      to={`/pr/${encodeURIComponent(pr.id)}`}
      className="block px-4 py-3 hover:bg-elevated/50 transition-colors group"
    >
      <div className="flex items-start gap-3">
        <ProviderIcon provider={pr.providerType} className="w-3.5 h-3.5 mt-1 shrink-0" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-2xs text-subtle">
              {pr.repoFullName}<span className="text-subtle">#{pr.number}</span>
            </span>
          </div>

          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-text group-hover:text-accent transition-colors">
              {pr.title}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <StatusBadge status={pr.status} />
            <ReviewStatusBadge status={pr.reviewStatus} />
            {role && (
              <Badge tone="accent" mono>
                you: {role}
              </Badge>
            )}
          </div>

          <div className="mt-2 flex items-center gap-3 text-2xs text-muted flex-wrap">
            <span className="flex items-center gap-1.5">
              <Avatar src={pr.authorAvatarUrl} alt={pr.authorUsername} size="xs" />
              <span className="font-mono">{pr.authorUsername}</span>
            </span>

            {pr.branchName && pr.status !== 'MERGED' && (
              <span className="flex items-center gap-1 font-mono truncate max-w-[220px]">
                <GitBranch className="w-3 h-3 shrink-0" />
                <span className="truncate">{pr.branchName}</span>
              </span>
            )}

            {pr.status === 'MERGED' && pr.mergedByUsername && (
              <span className="flex items-center gap-1.5 font-mono text-status-merged">
                <GitMerge className="w-3 h-3" />
                <span>merged by {pr.mergedByUsername}</span>
                {pr.mergedAt && (
                  <>
                    <span className="text-subtle">·</span>
                    <RelativeTime iso={pr.mergedAt} />
                  </>
                )}
              </span>
            )}

            {pr.status !== 'MERGED' && (
              <span className="font-mono">
                updated <RelativeTime iso={pr.updatedAt} />
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}