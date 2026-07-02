import { api, unwrap } from './client';
import type { ApiResponse } from '@/types/api';
import type { PullRequestDTO } from '@/types/domain';

export const involvedApi = {
  list: () =>
    unwrap<PullRequestDTO[]>(
      api.get<ApiResponse<PullRequestDTO[]>>('/involved-prs/list'),
    ),
};