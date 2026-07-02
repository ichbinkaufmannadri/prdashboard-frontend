import { api, unwrap } from './client';
import type { ApiResponse, PagedResponse } from '@/types/api';
import type { AuditLogDTO } from '@/types/domain';

export const historyApi = {
  list: (page = 0, size = 50) =>
    unwrap<PagedResponse<AuditLogDTO>>(
      api.get<ApiResponse<PagedResponse<AuditLogDTO>>>('/audit-logs/list', {
        params: { page, size },
      }),
    ),
};