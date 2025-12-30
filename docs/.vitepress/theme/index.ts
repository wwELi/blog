import DefaultTheme from 'vitepress/theme'
import GithubInfo from '../components/GithubInfo.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: any): void {
    // 注册全局组件
    app.component('GithubInfo', GithubInfo)
  }
}