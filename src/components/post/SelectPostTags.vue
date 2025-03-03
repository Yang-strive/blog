<template>
  <div class="select-post-tags-wrapper">
    <!-- 标签选择触发器 -->
    <el-popover
      ref="popoverRef"
      :visible="visible"
      placement="bottom-start"
      :width="isMobile ? '90%' : 400"
      trigger="click"
      popper-class="fixed-tag-popper"
      :offset="0"
      :show-arrow="false"
    >
      <template #reference>
        <!-- 已选标签展示区 -->
        <div class="selected-tags-wrapper">
          <el-tag
            v-for="tag in selectedTags"
            :key="tag.id"
            closable
            :type="getTagColor(tag)"
            @close="handleCloseTag(tag)"
          >
            {{ tag.name }}
          </el-tag>
          <el-tag class="add-tag-trigger" @click="visible = !visible">
            <el-icon><Plus /></el-icon> 选择标签
          </el-tag>
        </div>
      </template>

      <!-- 标签选择面板 -->
      <div class="tag-selector-panel" v-click-outside="onCloseSelectPanel">
        <el-input
          v-model="searchQuery"
          placeholder="搜索标签..."
          clearable
          size="small"
          class="search-input"
        />

        <div class="tag-list">
          <el-tag
            v-for="tag in filteredTags"
            :key="tag.id"
            :type="isSelected(tag) ? 'success' : 'info'"
            class="tag-item"
            @click="toggleTag(tag)"
          >
            {{ tag.name }}
          </el-tag>
        </div>
      </div>
    </el-popover>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Plus } from "@element-plus/icons-vue";
import type { PropType } from "vue";
import { ClickOutside as vClickOutside } from 'element-plus' // 当点击外部时触发

interface Tag {
  id: string | number;
  name: string;
  color?: string;
}

const props = defineProps({
  modelValue: {
    type: Array as PropType<Tag[]>,
    default: () => [],
  },
});

let tagOptions = ref<Tag[]>([]); // 标签选项
const visible = ref();
const emit = defineEmits(["update:modelValue"]);
const isMobile = computed(() => window.innerWidth < 768);
const searchQuery = ref("");
const selectedTags = ref<Tag[]>(props.modelValue);
const popoverRef = ref();


// 初始化标签选项
onMounted(() => {
  tagOptions.value = [
    { id: 1, name: "标签1", color: "primary" },
    { id: 2, name: "标签2", color: "success" },
    { id: 3, name: "标签3", color: "warning" },
    { id: 4, name: "标签4", color: "danger" },
    { id: 5, name: "标签5", color: "info" },
  ];
});

// 关闭面板
const onCloseSelectPanel = () => {
  popoverRef.value.hide();
  
}

// 过滤后的标签列表
const filteredTags = computed(() => {
  return tagOptions.value.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 切换标签选择状态
const toggleTag = (tag: Tag) => {
  const index = selectedTags.value.findIndex((t) => t.id === tag.id);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
  emitUpdate();
};

// 删除标签
const handleCloseTag = (tag: Tag) => {
  selectedTags.value = selectedTags.value.filter((t) => t.id !== tag.id);
  emitUpdate();
};

// 判断是否已选中
const isSelected = (tag: Tag) => {
  return selectedTags.value.some((t) => t.id === tag.id);
};

// 生成标签颜色
const getTagColor = (tag: Tag):any => {
  return tag.color || "primary";
};

// 触发更新事件
const emitUpdate = () => {
  emit("update:modelValue", selectedTags.value);
};
</script>
<style scoped lang="scss">
.select-post-tags-wrapper {
  .selected-tags-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;

    .el-tag {
      cursor: default;
      transition: all 0.3s;

      &.add-tag-trigger {
        background-color: var(--el-color-primary-light-9);
        border-color: var(--el-color-primary-light-7);
        cursor: pointer;

        &:hover {
          background-color: var(--el-color-primary-light-8);
        }
      }
    }
  }

  .tag-selector-panel {
    padding: 16px;

    .search-input {
      margin-bottom: 12px;
    }

    .tag-list {
      max-height: 60vh;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 8px;
      max-height: 200px;
      overflow-y: auto;

      .tag-item {
        cursor: pointer;
        transition: transform 0.2s;

        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }
}
.fixed-tag-popper {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  max-height: 70vh;
  overflow-y: auto;

  &.el-popover {
    margin: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    width: 90% !important;
    max-width: 400px;
  }
}
@media (max-width: 768px) {
  .tag-selector-panel {
    width: 90vw !important;

    .tag-list {
      grid-template-columns: repeat(3, 1fr) !important;
    }
  }
}
</style>
