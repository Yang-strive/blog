import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // 从 localStorage 初始化状态
  const token = ref<string | null>(localStorage.getItem('token'))
  const currentUser = ref<User | null>(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (e) {
        localStorage.removeItem('user')
        return null
      }
    }
    return null
  })

  const setUser = (user: User) => {
    currentUser.value = user
    localStorage.setItem('user', JSON.stringify(user))
  }

  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const logout = () => {
    currentUser.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    currentUser,
    token,
    setUser,
    setToken,
    logout
  }
}) 