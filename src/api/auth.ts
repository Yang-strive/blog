import request from '@/utils/request'
import type { LoginForm, RegisterForm, User } from '@/types/user'

export const login = (data: LoginForm) => {
  return request.post<{token: string; user: User}>('/auth/login', data)
}

export const register = (data: RegisterForm) => {
  return request.post<{token: string; user: User}>('/auth/register', data)
}

export const getUserInfo = () => {
  return request.get<User>('/auth/me')
} 