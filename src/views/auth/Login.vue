<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { LoginForm } from '@/types/user'
import { useUserStore } from '@/stores/user'
import { UserFilled, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 模拟用户数据
const mockUser = {
  id: 1,
  username: 'admin',
  email: 'admin@example.com',
  role: 'admin' as const,
  createdAt: new Date().toISOString()
}

const loginForm = reactive<LoginForm>({
  email: 'admin@example.com', // 默认填充邮箱
  password: 'admin123' // 默认填充密码
})

const loading = ref(false)
const formRef = ref()

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  try {
    loading.value = true
    // 模拟登录请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟登录成功
    const token = 'mock_token_' + Date.now()
    userStore.setToken(token)
    userStore.setUser(mockUser)
    
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error: any) {
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-card">
        <div class="card-header">
          <img src="@/assets/logo.png" alt="Logo" class="logo" />
          <h2>欢迎回来</h2>
          <p class="subtitle">登录你的账号继续探索</p>
        </div>
        
        <el-form
          ref="formRef"
          :model="loginForm"
          :rules="rules"
          class="login-form"
        >
          <el-form-item prop="email">
            <el-input
              v-model="loginForm.email"
              placeholder="邮箱"
              :prefix-icon="UserFilled"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>
          
          <div class="form-footer">
            <el-button
              type="primary"
              :loading="loading"
              class="submit-btn"
              @click="handleLogin"
            >
              登录
            </el-button>
            
            <p class="register-link">
              还没有账号？
              <el-link type="primary" @click="router.push('/auth/register')">
                立即注册
              </el-link>
            </p>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(120deg, #e0f2fe 0%, #93c5fd 100%);
  padding: 20px;
  
  .login-box {
    width: 100%;
    max-width: 420px;
    
    .login-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 40px 30px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      
      .card-header {
        text-align: center;
        margin-bottom: 40px;
        
        .logo {
          width: 64px;
          height: 64px;
          margin-bottom: 16px;
        }
        
        h2 {
          font-size: 24px;
          color: #333;
          margin: 0 0 8px;
          font-weight: 600;
        }
        
        .subtitle {
          color: #666;
          font-size: 14px;
          margin: 0;
        }
      }
      
      .login-form {
        :deep(.el-input) {
          --el-input-height: 44px;
          
          .el-input__wrapper {
            border-radius: 8px;
            background-color: #f5f7fa;
            box-shadow: none;
            border: 2px solid transparent;
            transition: all 0.3s ease;
            
            &:hover, &.is-focus {
              border-color: var(--el-color-primary);
              background-color: #fff;
            }
          }
        }
        
        .submit-btn {
          width: 100%;
          height: 44px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          margin-top: 20px;
        }
        
        .register-link {
          text-align: center;
          margin-top: 16px;
          color: #666;
          font-size: 14px;
          
          .el-link {
            font-weight: 500;
            margin-left: 4px;
          }
        }
      }
    }
  }
}

// 响应式适配
@media screen and (max-width: 480px) {
  .login-container {
    padding: 16px;
    
    .login-card {
      padding: 30px 20px;
    }
  }
}
</style> 