<template>
  <div class="post-edit">
    <!-- 隐藏默认布局的导航栏 -->
    <div class="hide-nav" />

    <!-- 顶部操作栏 -->
    <div class="action-bar">
      <!-- PC端布局 -->
      <div class="pc-header">
        <div class="left">
          <el-button @click="router.back()" text>
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
          <span class="divider">|</span>
          <div class="title-input">
            <span class="label">文章标题</span>
            <el-input
              v-model="docForm.title"
              placeholder="这是文章标题"
              :maxlength="100"
              show-word-limit
            />
          </div>
        </div>
        <div class="right">
          <el-button @click="saveDraft">保存草稿</el-button>
          <el-button type="primary" @click="showPublishDialog">{{ isEdit ? '保存' : '发布' }}</el-button>
        </div>
      </div>

      <!-- 移动端布局 -->
      <div class="mobile-header">
        <el-button @click="router.back()" text>
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <div class="title-input">
          <el-input
            v-model="docForm.title"
            placeholder="这是文章标题"
            :maxlength="100"
            show-word-limit
          />
        </div>
        <div class="action-buttons">
          <el-button type="primary" @click="showPublishDialog">{{ isEdit ? '保存' : '发布' }}</el-button>
        </div>
      </div>
    </div>

    <!-- 编辑区域 -->
    <el-scrollbar class="editor-container">
      <div class="editor-content">
        <el-input
          v-model="docForm.content"
          type="textarea"
          placeholder="请输入文章内容..."
          :rows="20"
          resize="none"
        />
      </div>
    </el-scrollbar>

    <!-- 发布文章弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="发布文章"
      :width="isMobile ? '90%' : '500px'"
      :close-on-click-modal="false"
      :fullscreen="isMobile"
      class="publish-dialog"
    >
      <!-- 标签 -->
      <el-row ref="tagRow">
        <el-col :span="isMobile ? 24 : 3" class="label-col">标签</el-col>
        <el-col :span="isMobile ? 24 : 21" class="input-col">
          <div>
            <el-tag
              v-for="tag in docForm.tags"
              :key="tag.id"
              class="mx-1"
              closable
              :disable-transitions="false"
              @close="handleCloseTag(tag)"
            >
              {{ tag.content }}
            </el-tag>
            <el-tag
              v-if="showAddTagFlag"
              @click="selectTagDialogFlag = true"
              effect="plain"
              type="info"
              >+添加标签</el-tag
            >
            <el-dialog
              ref="tagDialog"
              v-model="selectTagDialogFlag"
              :modal="false"
              :append-to-body="false"
              :style="tagDialogStyle"
              draggable
            >
              <template #default>
                <select-doc-tags :selectTags="docForm.tags" />
              </template>
            </el-dialog>
          </div>
        </el-col>
      </el-row>
      <!-- 封面 -->
      <el-row>
        <el-col :span="isMobile ? 24 : 3" class="label-col">封面</el-col>
        <el-col :span="isMobile ? 24 : 21">
          <el-row>
            <el-col :span="isMobile ? 24 : 8">
              <div>
                <el-upload
                  action="http://localhost:20011/blog/uploadBlogFile"
                  :auto-upload="true"
                  :show-file-list="false"
                  :disabled="isDisabledUpload"
                  :on-remove="handleRemove"
                  v-model="uploadedFiles"
                  :on-success="uploadSuccessHandle"
                  :on-error="uploadErrorHandle"
                  class="upload-cover"
                >
                  <!-- <div v-if="docForm.coverUrl" class="el-upload-list__item is-success"> -->
                  <div
                    v-if="docForm.coverUrl"
                    class="el-upload-list el-upload-list--picture-card is-disabled"
                  >
                    <!-- <div class="el-upload-list__item is-success"> -->
                    <el-image
                      style="width: 150px; height: 100px"
                      :src="docForm.coverUrl"
                      fit="fit"
                    />
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-delete"
                        @click.stop="handleRemove()"
                      >
                        <el-icon><Delete /></el-icon>
                      </span>
                    </span>
                    <!-- </div> -->
                  </div>
                  <el-icon v-else class="avatar-uploader-icon">
                    <Plus />添加文章封面
                  </el-icon>
                </el-upload>
              </div>
            </el-col>
            <!-- 文章图片选择区 -->
            <el-col :span="isMobile ? 24 : 14" class="mt-mobile-2">
              <div>
                <!-- 图片来源标签页 -->
                <el-row style="height: 30px; margin-bottom: 5px">
                  <el-col :span="12">
                    <el-tag type="info">正文图</el-tag>
                  </el-col>
                  <el-col :span="12">
                    <el-tag type="info">标签图</el-tag>
                  </el-col>
                </el-row>
                <!-- 图片备选区域 -->
                <el-row>
                  <el-col>
                    <el-scrollbar>
                      <div class="selectImgBox">
                        <div style="background-color: #ccc">
                          <el-popover
                            :width="300"
                            v-for="imgLink in docImgLinks"
                            :key="imgLink"
                          >
                            <template #reference>
                              <el-image
                                class="selectImgItem"
                                :src="imgLink"
                                fit="fit"
                                @click="handleSelectImg(imgLink)"
                              />
                            </template>
                            <template #default>
                              <div>
                                <el-image
                                  style="height: 200px"
                                  :src="imgLink"
                                  fit="fit"
                                />
                              </div>
                            </template>
                          </el-popover>
                        </div>
                      </div>
                    </el-scrollbar>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!-- 文章简介 -->
      <el-row align="middle">
        <el-col :span="isMobile ? 24 : 3" class="label-col">文章简介</el-col>
        <el-col :span="isMobile ? 24 : 21">
          <el-input
            v-model="docForm.summary"
            :rows="3"
            type="textarea"
            placeholder="请输入文章简介"
          />
        </el-col>
      </el-row>
      <!-- 是否原创 -->
      <el-row align="middle">
        <el-col :span="isMobile ? 24 : 3" class="label-col">是否原创</el-col>
        <el-col :span="isMobile ? 24 : 21">
          <el-radio-group v-model="docForm.original">
            <el-radio label="true">是</el-radio>
            <el-radio label="false">否</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <!-- 文章权限 -->
      <el-row align="middle">
        <el-col :span="isMobile ? 24 : 3" class="label-col">文章权限</el-col>
        <el-col :span="isMobile ? 24 : 21">
          <el-radio-group v-model="docForm.authType">
            <el-radio label="1">公开</el-radio>
            <el-radio label="0">私密</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <!-- 是否置顶（功能移到外部操作） -->
      <!-- 是否开启评论（保留功能） -->

      <!-- 弹出层底部按钮区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="docForm.status !== '1'" @click="saveDraft">保存草稿</el-button>
          <el-button type="primary" @click="publish">发布</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Plus, Delete } from '@element-plus/icons-vue'
