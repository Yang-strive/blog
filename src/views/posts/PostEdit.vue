<template>
  <div class="post-edit">
    <div class="edit-header">
      <h2>{{ isEdit ? '编辑文章' : '创建文章' }}</h2>
    </div>

    <el-form
      ref="formRef"
      :model="postForm"
      :rules="rules"
      label-width="80px"
      class="edit-form"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="postForm.title" placeholder="请输入文章标题" />
      </el-form-item>

      <el-form-item label="分类" prop="categoryId">
        <el-select v-model="postForm.categoryId" placeholder="请选择文章分类">
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="标签" prop="tags">
        <el-select
          v-model="postForm.tags"
          multiple
          placeholder="请选择文章标签"
        >
          <el-option
            v-for="item in tags"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="封面" prop="cover">
        <el-upload
          class="cover-upload"
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleCoverChange"
        >
          <el-image
            v-if="postForm.cover"
            :src="postForm.cover"
            class="cover-preview"
          />
          <el-button v-else type="primary">
            <el-icon><Plus /></el-icon>
            上传封面
          </el-button>
        </el-upload>
      </el-form-item>

      <el-form-item label="摘要" prop="summary">
        <el-input
          v-model="postForm.summary"
          type="textarea"
          :rows="3"
          placeholder="请输入文章摘要"
        />
      </el-form-item>

      <el-form-item label="内容" prop="content">
        <el-input
          v-model="postForm.content"
          type="textarea"
          :rows="10"
          placeholder="请输入文章内容"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          {{ isEdit ? '保存修改' : '发布文章' }}
        </el-button>
        <el-button @click="router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, UploadFile } from 'element-plus'

const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

// 判断是否为编辑模式
const isEdit = computed(() => {
  return route.name === 'PostEdit'
})

// 表单数据
const postForm = ref({
  title: '',
  categoryId: '',
  tags: [] as number[],
  cover: '',
  summary: '',
  content: ''
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ]
}

// 模拟数据
const categories = ref([
  { id: 1, name: '前端开发' },
  { id: 2, name: '后端开发' },
  { id: 3, name: '移动开发' }
])

const tags = ref([
  { id: 1, name: 'Vue3' },
  { id: 2, name: 'React' },
  { id: 3, name: 'TypeScript' }
])

// 处理封面上传
const handleCoverChange = (file: UploadFile) => {
  // TODO: 实现图片上传
  postForm.value.cover = URL.createObjectURL(file.raw!)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // TODO: 调用创建/更新文章接口
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success(isEdit.value ? '更新成功' : '发布成功')
    router.push('/posts')
  } catch (error: any) {
    console.error(error)
    ElMessage.error(error.message || '操作失败')
  } finally {
    loading.value = false
  }
}

// 获取文章详情
const getPostDetail = async (id: string | string[]) => {
  // TODO: 调用获取文章详情接口
  postForm.value = {
    title: '示例文章',
    categoryId: 1,
    tags: [1, 2],
    cover: '',
    summary: '这是文章摘要',
    content: '这是文章内容'
  }
}

onMounted(async () => {
  if (isEdit.value) {
    const id = route.params.id
    await getPostDetail(id)
  }
})
</script>

<style lang="scss" scoped>
.post-edit {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  .edit-header {
    margin-bottom: 24px;

    h2 {
      font-size: 24px;
      color: #333;
      margin: 0;
    }
  }

  .edit-form {
    background: #fff;
    padding: 24px;
    border-radius: 8px;

    .cover-upload {
      :deep(.el-upload) {
        width: 100%;
        max-width: 360px;
      }

      .cover-preview {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 4px;
      }
    }
  }
}

// 响应式适配
@media screen and (max-width: 768px) {
  .post-edit {
    padding: 16px;

    .edit-header {
      margin-bottom: 16px;

      h2 {
        font-size: 20px;
      }
    }

    .edit-form {
      padding: 16px;
    }
  }
}
</style> 