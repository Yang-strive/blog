<template>
  <div class="post-detail">
    <div class="post-header">
      <h1 class="title">{{ post.title }}</h1>
      <div class="meta">
        <span class="author">
          <el-avatar :size="24" :src="post.authorAvatar">{{ post.author?.charAt(0) }}</el-avatar>
          {{ post.author }}
        </span>
        <span class="date">{{ post.date }}</span>
        <span class="category">
          <el-tag size="small">{{ post.category }}</el-tag>
        </span>
        <span class="views">
          <el-icon><View /></el-icon>
          {{ post.views }} 阅读
        </span>
      </div>
      <!-- 作者操作按钮 -->
      <div v-if="isAuthor" class="actions">
        <el-button type="primary" @click="handleEdit">编辑文章</el-button>
        <el-button type="danger" @click="handleDelete">删除文章</el-button>
      </div>
    </div>

    <div class="post-content">
      {{ post.content }}
    </div>

    <div class="post-footer">
      <div class="tags">
        <el-tag
          v-for="tag in post.tags"
          :key="tag"
          :type="tag.type"
          class="tag-item"
        >
          {{ tag.name }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { View } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 模拟文章数据
const post = ref({
  id: 1,
  title: 'Vue3 和 TypeScript 实战教程',
  content: '这是文章的详细内容...',
  author: '张三',
  authorId: 1,
  authorAvatar: '',
  category: '前端开发',
  date: '2024-02-05',
  views: 1234,
  tags: [
    { name: 'Vue3', type: '' },
    { name: 'TypeScript', type: 'warning' }
  ]
})

// 判断是否为作者
const isAuthor = computed(() => {
  return userStore.currentUser?.id === post.value.authorId
})

// 编辑文章
const handleEdit = () => {
  router.push(`/posts/edit/${post.value.id}`)
}

// 删除文章
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
      type: 'warning'
    })
    // TODO: 调用删除接口
    ElMessage.success('删除成功')
    router.push('/posts')
  } catch {
    // 用户取消删除
  }
}

onMounted(async () => {
  const id = route.params.id
  // TODO: 根据 ID 获取文章详情
  console.log('获取文章详情:', id)
})
</script>

<style lang="scss" scoped>
.post-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  .post-header {
    margin-bottom: 30px;

    .title {
      font-size: 28px;
      color: #333;
      margin: 0 0 16px;
    }

    .meta {
      display: flex;
      align-items: center;
      gap: 16px;
      color: #999;
      font-size: 14px;
      margin-bottom: 16px;

      .author {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .views {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }

    .actions {
      display: flex;
      gap: 12px;
    }
  }

  .post-content {
    font-size: 16px;
    line-height: 1.8;
    color: #333;
  }

  .post-footer {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #eee;

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
}

// 响应式适配
@media screen and (max-width: 768px) {
  .post-detail {
    padding: 16px;

    .post-header {
      .title {
        font-size: 22px;
        margin-bottom: 12px;
      }

      .meta {
        flex-wrap: wrap;
        gap: 12px;
        font-size: 13px;
      }
    }

    .post-content {
      font-size: 15px;
    }
  }
}
</style> 