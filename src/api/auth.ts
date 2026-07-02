import { api, unwrap, unwrapVoid } from './client';
import type { ApiResponse } from '@/types/api';
import type {
  JwtResponseDTO,
  LoginPayload,
  RegisterPayload,
  UserDTO,
} from '@/types/domain';

export const authApi = {
  register: (payload: RegisterPayload) =>
    unwrap<UserDTO>(api.post<ApiResponse<UserDTO>>('/auth/register', payload)),

  login: (payload: LoginPayload) =>
    unwrap<JwtResponseDTO>(api.post<ApiResponse<JwtResponseDTO>>('/auth/login', payload)),

  me: () => unwrap<UserDTO>(api.get<ApiResponse<UserDTO>>('/auth/me')),

  logout: (refreshToken?: string) =>
    unwrapVoid(api.post('/auth/logout', { refreshToken })),
};
