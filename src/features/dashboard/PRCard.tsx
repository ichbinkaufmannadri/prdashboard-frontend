import { Link } from 'react-router-dom';
import { GitBranch, ExternalLink } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/StatusBadge';
import { RelativeTime } from '@/components/RelativeTime';
import type { PullRequestDTO } from '@/types/domain';
import { ReviewStatusBadge } from '@/components/ReviewStatusBadge';

interface PRCardProps {
  pr: PullRequestDTO;
}

export function PRCard({ pr }: PRCardProps) {
  return (
    <Link
      to={`/pr/${encodeURIComponent(pr.id)}`}
      className="group flex items-start gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-elevated/60 transition-colors"
    >
      <div className="pt-0.5 shrink-0">
        <StatusBadge status={pr.status} />
      </div>
      <div className="pt-0.5 shrink-0 flex flex-col gap-1 items-start">
        <StatusBadge status={pr.status} />
        <ReviewStatusBadge status={pr.reviewStatus} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text truncate group-hover:text-accent transition-colors">
            {pr.title}
          </span>
          <span className="font-mono text-2xs text-subtle shrink-0">
            #{pr.number}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-3 text-2xs text-muted">
          <span className="flex items-center gap-1.5">
            <Avatar
              src={pr.authorAvatarUrl}
              alt={pr.authorUsername}
              size="xs"
            />
            <span className="font-mono">{pr.authorUsername}</span>
          </span>
          {pr.branchName && (
            <span className="flex items-center gap-1 font-mono truncate max-w-[240px]">
              <GitBranch className="w-3 h-3 shrink-0" />
              <span className="truncate">{pr.branchName}</span>
            </span>
          )}
          <RelativeTime iso={pr.updatedAt} className="font-mono" />
        </div>
      </div>

      <a
        href={pr.url}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="p-1.5 text-subtle hover:text-text opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Open on provider"
      >
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </Link>
  );
}
