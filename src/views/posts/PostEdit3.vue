<template>
  <div class="editor-container">
    <div class="editor-top">
      <div class="back-btn" @click="handleBack">
        <icon-fluent:arrow-left-12-regular/>
        返回
      </div>
      <div class="editor-title">
        <el-input v-model="docForm.title" 
          placeholder="请输入文章标题 (5-100字)" 
          maxlength="100"
          :show-word-limit="!isMobile"
          type="text">
          <!-- <template #prepend>标题</template> -->
        </el-input>
      </div>
      <div class="editor-btn">
        <el-button type="primary" :size="isMobile?'small':'default'" @click="handleSaveDraft">保存草稿</el-button>
        <el-button type="primary" :size="isMobile?'small':'default'" @click="handleSave">保存</el-button>
      </div>
    </div>
    <div class="editor-main">
      <Vditor v-model="docForm.content" :config="vditorConfig"></Vditor>
    </div>
  </div>

  <SubmitPostDialog
    v-model="dialogVisible"
    :initial-data="docForm"
    @confirm="handlePublishConfirm"
  />
</template>

<script setup>
// 顶部添加组件引入
import SubmitPostDialog from '@/components/post/SubmitPostDialog.vue'
import { useRouter } from 'vue-router';
import { ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue';
import Vditor from '@/components/vditor/Vditor.vue';

const vditor = ref()
const vditorConfig = ref({})
const docForm = ref({
  title: '',
  content: '',
  tags: [
    { id: 1, name: "标签1", color: "primary" },
    { id: 2, name: "标签2", color: "success" },
    { id: 3, name: "标签3", color: "warning" },
  ],
  categories: [
    { label: '技术文章', value: 1 },
    { label: '生活随笔', value: 2 }
  ],
  status: 'draft',
  password: '',
  password_confirmation: '',
  cover: '',
  cover_id: '',
  cover_url: '',
  cover_thumb: '',
  cover_thumb_url: '',
  cover_medium:'',
})
const isMobile = window.innerWidth < 768;
let dialogVisible = ref(false);

/**
 * 返回按钮
 */
const handleBack = () => {
  const router = useRouter();
  router.back();
}
/**
 * 保存草稿按钮
 */
const handleSaveDraft = () => {
  console.log(docForm.value.content);
  
}
/**
 * 保存按钮
 */
const handleSave = () => {
  dialogVisible.value = true
}
// 添加发布确认处理
const handlePublishConfirm = async (formData) => {
  try {
    // 这里调用API接口提交数据
    console.log('提交数据:', formData)
    ElMessage.success('文章发布成功')
  } catch (error) {
    ElMessage.error('发布失败: ' + error.message)
  }
}

</script>

<style lang="scss" scoped>
.editor-container{
  min-height: 100vh;
  background-color: #eee;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  height: 100vh;

  .editor-top{
    flex: 0 0 auto;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .back-btn{
      display: flex;
      justify-content: center;
      align-items: center;
      color: #333;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }

    .editor-title{
      flex: 1;
      margin-left: 10px;
      margin-right: 10px;

      .el-input{
        width: 100%;
        --el-input-border-radius: 20px;
        .el-input__inner{
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          border: none;
        }
      }
    }
  }
  .editor-main{
    flex: 1;
    min-height: 0;
  }
  
}
@media (max-width: 768px) {
  .editor-container{
    .editor-top{
      padding: 5px 10px;
      .editor-btn{

        :deep(.el-button){
          padding: 8px 8px;
        }
      }
    }
  }
}
</style>