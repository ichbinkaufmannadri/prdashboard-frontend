import {
  AuditAction,
  AuthMethod,
  ChangeType,
  DiffSide,
  HostType,
  MergeStrategy,
  ProviderType,
  PullRequestStatus,
  ReviewAction,
  ReviewStatus,
  ViewerRole,
} from './enums';

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  activeStatus: boolean;
  createdAt: string;
}

export interface JwtResponseDTO {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresInSeconds: number;
  refreshTokenExpiresInSeconds: number;
  user: UserDTO;
}

export interface ProviderAccountDTO {
  id: string;
  providerType: ProviderType;
  hostType: HostType;
  baseUrl?: string;
  authMethod: AuthMethod;
  accountUsername: string;
  scopes?: string;
  createdAt: string;
}

export interface PullRequestDTO {
  id: string;
  providerType: ProviderType;
  repoFullName: string;
  number: number;
  title: string;
  description?: string;
  branchName?: string;
  targetBranch?: string;
  authorUsername: string;
  authorAvatarUrl?: string;
  status: PullRequestStatus;
  reviewStatus?: ReviewStatus;
  draft: boolean;
  url: string;
  createdAt: string;
  updatedAt: string;
  // Merge metadata (populated when status = MERGED)
  mergedByUsername?: string;
  mergedByAvatarUrl?: string;
  mergedAt?: string;
  mergeStrategyLabel?: string;
  // Viewer context
  viewerRole?: ViewerRole;
}

export interface RepoGroupDTO {
  repoFullName: string;
  repoUrl?: string;
  pullRequests: PullRequestDTO[];
}

export interface ProviderGroupDTO {
  providerType: ProviderType;
  repos: RepoGroupDTO[];
}

export interface DashboardDTO {
  providers: ProviderGroupDTO[];
}

export interface DiffHunkDTO {
  oldStartLine: number;
  oldLineCount: number;
  newStartLine: number;
  newLineCount: number;
  content: string;
}

export interface FileDiffDTO {
  filePath: string;
  previousFilePath?: string;
  changeType: ChangeType;
  additions: number;
  deletions: number;
  hunks: DiffHunkDTO[];
  rawPatch: string;
}

export interface DiffCommentDTO {
  id: string;
  threadId?: string;
  inReplyToId?: string;
  filePath: string;
  lineNumber: number;
  side: DiffSide;
  body: string;
  authorUsername: string;
  authorAvatarUrl?: string;
  createdAt: string;
}

export interface GeneralCommentDTO {
  id: string;
  body: string;
  authorUsername: string;
  authorAvatarUrl?: string;
  createdAt: string;
}

export interface ReviewDTO {
  id: string;
  reviewerUsername: string;
  reviewerAvatarUrl?: string;
  action: ReviewAction;
  body?: string;
  submittedAt?: string;
}

export interface PullRequestDetailDTO {
  pullRequest: PullRequestDTO;
  generalComments: GeneralCommentDTO[];
  reviews: ReviewDTO[];
  supportsRequestChanges: boolean;
  supportedMergeStrategies: MergeStrategy[];
  viewerIsAuthor: boolean;
  // Merge summary
  mergedByUsername?: string;
  mergedByAvatarUrl?: string;
  mergedAt?: string;
  mergeStrategyLabel?: string;
  branchExists?: boolean | null;
}

export interface AuditLogDTO {
  id: string;
  providerType?: ProviderType;
  action: AuditAction;
  repoName?: string;
  pullRequestTitle?: string;
  pullRequestUrl?: string;
  detail?: string;
  createdAt: string;
}

// -------- Request payloads -------- //

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface ConnectProviderPayload {
  providerType: ProviderType;
  hostType: HostType;
  baseUrl?: string;
  authMethod: AuthMethod;
  accessToken: string;
  accountUsername?: string;
}

export interface AddCommentPayload {
  body: string;
}

export interface AddDiffCommentPayload {
  filePath: string;
  lineNumber: number;
  side: DiffSide;
  body: string;
  inReplyToId?: string;
}

export interface SubmitReviewPayload {
  action: ReviewAction;
  body?: string;
}

export interface MergePayload {
  strategy: MergeStrategy;
  commitTitle?: string;
  commitMessage?: string;
}