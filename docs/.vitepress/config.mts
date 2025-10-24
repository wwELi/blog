import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'
import fs, { link } from 'node:fs';
import path from 'node:path';
import { SidebarItem } from 'vitepress-sidebar/types';
import _ from 'lodash'

const excludeFolders = ['.vitepress', 'public'];
const currentDir = path.join(process.cwd(), 'docs');
const files = fs.readdirSync(currentDir);
const folders = files.filter(filename => !excludeFolders.includes(filename) && fs.statSync(path.join(currentDir, filename)).isDirectory());

const sidebar = {};
const nav = folders.map((folder) => {
  const items = generateSidebar({
      documentRootPath: `docs/${folder}`, // 根目录
      scanStartPath: '',        // 从根开始
      basePath: '',            // 生成链接的基础路径
      useTitleFromFileHeading: true, // 从 Markdown 一级标题读取标题
      collapsed: true,          // ✅ 初始折叠状态（可改为 false 展开）
      sortMenusByFrontmatterOrder: true,
      sortFolderTo: 'bottom'
  }) as SidebarItem[]
  const defaultRoute = `/${folder}${items[0]?.link || ''}`;
  Object.assign(sidebar, {[`/${folder}/`]: items.map((item) => ({ ...item, link: `/${folder}${item.link}` }))});
  return { text: folder, link: defaultRoute, activeMatch: defaultRoute }
})
console.log(sidebar);
// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: "技术随笔",
  base: '/blog/',
  description: "西红柿红烧肉的博客",
  outDir: '../dist',
  ignoreDeadLinks: 'localhostLinks',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    logo: '/logo.png',
    search: {
      provider: 'local'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: '主页', link: '/' }, ...nav ],
    sidebar,
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
