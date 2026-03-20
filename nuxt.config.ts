// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxtjs/tailwindcss','@nuxtjs/color-mode'],
  colorMode: {
    classSuffix: '',
    preference: 'dark' 
  },
  devtools: { enabled: true }
})
