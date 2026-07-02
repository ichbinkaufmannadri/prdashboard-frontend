import { GitBranch, ArrowRight, ExternalLink } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/StatusBadge';
import { ProviderIcon } from '@/components/ProviderIcon';
import { RelativeTime } from '@/components/RelativeTime';
import type { PullRequestDTO } from '@/types/domain';
import { ReviewStatusBadge } from '@/components/ReviewStatusBadge';

interface PRHeaderProps {
  pr: PullRequestDTO;
}

export function PRHeader({ pr }: PRHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 font-mono text-2xs text-subtle">
        <ProviderIcon provider={pr.providerType} className="w-3 h-3" />
        <span>{pr.repoFullName}</span>
        <span>·</span>
        <span>#{pr.number}</span>
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-text leading-tight">
          {pr.title}
        </h1>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <StatusBadge status={pr.status} />
        <ReviewStatusBadge status={pr.reviewStatus} />
        <span className="text-sm text-muted flex items-center gap-1.5">
          <Avatar
            src={pr.authorAvatarUrl}
            alt={pr.authorUsername}
            size="xs"
          />
          <span className="font-mono">{pr.authorUsername}</span>
        </span>
        <span className="text-sm text-muted">
          opened <RelativeTime iso={pr.createdAt} />
        </span>
        <a
          href={pr.url}
          target="_blank"
          rel="noreferrer"
          className="ml-auto text-sm text-muted hover:text-text flex items-center gap-1.5"
        >
          view on {pr.providerType.toLowerCase()}
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {pr.branchName && pr.targetBranch && (
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="inline-flex items-center gap-1 px-2 h-6 rounded bg-elevated border border-border text-text">
            <GitBranch className="w-3 h-3 text-muted" />
            {pr.branchName}
          </span>
          <ArrowRight className="w-3 h-3 text-subtle" />
          <span className="inline-flex items-center gap-1 px-2 h-6 rounded bg-elevated border border-border text-muted">
            <GitBranch className="w-3 h-3" />
            {pr.targetBranch}
          </span>
        </div>
      )}
    </div>
  );
}
