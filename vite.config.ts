import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'icon'
        })
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        // 自动注册图标组件
        IconsResolver({
          prefix: "icon", // 图标引用规则：{prefix}-{collection}-{icon}，默认前缀是‘i’
          // 其他图标库请到 https://icon-sets.iconify.design/
          // enabledCollections: ['ep','mynaui']
        }),
      ],
      dts: true,
    }),
    Icons({
      compiler: 'vue3',// 指定编译器
      // 让unplugin-icons自动安装图标库
      autoInstall: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *;`
      },
    },
  },
  server: {
    host: '0.0.0.0',    // 监听所有地址
    port: 5173,         // 指定端口号
    strictPort: true,   // 端口被占用时直接退出
  }
}) 