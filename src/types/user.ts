export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  role: 'user' | 'admin'
  createdAt: string
}

export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm extends LoginForm {
  username: string
  confirmPassword: string
} 