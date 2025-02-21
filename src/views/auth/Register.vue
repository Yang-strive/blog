<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { RegisterForm } from '@/types/user'
import { useUserStore } from '@/stores/user'
import { User, Message, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 模拟用户数据
const mockUser = {
  id: 2,
  username: 'test',
  email: 'test@example.com',
  role: 'user' as const,
  createdAt: new Date().toISOString()
}

const registerForm = reactive<RegisterForm>({
  username: 'test', // 默认填充用户名
  email: 'test@example.com', // 默认填充邮箱
  password: 'test123', // 默认填充密码
  confirmPassword: 'test123' // 默认填充确认密码
})

const loading = ref(false)
const formRef = ref()

const validatePass2 = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePass2, trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate()
  
  try {
    loading.value = true
    // 模拟注册请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟注册成功
    const token = 'mock_token_' + Date.now()
    userStore.setToken(token)
    userStore.setUser(mockUser)
    
    ElMessage.success('注册成功')
    router.push('/')
  } catch (error: any) {
    ElMessage.error(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-card">
        <div class="card-header">
          <img src="@/assets/logo.png" alt="Logo" class="logo" />
          <h2>创建账号</h2>
          <p class="subtitle">加入我们的社区</p>
        </div>
        
        <el-form
          ref="formRef"
          :model="registerForm"
          :rules="rules"
          class="register-form"
        >
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="用户名"
              :prefix-icon="User"
            />
          </el-form-item>
          
          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="邮箱"
              :prefix-icon="Message"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="密码"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>
          
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="确认密码"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>
          
          <div class="form-footer">
            <el-button
              type="primary"
              :loading="loading"
              class="submit-btn"
              @click="handleRegister"
            >
              注册
            </el-button>
            
            <p class="login-link">
              已有账号？
              <el-link type="primary" @click="router.push('/auth/login')">
                立即登录
              </el-link>
            </p>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(120deg, #e0f2fe 0%, #93c5fd 100%);
  padding: 20px;
  
  .register-box {
    width: 100%;
    max-width: 420px;
    
    .register-card {
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
      
      .register-form {
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
        
        .login-link {
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
  .register-container {
    padding: 16px;
    
    .register-card {
      padding: 30px 20px;
    }
  }
}
</style> 