<template>
  <div class="projects-root" :class="colorMode.value">
    <section class="projects-section">

      <div class="section-title-wrap">
        <h2 class="section-title"><span class="highlight">Projects</span></h2>
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
      <div v-else class="orbital-system" :style="systemStyle">
        <!-- Inner wrapper: fixed size, auto-scaled down if it's wider than the screen -->
        <div class="orbital-inner" :style="innerStyle">

          <!-- One dashed ring per group of 5 projects -->
          <div
            v-for="(ring, r) in rings"
            :key="'ring-' + r"
            class="orbit-ring"
            :style="ringStyle(r)"
          />

          <!-- Center Avatar -->
          <div class="center-avatar">
            <div class="avatar-glow" />
            <img src="/images/profile.jpg" alt="Nilima Kumar" class="avatar-img" />
          </div>

          <!-- Orbiting project nodes (all rings) -->
          <div
            v-for="node in nodes"
            :key="node.project.id"
            class="orbit-node"
            :style="nodeStyle(node)"
            @mouseenter="pauseOrbit(); hoveredCard = node.project.id"
            @mouseleave="resumeOrbit(); hoveredCard = null"
            @click.stop="toggleCard(node.project.id)"
          >
            <div
              class="node-bubble"
              :class="{ active: hoveredCard === node.project.id, 'yellow-bg': node.flatIndex === 1 }"
            >
              <img
                v-if="node.project.image"
                :src="node.project.image"
                :alt="node.project.title"
                class="node-img"
              />
              <span v-else class="node-fallback">{{ node.project.title.charAt(0) }}</span>
            </div>

            <transition name="card-pop">
              <div
                v-if="hoveredCard === node.project.id"
                class="project-popup"
                :class="popupPosition(node)"
                @click.stop
              >
                <h3 class="popup-title">{{ node.project.title }}</h3>
                <p class="popup-desc">{{ node.project.description }}</p>
                <div class="popup-tags">
                  <span v-for="tag in node.project.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
                <div class="popup-links">
                  <a v-if="node.project.demo" :href="node.project.demo" target="_blank" class="plink demo-link">
                    <svg viewBox="0 0 24 24" fill="none" class="plink-icon">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                      <polyline points="15,3 21,3 21,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Live
                  </a>
                  <a v-if="node.project.github" :href="node.project.github" target="_blank" class="plink github-link">
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
      </div>

    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const colorMode   = useColorMode()
const hoveredCard = ref(null)   // stores project.id
const angle       = ref(0)
let   animFrame   = null
let   paused      = false

const { data: projects, pending, error } = await useFetch('/api/projects')

// ─── Config ──────────────────────────────────────
const PER_RING = 5      // max projects per ring
const SPEED    = 0.005

// Smaller rings: innermost radius + gap between rings + bubble size.
// All three shrink further on smaller screens.
const baseRadius = ref(150)
const ringGap    = ref(70)
const bubbleSize = ref(52)
const availWidth = ref(1000)   // width available for the orbital system

function updateRadius() {
  const w = window.innerWidth
  if (w <= 380)      { baseRadius.value = 68;  ringGap.value = 34; bubbleSize.value = 32 }
  else if (w <= 480) { baseRadius.value = 80;  ringGap.value = 40; bubbleSize.value = 36 }
  else if (w <= 640) { baseRadius.value = 95;  ringGap.value = 46; bubbleSize.value = 40 }
  else if (w <= 900) { baseRadius.value = 125; ringGap.value = 58; bubbleSize.value = 46 }
  else               { baseRadius.value = 150; ringGap.value = 70; bubbleSize.value = 52 }

  // section max-width 1100px minus its horizontal padding
  const pad = w <= 640 ? 36 : w <= 900 ? 48 : 64
  availWidth.value = Math.min(w, 1100) - pad
}

// ─── Group projects into rings of 5 ──────────────
const rings = computed(() => {
  const list   = projects.value || []
  const result = []
  for (let i = 0; i < list.length; i += PER_RING) {
    result.push(list.slice(i, i + PER_RING))
  }
  return result
})

function radiusOf(ringIndex) {
  return baseRadius.value + ringIndex * ringGap.value
}

const nodes = computed(() => {
  const out = []
  let flatIndex = 0
  rings.value.forEach((ring, r) => {
    ring.forEach((project, i) => {
      out.push({
        project,
        ringIndex: r,
        indexInRing: i,
        ringSize: ring.length,
        flatIndex: flatIndex++,
      })
    })
  })
  return out
})

// Full size of the system (outermost ring + room for the bubble)
const fullSize = computed(() => {
  const count = Math.max(rings.value.length, 1)
  return radiusOf(count - 1) * 2 + bubbleSize.value + 24
})

// If there are so many rings that the system is wider than the screen,
// scale the whole thing down to fit. Never scales up.
const scale = computed(() => Math.min(1, availWidth.value / fullSize.value))

