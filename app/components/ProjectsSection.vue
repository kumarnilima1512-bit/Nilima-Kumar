<template>
  <div class="projects-root" :class="colorMode.value">
    <section class="projects-section">

      <div class="section-title-wrap">
        <h2 class="section-title">My <span class="highlight">Projects</span></h2>
        <div class="title-line" />
      </div>

      <!-- Loading -->
      <div v-if="pending" class="loading-wrap">
        <div class="loader" />
        <p class="loading-text">Loading projects...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-wrap">
        <p>Failed to load projects. Please try again.</p>
      </div>

      <!-- Orbital System -->
      <div v-else class="orbital-system">
        <div class="orbit-ring" :style="ringStyle" />

        <!-- Center Avatar -->
        <div class="center-avatar">
          <div class="avatar-glow" />
          <img src="/images/profile.jpg" alt="Nilima Kumar" class="avatar-img" />
        </div>

        <!-- Orbiting project nodes -->
        <div
          v-for="(project, i) in projects"
          :key="project.id"
          class="orbit-node"
          :style="nodeStyle(i)"
          @mouseenter="pauseOrbit(); hoveredCard = i"
          @mouseleave="resumeOrbit(); hoveredCard = null"
          @click.stop="toggleCard(i)"
        >
          <div class="node-bubble" :class="{ active: hoveredCard === i, 'yellow-bg': i === 1 }">
            <img
              v-if="project.image"
              :src="project.image"
              :alt="project.title"
              class="node-img"
            />
            <span v-else class="node-fallback">{{ project.title.charAt(0) }}</span>
          </div>

          <transition name="card-pop">
            <div v-if="hoveredCard === i" class="project-popup" :class="popupPosition(i)" @click.stop>
              <h3 class="popup-title">{{ project.title }}</h3>
              <p class="popup-desc">{{ project.description }}</p>
              <div class="popup-tags">
                <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <div class="popup-links">
                <a v-if="project.demo" :href="project.demo" target="_blank" class="plink demo-link">
                  <svg viewBox="0 0 24 24" fill="none" class="plink-icon">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <polyline points="15,3 21,3 21,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Live
                </a>
                <a v-if="project.github" :href="project.github" target="_blank" class="plink github-link">
                  <svg viewBox="0 0 24 24" fill="currentColor" class="plink-icon">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </transition>
        </div>
      </div>

    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const colorMode   = useColorMode()
const hoveredCard = ref(null)
const angle       = ref(0)
let   animFrame   = null
let   paused      = false

const { data: projects, pending, error } = await useFetch('/api/projects')

// Orbit radius shrinks on small screens so the circle still fits and keeps
// rotating, instead of being disabled/stacked on mobile.
const orbitRadius = ref(210)

function updateRadius() {
  const w = window.innerWidth
  if (w <= 380)      orbitRadius.value = 85
  else if (w <= 480)  orbitRadius.value = 100
  else if (w <= 640)  orbitRadius.value = 120
  else if (w <= 900)  orbitRadius.value = 160
  else                orbitRadius.value = 210
}

const ringStyle = computed(() => ({
  width:  `${orbitRadius.value * 2}px`,
  height: `${orbitRadius.value * 2}px`,
}))

const SPEED  = 0.005

function nodeStyle(i) {
  const total     = (projects.value?.length || 1)
  const baseAngle = (i / total) * Math.PI * 2
  const current   = baseAngle + angle.value
  const x = Math.cos(current) * orbitRadius.value
  const y = Math.sin(current) * orbitRadius.value
  return { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }
}

function popupPosition(i) {
  const total     = (projects.value?.length || 1)
  const baseAngle = (i / total) * Math.PI * 2
  const current   = (baseAngle + angle.value) % (Math.PI * 2)
  const x = Math.cos(current)
  const y = Math.sin(current)
  if (x > 0.3)  return 'popup-right'
  if (x < -0.3) return 'popup-left'
  if (y < 0)    return 'popup-top'
  return 'popup-bottom'
}