import SelectDocTags from '@/components/SelectDocTags.vue'

const router = useRouter()
const route = useRoute()

// 判断是否为编辑模式
const isEdit = computed(() => !!route.params.id)

// 判断是否为移动端
const isMobile = computed(() => window.innerWidth <= 768)

// 文章表单类型定义
interface DocForm {
  id?: string
  title: string
  content: string
  summary: string
  coverUrl: string
  tags: Array<{
    id: number
    content: string
  }>
  original: string
  authType: string
  status: string
  category?: string
}

// 弹窗相关
const dialogVisible = ref(false)
const selectTagDialogFlag = ref(false)
const tagDialog = ref()
const tagRow = ref()

// 标签相关
const showAddTagFlag = ref(true)
const tagDialogStyle = computed(() => {
  if (!tagRow.value) return {}
  const rect = tagRow.value.$el.getBoundingClientRect()
  return {
    position: 'absolute',
    top: `${rect.bottom + 5}px`,
    left: `${rect.left}px`
  }
})

// 文章表单数据
const docForm = ref<DocForm>({
  title: '',
  content: '',
  summary: '',
  coverUrl: '',
  tags: [],
  original: 'true',
  authType: '1',
  status: '0',
  category: ''
})

// 上传相关
const isDisabledUpload = ref(false)
const uploadedFiles = ref([])
const docImgLinks = ref<string[]>([])

// 如果是编辑模式，获取文章数据
onMounted(async () => {
  if (isEdit.value) {
    try {
      const postId = route.params.id
      // 模拟接口调用
      const mockPost: DocForm = {
        id: postId as string,
        title: '测试文章标题',
        content: '测试文章内容',
        status: '1',
        summary: '',
        coverUrl: '',
        tags: [],
        original: 'true',
        authType: '1',
        category: ''
      }
      docForm.value = mockPost
    } catch (error) {
      ElMessage.error('获取文章失败')
      router.back()
    }
  }
})

// 显示发布弹窗
const showPublishDialog = () => {
  if (!docForm.value.title.trim()) {
    return ElMessage.warning('请输入文章标题')
  }
  if (!docForm.value.content.trim()) {
    return ElMessage.warning('请输入文章内容')
  }

  // 如果是编辑模式，直接更新
  if (isEdit.value) {
    publish()
    return
  }

  dialogVisible.value = true
}

