<template>
  <div class="search-page">
    <!-- 顶部导航栏 -->
    <div class="search-header">
      <div class="header-content">
        <el-button class="back-btn" @click="router.back()">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="search-box">
          <el-autocomplete
            v-model="searchKeyword"
            :fetch-suggestions="querySearchAsync"
            placeholder="搜索文章..."
            class="search-input"
            :trigger-on-focus="false"
            @select="handleSelect"
            @keyup.enter="handleSearch"
            clearable
          >
            <template #default="{ item }">
              <div class="suggestion-item">
                <el-icon><Search /></el-icon>
                <span>{{ item.value }}</span>
              </div>
            </template>
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-autocomplete>
          <el-button class="search-btn" @click="handleSearch">
            搜索
          </el-button>
        </div>
      </div>
    </div>

    <!-- 搜索历史 -->
    <div class="search-content">
      <div v-if="!searchKeyword && searchHistory.length > 0" class="search-history">
        <div class="history-header">
          <h3>搜索历史</h3>
          <el-button link @click="clearHistory">
            <el-icon><Delete /></el-icon>
            清空历史
          </el-button>
        </div>
        <div class="history-list">
          <el-tag
            v-for="item in searchHistory"
            :key="item"
            class="history-item"
            @click="searchKeyword = item"
          >
            {{ item }}
          </el-tag>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div v-if="resultList" class="search-results">
        <div class="result-header">
          <span>搜索结果</span>
          <span class="result-count">共 {{ mockResults.length }} 条</span>
        </div>
        
        <el-empty v-if="mockResults.length === 0" description="暂无搜索结果" />
        
        <div v-else class="result-list">
          <div
            v-for="item in mockResults"
            :key="item.id"
            class="result-item"
            @click="router.push(`/posts/${item.id}`)"
          >
            <h3 class="title">{{ item.title }}</h3>
            <p class="summary">{{ item.summary }}</p>
            <div class="meta">
              <span>{{ item.author }}</span>
              <span>{{ item.date }}</span>
              <span>{{ item.views }} 阅读</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, Delete, ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 定义搜索结果类型
interface SearchResult {
  id: number
  title: string
  summary: string
  author: string
  date: string
  views: number
}


const route = useRoute()
const router = useRouter()
const searchKeyword = ref('')
const searchHistory = ref<string[]>([]) // 搜索历史
const resultList = ref<SearchResult[]>() // 搜索结果列表
const mockResults = ref<SearchResult[]>() // 模拟搜索结果
// 模拟搜索结果
mockResults.value = [
  {
    id: 1,
    title: '如何使用 Vue3 和 TypeScript',
    summary: 'Vue3 和 TypeScript 的结合使用可以带来更好的开发体验...',
    author: '张三',
    date: '2024-01-15',
    views: 1234
  },
  {
    id: 2,
    title: '前端性能优化实践',
    summary: '本文将介绍一些实用的前端性能优化技巧...',
    author: '李四',
    date: '2024-01-14',
    views: 2345
  }
]


// 模拟热门搜索词
const hotSearches = [
  '前端开发',
  'Vue3教程',
  'TypeScript入门',
  'React实战',
  'Node.js',
  'JavaScript高级'
]

// 模拟搜索建议
const querySearchAsync = (queryString: string, cb: (arg: any[]) => void) => {
  if (!queryString) {
    cb([])
    return
  }

  const results = hotSearches
    .filter(item => item.toLowerCase().includes(queryString.toLowerCase()))
    .map(item => ({ value: item }))

  // 模拟异步请求
  setTimeout(() => {
    cb(results)
  }, 300)
}

// 处理选择搜索建议
const handleSelect = (item: { value: string }) => {
  searchKeyword.value = item.value
  handleSearch()
}

// 从 localStorage 加载搜索历史
const loadSearchHistory = () => {
  const history = localStorage.getItem('searchHistory')
  if (history) {
    searchHistory.value = JSON.parse(history)
  }
}