function animate() {
  if (!paused) angle.value += SPEED
  animFrame = requestAnimationFrame(animate)
}

function pauseOrbit()  { paused = true }
function resumeOrbit() { paused = false }

// Tap-to-toggle for touch devices (mouseenter/mouseleave don't fire on touch,
// so without this mobile users could never see project details).
function toggleCard(i) {
  if (hoveredCard.value === i) {
    hoveredCard.value = null
    resumeOrbit()
  } else {
    hoveredCard.value = i
    pauseOrbit()
  }
}

// Tapping anywhere outside an open popup closes it (mobile UX)
function handleOutsideClick() {
  if (hoveredCard.value !== null) {
    hoveredCard.value = null
    resumeOrbit()
  }
}

onMounted(() => {
  updateRadius()
  animFrame = requestAnimationFrame(animate)
  document.addEventListener('click', handleOutsideClick)
  window.addEventListener('resize', updateRadius)
})
onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
  document.removeEventListener('click', handleOutsideClick)
  window.removeEventListener('resize', updateRadius)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@500;600&family=DM+Sans:wght@400;500&display=swap');

.projects-root {
  --bg: #0a0a0f; --bg2: #12121a; --accent: #7c3aed; --accent2: #a855f7;
  --text: #f1f0ff; --subtext: #9ca3af; --ring: rgba(124,58,237,0.5);
  --glow: rgba(124,58,237,0.25); --card: rgba(255,255,255,0.04); --border: rgba(124,58,237,0.2);
  background: var(--bg); transition: background 0.5s ease;
}
.projects-root.light {
  --bg: #f5f3ff; --bg2: #ede9fe; --accent: #6d28d9; --accent2: #7c3aed;
  --text: #1e1b4b; --subtext: #6b7280; --ring: rgba(109,40,217,0.4);
  --glow: rgba(109,40,217,0.12); --card: rgba(109,40,217,0.04); --border: rgba(109,40,217,0.18);
  background: var(--bg);
}
.projects-section { max-width: 1100px; margin: 0 auto; padding: 6rem 2rem; }
.section-title-wrap { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 4rem; }
.section-title { font-family: 'Syne', sans-serif; font-size: clamp(2rem,4vw,2.8rem); font-weight: 800; color: var(--text); white-space: nowrap; }
.highlight { background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.title-line { flex:1; height:1px; background: linear-gradient(90deg, var(--border), transparent); }

/* Loading */
.loading-wrap { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 4rem 0; }
.loader { width: 40px; height: 40px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--accent2); animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text { font-family: 'DM Sans', sans-serif; color: var(--subtext); font-size: 0.9rem; }
.error-wrap { text-align: center; padding: 3rem; color: var(--subtext); font-family: 'DM Sans', sans-serif; }

/* Orbital */
.orbital-system { position: relative; width: 100%; height: 560px; display: flex; align-items: center; justify-content: center; }
.orbit-ring { position: absolute; border-radius: 50%; border: 1.5px dashed rgba(168,85,247,0.2); top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none; transition: width 0.3s ease, height 0.3s ease; }
.center-avatar { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 10; width: 150px; height: 150px; }
.avatar-glow { position: absolute; inset: -14px; border-radius: 50%; background: radial-gradient(circle, var(--glow) 0%, transparent 70%); animation: pulseGlow 2.5s ease-in-out infinite; }
@keyframes pulseGlow { 0%,100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.12); } }
.avatar-img { width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 3px solid var(--accent); box-shadow: 0 0 30px var(--glow), 0 0 60px var(--glow); position: relative; z-index: 2; }
.orbit-node { position: absolute; top: 50%; left: 50%; z-index: 20; cursor: pointer; }
.node-bubble { width: 72px; height: 72px; border-radius: 50%; overflow: hidden; border: 2.5px solid var(--border); box-shadow: 0 0 12px var(--glow); transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s; display: flex; align-items: center; justify-content: center; }
.node-bubble.active { border-color: var(--accent2); box-shadow: 0 0 24px var(--ring), 0 0 48px var(--glow); transform: scale(1.18); }
.node-bubble.yellow-bg { background: #fef08a; border-color: #eab308; box-shadow: 0 0 12px rgba(234,179,8,0.4); }
.node-bubble.yellow-bg.active { border-color: #ca8a04; box-shadow: 0 0 24px rgba(234,179,8,0.7); }
.node-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; pointer-events: none; }
.node-fallback { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; color: var(--accent2); }

/* Popup */
.project-popup { position: absolute; width: 250px; background: var(--bg2); border: 1px solid var(--accent2); border-radius: 16px; padding: 1rem; box-shadow: 0 0 30px var(--glow), 0 8px 32px rgba(0,0,0,0.4); z-index: 50; backdrop-filter: blur(14px); }
.popup-right  { left: 82px;  top: 50%; transform: translateY(-50%); }
.popup-left   { right: 82px; top: 50%; transform: translateY(-50%); }
.popup-top    { bottom: 82px; left: 50%; transform: translateX(-50%); }
.popup-bottom { top: 82px;   left: 50%; transform: translateX(-50%); }
.popup-title { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700; color: var(--text); margin-bottom: 0.4rem; }
.popup-desc { font-family: 'DM Sans', sans-serif; font-size: 0.78rem; color: var(--subtext); line-height: 1.5; margin-bottom: 0.65rem; }
.popup-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.7rem; }
.tag { font-family: 'JetBrains Mono', monospace; font-size: 0.62rem; padding: 0.12rem 0.45rem; border-radius: 999px; background: var(--card); border: 1px solid var(--border); color: var(--accent2); }
.popup-links { display: flex; gap: 0.5rem; }
.plink { display: inline-flex; align-items: center; gap: 4px; font-family: 'DM Sans', sans-serif; font-size: 0.72rem; font-weight: 600; padding: 0.28rem 0.65rem; border-radius: 999px; text-decoration: none; transition: box-shadow 0.2s, transform 0.2s; }
.demo-link { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: white; }
.demo-link:hover { box-shadow: 0 0 14px var(--ring); transform: translateY(-1px); }
.github-link { background: var(--card); border: 1px solid var(--border); color: var(--text); }
.github-link:hover { border-color: var(--accent2); color: var(--accent2); }
.plink-icon { width: 11px; height: 11px; }
.card-pop-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.card-pop-leave-active { transition: opacity 0.15s ease; }
.card-pop-enter-from { opacity: 0; transform: scale(0.9); }
.card-pop-leave-to { opacity: 0; }

