import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { providersApi } from '@/api/providers';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageSpinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { ProviderIcon } from '@/components/ProviderIcon';
import { RelativeTime } from '@/components/RelativeTime';
import { ConnectProviderModal } from '@/features/dashboard/ConnectProviderModal';
import { toast } from '@/components/ui/Toast';
import { ApiError } from '@/types/api';
import type { ProviderAccountDTO } from '@/types/domain';

export function ProvidersPage() {
  const [connectOpen, setConnectOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['providers'],
    queryFn: providersApi.list,
  });

  const disconnect = useMutation({
    mutationFn: providersApi.disconnect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast('Provider disconnected');
    },
    onError: (err: unknown) => {
      toast(err instanceof ApiError ? err.message : 'Failed to disconnect', 'error');
    },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="font-mono text-xs text-subtle mb-1">
            <span className="text-accent">~</span> / providers
          </p>
          <h1 className="text-xl font-semibold text-text">Connected accounts</h1>
          <p className="mt-1 text-sm text-muted">
            Each token is verified against the provider on connect, then encrypted at rest.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setConnectOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Connect
        </Button>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : !data || data.length === 0 ? (
        <EmptyState
          message="no providers connected yet."
          action={
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setConnectOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Connect a provider
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {data.map((account) => (
            <Card key={account.id} className="p-4 flex items-center gap-4">
              <ProviderIcon provider={account.providerType} className="w-5 h-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-text truncate">
                    {account.accountUsername}
                  </span>
                  <Badge tone="muted" mono>
                    {account.hostType === 'CLOUD' ? 'cloud' : 'self-hosted'}
                  </Badge>
                  <Badge tone="muted" mono>
                    {account.authMethod.toLowerCase()}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-subtle font-mono truncate">
                  {displayHost(account)} · connected <RelativeTime iso={account.createdAt} />
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (window.confirm('Disconnect this account?')) {
                    disconnect.mutate(account.id);
                  }
                }}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Disconnect
              </Button>
            </Card>
          ))}
        </div>
      )}

      <ConnectProviderModal
        open={connectOpen}
        onClose={() => setConnectOpen(false)}
      />
    </div>
  );
}

function displayHost(account: ProviderAccountDTO): string {
  if (account.baseUrl) return account.baseUrl;
  switch (account.providerType) {
    case 'GITHUB': return 'github.com';
    case 'GITLAB': return 'gitlab.com';
    case 'AZURE': return 'dev.azure.com';
  }
}