// 保存搜索历史
const saveSearchHistory = (keyword: string) => {
  if (!keyword) return
  const history = new Set([keyword, ...searchHistory.value])
  searchHistory.value = Array.from(history).slice(0, 10)
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

// 清空搜索历史
const clearHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
  ElMessage.success('搜索历史已清空')
}

// 修改搜索处理函数
const handleSearch = () => {
  // 清除搜索结果
  resultList.value = []
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return

  }
  saveSearchHistory(searchKeyword.value.trim())
  // TODO: 实际的搜索逻辑
  resultList.value = mockResults.value.filter(item => item.title.toLowerCase().includes(searchKeyword.value.toLowerCase()))
  console.log('搜索:', searchKeyword.value)
}

onMounted(() => {
  // 从 URL 参数中获取搜索关键词
  const keyword = route.query.keyword as string
  if (keyword) {
    searchKeyword.value = keyword
    handleSearch()
  }
  loadSearchHistory()
})
</script>

<style lang="scss" scoped>
.search-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;

  .search-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    z-index: 100;

    .header-content {
      height: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 16px;
      max-width: 800px;
      margin: 0 auto;

      .back-btn {
        padding: 8px;
        border: none;
        background: none;
        color: #606266;
        
        .el-icon {
          font-size: 20px;
        }
      }

      .search-box {
        display: flex;
        align-content: center;
        flex: 1;
        position: relative;
        max-width: 300px;
        

        .search-input {
          flex: 1;
          :deep(.el-input__wrapper) {
            border-radius: 20px 0px 0px 20px;
            background-color: #fff;
            box-shadow: none !important;
            // border: none;
            padding: 0 16px;
            height: 40px;
            line-height: 40px;

            &.is-focus {
              box-shadow: none !important;
            }

            .el-input__prefix {
              margin-left: 4px;
              color: #999;
              height: 40px;
              line-height: 40px;
            }

            .el-input__clear {
              position: absolute;
              right: 8px;
              margin-right: 0;
              color: #999;
              font-size: 16px;
              height: 40px;
              line-height: 40px;
            }

            .el-input__inner {
              font-size: 16px;
              color: #333;
              height: 40px;
              line-height: 40px;
              
              &::placeholder {
                color: #999;
                font-size: 14px;
              }
            }
          }
        }

        .search-btn {
          // height: 40px;
          padding: 0 20px;
          border: none;
          border-radius: 0px 20px 20px 0px;
          background-color: var(--el-color-primary);
          color: #fff;
          font-size: 15px;
          font-weight: 500;
          // min-width: 100px;

          &:hover {
            background-color: var(--el-color-primary-dark-2);
          }
        }
      }
    }
  }

  .search-content {
    flex: 1;
    padding: 72px 16px 16px;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
  }

  .search-history {
    margin-top: 8px;
    padding: 16px;
    background: #f5f7fa;
    // 取消边框  update by 2025-02-05 杨杰
    /* border-radius: 4px;
    border: 1px solid #ebeef5; */

    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      h3 {
        margin: 0;
        font-size: 14px;
        color: #606266;
        font-weight: normal;
      }
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .history-item {
        cursor: pointer;
        background-color: #f5f7fa;
        border: none;
        
        &:hover {
          color: var(--el-color-primary);
          background-color: #ecf5ff;
        }
      }
    }
  }

  .search-results {
    margin-top: 16px;

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding: 0 16px;
      
      .result-count {
        color: #999;
        font-size: 14px;
      }
    }

    .result-list {
      .result-item {
        padding: 16px;
        background: #fff;
        border-radius: 8px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .title {
          margin: 0 0 8px;
          font-size: 16px;
          color: #333;
        }

        .summary {
          margin: 0 0 12px;
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }

        .meta {
          display: flex;
          gap: 16px;
          color: #999;
          font-size: 12px;
        }
      }
    }
  }
}

// 响应式适配
@media screen and (max-width: 768px) {
  .search-page {
    .search-header {
      height: 50px;
    }

    .search-content {
      padding: 12px 12px 12px;
    }

    .search-results {
      .result-item {
        padding: 12px;

        .title {
          font-size: 15px;
        }

        .summary {
          font-size: 13px;
        }
      }
    }
  }
}
</style> 