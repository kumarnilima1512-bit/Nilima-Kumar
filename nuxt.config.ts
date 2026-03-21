// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxtjs/tailwindcss','@nuxtjs/color-mode'],
  colorMode: {
    classSuffix: '',
    preference: 'dark' 
  },
  runtimeConfig: {
    notionToken:            process.env.NOTION_TOKEN,
    notionProjectsDb:       process.env.NOTION_PROJECTS_DB,
    notionExperienceDb:     process.env.NOTION_EXPERIENCE_DB,
    notionSkillsDb:         process.env.NOTION_SKILLS_DB,
    notionCertificationsDb: process.env.NOTION_CERTIFICATIONS_DB,
  },
  devtools: { enabled: true }
})
