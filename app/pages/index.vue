<script setup>
definePageMeta({ layout: 'default' })
useSeoMeta({
  title: 'Nilima Kumar | Full Stack Developer',
  description:
    'Official portfolio of Nilima Kumar. Explore my projects, skills, experience, certifications, and AI-powered web development work built with Nuxt.js, Vue.js, TypeScript, and modern technologies.',
  ogTitle: 'Nilima Kumar | Full Stack Developer',
  ogDescription:
    'Explore my portfolio, projects, technical skills, and experience in Full Stack Development and AI.',
  ogImage: 'https://nilima-kumar.vercel.app/og-image.png',
  ogType: 'website',
  ogUrl: 'https://nilima-kumar.vercel.app',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Nilima Kumar | Full Stack Developer',
  twitterDescription:
    'Official portfolio of Nilima Kumar showcasing projects, skills, and experience.',
  twitterImage: 'https://nilima-kumar.vercel.app/images/og-image.png'
  })

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://nilima-kumar.vercel.app'
    }
  ]
})
</script>

<template>
  <div>
    <div id="home"><HeroSection /></div>
    <div id="about"><AboutSection /></div>
    <div id="projects"><ProjectsSection /></div>
    <div id="experience"><ExperienceSection /></div>
    <div id="skills"><SkillsSection /></div>
    <div id="certifications"><CertificationSection /></div>
    <div id="contact"><ContactSection /></div>
  </div>
</template>