export type ProviderType = 'GITHUB' | 'GITLAB' | 'AZURE';

export const ALL_PROVIDER_TYPES: readonly ProviderType[] = ['GITHUB', 'GITLAB', 'AZURE'] as const;

export type HostType = 'CLOUD' | 'SELF_HOSTED';
export type AuthMethod = 'OAUTH' | 'PAT';
export type PullRequestStatus = 'OPEN' | 'DRAFT' | 'MERGED' | 'CLOSED';
export type ReviewAction = 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT';
export type MergeStrategy = 'MERGE' | 'SQUASH' | 'REBASE';
export type DiffSide = 'OLD' | 'NEW';
export type ChangeType = 'ADDED' | 'MODIFIED' | 'DELETED' | 'RENAMED';
export type AuditAction = 'COMMENT' | 'DIFF_COMMENT' | 'APPROVE' | 'REQUEST_CHANGES' | 'MERGE' | 'DELETE_BRANCH';
export type ReviewStatus = 'APPROVED' | 'CHANGES_REQUESTED' | 'REVIEW_REQUIRED';
export type ViewerRole = 'AUTHOR' | 'REVIEWER' | 'ASSIGNEE' | 'NONE';