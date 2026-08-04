// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxtjs/tailwindcss','@nuxtjs/color-mode','@nuxtjs/sitemap'],
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/logo.png' }
      ]
    }
  },
  colorMode: {
    classSuffix: '',
    preference: 'dark' 
  },
  runtimeConfig: {
    geminiApiKey:           process.env.GEMINI_API_KEY,
    notionToken:            process.env.NOTION_TOKEN,
    notionProjectsDb:       process.env.NOTION_PROJECTS_DB,
    notionExperienceDb:     process.env.NOTION_EXPERIENCE_DB,
    notionSkillsDb:         process.env.NOTION_SKILLS_DB,
    notionCertificationsDb: process.env.NOTION_CERTIFICATIONS_DB,
    notionChatbotDb:        process.env.NOTION_CHATBOT_DB
  },
  devtools: { enabled: true }
})