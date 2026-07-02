import { GitPullRequest, GitPullRequestDraft, GitMerge, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { PullRequestStatus } from '@/types/enums';

interface StatusBadgeProps {
  status: PullRequestStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'OPEN':
      return (
        <Badge tone="success" icon={<GitPullRequest className="w-3 h-3" />}>
          open
        </Badge>
      );
    case 'DRAFT':
      return (
        <Badge tone="muted" icon={<GitPullRequestDraft className="w-3 h-3" />}>
          draft
        </Badge>
      );
    case 'MERGED':
      return (
        <Badge tone="purple" icon={<GitMerge className="w-3 h-3" />}>
          merged
        </Badge>
      );
    case 'CLOSED':
      return (
        <Badge tone="danger" icon={<XCircle className="w-3 h-3" />}>
          closed
        </Badge>
      );
  }
}
