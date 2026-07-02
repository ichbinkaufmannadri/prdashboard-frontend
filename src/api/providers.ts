import { api, unwrap, unwrapVoid } from './client';
import type { ApiResponse } from '@/types/api';
import type { ConnectProviderPayload, ProviderAccountDTO } from '@/types/domain';

export const providersApi = {
  list: () =>
    unwrap<ProviderAccountDTO[]>(
      api.get<ApiResponse<ProviderAccountDTO[]>>('/providers/list'),
    ),

  connect: (payload: ConnectProviderPayload) =>
    unwrap<ProviderAccountDTO>(
      api.post<ApiResponse<ProviderAccountDTO>>('/providers/connect', payload),
    ),

  disconnect: (id: string) => unwrapVoid(api.delete(`/providers/disconnect/${id}`)),
};
