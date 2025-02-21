<template>
  <div class="post-list-page">
    <!-- 分类筛选区 -->
    <div class="filter-section">
      <div class="filter-content">
        <!-- 分类选择 -->
        <div class="category-filter">
          <h3 class="filter-title">文章分类</h3>
          <div class="category-list">
            <el-tag
              v-for="category in categories"
              :key="category.id"
              :class="{ active: selectedCategory === category.id }"
              @click="handleCategorySelect(category.id)"
            >
              {{ category.name }}
            </el-tag>
          </div>
        </div>

        <!-- 标签选择 -->
        <div class="tag-filter">
          <h3 class="filter-title">热门标签</h3>
          <div class="tag-list">
            <el-tag
              v-for="tag in tags"
              :key="tag.id"
              :type="tag.type"
              :class="{ active: selectedTags.includes(tag.id) }"
              @click="handleTagSelect(tag.id)"
            >
              {{ tag.name }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="post-list-content">
      <!-- 排序和布局切换 -->
      <div class="list-header">
        <div class="sort-options">
          <el-radio-group v-model="sortBy" size="small">
            <el-radio-button label="latest">最新发布</el-radio-button>
            <el-radio-button label="hot">最多浏览</el-radio-button>
            <el-radio-button label="recommended">推荐</el-radio-button>
          </el-radio-group>
        </div>
        <div class="view-switch">
          <el-switch
            v-model="isGridView"
            :active-icon="Grid"
            :inactive-icon="List"
            style="--el-switch-on-color: #13ce66"
          />
        </div>
      </div>

      <!-- 文章列表 -->
      <div :class="['post-list', { 'grid-view': isGridView }]">
        <div v-for="post in posts" :key="post.id" class="post-item" @click="goToDetail(post.id)">
          <div class="post-cover">
            <el-image :src="post.cover" fit="cover" />
          </div>
          <div class="post-info">
            <h3 class="title">{{ post.title }}</h3>
            <p class="summary">{{ post.summary }}</p>
            <div class="meta">
              <span class="author">
                <el-avatar :size="20" :src="post.authorAvatar">{{ post.author.charAt(0) }}</el-avatar>
                {{ post.author }}
              </span>
              <span class="category">
                <el-tag size="small" type="info">{{ post.category }}</el-tag>
              </span>
              <span class="date">{{ post.date }}</span>
              <span class="views">
                <el-icon><View /></el-icon>
                {{ post.views }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div class="load-more">
        <el-button :loading="loading" @click="loadMore">加载更多</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { View, Grid, List } from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)
const selectedCategory = ref<number | null>(null)
const selectedTags = ref<number[]>([])
const sortBy = ref('latest')
const isGridView = ref(false)

// 模拟数据
const categories = ref([
  { id: 1, name: '全部' },
  { id: 2, name: '前端开发' },
  { id: 3, name: '后端开发' },
  { id: 4, name: '移动开发' },
  { id: 5, name: '数据库' },
  { id: 6, name: '运维部署' },
  { id: 7, name: '人工智能' }
])

const tags = ref([
  { id: 1, name: 'Vue3', type: '' },
  { id: 2, name: 'React', type: 'success' },
  { id: 3, name: 'TypeScript', type: 'warning' },
  { id: 4, name: 'Node.js', type: 'danger' },
  { id: 5, name: 'Python', type: 'info' }
])

const posts = ref([
  {
    id: 1,
    title: 'Vue3 和 TypeScript 实战教程',
    summary: '本文将介绍如何在 Vue3 项目中使用 TypeScript，包括类型定义、组件编写等最佳实践...',
    author: '张三',
    authorAvatar: '',
    category: '前端开发',
    date: '2024-02-05',
    views: 1234,
    cover: 'https://picsum.photos/400/300'
  },
  // ... 更多文章数据
])

// 处理分类选择
const handleCategorySelect = (categoryId: number) => {
  selectedCategory.value = selectedCategory.value === categoryId ? null : categoryId
  // TODO: 根据分类筛选文章
}

// 处理标签选择
const handleTagSelect = (tagId: number) => {
  const index = selectedTags.value.indexOf(tagId)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tagId)
  }
  // TODO: 根据标签筛选文章
}

// 跳转到文章详情
const goToDetail = (id: number) => {
  router.push(`/posts/${id}`)
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
</script>

<style lang="scss" scoped>
.post-list-page {
  .filter-section {
    background: #fff;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;

    .filter-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;

      .filter-title {
        font-size: 16px;
        color: #333;
        margin: 0 0 12px;
        font-weight: normal;
      }

      .category-filter {
        margin-bottom: 20px;

        .category-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;

          .el-tag {
            cursor: pointer;
            transition: all 0.3s;

            &.active {
              background-color: var(--el-color-primary);
              border-color: var(--el-color-primary);
              color: #fff;
            }
          }
        }
      }

      .tag-filter {
        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;

          .el-tag {
            cursor: pointer;
            transition: all 0.3s;

            &.active {
              transform: scale(1.05);
            }
          }
        }
      }
    }
  }

  .post-list-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .post-list {
      &.grid-view {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;

        .post-item {
          display: block;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

          .post-cover {
            height: 180px;

            .el-image {
              width: 100%;
              height: 100%;
            }
          }

          .post-info {
            padding: 16px;

            .title {
              font-size: 16px;
              margin: 0 0 8px;
            }

            .summary {
              font-size: 14px;
              color: #666;
              margin: 0 0 12px;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          }
        }
      }

      .post-item {
        display: flex;
        padding: 20px 0;
        border-bottom: 1px solid #eee;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-2px);
        }

        .post-cover {
          width: 240px;
          height: 160px;
          border-radius: 8px;
          overflow: hidden;
          margin-right: 20px;

          .el-image {
            width: 100%;
            height: 100%;
          }
        }

        .post-info {
          flex: 1;

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
      }
    }

    .load-more {
      text-align: center;
      margin: 30px 0;
    }
  }
}

// 响应式适配
@media screen and (max-width: 768px) {
  .post-list-page {
    .filter-section {
      .filter-content {
        padding: 12px;

        .category-list,
        .tag-list {
          gap: 8px;
        }
      }
    }

    .post-list-content {
      padding: 0 12px;

      .list-header {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;

        .sort-options {
          :deep(.el-radio-group) {
            width: 100%;
            display: flex;

            .el-radio-button {
              flex: 1;

              &__inner {
                width: 100%;
              }
            }
          }
        }

        .view-switch {
          display: none;
        }
      }

      .post-list {
        .post-item {
          padding: 12px 0;

          .post-cover {
            width: 120px;
            height: 80px;
            margin-right: 12px;
          }

          .post-info {
            .title {
              font-size: 15px;
              margin: 0 0 8px;
            }

            .summary {
              font-size: 13px;
              margin: 0 0 8px;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .meta {
              gap: 12px;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style> 