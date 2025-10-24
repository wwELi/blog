import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "西红柿红烧肉的博客",
  base: '/blog/',
  description: "西红柿红烧肉的博客",
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
      { icon: 'github', link: 'https://github.com/wwELi/blog' }
    ],
        outlineTitle: '本页内容', // 页面大纲标题
    lastUpdated: {
      text: '最后更新于',
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    darkModeSwitchLabel: '外观',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    langMenuLabel: '语言',
    notFound: {
      title: '页面未找到',
      quote: '哎呀，这个页面不见了 😢',
      linkText: '返回首页',
    },
    outline: [2, 3]
  }
})
