import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { ReviewStatus } from '@/types/enums';

interface ReviewStatusBadgeProps {
  status?: ReviewStatus;
}

export function ReviewStatusBadge({ status }: ReviewStatusBadgeProps) {
  if (!status) return null;
  switch (status) {
    case 'APPROVED':
      return (
        <Badge tone="success" icon={<CheckCircle2 className="w-3 h-3" />}>
          approved
        </Badge>
      );
    case 'CHANGES_REQUESTED':
      return (
        <Badge tone="danger" icon={<XCircle className="w-3 h-3" />}>
          changes requested
        </Badge>
      );
    case 'REVIEW_REQUIRED':
      return (
        <Badge tone="muted" icon={<Clock className="w-3 h-3" />}>
          review required
        </Badge>
      );
  }
}