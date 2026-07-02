import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, XCircle, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { RelativeTime } from '@/components/RelativeTime';
import { pullRequestApi } from '@/api/dashboard';
import { toast } from '@/components/ui/Toast';
import { ApiError } from '@/types/api';
import type { GeneralCommentDTO, ReviewDTO } from '@/types/domain';

interface ConversationItem {
  kind: 'comment' | 'review';
  time: string | undefined;
  data: GeneralCommentDTO | ReviewDTO;
}

interface PRConversationProps {
  id: string;
  comments: GeneralCommentDTO[];
  reviews: ReviewDTO[];
}

export function PRConversation({ id, comments, reviews }: PRConversationProps) {
  const [body, setBody] = useState('');
  const queryClient = useQueryClient();

  const addComment = useMutation({
    mutationFn: (payload: { body: string }) => pullRequestApi.addComment(id, payload),
    onSuccess: () => {
      setBody('');
      queryClient.invalidateQueries({ queryKey: ['pr', id] });
      toast('Comment posted');
    },
    onError: (err: unknown) => {
      toast(err instanceof ApiError ? err.message : 'Failed to post', 'error');
    },
  });

  const items: ConversationItem[] = [
    ...comments.map((c): ConversationItem => ({ kind: 'comment', time: c.createdAt, data: c })),
    ...reviews.map((r): ConversationItem => ({ kind: 'review', time: r.submittedAt, data: r })),
  ].sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-muted" />
        <h2 className="text-sm font-medium text-text">Conversation</h2>
        <span className="font-mono text-2xs text-subtle">
          {comments.length} comments · {reviews.length} reviews
        </span>
      </div>

      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) =>
            item.kind === 'comment' ? (
              <CommentBlock key={`c-${item.data.id}`} comment={item.data as GeneralCommentDTO} />
            ) : (
              <ReviewBlock key={`r-${item.data.id}`} review={item.data as ReviewDTO} />
            ),
          )}
        </div>
      )}

      <Card className="p-4">
        <Textarea
          placeholder="Leave a comment..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
        />
        <div className="mt-3 flex justify-end">
          <Button
            size="sm"
            onClick={() => addComment.mutate({ body })}
            loading={addComment.isPending}
            disabled={!body.trim()}
          >
            Comment
          </Button>
        </div>
      </Card>
    </div>
  );
}

function CommentBlock({ comment }: { comment: GeneralCommentDTO }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Avatar
          src={comment.authorAvatarUrl}
          alt={comment.authorUsername}
          size="sm"
        />
        <span className="font-mono text-[13px] text-text">{comment.authorUsername}</span>
        <span className="font-mono text-2xs text-subtle">
          <RelativeTime iso={comment.createdAt} />
        </span>
      </div>
      <div className="whitespace-pre-wrap text-sm text-text leading-relaxed">
        {comment.body}
      </div>
    </Card>
  );
}

function ReviewBlock({ review }: { review: ReviewDTO }) {
  const isApprove = review.action === 'APPROVE';
  const isRequest = review.action === 'REQUEST_CHANGES';

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Avatar
          src={review.reviewerAvatarUrl}
          alt={review.reviewerUsername}
          size="sm"
        />
        <span className="font-mono text-[13px] text-text">{review.reviewerUsername}</span>
        {isApprove && (
          <Badge tone="success" icon={<CheckCircle2 className="w-3 h-3" />}>
            approved
          </Badge>
        )}
        {isRequest && (
          <Badge tone="danger" icon={<XCircle className="w-3 h-3" />}>
            changes requested
          </Badge>
        )}
        {review.submittedAt && (
          <span className="font-mono text-2xs text-subtle">
            <RelativeTime iso={review.submittedAt} />
          </span>
        )}
      </div>
      {review.body && (
        <div className="whitespace-pre-wrap text-sm text-text leading-relaxed">
          {review.body}
        </div>
      )}
    </Card>
  );
}
