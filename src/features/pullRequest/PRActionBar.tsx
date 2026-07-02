import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, XCircle, GitMerge, Trash2, GitBranch } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Avatar } from '@/components/ui/Avatar';
import { RelativeTime } from '@/components/RelativeTime';
import { pullRequestApi } from '@/api/dashboard';
import { toast } from '@/components/ui/Toast';
import { ApiError } from '@/types/api';
import type { PullRequestDetailDTO } from '@/types/domain';
import type { MergeStrategy, ReviewAction } from '@/types/enums';

interface PRActionBarProps {
  id: string;
  detail: PullRequestDetailDTO;
}

export function PRActionBar({ id, detail }: PRActionBarProps) {
  const queryClient = useQueryClient();
  const [reviewBody, setReviewBody] = useState('');
  const [mergeStrategy, setMergeStrategy] = useState<MergeStrategy>(
    detail.supportedMergeStrategies[0] ?? 'MERGE',
  );

  const canAct = detail.pullRequest.status === 'OPEN' || detail.pullRequest.status === 'DRAFT';
  const wasMerged = detail.pullRequest.status === 'MERGED';

  const review = useMutation({
    mutationFn: (action: ReviewAction) =>
      pullRequestApi.submitReview(id, { action, body: reviewBody || undefined }),
    onSuccess: () => {
      setReviewBody('');
      queryClient.invalidateQueries({ queryKey: ['pr', id] });
      toast('Review submitted');
    },
    onError: (err: unknown) => {
      toast(err instanceof ApiError ? err.message : 'Review failed', 'error');
    },
  });

  const merge = useMutation({
    mutationFn: () => pullRequestApi.merge(id, { strategy: mergeStrategy }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pr', id] });
      toast('Merged');
    },
    onError: (err: unknown) => {
      toast(err instanceof ApiError ? err.message : 'Merge failed', 'error');
    },
  });

  const deleteBranch = useMutation({
    mutationFn: () => pullRequestApi.deleteBranch(id, detail.pullRequest.branchName ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pr', id] });
      toast('Branch deleted');
    },
    onError: (err: unknown) => {
      toast(err instanceof ApiError ? err.message : 'Delete failed', 'error');
    },
  });

  if (wasMerged) {
    return (
      <MergedSummary
        detail={detail}
        onDeleteBranch={() => deleteBranch.mutate()}
        deleting={deleteBranch.isPending}
      />
    );
  }

  if (!canAct) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted font-mono">
          $ this PR is {detail.pullRequest.status.toLowerCase()} — no actions available
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-sm font-medium text-text">Review &amp; merge</h3>

      <Textarea
        placeholder="Review comment (optional)..."
        value={reviewBody}
        onChange={(e) => setReviewBody(e.target.value)}
        rows={2}
      />

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => review.mutate('APPROVE')}
          loading={review.isPending && review.variables === 'APPROVE'}
          disabled={detail.viewerIsAuthor}
          title={detail.viewerIsAuthor ? "You can't approve your own pull request" : undefined}
          leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-success" />}
        >
          Approve
        </Button>

        {detail.supportsRequestChanges && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => review.mutate('REQUEST_CHANGES')}
            loading={review.isPending && review.variables === 'REQUEST_CHANGES'}
            disabled={detail.viewerIsAuthor}
            title={detail.viewerIsAuthor ? "You can't review your own pull request" : undefined}
            leftIcon={<XCircle className="w-3.5 h-3.5 text-danger" />}
          >
            Request changes
          </Button>
        )}

        <Button
          size="sm"
          variant="secondary"
          onClick={() => review.mutate('COMMENT')}
          loading={review.isPending && review.variables === 'COMMENT'}
          disabled={!reviewBody.trim()}
        >
          Comment only
        </Button>
      </div>

      <div className="pt-3 border-t border-border flex items-end gap-2">
        <div className="flex-1">
          <Select
            label="Merge strategy"
            value={mergeStrategy}
            onChange={(e) => setMergeStrategy(e.target.value as MergeStrategy)}
          >
            {detail.supportedMergeStrategies.map((s) => (
              <option key={s} value={s}>
                {s.toLowerCase()}
              </option>
            ))}
          </Select>
        </div>
        <Button
          onClick={() => merge.mutate()}
          loading={merge.isPending}
          leftIcon={<GitMerge className="w-3.5 h-3.5" />}
        >
          Merge
        </Button>
      </div>

      {!detail.supportsRequestChanges && (
        <p className="font-mono text-2xs text-subtle pt-1">
          note: gitlab has no native "request changes" state — use a comment instead
        </p>
      )}
    </Card>
  );
}

// ---------------------------- Merged summary ---------------------------- //

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-2xs text-subtle uppercase tracking-wider mb-2">
      {children}
    </p>
  );
}

function BranchStatus({ exists }: { exists: boolean | null | undefined }) {
  if (exists === true) {
    return <span className="text-warning font-mono text-2xs">still exists</span>;
  }
  if (exists === false) {
    return <span className="text-subtle font-mono text-2xs">deleted</span>;
  }
  return <span className="text-subtle font-mono text-2xs">status unknown</span>;
}

function MergedSummary({
  detail,
  onDeleteBranch,
  deleting,
}: {
  detail: PullRequestDetailDTO;
  onDeleteBranch: () => void;
  deleting: boolean;
}) {
  const branchName = detail.pullRequest.branchName;
  const isProtected =
    branchName === 'main' ||
    branchName === 'master' ||
    branchName === detail.pullRequest.targetBranch;

  return (
    <Card className="p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-status-merged/15 flex items-center justify-center">
          <GitMerge className="w-3.5 h-3.5 text-status-merged" />
        </div>
        <h3 className="text-sm font-semibold text-text">Merged</h3>
      </div>

      {/* Merged by */}
      <div>
        <SectionLabel>Merged by</SectionLabel>
        {detail.mergedByUsername ? (
          <div className="flex items-center gap-2.5">
            <Avatar
              src={detail.mergedByAvatarUrl}
              alt={detail.mergedByUsername}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm text-text truncate leading-tight">
                {detail.mergedByUsername}
              </p>
              {detail.mergedAt && (
                <p className="font-mono text-2xs text-muted mt-0.5">
                  <RelativeTime iso={detail.mergedAt} />
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-muted text-xs font-mono">unknown</p>
        )}
      </div>

      {/* Strategy */}
      {detail.mergeStrategyLabel && (
        <div>
          <SectionLabel>Strategy</SectionLabel>
          <p className="font-mono text-sm text-text">
            {detail.mergeStrategyLabel}
          </p>
        </div>
      )}

      {/* Source branch */}
      {branchName && (
        <div className="pt-4 border-t border-border">
          <SectionLabel>Source branch</SectionLabel>

          <div className="flex items-center gap-1.5 min-w-0">
            <GitBranch className="w-3.5 h-3.5 text-muted shrink-0" />
            <span className="font-mono text-sm text-text truncate">
              {branchName}
            </span>
          </div>

          <div className="mt-1.5">
            <BranchStatus exists={detail.branchExists} />
          </div>

          {detail.branchExists === true && !isProtected && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                if (window.confirm(`Delete branch "${branchName}"?`)) {
                  onDeleteBranch();
                }
              }}
              loading={deleting}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              className="mt-3 w-full"
            >
              Delete branch
            </Button>
          )}

          {detail.branchExists === true && isProtected && (
            <p className="mt-2 text-2xs font-mono text-subtle">
              protected branch — cannot delete
            </p>
          )}
        </div>
      )}
    </Card>
  );
}