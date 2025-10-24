import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  outDir: '../dist',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '文章', link: '/liux命令.md' }
    ],
    sidebar: generateSidebar({
      documentRootPath: 'docs', // 根目录
      scanStartPath: '',        // 从根开始
      basePath: '/',            // 生成链接的基础路径
      useTitleFromFileHeading: true, // 从 Markdown 一级标题读取标题
      collapsed: true,          // ✅ 初始折叠状态（可改为 false 展开）
      sortMenusByFrontmatterOrder: true,
      excludeByGlobPattern: ['index.md'], // 排除首页
     }),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
