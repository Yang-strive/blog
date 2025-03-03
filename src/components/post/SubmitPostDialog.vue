<!-- components/post/SubmitPostDialog.vue -->
<template>
  <el-dialog
    :model-value="false"
    :title="title"
    :width="isMobile ? '90%' : 600"
    destroy-on-close
  >
    <el-form :model="form" label-width="80px">

      <!-- 标签选择 -->
      <el-form-item label="文章标签">
        <SelectPostTags 
          v-model="form.tags"
        />
      </el-form-item>
      
      <!-- 封面图上传 -->
      <el-form-item label="封面图">
        <div class="cover-wrapper">
          <!-- 封面预览图 -->
          <el-upload
            action="http://localhost:8080/api/upload/file"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
            class="cover-preview"
          >
            <img v-if="form.cover_url" :src="form.cover_url" class="cover-preview">
            <el-icon v-else size="50"><Plus /></el-icon>
          </el-upload>
          <!-- 图片选择区 -->
          <div class="image-list-wrapper">
            <!-- 封面来源标签按钮 -->
            <div class="cover-source-tags">
              <el-tag>正文图</el-tag>
              <el-tag>热门图</el-tag>
            </div>
            <!-- 封面图片列表 -->
            <div class="image-list">
              <img v-for="item in imageList" :src="item.url" :key="item.id"/>
            </div>
          </div>
        </div>
        
      </el-form-item>

      <!-- 简介 -->
       <el-form-item label="文章简介">
        <el-input v-model="form.summary" 
          type="textarea" 
          :rows="3"
          placeholder="请输入文章简介" />
      </el-form-item>

      <!-- 分类选择 -->
      <el-form-item label="文章分类" required>
        <el-select
          v-model="form.categories"
          multiple
          placeholder="请选择分类"
          style="width: 100%"
        >
          <el-option
            v-for="item in categoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- 权限 -->
      <el-form-item label="权限">
        <el-radio-group v-model="form.authType">
          <el-radio label="publish" value="1">公开</el-radio>
          <el-radio label="private" value="0">私密</el-radio>
        </el-radio-group>
      </el-form-item>

    </el-form>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认发布</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'

interface Tag {
  id: string | number
  name: string
  color?: string
}
interface Category {
  value: string | number
  label: string
}

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  },
})

const emit = defineEmits(['update:visible', 'confirm'])

const isMobile = computed(() => window.innerWidth < 768)
const title = computed(() => props.initialData.id ? '编辑文章' : '发布新文章')

const form = ref({
  content: '',
  categories: [],
  tags: <Tag[]>[],
  summary: '',
  authType: 1, // 1公开 0私密
  cover_url: '',
  cover_id: '',
  ...props.initialData,
})

const imageList = ref<{url: string, id: number}[]>([])
const categoryOptions = ref<Category[]>([])

// 初始化获取分类列表
onMounted(async () => {
  // 获取分类列表
  // const res = await getCategoryList()
  const res = {data: [
    { id: 1, name: '技术文章' },
    { id: 2, name: '生活随笔' },
    { id: 3, name: '分类3' },
  ]}
  categoryOptions.value = res.data.map((item: any) => ({
    label: item.name,
    value: item.id,
  }))

  // 获取文章封面图片
  if (form.value.content) {
    const imageInfoList = getImageInfoListByPost(form.value.content)
    console.log('imageInfoList:', imageInfoList);
    
  }
})

// 从文章中获取封面图片信息
function getImageInfoListByPost(content: string) {
  const regex = /!\[.*?\]\((.*?)\)/gm;
  const matchs = content.match(regex);
  /* if (match && match[1]) {
    const url = match[1];
    const id = parseInt(url.split('/').pop()!.split('.')[0], 10);
    return { url, id };
  } */
  imageList.value = matchs?.map((match:string) => {
    const url = match;
    const id = parseInt(url.split('/').pop()!.split('.')[0], 10);
    return { url:url, id:id };
  })
}

const handleCoverSuccess = (response: any) => {
  form.value.cover_url = response.data
  form.value.cover_id = response.id ? response.id : 1
}

const handleCancel = () => {
  emit('update:visible', false)
}

const handleConfirm = () => {
  emit('confirm', form.value)
  handleCancel()
}
</script>

<style scoped lang="scss">
.cover-wrapper{
  display: flex;
  gap: 16px;
  align-items: center;
  width: 100%;
  height: 120px;
  .cover-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160px;
    height: 120px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
  }
  .image-list-wrapper{
    flex: 1;
    display: flex;
    flex-direction:column;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    height: 120px;
    .cover-source-tags{
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      :deep(.el-tag){
        cursor: pointer;
      }
    }
    .image-list{
      flex: 1; 
      display: flex;
      background-color: azure;
      width: 100%;
      padding: 3px 8px
    }
  }
}


@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 92% !important;
    margin: 2vh auto !important;
    border-radius: 8px;
    
    :deep(.el-dialog__header) {
      padding: 12px;
      font-size: 16px;
    }
    
    :deep(.el-dialog__body) {
      padding: 0 12px 12px;
    }
    
    .el-form-item {
      margin-bottom: 12px;
      
      :deep(.el-form-item__label) {
        width: 70px !important;
        text-align: right;
        padding-right: 8px;
        font-size: 13px;
      }
      
      :deep(.el-form-item__content) {
        margin-left: 70px !important;
      }
    }
    
    .el-radio-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .el-radio {
        margin-right: 0;
      }
    }
    
    .el-upload {
      width: 100%;
      text-align: center;
    }
  }
  
  .cover-preview {
    max-width: 100%;
    height: auto;
  }
  
  :deep(.el-dialog__footer) {
    padding: 12px;
    .el-button {
      width: 48%;
      margin: 0;
      :first-child {
        margin-right: 4%;
      }
    }
  }
}
</style>