// 保存草稿
const saveDraft = async () => {
  try {
    docForm.value.status = '0'
    // TODO: 调用保存草稿接口
    ElMessage.success('草稿保存成功')
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 发布文章
const publish = async () => {
  try {
    docForm.value.status = '1'
    // TODO: 调用发布接口
    console.log('发布数据:', docForm.value)
    
    ElMessage.success('发布成功')
    dialogVisible.value = false
    router.push('/posts')
  } catch (error) {
    ElMessage.error('发布失败')
  }
}

// 标签相关方法
const handleCloseTag = (tag: { id: number }) => {
  docForm.value.tags = docForm.value.tags.filter(t => t.id !== tag.id)
}

// 上传相关方法
const handleRemove = () => {
  docForm.value.coverUrl = ''
}

const uploadSuccessHandle = (response: any) => {
  if (response.code === 200) {
    docForm.value.coverUrl = response.data
    ElMessage.success('上传成功')
  } else {
    ElMessage.error('上传失败')
  }
}

const uploadErrorHandle = () => {
  ElMessage.error('上传失败')
}

const handleSelectImg = (imgLink: string) => {
  docForm.value.coverUrl = imgLink
}
</script>

<style lang="scss" scoped>
.post-edit {
  min-height: 100vh;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  // 用于隐藏默认布局的导航栏
  .hide-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: -1;
  }

  @media screen and (max-width: 768px) {
    z-index: 2000;
  }

  .action-bar {
    position: relative;
    z-index: 1002;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 24px;
    background-color: #fff;
    border-bottom: 1px solid #f0f0f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    height: 56px;
    box-sizing: border-box;
    flex-shrink: 0;

    // PC端布局样式
    .pc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      
      .left {
        display: flex;
        align-items: center;
        gap: 16px;

        .divider {
          color: #ddd;
        }

        .title-input {
          display: flex;
          align-items: center;
          gap: 8px;

          .label {
            font-size: 14px;
            color: #666;
          }

          .el-input {
            width: 400px;
          }
        }
      }

      .right {
        display: flex;
        gap: 12px;
      }
    }


    .mobile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
    }

    // 移动端布局样式
    .mobile-header {
      display: none;
    }

    .title-input {
      padding: 8px 12px;
      width: 100%;

      .el-input {
        width: 100%;

        :deep(.el-input__wrapper) {
          padding: 0;
          border: none;
          box-shadow: none;
        }

        :deep(.el-input__inner) {
          font-size: 16px;
          height: 24px;
          line-height: 24px;
          padding: 0;
        }

        :deep(.el-input__count) {
          background: transparent;
          padding: 0;
          height: 20px;
          line-height: 20px;
        }
      }
    }

    @media screen and (max-width: 768px) {
      padding: 0 8px;
      gap: 0;
      height: auto;
      background-color: #fff;
      .pc-header {
        display: none;
      }
     .mobile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
     }
    }
  }

  .editor-container {
    position: relative;
    flex: 1;
    overflow: hidden;
    background-color: #fff;

    @media screen and (max-width: 768px) {
    }

    .editor-content {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
      height: 100%;
      display: flex;
      flex-direction: column;

      :deep(.el-textarea__inner) {
        flex: 1;
        height: 100% !important;
        font-size: 16px;
        line-height: 1.8;
        padding: 16px;
        border: none;
        box-shadow: none;
        background-color: transparent;
      }

      @media screen and (max-width: 768px) {
        padding: 12px;
      }
    }
  }

  @media screen and (max-width: 768px) {
    -webkit-overflow-scrolling: touch;
  }
}

// 封面上传样式
.cover-uploader {
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration);
    
    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.cover-image {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}

// 添加图片选择相关样式
.selectImgBox {
  height: 200px;
  overflow-y: auto;
  
  .selectImgItem {
    width: 80px;
    height: 80px;
    margin: 5px;
    cursor: pointer;
  }
}

// 标签相关样式
.mx-1 {
  margin: 0 5px;
}

// 布局相关样式
.label-col {
  line-height: 32px;
}

// 修复 el-image 的 fit 属性
.el-image {
  &[fit="fit"] {
    object-fit: contain;  // 修改为合法的 fit 值
  }
}

// 发布弹窗样式
.publish-dialog {
  :deep(.el-dialog) {
    @media screen and (max-width: 768px) {
      margin: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      
      .el-dialog__body {
        padding: 16px;
        flex: 1;
        overflow: auto;
      }
    }
  }

  .el-row {
    margin-bottom: 16px;

    @media screen and (max-width: 768px) {
      .label-col {
        margin-bottom: 8px;
        font-weight: 500;
      }
    }
  }

  .mt-mobile-2 {
    @media screen and (max-width: 768px) {
      margin-top: 16px;
    }
  }
}
</style> 