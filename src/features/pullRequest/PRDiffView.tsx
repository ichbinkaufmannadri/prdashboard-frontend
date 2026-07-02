import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Diff, Hunk, parseDiff, type ViewType } from 'react-diff-view';
import { ChevronRight, ChevronDown, FileCode2, Plus, Minus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageSpinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { pullRequestApi } from '@/api/dashboard';
import { cn } from '@/lib/cn';
import type { FileDiffDTO } from '@/types/domain';
import './pr-diff-view.css';

interface PRDiffViewProps {
  id: string;
}

export function PRDiffView({ id }: PRDiffViewProps) {
  const [viewType, setViewType] = useState<ViewType>('unified');

  const { data, isLoading } = useQuery({
    queryKey: ['pr', id, 'diff'],
    queryFn: () => pullRequestApi.getDiff(id),
  });

  if (isLoading) return <PageSpinner />;
  if (!data || data.length === 0) {
    return <EmptyState message="no diff to show." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-text">
          Changes{' '}
          <span className="font-mono text-2xs text-subtle ml-1">
            {data.length} {data.length === 1 ? 'file' : 'files'}
          </span>
        </h2>
        <div className="flex items-center gap-1 p-0.5 bg-surface border border-border rounded-md">
          {(['unified', 'split'] as ViewType[]).map((v) => (
            <button
              key={v}
              onClick={() => setViewType(v)}
              className={cn(
                'px-2.5 h-6 font-mono text-2xs rounded transition-colors',
                viewType === v
                  ? 'bg-elevated text-text'
                  : 'text-muted hover:text-text',
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {data.map((file) => (
          <FileBlock key={file.filePath} file={file} viewType={viewType} />
        ))}
      </div>
    </div>
  );
}

function FileBlock({ file, viewType }: { file: FileDiffDTO; viewType: ViewType }) {
  const [expanded, setExpanded] = useState(true);

  // Wrap the raw patch in a minimal git diff header so react-diff-view can parse it
  const files = useMemo(() => {
    if (!file.rawPatch) return [];
    const oldPath = file.previousFilePath ?? file.filePath;
    const newPath = file.filePath;
    const header = `diff --git a/${oldPath} b/${newPath}\n--- a/${oldPath}\n+++ b/${newPath}\n`;
    try {
      return parseDiff(header + file.rawPatch);
    } catch {
      return [];
    }
  }, [file.rawPatch, file.filePath, file.previousFilePath]);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2.5 bg-elevated hover:bg-elevated/80 border-b border-border transition-colors text-left"
      >
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-muted shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-muted shrink-0" />
        )}
        <FileCode2 className="w-3.5 h-3.5 text-muted shrink-0" />
        <span className="font-mono text-[13px] text-text truncate flex-1">
          {file.filePath}
        </span>
        {file.changeType !== 'MODIFIED' && (
          <span className="font-mono text-2xs text-subtle uppercase">
            {file.changeType.toLowerCase()}
          </span>
        )}
        <span className="flex items-center gap-2 font-mono text-2xs shrink-0">
          <span className="text-success flex items-center">
            <Plus className="w-2.5 h-2.5" />
            {file.additions}
          </span>
          <span className="text-danger flex items-center">
            <Minus className="w-2.5 h-2.5" />
            {file.deletions}
          </span>
        </span>
      </button>

      {expanded && files.length > 0 && (
        <div className="pr-diff-view overflow-x-auto">
          {files.map((f, i) => (
            <Diff key={i} viewType={viewType} diffType={f.type} hunks={f.hunks}>
              {(hunks) => hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)}
            </Diff>
          ))}
        </div>
      )}
      {expanded && files.length === 0 && (
        <p className="p-4 text-sm text-subtle font-mono">no patch content available</p>
      )}
    </Card>
  );
}