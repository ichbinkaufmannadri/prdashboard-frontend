import { api, unwrap, unwrapVoid } from './client';
import type { ApiResponse } from '@/types/api';
import type { ProviderType } from '@/types/enums';
import type {
  AddCommentPayload,
  AddDiffCommentPayload,
  DashboardDTO,
  DiffCommentDTO,
  FileDiffDTO,
  MergePayload,
  PullRequestDetailDTO,
  SubmitReviewPayload,
} from '@/types/domain';

/**
 * Derived from ProviderType so we never have to maintain a parallel list.
 * Adding a new provider to enums.ts expands this automatically.
 */
export type DashboardFilter = 'all' | Lowercase<ProviderType>;

export const dashboardApi = {
  get: (provider: DashboardFilter = 'all') =>
    unwrap<DashboardDTO>(
      api.get<ApiResponse<DashboardDTO>>('/dashboard', { params: { provider } }),
    ),
};

export const pullRequestApi = {
  getDetail: (id: string) =>
    unwrap<PullRequestDetailDTO>(
      api.get<ApiResponse<PullRequestDetailDTO>>('/pull-requests/detail', {
        params: { id },
      }),
    ),

  getDiff: (id: string) =>
    unwrap<FileDiffDTO[]>(
      api.get<ApiResponse<FileDiffDTO[]>>('/pull-requests/diff', {
        params: { id },
      }),
    ),

  getDiffComments: (id: string) =>
    unwrap<DiffCommentDTO[]>(
      api.get<ApiResponse<DiffCommentDTO[]>>('/pull-requests/diff-comments', {
        params: { id },
      }),
    ),

  addComment: (id: string, payload: AddCommentPayload) =>
    unwrapVoid(
      api.post('/pull-requests/comments', payload, { params: { id } }),
    ),

  addDiffComment: (id: string, payload: AddDiffCommentPayload) =>
    unwrapVoid(
      api.post('/pull-requests/diff-comments', payload, { params: { id } }),
    ),

  submitReview: (id: string, payload: SubmitReviewPayload) =>
    unwrapVoid(
      api.post('/pull-requests/reviews', payload, { params: { id } }),
    ),

  merge: (id: string, payload: MergePayload) =>
    unwrapVoid(api.post('/pull-requests/merge', payload, { params: { id } })),

  deleteBranch: (id: string, branchName: string) =>
    unwrapVoid(
      api.post('/pull-requests/delete-branch', { branchName }, { params: { id } }),
    ),
};