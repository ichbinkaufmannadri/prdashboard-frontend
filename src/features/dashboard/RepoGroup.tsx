import { ExternalLink } from 'lucide-react';
import { PRCard } from './PRCard';
import type { RepoGroupDTO } from '@/types/domain';

interface RepoGroupProps {
  group: RepoGroupDTO;
}

export function RepoGroup({ group }: RepoGroupProps) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-elevated border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-[13px] text-text truncate">
            {group.repoFullName}
          </span>
          <span className="text-2xs text-subtle font-mono shrink-0">
            {group.pullRequests.length} open
          </span>
        </div>
        {group.repoUrl && (
          <a
            href={group.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-subtle hover:text-text transition-colors"
            aria-label="Open repo"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
      <div>
        {group.pullRequests.map((pr) => (
          <PRCard key={pr.id} pr={pr} />
        ))}
      </div>
    </div>
  );
}