/* Tablet: shrink orbit + section padding so it doesn't overflow */
@media (max-width: 900px) {
  .projects-section { padding: 4.5rem 1.5rem; }
  .orbital-system { height: 460px; }
  .center-avatar { width: 130px; height: 130px; }
  .avatar-img { width: 130px; height: 130px; }
  .node-bubble { width: 66px; height: 66px; }
}

/* Mobile: orbit keeps rotating, just at a smaller radius (see orbitRadius
   in script) so it stays inside the screen instead of overflowing */
@media (max-width: 640px) {
  .projects-section { padding: 3rem 1.1rem; }
  .section-title-wrap { margin-bottom: 2.5rem; }
  .orbital-system { height: 360px; }
  .center-avatar { width: 100px; height: 100px; }
  .avatar-img { width: 100px; height: 100px; }
  .node-bubble { width: 56px; height: 56px; }

  /* Smaller popup card so it doesn't run off the edge of the screen */
  .project-popup { width: min(220px, 70vw); padding: 0.8rem; }
  .popup-right  { left: 62px; }
  .popup-left   { right: 62px; }
  .popup-top    { bottom: 62px; }
  .popup-bottom { top: 62px; }
}

@media (max-width: 380px) {
  .orbital-system { height: 300px; }
  .center-avatar { width: 84px; height: 84px; }
  .avatar-img { width: 84px; height: 84px; }
  .node-bubble { width: 48px; height: 48px; }
}
</style>