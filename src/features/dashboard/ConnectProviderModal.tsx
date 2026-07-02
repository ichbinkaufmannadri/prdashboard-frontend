import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { providersApi } from '@/api/providers';
import { ApiError } from '@/types/api';
import { toast } from '@/components/ui/Toast';
import type { HostType, ProviderType } from '@/types/enums';

interface ConnectProviderModalProps {
  open: boolean;
  onClose: () => void;
}

// Azure always needs baseUrl (org URL is part of the API endpoint), regardless of host.
const requiresBaseUrl = (providerType: ProviderType, hostType: HostType) =>
  providerType === 'AZURE' || hostType === 'SELF_HOSTED';

export function ConnectProviderModal({ open, onClose }: ConnectProviderModalProps) {
  const queryClient = useQueryClient();
  const [providerType, setProviderType] = useState<ProviderType>('GITHUB');
  const [hostType, setHostType] = useState<HostType>('CLOUD');
  const [baseUrl, setBaseUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [error, setError] = useState<string | null>(null);

  const showBaseUrl = requiresBaseUrl(providerType, hostType);

  const mutation = useMutation({
    mutationFn: providersApi.connect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast('Provider connected');
      onClose();
      setAccessToken('');
      setBaseUrl('');
    },
    onError: (err: unknown) => {
      setError(err instanceof ApiError ? err.message : 'Failed to connect');
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate({
      providerType,
      hostType,
      baseUrl: showBaseUrl ? baseUrl : undefined,
      authMethod: 'PAT',
      accessToken,
    });
  };

  const config = getProviderConfig(providerType, hostType, baseUrl);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Connect a provider"
      description="Paste a personal access token — we'll verify it and store it encrypted."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Provider"
            value={providerType}
            onChange={(e) => setProviderType(e.target.value as ProviderType)}
          >
            <option value="GITHUB">GitHub</option>
            <option value="GITLAB">GitLab</option>
            <option value="AZURE">Azure DevOps</option>
          </Select>
          <Select
            label="Host"
            value={hostType}
            onChange={(e) => setHostType(e.target.value as HostType)}
          >
            <option value="CLOUD">Cloud</option>
            <option value="SELF_HOSTED">Self-hosted</option>
          </Select>
        </div>

        {showBaseUrl && (
          <Input
            label={config.baseUrlLabel}
            placeholder={config.baseUrlPlaceholder}
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            mono
            required
          />
        )}

        <div>
          <Input
            label="Access token"
            type="password"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder={config.tokenPlaceholder}
            mono
            required
          />
          <p className="mt-1.5 text-xs text-subtle">
            {config.tokenHint}{' '}
            <a
              href={config.tokenLink}
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:text-accent-hover"
            >
              Generate one →
            </a>
          </p>
        </div>

        {error && (
          <p className="text-sm text-danger font-mono text-[13px]">! {error}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            Connect
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ---------------------------- Provider-specific copy ---------------------------- //

interface ProviderConfig {
  baseUrlLabel: string;
  baseUrlPlaceholder: string;
  tokenPlaceholder: string;
  tokenHint: string;
  tokenLink: string;
}

function getProviderConfig(
  providerType: ProviderType,
  hostType: HostType,
  baseUrl: string,
): ProviderConfig {
  const host = baseUrl || 'https://your-host';

  switch (providerType) {
    case 'GITHUB':
      return {
        baseUrlLabel: 'Instance URL',
        baseUrlPlaceholder: 'https://github.company.com',
        tokenPlaceholder: 'ghp_...',
        tokenHint: 'GitHub PAT. Needs repo + pull_requests scopes.',
        tokenLink:
          hostType === 'CLOUD'
            ? 'https://github.com/settings/tokens'
            : `${host}/settings/tokens`,
      };

    case 'GITLAB':
      return {
        baseUrlLabel: 'Instance URL',
        baseUrlPlaceholder: 'https://gitlab.company.com',
        tokenPlaceholder: 'glpat-...',
        tokenHint: 'GitLab PAT. Needs the api scope.',
        tokenLink:
          hostType === 'CLOUD'
            ? 'https://gitlab.com/-/user_settings/personal_access_tokens'
            : `${host}/-/user_settings/personal_access_tokens`,
      };

    case 'AZURE':
      return {
        baseUrlLabel: hostType === 'CLOUD' ? 'Organization URL' : 'Collection URL',
        baseUrlPlaceholder:
          hostType === 'CLOUD'
            ? 'https://dev.azure.com/your-org'
            : 'https://azure.company.com/DefaultCollection',
        tokenPlaceholder: 'PAT token',
        tokenHint:
          'Azure DevOps PAT. Needs Code (Read & Write) and Pull Request Threads (Read & Write) scopes.',
        tokenLink: baseUrl
          ? `${baseUrl}/_usersSettings/tokens`
          : 'https://aex.dev.azure.com',
      };
  }
}