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
          show-word-limit
          type="text">
          <!-- <template #prepend>标题</template> -->
        </el-input>
      </div>
      <div class="editor-btn">
        <el-button type="primary" @click="handleSaveDraft">保存草稿</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </div>
    <div class="editor-main">
      <div id="vditor"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, reactive, onMounted } from 'vue';
// import Vditor from 'vditor'
// import 'vditor/dist/index.css' // 引入样式，要不然页面错乱
import createVditor from '@/vditor/index'

const vditor = ref()


onMounted(() => {
  vditor.value = createVditor('vditor')
})

const docForm = reactive({
  title: '',
  content: '',
  tags: [],
  categories: [],
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
}
/**
 * 保存按钮
 */
const handleSave = () => {
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

  .editor-top{
    padding: 2px 20px;
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
  
}

@media (max-width: 768px) {
}
</style>