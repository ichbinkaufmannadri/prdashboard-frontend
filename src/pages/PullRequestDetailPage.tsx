import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MessageSquare, FileDiff } from 'lucide-react';
import { pullRequestApi } from '@/api/dashboard';
import { PageSpinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { PRHeader } from '@/features/pullRequest/PRHeader';
import { PRConversation } from '@/features/pullRequest/PRConversation';
import { PRDiffView } from '@/features/pullRequest/PRDiffView';
import { PRActionBar } from '@/features/pullRequest/PRActionBar';
import { cn } from '@/lib/cn';

type Tab = 'conversation' | 'diff';

export function PullRequestDetailPage() {
  const { id: rawId } = useParams<{ id: string }>();
  const id = rawId ? decodeURIComponent(rawId) : '';
  const [tab, setTab] = useState<Tab>('conversation');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['pr', id],
    queryFn: () => pullRequestApi.getDetail(id),
    enabled: !!id,
  });

  if (isLoading) return <PageSpinner />;

  if (isError || !data) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <EmptyState message="couldn't load this pull request." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-text mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to dashboard
      </Link>

      <PRHeader pr={data.pullRequest} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="min-w-0 space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-border">
            <TabButton
              active={tab === 'conversation'}
              onClick={() => setTab('conversation')}
              icon={<MessageSquare className="w-3.5 h-3.5" />}
              label="Conversation"
              count={data.generalComments.length + data.reviews.length}
            />
            <TabButton
              active={tab === 'diff'}
              onClick={() => setTab('diff')}
              icon={<FileDiff className="w-3.5 h-3.5" />}
              label="Diff"
            />
          </div>

          {tab === 'conversation' ? (
            <PRConversation
              id={id}
              comments={data.generalComments}
              reviews={data.reviews}
            />
          ) : (
            <PRDiffView id={id} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <PRActionBar id={id} detail={data} />
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 h-9 text-sm border-b-2 transition-colors -mb-px',
        active
          ? 'border-accent text-text'
          : 'border-transparent text-muted hover:text-text',
      )}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="font-mono text-2xs text-subtle">{count}</span>
      )}
    </button>
  );
}
