import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: { 
          title: '首页',
          requiresAuth: true 
        }
      },
      {
        path: 'search',
        name: 'Search',
        component: () => import('@/views/Search.vue'),
        meta: { 
          title: '搜索',
          requiresAuth: true 
        }
      },
      {
        path: 'posts',
        name: 'Posts',
        component: () => import('@/views/posts/PostList.vue'),
        meta: { 
          title: '文章列表',
          requiresAuth: true 
        }
      },
      {
        path: 'posts/:id',
        name: 'PostDetail',
        component: () => import('@/views/posts/PostDetail.vue'),
        meta: { 
          title: '文章详情',
          requiresAuth: true 
        }
      },
      {
        path: 'posts/create',
        name: 'PostCreate',
        component: () => import('@/views/posts/PostEdit.vue'),
        meta: { 
          title: '创建文章',
          requiresAuth: true 
        }
      },
      {
        path: 'posts/edit/:id',
        name: 'PostEdit',
        component: () => import('@/views/posts/PostEdit.vue'),
        meta: { 
          title: '编辑文章',
          requiresAuth: true 
        }
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/Login.vue'),
        meta: { title: '登录' }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/auth/Register.vue'),
        meta: { title: '注册' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const token = userStore.token

  console.log(token)

  // 需要登录的路由
  if (to.meta.requiresAuth && !token) {
    next('/auth/login')
    return
  }

  // 已登录用户不能访问登录/注册页
  if (token && to.path.startsWith('/auth')) {
    next('/')
    return
  }

  next()
})

export default router 