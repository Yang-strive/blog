<!-- eslint-disable no-undef -->
<!-- 选择文章分类标签组件 -->
<template>
  <div class="select-doc-tags">
    <!-- 标签搜索 -->
    <el-input
      v-model="searchText"
      placeholder="搜索标签"
      clearable
      @input="handleSearch"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>

    <!-- 标签列表 -->
    <div class="tags-container">
      <el-tag
        v-for="tag in filteredTags"
        :key="tag.id"
        :type="isSelected(tag) ? 'primary' : ''"
        class="tag-item"
        @click="handleTagClick(tag)"
      >
        {{ tag.content }}
        <span class="tag-count">({{ tag.count }})</span>
      </el-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'

// 定义 props
const props = defineProps<{
  selectTags: Array<{
    id: number
    content: string
  }>
}>()

// 模拟标签数据
const mockTags = [
  { id: 1, content: 'Vue3', count: 125 },
  { id: 2, content: 'React', count: 98 },
  { id: 3, content: 'TypeScript', count: 156 },
  { id: 4, content: 'JavaScript', count: 234 },
  { id: 5, content: 'Node.js', count: 89 },
  { id: 6, content: 'Express', count: 45 },
  { id: 7, content: 'MongoDB', count: 67 },
  { id: 8, content: 'MySQL', count: 78 },
  { id: 9, content: 'Docker', count: 92 },
  { id: 10, content: 'Kubernetes', count: 34 }
]

// 搜索文本
const searchText = ref('')

// 根据搜索文本过滤标签
const filteredTags = computed(() => {
  const text = searchText.value.toLowerCase()
  return mockTags.filter(tag => 
    tag.content.toLowerCase().includes(text)
  )
})

// 判断标签是否已选中
const isSelected = (tag: { id: number }) => {
  return props.selectTags.some(t => t.id === tag.id)
}

// 处理标签点击
const handleTagClick = (tag: { id: number; content: string }) => {
  // 如果已选中则取消选中，否则添加到选中列表
  if (isSelected(tag)) {
    props.selectTags.splice(
      props.selectTags.findIndex(t => t.id === tag.id),
      1
    )
  } else {
    props.selectTags.push(tag)
  }
}

// 处理搜索
const handleSearch = () => {
  // 实际项目中这里可能需要调用后端接口
  // const searchTags = async () => {
  //   try {
  //     const response = await fetch(`/api/tags/search?keyword=${searchText.value}`)
  //     const data = await response.json()
  //     tags.value = data
  //   } catch (error) {
  //     console.error('搜索标签失败:', error)
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.select-doc-tags {
  padding: 16px;

  .el-input {
    margin-bottom: 16px;
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .tag-item {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
      }

      .tag-count {
        margin-left: 4px;
        font-size: 12px;
        opacity: 0.8;
      }
    }
  }
}
</style>