const systemStyle = computed(() => ({
  height: `${fullSize.value * scale.value}px`,
  '--bubble': `${bubbleSize.value}px`,
}))

const innerStyle = computed(() => ({
  width:  `${fullSize.value}px`,
  height: `${fullSize.value}px`,
  transform: `translate(-50%, -50%) scale(${scale.value})`,
}))

function ringStyle(r) {
  const size = radiusOf(r) * 2
  return { width: `${size}px`, height: `${size}px` }
}

// Alternate direction per ring + slightly different speeds
function ringAngle(ringIndex) {
  const direction = ringIndex % 2 === 0 ? 1 : -1
  const speedMul  = 1 - ringIndex * 0.12
  return angle.value * direction * Math.max(speedMul, 0.4)
}

function nodeStyle(node) {
  const baseAngle = (node.indexInRing / node.ringSize) * Math.PI * 2
  const current   = baseAngle + ringAngle(node.ringIndex)
  const radius    = radiusOf(node.ringIndex)
  const x = Math.cos(current) * radius
  const y = Math.sin(current) * radius
  return { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }
}

function popupPosition(node) {
  const baseAngle = (node.indexInRing / node.ringSize) * Math.PI * 2
  const current   = baseAngle + ringAngle(node.ringIndex)
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

function toggleCard(id) {
  if (hoveredCard.value === id) {
    hoveredCard.value = null
    resumeOrbit()
  } else {
    hoveredCard.value = id
    pauseOrbit()
  }
}

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

/* Orbital (height + --bubble are set dynamically via :style="systemStyle") */
.orbital-system { --bubble: 52px; position: relative; width: 100%; overflow: visible; }
.orbital-inner { position: absolute; top: 50%; left: 50%; transform-origin: center center; }
.orbit-ring { position: absolute; border-radius: 50%; border: 1.5px dashed rgba(168,85,247,0.2); top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none; transition: width 0.3s ease, height 0.3s ease; }
.center-avatar { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 10; width: 110px; height: 110px; }
.avatar-glow { position: absolute; inset: -10px; border-radius: 50%; background: radial-gradient(circle, var(--glow) 0%, transparent 70%); animation: pulseGlow 2.5s ease-in-out infinite; }
@keyframes pulseGlow { 0%,100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.12); } }
.avatar-img { width: 110px; height: 110px; border-radius: 50%; object-fit: cover; border: 3px solid var(--accent); box-shadow: 0 0 24px var(--glow), 0 0 48px var(--glow); position: relative; z-index: 2; }
.orbit-node { position: absolute; top: 50%; left: 50%; z-index: 20; cursor: pointer; }
.node-bubble { width: var(--bubble); height: var(--bubble); border-radius: 50%; overflow: hidden; border: 2px solid var(--border); box-shadow: 0 0 10px var(--glow); transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s; display: flex; align-items: center; justify-content: center; }
.node-bubble.active { border-color: var(--accent2); box-shadow: 0 0 20px var(--ring), 0 0 40px var(--glow); transform: scale(1.18); }
.node-bubble.yellow-bg { background: #fef08a; border-color: #eab308; box-shadow: 0 0 12px rgba(234,179,8,0.4); }
.node-bubble.yellow-bg.active { border-color: #ca8a04; box-shadow: 0 0 24px rgba(234,179,8,0.7); }
.node-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; pointer-events: none; }
.node-fallback { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--accent2); }

/* Popup: offsets follow the bubble size via --bubble */
.project-popup { position: absolute; width: 250px; background: var(--bg2); border: 1px solid var(--accent2); border-radius: 16px; padding: 1rem; box-shadow: 0 0 30px var(--glow), 0 8px 32px rgba(0,0,0,0.4); z-index: 50; backdrop-filter: blur(14px); }
.popup-right  { left: calc(var(--bubble) + 10px);  top: 50%; transform: translateY(-50%); }
.popup-left   { right: calc(var(--bubble) + 10px); top: 50%; transform: translateY(-50%); }
.popup-top    { bottom: calc(var(--bubble) + 10px); left: 50%; transform: translateX(-50%); }
.popup-bottom { top: calc(var(--bubble) + 10px);   left: 50%; transform: translateX(-50%); }
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

/* Tablet */
@media (max-width: 900px) {
  .projects-section { padding: 4.5rem 1.5rem; }
  .center-avatar { width: 90px; height: 90px; }
  .avatar-img { width: 90px; height: 90px; }
}

/* Mobile */
@media (max-width: 640px) {
  .projects-section { padding: 3rem 1.1rem; }
  .section-title-wrap { margin-bottom: 2.5rem; }
  .center-avatar { width: 70px; height: 70px; }
  .avatar-img { width: 70px; height: 70px; border-width: 2px; }
  .node-fallback { font-size: 0.95rem; }
  .project-popup { width: min(220px, 70vw); padding: 0.8rem; }
}

@media (max-width: 380px) {
  .center-avatar { width: 54px; height: 54px; }
  .avatar-img { width: 54px; height: 54px; }
}
</style>