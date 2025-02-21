<template>
  <div class="home-page">
    <!-- 顶部轮播图 -->
    <div class="banner-section">
      <el-carousel :height="isMobile ? '180px' : '300px'" :interval="5000">
        <el-carousel-item v-for="item in bannerList" :key="item.id">
          <div class="banner-item" :style="{ backgroundImage: `url(${item.image})` }">
            <div class="banner-content">
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧内容区 -->
      <div class="content-left">
        <!-- 热门话题 -->
        <div class="hot-topics section-card">
          <div class="section-header">
            <h2>热门话题圈</h2>
            <el-link :underline="false" @click="router.push('/topics')">
              更多<el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-link>
          </div>
          <div class="topic-list">
            <div v-for="topic in hotTopics" :key="topic.id" class="topic-item">
              <!-- 圈子信息 -->
              <div class="circle-header">
                <div class="circle-info">
                  <el-avatar :size="36" :src="topic.avatar" class="circle-avatar">
                    {{ topic.name.charAt(0) }}
                  </el-avatar>
                  <span class="circle-name">{{ topic.name }}</span>
                </div>
                <el-tag 
                  :type="topic.isJoined ? 'success' : 'info'"
                  class="follow-status"
                  effect="plain"
                >
                  {{ topic.isJoined ? '已加入' : '加入' }}
                </el-tag>
              </div>

              <!-- 话题内容 -->
              <div class="topic-content">
                <!-- 话题标题 -->
                <h4 class="topic-title">{{ topic.post.title }}</h4>

                <!-- 话题正文 -->
                <p class="topic-text" :class="{ 'mobile': isMobile }">
                  {{ topic.post.content }}
                </p>

                <!-- 图片展示 -->
                <div v-if="topic.post.images?.length" class="topic-images">
                  <el-image 
                    v-for="(img, index) in topic.post.images.slice(0, 3)"
                    :key="index"
                    :src="img"
                    fit="cover"
                    class="topic-image"
                    @click="previewImage(topic.post.images, index)"
                  />
                </div>

                <!-- 底部信息栏 -->
                <div class="post-footer">
                  <!-- 作者信息 -->
                  <div class="author-info">
                    <el-avatar :size="24" :src="topic.post.authorAvatar">
                      {{ topic.post.author.charAt(0) }}
                    </el-avatar>
                    <span class="author-name">{{ topic.post.author }}</span>
                    <span class="info-divider">·</span>
                    <span class="post-time">{{ topic.post.time }}</span>
                    <span class="info-divider">·</span>
                    <span class="topic-heat" :class="getHeatClass(topic.post.heat)">
                      <el-icon><Histogram /></el-icon>
                      热度 {{ topic.post.heat }}
                    </span>
                  </div>

                  <!-- 交互按钮 -->
                  <div class="interaction-stats">
                    <span class="likes">
                      <el-icon><Opportunity /></el-icon>
                      {{ topic.post.likes }}
                    </span>
                    <span class="comments">
                      <el-icon><ChatDotRound /></el-icon>
                      {{ topic.post.comments }}
                    </span>
                    <span class="favorites">
                      <el-icon><Star /></el-icon>
                      {{ topic.post.favorites || 0 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 推荐文章 -->
        <div class="recommended-posts section-card">
          <div class="section-header">
            <h2>推荐文章</h2>
            <el-link :underline="false" @click="router.push('/posts')">
              更多<el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-link>
          </div>
          <div class="post-list">
            <div v-for="post in recommendedPosts" :key="post.id" class="post-item" @click="goToDetail(post.id)">
              <div class="post-info">
                <h3 class="title">{{ post.title }}</h3>
                <p class="summary">{{ post.summary }}</p>
                <div class="meta">
                  <span class="author">
                    <el-avatar :size="20" :src="post.authorAvatar">
                      {{ post.author.charAt(0) }}
                    </el-avatar>
                    {{ post.author }}
                  </span>
                  <span class="date">{{ post.date }}</span>
                  <span class="views">
                    <el-icon><View /></el-icon>
                    {{ post.views }}
                  </span>
                </div>
              </div>
              <div class="post-cover">
                <el-image :src="post.cover" fit="cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧边栏 -->
      <div class="sidebar">
        <!-- 推荐作者 -->
        <div class="recommended-authors panel">
          <div class="panel-header">
            <h3>作者推荐</h3>
          </div>
          <div class="panel-content">
            <div v-for="author in recommendedAuthors" :key="author.id" class="author-item">
              <el-avatar :size="40" :src="author.avatar" class="author-avatar">
                {{ author.name.charAt(0) }}
              </el-avatar>
              <div class="author-info">
                <div class="info-header">
                  <span class="name">{{ author.name }}</span>
                  <el-button class="follow-btn" size="small" text>
                    {{ author.isFollowing ? '已关注' : '关注' }}
                  </el-button>
                </div>
                <span class="description">{{ author.description }}</span>
                <div class="badges" v-if="author.badges?.length">
                  <el-tag 
                    v-for="(badge, index) in author.badges" 
                    :key="index"
                    size="small"
                    :type="badge.type"
                    class="badge-item"
                  >
                    {{ badge.text }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 热门标签 -->
        <div class="hot-tags panel">
          <div class="panel-header">
            <h3>热门标签</h3>
          </div>
          <div class="panel-content">
            <el-tag
              v-for="tag in hotTags"
              :key="tag.id"
              :type="tag.type as 'success' | 'warning' | 'danger' | 'info'"
              class="tag-item"
              @click="handleTagClick(tag)"
            >
              {{ tag.name }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  View, 
  ArrowRight, 
  Histogram, 
  ChatDotRound,
  User,
  Document,
  ArrowUp,
  ArrowDown,
  CaretTop,
  Star,
  Opportunity
} from '@element-plus/icons-vue'
import { ElImageViewer } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const activeCategory = ref('recommended')

// 模拟数据
const bannerList = ref([
  {
    id: 1,
    title: '探索 Vue3 新特性',
    description: '深入了解 Vue3 的 Composition API、响应式系统等新特性',
    image: 'https://picsum.photos/1200/300'
  },
  {
    id: 2,
    title: 'TypeScript 实战指南',
    description: '使用 TypeScript 提升代码质量和开发效率',
    image: 'https://picsum.photos/1200/300'
  }
])

// 添加图片展示相关的状态
const imageStartIndexMap = ref<Record<number, number>>({})

// 获取要显示的图片
const displayImages = (images: string[]) => {
  const topicId = Number(Object.keys(imageStartIndexMap.value)[0])
  const startIndex = imageStartIndexMap.value[topicId] || 0
  return images.slice(startIndex, startIndex + 3)
}

// 上一组图片
const prevImages = (topicId: number) => {
  const currentStart = imageStartIndexMap.value[topicId] || 0
  if (currentStart > 0) {
    imageStartIndexMap.value[topicId] = currentStart - 3
  }
}

// 下一组图片
const nextImages = (topicId: number) => {
  const topic = hotTopics.value.find(t => t.id === topicId)
  if (!topic) return
  
  const currentStart = imageStartIndexMap.value[topicId] || 0
  if (currentStart + 3 < topic.post.images.length) {
    imageStartIndexMap.value[topicId] = currentStart + 3
  }
}

// 预览图片
const previewImage = (images: string[], index: number) => {
  // 使用 element-plus 的图片预览功能
  const imgUrls = images.map(url => ({ url }))
  ElImageViewer({
    urlList: imgUrls,
    initialIndex: index
  })
}

// 修改热门话题的数据结构
const hotTopics = ref([
  {
    id: 1,
    name: 'Vue3学习圈',
    avatar: 'https://picsum.photos/48/48?random=1',
    description: '专注 Vue3 技术分享和学习交流',
    memberCount: 12345,
    postCount: 1234,
    isJoined: true,
    post: {
      id: 1,
      title: '分享一个Vue3 + TS的项目最佳实践',
      author: '技术大牛',
      authorAvatar: 'https://picsum.photos/24/24?random=1',
      content: '最近在做一个Vue3+TS的项目，积累了一些经验和踩坑记录。主要包括以下几个方面：1. 项目架构的设计思路；2. TypeScript的类型定义最佳实践；3. Composition API的合理使用；4. 性能优化的关键点；5. 自动化测试的实践经验。',
      images: [
        'https://picsum.photos/300/200?random=1',
        'https://picsum.photos/300/200?random=2',
        'https://picsum.photos/300/200?random=3',
        'https://picsum.photos/300/200?random=4',
        'https://picsum.photos/300/200?random=5'
      ],
      heat: 9.8,
      likes: 234,
      comments: 56,
      favorites: 88,
      time: '2小时前'
    }
  },
  {
    id: 2,
    name: 'TypeScript交流',
    avatar: 'https://picsum.photos/40/40?random=2',
    memberCount: 8765,
    postCount: 876,
    isJoined: false,
    post: {
      id: 4,
      title: 'TypeScript 高级类型实战指南',
      author: 'TS专家',
      authorAvatar: '',
      content: 'TypeScript 高级类型实战指南，深入探讨 TypeScript 的高级类型和实战应用...',
      images: [],
      heat: 9.7,
      likes: 212,
      comments: 48,
      time: '2小时前'
    }
  }
])

const recommendedPosts = ref([
  {
    id: 1,
    title: 'Vue3 和 TypeScript 实战教程',
    summary: '本文将介绍如何在 Vue3 项目中使用 TypeScript，包括类型定义、组件编写等最佳实践...',
    author: '张三',
    authorAvatar: '',
    date: '2024-02-05',
    views: 1234,
    cover: 'https://picsum.photos/200/120'
  },
  {
    id: 2,
    title: 'React Hooks 最佳实践指南',
    summary: '深入探讨 React Hooks 的使用技巧，包括自定义 Hooks、性能优化等进阶主题...',
    author: '李四',
    authorAvatar: '',
    date: '2024-02-04',
    views: 2345,
    cover: 'https://picsum.photos/200/120'
  }
])

const hotTags = ref([
  {
    id: 1,
    name: 'Vue3',
    type: 'success'
  },
  {
    id: 2,
    name: 'TypeScript',
    type: 'warning'
  }
])

const recommendedAuthors = ref([
  {
    id: 1,
    name: '森叔',
    avatar: '',
    description: '资深架构师，PMP，OCP，CSM...',
    isFollowing: false,
    badges: [
      { text: '资深架构师', type: 'info' },
      { text: 'PMP', type: 'info' },
      { text: 'OCP', type: 'info' }
    ]
  },
  {
    id: 2,
    name: '沧海一笑-dj',
    avatar: '',
    description: 'TA很懒，还没有添加简介',
    isFollowing: false,
    badges: []
  },
  {
    id: 3,
    name: '算法与编程之美',
    avatar: '',
    description: 'CSDN官方认证"博客专家"51CTO...',
    isFollowing: false,
    badges: [
      { text: 'CSDN博客专家', type: 'success' },
      { text: '51CTO', type: 'warning' }
    ]
  }
])

// 添加移动端检测
const isMobile = computed(() => {
  return window.innerWidth <= 768
})

// 监听窗口大小变化
onMounted(() => {
  window.addEventListener('resize', () => {
    // 触发 isMobile 的重新计算
    isMobile.value
  })
})

// 处理分类切换
const handleCategoryChange = (tab: string) => {
  console.log('切换分类:', tab)
  // TODO: 加载对应分类的文章
}

// 处理标签点击
const handleTagClick = (tag: { id: number; name: string; type: string }) => {
  router.push(`/tags/${tag.id}`)
}

// 跳转到文章详情
const goToDetail = (id: number) => {
  router.push(`/posts/${id}`)
}

// 跳转到帖子详情
const goToPost = (postId: number) => {
  router.push(`/posts/${postId}`)
}

// 加载更多
const loadMore = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // TODO: 加载更多文章
  } finally {
    loading.value = false
  }
}

// 根据热度返回对应的样式类名
const getHeatClass = (heat: number) => {
  if (heat >= 9.5) return 'heat-high'
  if (heat >= 8.5) return 'heat-medium'
  return 'heat-normal'
}
</script>

<style lang="scss" scoped>
// 文本溢出省略混入
@mixin text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.home-page {
  .banner-section {
    margin-bottom: 24px;
    
    .banner-item {
      height: 100%;
      background-size: cover;
      background-position: center;
      position: relative;

      .banner-content {
        position: absolute;
        left: 50px;
        bottom: 40px;
        right: 50px;
        color: #fff;
        text-shadow: 0 2px 4px rgba(0,0,0,0.2);

        h2 {
          font-size: 32px;
          margin: 0 0 12px;
        }

        p {
          font-size: 16px;
          margin: 0;
          opacity: 0.9;
        }
      }
    }
  }

  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 24px;

    .section-card {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 24px;

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        h2 {
          font-size: 20px;
          margin: 0;
          color: #333;
        }
      }
    }

    .hot-topics {
      .topic-list {
        .topic-item {
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 16px;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 16px;

          &:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }

          .circle-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;

            .circle-info {
              display: flex;
              align-items: center;
              gap: 8px;

              .circle-name {
                font-size: 14px;
                font-weight: 500;
                color: #333;
              }
            }

            .follow-status {
              font-size: 12px;
              padding: 0 12px;
              height: 24px;
              line-height: 22px;
            }
          }

          .topic-content {
            padding: 16px;

            .topic-title {
              font-size: 18px;
              font-weight: 600;
              color: #333;
              margin: 0 0 12px;
            }

            .topic-text {
              font-size: 14px;
              color: #666;
              line-height: 1.6;
              margin: 0 0 12px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              overflow: hidden;
              -webkit-line-clamp: 3;

              &.mobile {
                -webkit-line-clamp: 2;
              }
            }

            .topic-images {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 8px;
              margin-bottom: 16px;

              .topic-image {
                aspect-ratio: 1;
                border-radius: 4px;
                cursor: pointer;
              }
            }

            .post-footer {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-top: 12px;
            }
          }
        }
      }
    }

    .recommended-posts {
      .post-list {
        .post-item {
          display: flex;
          padding: 20px 0;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          transition: all 0.3s;

          &:first-child {
            padding-top: 0;
          }

          &:last-child {
            padding-bottom: 0;
            border-bottom: none;
          }

          &:hover {
            transform: translateY(-2px);
          }

          .post-info {
            flex: 1;
            margin-right: 20px;

            .title {
              font-size: 18px;
              color: #333;
              margin: 0 0 12px;
            }

            .summary {
              font-size: 14px;
              color: #666;
              margin: 0 0 16px;
              line-height: 1.6;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .meta {
              display: flex;
              align-items: center;
              gap: 16px;
              color: #999;
              font-size: 13px;

              .author {
                display: flex;
                align-items: center;
                gap: 6px;
              }

              .views {
                display: flex;
                align-items: center;
                gap: 4px;
              }
            }
          }

          .post-cover {
            width: 200px;
            height: 120px;
            border-radius: 8px;
            overflow: hidden;

            .el-image {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
      }
    }
  }
}

// 响应式适配
@media screen and (max-width: 768px) {
  .home-page {
    .banner-section {
      .banner-item {
        .banner-content {
          left: 20px;
          bottom: 20px;
          right: 20px;

          h2 {
            font-size: 24px;
            margin: 0 0 8px;
          }

          p {
            font-size: 14px;
          }
        }
      }
    }

    .main-content {
      grid-template-columns: 1fr;
      padding: 0;

      .section-card {
        margin: 0 12px 16px;
        border-radius: 8px;
      }

      .hot-topics {
        .topic-list {
          .topic-item {
            margin: 0;
            padding-bottom: 12px;

            .topic-content {
              padding: 12px;

              .topic-title {
                font-size: 16px;
              }

              .topic-text {
                font-size: 13px;
              }

              .topic-images {
                gap: 4px;
              }

              .post-footer {
                flex-direction: column;
                gap: 12px;
                align-items: flex-start;

                .author-info {
                  order: 2;
                }

                .interaction-stats {
                  order: 1;
                  width: 100%;
                  justify-content: space-around;
                }
              }
            }
          }
        }
      }

      .recommended-posts {
        .post-item {
          margin: 0 12px;
          padding: 16px 0;

          .post-cover {
            width: 120px;
            height: 80px;
          }
        }
      }

      .sidebar {
        display: none;
      }
    }
  }
}

.recommended-authors {
  .panel-content {
    .author-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      transition: background-color 0.2s;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: #f8f9fa;
      }

      .author-avatar {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        border: 1px solid #f0f0f0;
      }

      .author-info {
        flex: 1;
        min-width: 0;
        overflow: hidden;

        .info-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;

          .name {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            @include text-ellipsis;
          }

          .follow-btn {
            padding: 4px 12px;
            font-size: 13px;
            color: #666;

            &:hover {
              color: var(--el-color-primary);
            }
          }
        }

        .description {
          display: block;
          font-size: 12px;
          color: #999;
          margin-bottom: 8px;
          @include text-ellipsis;
        }

        .badges {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;

          .badge-item {
            height: 20px;
            padding: 0 6px;
            font-size: 12px;
            border: none;
            background-color: #f5f5f5;
            color: #666;
          }
        }
      }
    }
  }
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;

  .author-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #666;

    .author-name {
      color: #333;
      font-weight: 500;
    }

    .info-divider {
      color: #ddd;
    }

    .post-time {
      color: #999;
    }

    .topic-heat {
      display: flex;
      align-items: center;
      gap: 4px;

      .el-icon {
        font-size: 14px;
      }

      &.heat-high {
        color: #ff4d4f;
        .el-icon {
          color: #ff4d4f;
        }
      }

      &.heat-medium {
        color: #ff7a45;
        .el-icon {
          color: #ff7a45;
        }
      }

      &.heat-normal {
        color: #666;
        .el-icon {
          color: #666;
        }
      }
    }
  }

  .interaction-stats {
    display: flex;
    align-items: center;
    gap: 16px;
    color: #999;
    font-size: 13px;

    span {
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      transition: color 0.2s;
      padding: 4px;

      &:hover {
        color: var(--el-color-primary);
      }

      .el-icon {
        font-size: 16px;
      }
    }
  }
}

// 移动端适配
@media screen and (max-width: 768px) {
  .post-footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;

    .author-info {
      order: 2;
      flex-wrap: wrap;
      gap: 6px;
    }

    .interaction-stats {
      order: 1;
      width: 100%;
      justify-content: space-around;

      span {
        padding: 6px 12px;
      }
    }
  }
}
</style> 