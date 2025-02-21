<template>
  <div class="default-layout">
    <!-- PC端顶部导航 -->
    <header class="header-pc">
      <div class="header-content">
        <!-- 左侧 Logo -->
        <div class="logo">
          <img src="@/assets/logo.png" alt="Logo" />
          <span class="logo-text">博客系统</span>
        </div>

        <!-- 导航菜单 -->
        <el-menu
          mode="horizontal"
          :router="true"
          class="nav-menu"
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/posts">文章</el-menu-item>
          <el-menu-item index="/categories">分类</el-menu-item>
          <el-menu-item index="/tags">标签</el-menu-item>
        </el-menu>

        <!-- 搜索框 -->
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文章..."
            class="search-input"
            :prefix-icon="Search"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button @click="handleSearch">
                搜索
              </el-button>
            </template>
          </el-input>
        </div>

        <!-- 右侧用户信息 -->
        <div class="user-section">
          <el-dropdown trigger="click">
            <div class="user-info">
              <el-avatar :size="32" :src="userStore.currentUser?.avatar">
                {{ userStore.currentUser?.username?.charAt(0).toUpperCase() }}
              </el-avatar>
              <span class="username">{{ userStore.currentUser?.username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/profile')">
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item @click="router.push('/posts/create')">
                  <el-icon><EditPen /></el-icon>写文章
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>

    <!-- 移动端顶部导航 -->
    <header class="header-mobile">
      <div class="header-content">
        <el-button class="menu-btn" @click="drawerVisible = true">
          <el-icon><Menu /></el-icon>
        </el-button>
        <div class="logo">
          <img src="@/assets/logo.png" alt="Logo" />
          <span class="logo-text">博客系统</span>
        </div>
        <el-button 
          class="search-btn" 
          @click="router.push('/search')"
        >
          <el-icon><Search /></el-icon>
        </el-button>
      </div>
    </header>

    <!-- 移动端侧边栏 -->
    <el-drawer
      v-model="drawerVisible"
      direction="ltr"
      size="80%"
      :with-header="false"
    >
      <div class="drawer-content">
        <div class="drawer-header">
          <el-avatar :size="64" :src="userStore.currentUser?.avatar">
            {{ userStore.currentUser?.username?.charAt(0).toUpperCase() }}
          </el-avatar>
          <h3>{{ userStore.currentUser?.username }}</h3>
        </div>

        <el-menu
          :router="true"
          @select="drawerVisible = false"
        >
          <el-menu-item index="/">
            <el-icon><House /></el-icon>首页
          </el-menu-item>
          <el-menu-item index="/posts">
            <el-icon><Document /></el-icon>文章
          </el-menu-item>
          <el-menu-item index="/categories">
            <el-icon><Files /></el-icon>分类
          </el-menu-item>
          <el-menu-item index="/tags">
            <el-icon><Collection /></el-icon>标签
          </el-menu-item>
          <el-menu-item index="/profile">
            <el-icon><User /></el-icon>个人中心
          </el-menu-item>
          <el-menu-item index="/posts/create">
            <el-icon><EditPen /></el-icon>写文章
          </el-menu-item>
        </el-menu>

        <div class="drawer-footer">
          <el-button type="danger" @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>退出登录
          </el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 移动端底部导航 -->
    <nav class="nav-mobile">
      <el-menu
        mode="horizontal"
        :router="true"
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/posts">
          <el-icon><Document /></el-icon>
          <span>文章</span>
        </el-menu-item>
        <el-menu-item index="/posts/create">
          <el-icon><EditPen /></el-icon>
          <span>写作</span>
        </el-menu-item>
        <el-menu-item index="/profile">
          <el-icon><User /></el-icon>
          <span>我的</span>
        </el-menu-item>
      </el-menu>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import {
  House,
  Document,
  Files,
  Collection,
  User,
  EditPen,
  SwitchButton,
  Menu,
  Search
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const drawerVisible = ref(false)
const searchKeyword = ref('')

const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  // 跳转到搜索结果页面
  router.push({
    path: '/search',
    query: { keyword: searchKeyword.value.trim() }
  })
}

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('退出成功')
  router.push('/auth/login')
}
</script>

<style lang="scss" scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  // PC端顶部导航
  .header-pc {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    z-index: 100;

    @media screen and (min-width: 768px) {
      display: block;
    }

    .header-content {
      display: flex;
      align-items: center;
      max-width: 1440px;
      margin: 0 auto;
      height: 100%;
      padding: 0 16px;
      gap: 24px;

      .logo {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 120px;

        img {
          height: 32px;
          width: 32px;
        }

        .logo-text {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }
      }

      .nav-menu {
        border: none;
        flex: 0 0 auto;
        margin-right: 20px;

        :deep(.el-menu-item) {
          font-size: 14px;
          padding: 0 16px;
        }
      }

      .search-box {
        flex: 0 0 300px;
        margin: 0 20px;

        .search-input {
          :deep(.el-input__wrapper) {
            border-radius: 20px 0 0 20px;
            background-color: #f5f7fa;
            box-shadow: none !important;
            border: 1px solid #e4e7ed;
            border-right: none;
            padding-left: 20px;
          }

          :deep(.el-input-group__append) {
            background-color: #8dd0f6;
            border-left: none;
            border-radius: 0 20px 20px 0;
            padding: 8px, 20px;

            .el-button {
              border: none;
              height: 100%;
              padding: 8px 20px;
              border-radius: 0 20px 20px 0;
              color: #fff;
              font-size: 14px;

              &:hover {
                background-color: #89cbf1;
              }
            }
          }
        }
      }

      .user-section {
        margin-left: auto;
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;

          &:hover {
            background-color: #f5f7fa;
          }

          .username {
            font-size: 14px;
            color: #333;
          }
        }
      }
    }
  }

  // 移动端顶部导航
  .header-mobile {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    z-index: 100;

    @media screen and (min-width: 768px) {
      display: none;
    }

    .header-content {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;

      .menu-btn,
      .search-btn {
        padding: 8px;
        border: none;
        background: none;
        color: #606266;
        
        &:hover {
          color: var(--el-color-primary);
        }

        .el-icon {
          font-size: 20px;
        }
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 8px;

        img {
          height: 24px;
          width: 24px;
        }

        .logo-text {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
      }
    }
  }

  // 移动端侧边栏
  .drawer-content {
    height: 100%;
    display: flex;
    flex-direction: column;

    .drawer-header {
      padding: 24px;
      text-align: center;
      border-bottom: 1px solid #eee;

      h3 {
        margin: 12px 0 0;
        color: #333;
      }
    }

    .drawer-footer {
      margin-top: auto;
      padding: 16px;
      border-top: 1px solid #eee;

      .el-button {
        width: 100%;
      }
    }
  }

  // 主要内容区域
  .main-content {
    flex: 1;
    margin-top: 60px;
    
    @media screen and (max-width: 768px) {
      margin-top: 50px;
      margin-bottom: 50px;
    }
  }

  // 移动端底部导航
  .nav-mobile {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
    display: none;

    @media screen and (max-width: 768px) {
      display: block;
    }

    :deep(.el-menu) {
      --el-menu-hover-bg-color: transparent;
      border: none;
      justify-content: space-around;

      .el-menu-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px 0;
        height: auto;
        line-height: 1.5;

        .el-icon {
          margin: 0;
          font-size: 20px;
        }

        span {
          font-size: 12px;
          margin-top: 4px;
        }
      }
    }
  }
}

// 响应式调整
@media screen and (max-width: 1200px) {
  .header-pc {
    .header-content {
      .search-box {
        flex: 0 0 240px;
      }
    }
  }
}

@media screen and (max-width: 992px) {
  .header-pc {
    .header-content {
      .nav-menu {
        :deep(.el-menu-item) {
          padding: 0 12px;
        }
      }

      .search-box {
        flex: 0 0 200px;
      }
    }
  }
}
</style> 