<template>
  <!-- 响应式容器 -->
  <div class="vditor-wrapper">
    <div ref="editorContainer"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  config: {
    type: Object,
    default: () => ({
      
    })
  }
})

const emit = defineEmits(['update:modelValue', 'ready'])
const editorContainer = ref()
let vditorInstance = null



// 智能暗黑模式适配
const detectTheme = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "classic"
}

/**
 * 返回文件上传格式化后的响应数据json字符串
 * @param files 上传文件列表
 * @param responseText 后端响应数据json字符串
 * @returns 格式化后的响应数据json字符串
 */
function formatResponse (files, responseText) {
  
  try { 
    const response = JSON.parse(responseText)
    // 初始化标准化响应结构
    const formatResponse = {
      code: response.status || 500,
      msg: response.message || "文件处理失败",
      data: {
        errFiles: [],
        succMap: {}
      }
    }

    if (response.status === 200) {
      // 动态构建成功映射表
      formatResponse.data.succMap = Array.from(files).reduce((acc, file) => {
        // 根据实际业务需求匹配文件与URL的逻辑
        acc[file.name] = response.data // 假设返回数据是直接可用的URL
        return acc
      }, {})
    }
    
    // 错误文件处理逻辑（根据业务需求补充）
    formatResponse.data.errFiles = Array.from(files)
      .filter(file => !formatResponse.data.succMap[file.name])
      .map(file => file.name)
    return JSON.stringify(formatResponse)
  } catch (error) {
    return JSON.stringify({
      code: 500,
      msg: "服务器响应异常",
      data: {
        errFiles: Array.from(files).map(f => f.name),
        succMap: {}
      }
    })
  }
}

function getToolbar () {
  
  const isMobile = window.innerWidth < 768; // 判断是否为移动端
  return isMobile ? [
    'headings',
    'bold',
    'link',
    'table',
    'ordered-list',
    'check',
    'quote',
    'line',
    'code',
    'inline-code',
    'upload',
    'undo',
    'redo',
    {
      name: "more",
      toolbar: [
          "fullscreen",
          "preview",
          "help",
      ],
    },
  ] : [
    'emoji',
    'headings',
    'bold',
    'italic',
    'strike',
    'link',
    '|',
    'list',
    'ordered-list',
    'check',
    'outdent',
    'indent',
    '|',
    'quote',
    'line',
    'code',
    'inline-code',
    'insert-before',
    'insert-after',
    '|',
    'upload',
    'record',
    'table',
    '|',
    'undo',
    'redo',
    '|',
    'fullscreen',
    'preview',
    'both',
    'format',
    'help'
  ]
 }

// 组合式API封装
const initEditor = async () => {
  try {
    vditorInstance = new Vditor(editorContainer.value, {
      ...props.config,
      cache: {
        enable: false
      },
      outline: {
        enable: true,
        position: 'left'
      },
      toolbar: getToolbar(),
      toolbarConfig: {
        pin: true,
      },
      theme: detectTheme(),
      value: props.modelValue,
      input: (value) => {
        emit('update:modelValue', value)
      },
      after: () => {
        emit('ready', vditorInstance)
      },
      upload: {
        url: 'http://localhost:8080/api/upload/file',
        format: (files, responseText) => {
          return formatResponse(files, responseText)
        },
        error: (msg) => {
          console.log("upload[error]:",msg)
        },
        fieldName: 'file',
        multiple: false,
        max: 2*1024*1024*1024 // 限制上传文件大小：2GB
      }
    })

    // 实时主题切换监听
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', e => {
        vditorInstance.setTheme(e.matches ? 'dark' : 'light')
      })
  } catch (error) {
    console.error('[VDitor] 初始化失败:', error)
  }
}


// 生命周期管理
onMounted(() => {
  initEditor()
})

onBeforeUnmount(() => {
  if (vditorInstance) {
    vditorInstance.destroy()
    vditorInstance = null
  }
})

// 内容同步
watch(() => props.modelValue, (newVal) => {
  if (vditorInstance && vditorInstance.getValue() !== newVal) {
    vditorInstance.setValue(newVal)
  }
})
</script>

<style scoped>
.vditor-wrapper {
  --v-border-radius: 8px;
  height: 100%;
}

:deep(.vditor) {
  border-radius: var(--v-border-radius);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* height: calc(100vh - 52px)!important; */
  height: 100%!important;
  /* min-height: 300px; */
}
/* @media (max-width: 768px) {
  :deep(.vditor){
    height: calc(100vh - 42px)!important;
  }
} */

:deep(.vditor-toolbar) {
  border-radius: var(--v-border-radius) var(--v-border-radius) 0 0;
}
</style>
