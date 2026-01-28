// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  compatibilityDate: '2026-01-28',
  future: {
    compatibilityVersion: 4
  },
  modules: [],
  app: {
    baseURL: '/reaction',
    head: {
      title: '反应力测试',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '本地存储的反应时间测试工具，包含颜色测试和Simon Task。数据保存在本地设备上。Local-storage based reaction time tester with Color Test and Simon Task. Data stays on your device.' },
        { property: 'og:title', content: '反应力测试' },
        { property: 'og:description', content: '本地存储的反应时间测试工具，包含颜色测试和Simon Task。数据保存在本地设备上。Local-storage based reaction time tester with Color Test and Simon Task. Data stays on your device.' },
        { property: 'og:image', content: '/reaction/summary.png' },
        { property: 'og:image:alt', content: '反应力测试应用界面' },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: '/reaction/summary.png' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  }
})
