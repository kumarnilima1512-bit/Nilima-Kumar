<template>
  <div class="theme-root" :class="colorMode.value">
    <!-- Particles -->
    <div class="particles-bg" aria-hidden="true">
      <span v-for="n in 18" :key="n" class="particle" :style="particleStyle(n)" />
    </div>

    <!-- Hero -->
    <section class="hero-section">
      <div class="hero-inner">

        <!-- Profile -->
        <div class="profile-wrapper" :class="{ loaded: mounted }">
          <div class="ring ring-outer" />
          <div class="ring ring-inner" />
          <div class="orbit-dot" />
          <div class="profile-circle">
            <img src="/images/profile.jpg" alt="Nilima Kumar" class="profile-img" />
          </div>
        </div>

        <!-- Text -->
        <div class="text-block" :class="{ loaded: mounted }">
          <p class="greeting-tag">👋 Hello, I'm</p>
          <h1 class="name-heading">Nilima Kumar</h1>
          <div class="typewriter-line">
            <span class="typed-text">{{ displayedText }}</span>
            <span class="cursor">|</span>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const colorMode = useColorMode()
const mounted = ref(false)

function particleStyle(n) {
  const size  = 2 + (n % 4)
  const left  = (n * 37 + 11) % 97
  const delay = (n * 0.4) % 6
  const dur   = 6 + (n % 5)
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${dur}s`,
  }
}

// ─── Typewriter — multiple texts ─────────────────
const texts = ['Full Stack Developer', 'Nuxt Developer']
let textIndex  = 0
let charIndex  = 0
let isDeleting = false

const displayedText = ref('')

function typeEffect() {
  const current = texts[textIndex]

  if (!isDeleting) {
    // typing
    displayedText.value = current.substring(0, charIndex + 1)
    charIndex++

    if (charIndex === current.length) {
      // pause then start deleting
      isDeleting = true
      setTimeout(typeEffect, 1800)
      return
    }
  } else {
    // deleting
    displayedText.value = current.substring(0, charIndex - 1)
    charIndex--

    if (charIndex === 0) {
      isDeleting = false
      // move to next text
      textIndex = (textIndex + 1) % texts.length
    }
  }

  setTimeout(typeEffect, isDeleting ? 55 : 95)
}

onMounted(() => {
  mounted.value = true
  setTimeout(typeEffect, 900)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@500;600&family=DM+Sans:wght@400;500&display=swap');

.theme-root {
  --bg:      #0a0a0f;
  --accent:  #7c3aed;
  --accent2: #a855f7;
  --text:    #f1f0ff;
  --ring:    rgba(124,58,237,0.5);
  --glow:    rgba(124,58,237,0.35);
  --particle:rgba(168,85,247,0.6);
  --card:    rgba(255,255,255,0.03);

  position: relative;
  min-height: 100vh;
  background: var(--bg);
  transition: background 0.5s ease;
}

.theme-root.light {
  --bg:      #f5f3ff;
  --accent:  #6d28d9;
  --accent2: #7c3aed;
  --text:    #1e1b4b;
  --ring:    rgba(109,40,217,0.4);
  --glow:    rgba(109,40,217,0.15);
  --particle:rgba(109,40,217,0.35);
  --card:    rgba(109,40,217,0.05);
  background: var(--bg);
}

/* Particles */
.particles-bg {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}
.particle {
  position: absolute;
  bottom: -10px;
  border-radius: 50%;
  background: var(--particle);
  animation: floatUp linear infinite;
  opacity: 0;
}
@keyframes floatUp {
  0%   { transform: translateY(0) scale(1); opacity: 0; }
  10%  { opacity: 0.7; }
  90%  { opacity: 0.4; }
  100% { transform: translateY(-100vh) scale(0.4); opacity: 0; }
}

/* Hero */
.hero-section {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
}
.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}
@media (min-width: 768px) {
  .hero-inner { flex-direction: row; gap: 5rem; }
}

/* Profile */
.profile-wrapper {
  position: relative;
  width: 220px;
  height: 220px;
  opacity: 0;
  transform: scale(0.8) rotate(-10deg);
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.34,1.56,0.64,1);
}
.profile-wrapper.loaded {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}
@media (min-width: 768px) {
  .profile-wrapper { width: 260px; height: 260px; }
}

.ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid var(--accent);
}
.ring-outer {
  inset: -16px;
  border-color: var(--accent2);
  opacity: 0.3;
  border-style: dashed;
  animation: spinSlow 10s linear infinite;
}
.ring-inner {
  inset: -6px;
  opacity: 0.5;
  animation: pulsRing 2.5s ease-in-out infinite;
}
@keyframes spinSlow { to { transform: rotate(360deg); } }
@keyframes pulsRing {
  0%,100% { transform: scale(1);    opacity: 0.5; box-shadow: 0 0 0 0 var(--ring); }
  50%     { transform: scale(1.04); opacity: 0.9; box-shadow: 0 0 28px 6px var(--ring); }
}

.orbit-dot {
  position: absolute;
  width: 12px; height: 12px;
  border-radius: 50%;
  background: var(--accent2);
  box-shadow: 0 0 10px var(--accent2);
  top: calc(50% - 6px);
  left: -22px;
  transform-origin: calc(100% + 22px + 50%) 50%;
  animation: orbit 4s linear infinite;
}
@keyframes orbit {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.profile-circle {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--accent);
  box-shadow: 0 0 40px var(--glow), 0 0 80px var(--glow);
}
.profile-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.profile-circle:hover .profile-img { transform: scale(1.06); }

/* Text */
.text-block {
  text-align: center;
  opacity: 0;
  transform: translateX(40px);
  transition: opacity 0.9s ease 0.3s, transform 0.9s cubic-bezier(0.34,1.2,0.64,1) 0.3s;
}
.text-block.loaded { opacity: 1; transform: translateX(0); }
@media (min-width: 768px) { .text-block { text-align: left; } }

.greeting-tag {
  display: inline-block;
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  color: var(--accent2);
  background: var(--card);
  border: 1px solid var(--ring);
  padding: 0.25rem 0.85rem;
  border-radius: 999px;
  margin-bottom: 1rem;
}

.name-heading {
  font-family: 'Syne', sans-serif;
  font-size: clamp(2.4rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.05;
  margin: 0 0 0.75rem;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--text) 60%, var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.typewriter-line {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.8rem;
}
@media (min-width: 768px) { .typewriter-line { justify-content: flex-start; } }

.typed-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(1.2rem, 3vw, 1.9rem);
  font-weight: 600;
  color: var(--accent2);
  transition: color 0.5s ease;
}

.cursor {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(1.2rem, 3vw, 1.9rem);
  color: var(--accent2);
  margin-left: 1px;
  animation: blink 0.75s step-end infinite;
}
@keyframes blink {
  0%,100% { opacity: 1; }
  50%     { opacity: 0; }
}
</style>