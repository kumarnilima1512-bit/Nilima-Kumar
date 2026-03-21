<template>
  <div class="skills-root" :class="colorMode.value">
    <section class="skills-section">

      <div class="section-title-wrap">
        <h2 class="section-title">My <span class="highlight">Skills</span></h2>
        <div class="title-line" />
      </div>

      <p class="skills-hint">Pop the bubbles! 💥</p>

      <!-- Loading -->
      <div v-if="pending" class="loading-wrap">
        <div class="loader" />
        <p class="loading-text">Loading skills...</p>
      </div>

      <div v-else-if="error" class="error-wrap">
        <p>Failed to load skills.</p>
      </div>

      <div v-else class="bubbles-wrap">
        <div
          v-for="(skill, index) in skillsWithPos"
          :key="skill.id"
          class="bubble-anchor"
          :style="anchorStyle(skill)"
        >
          <!-- Burst particles -->
          <div class="burst-wrap" :class="{ bursting: skill.state === 'popping' }">
            <div v-for="p in 14" :key="p" class="burst-particle" :style="particleStyle(p, skill.color)" />
          </div>

          <!-- Flyout -->
          <div class="skill-flyout" :class="{ flying: skill.state === 'popping' || skill.state === 'flying' }" :style="{ '--skill-color': skill.color }">
            <img v-if="skill.logo" :src="skill.logo" :alt="skill.name" class="flyout-logo" />
            <span v-else class="flyout-emoji">{{ skill.name.charAt(0) }}</span>
            <span class="flyout-name">{{ skill.name }}</span>
          </div>

          <!-- Bubble -->
          <div
            class="bubble"
            :class="{ popping: skill.state === 'popping', reforming: skill.state === 'reforming', idle: skill.state === 'idle', flying: skill.state === 'flying' }"
            :style="bubbleVars(skill)"
            @click="popBubble(skill)"
          >
            <div class="bubble-shine" />
            <img v-if="skill.logo" :src="skill.logo" :alt="skill.name" class="bubble-logo" draggable="false" />
            <span v-else class="bubble-emoji">{{ skill.name.charAt(0) }}</span>
            <span class="bubble-name">{{ skill.name }}</span>
          </div>
        </div>
      </div>

    </section>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'

const colorMode = useColorMode()
const { data: skills, pending, error } = await useFetch('/api/skills')

// Pre-defined positions & sizes for up to 25 skills
const positions = [
  { x: 3,  y: 5,  size: 82, dur: 5.2, delay: 0.0 },
  { x: 14, y: 50, size: 88, dur: 6.1, delay: 0.4 },
  { x: 26, y: 10, size: 90, dur: 4.8, delay: 0.8 },
  { x: 38, y: 55, size: 78, dur: 5.5, delay: 1.2 },
  { x: 50, y: 8,  size: 76, dur: 6.3, delay: 0.3 },
  { x: 62, y: 60, size: 86, dur: 5.0, delay: 0.7 },
  { x: 74, y: 12, size: 84, dur: 6.8, delay: 1.1 },
  { x: 85, y: 48, size: 92, dur: 5.4, delay: 0.5 },
  { x: 44, y: 35, size: 96, dur: 6.0, delay: 0.9 },
  { x: 6,  y: 72, size: 80, dur: 5.8, delay: 0.2 },
  { x: 20, y: 78, size: 86, dur: 5.1, delay: 0.6 },
  { x: 32, y: 72, size: 78, dur: 4.9, delay: 1.0 },
  { x: 56, y: 75, size: 82, dur: 6.2, delay: 0.4 },
  { x: 70, y: 78, size: 80, dur: 5.6, delay: 0.8 },
  { x: 82, y: 72, size: 78, dur: 5.3, delay: 0.2 },
  { x: 3,  y: 30, size: 84, dur: 5.7, delay: 0.6 },
  { x: 90, y: 25, size: 86, dur: 6.4, delay: 1.0 },
  { x: 90, y: 5,  size: 80, dur: 5.0, delay: 0.3 },
  { x: 18, y: 22, size: 82, dur: 6.0, delay: 0.7 },
  { x: 72, y: 35, size: 80, dur: 5.5, delay: 1.1 },
  { x: 55, y: 22, size: 82, dur: 4.7, delay: 0.5 },
  { x: 40, y: 80, size: 76, dur: 5.9, delay: 0.3 },
  { x: 8,  y: 45, size: 80, dur: 6.1, delay: 0.9 },
  { x: 65, y: 42, size: 84, dur: 5.3, delay: 0.6 },
  { x: 30, y: 42, size: 78, dur: 4.8, delay: 1.2 },
]

const skillsWithPos = reactive(
  (skills.value || []).map((s, i) => ({
    ...s,
    ...(positions[i % positions.length]),
    state: 'idle',
  }))
)

function anchorStyle(skill) {
  return { left: `${skill.x}%`, top: `${skill.y}%`, width: `${skill.size}px`, height: `${skill.size}px` }
}
function bubbleVars(skill) {
  return { '--bubble-color': skill.color, '--float-dur': `${skill.dur}s`, '--float-delay': `${skill.delay}s`, width: `${skill.size}px`, height: `${skill.size}px` }
}
function particleStyle(p, color) {
  const angle = (p / 14) * 360
  const dist  = 35 + (p % 4) * 12
  const size  = 3 + (p % 4) * 2
  return { '--angle': `${angle}deg`, '--dist': `${dist}px`, width: `${size}px`, height: `${size}px`, background: p % 3 === 0 ? '#ffffff' : color }
}
function popBubble(skill) {
  if (skill.state !== 'idle') return
  skill.state = 'popping'
  setTimeout(() => { skill.state = 'flying' }, 400)
  setTimeout(() => { skill.state = 'reforming' }, 1800)
  setTimeout(() => { skill.state = 'idle' }, 3000)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@500;600&family=DM+Sans:wght@400;500&display=swap');

.skills-root {
  --bg: #0a0a0f; --bg2: #12121a; --accent: #7c3aed; --accent2: #a855f7;
  --text: #f1f0ff; --subtext: #9ca3af; --border: rgba(124,58,237,0.2); --glow: rgba(124,58,237,0.25);
  background: var(--bg); transition: background 0.5s ease;
}
.skills-root.light {
  --bg: #f5f3ff; --bg2: #ede9fe; --accent: #6d28d9; --accent2: #7c3aed;
  --text: #1e1b4b; --subtext: #6b7280; --border: rgba(109,40,217,0.18); --glow: rgba(109,40,217,0.12);
  background: var(--bg);
}
.skills-section { max-width: 1100px; margin: 0 auto; padding: 6rem 2rem; }
.section-title-wrap { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1rem; }
.section-title { font-family: 'Syne', sans-serif; font-size: clamp(2rem,4vw,2.8rem); font-weight: 800; color: var(--text); white-space: nowrap; }
.highlight { background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.title-line { flex:1; height:1px; background: linear-gradient(90deg, var(--border), transparent); }
.skills-hint { font-family: 'DM Sans', sans-serif; font-size: 0.88rem; color: var(--subtext); margin-bottom: 1.5rem; text-align: center; }

.loading-wrap { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 4rem 0; }
.loader { width: 40px; height: 40px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--accent2); animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text { font-family: 'DM Sans', sans-serif; color: var(--subtext); font-size: 0.9rem; }
.error-wrap { text-align: center; padding: 3rem; color: var(--subtext); font-family: 'DM Sans', sans-serif; }

.bubbles-wrap { position: relative; width: 100%; height: 600px; border-radius: 24px; background: var(--bg2); border: 1px solid var(--border); overflow: hidden; }
.bubble-anchor { position: absolute; display: flex; align-items: center; justify-content: center; }

.bubble { position: absolute; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; user-select: none; background: radial-gradient(circle at 35% 35%, rgba(255,255,255,0.22), rgba(255,255,255,0.06) 60%, rgba(0,0,0,0.04)); border: 1.5px solid rgba(255,255,255,0.2); box-shadow: inset 0 1px 1px rgba(255,255,255,0.3), 0 4px 20px rgba(0,0,0,0.25); backdrop-filter: blur(4px); }
.bubble.idle { animation: floatBubble var(--float-dur) ease-in-out var(--float-delay) infinite alternate; opacity: 1; transition: transform 0.2s ease, box-shadow 0.2s ease; }
.bubble.idle:hover { transform: scale(1.12) !important; animation-play-state: paused; box-shadow: inset 0 1px 2px rgba(255,255,255,0.4), 0 8px 30px rgba(0,0,0,0.3), 0 0 22px color-mix(in srgb, var(--bubble-color) 50%, transparent); }
@keyframes floatBubble { 0% { translate: 0px 0px; rotate: -2deg; } 100% { translate: 0px -18px; rotate: 2deg; } }
.bubble.popping { animation: bubblePop 0.4s cubic-bezier(0.36,0.07,0.19,0.97) forwards !important; cursor: default; }
@keyframes bubblePop { 0% { transform: scale(1); opacity: 1; } 40% { transform: scale(1.35); opacity: 0.7; } 70% { transform: scale(0.8); opacity: 0.2; } 100% { transform: scale(0); opacity: 0; } }
.bubble.flying { opacity: 0; transform: scale(0); }
.bubble.reforming { animation: bubbleReform 1s cubic-bezier(0.34,1.56,0.64,1) forwards !important; cursor: default; }
@keyframes bubbleReform { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.1); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } }

.bubble-shine { position: absolute; top: 11%; left: 16%; width: 34%; height: 22%; background: radial-gradient(ellipse, rgba(255,255,255,0.55), transparent 70%); border-radius: 50%; pointer-events: none; }
.bubble-logo { width: 46%; height: 46%; object-fit: contain; pointer-events: none; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35)); }
.bubble-emoji { font-size: 1.6rem; font-weight: 700; color: white; pointer-events: none; }
.bubble-name { font-family: 'JetBrains Mono', monospace; font-size: 0.52rem; font-weight: 600; color: rgba(255,255,255,0.9); margin-top: 3px; letter-spacing: 0.03em; pointer-events: none; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }

.skill-flyout { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; background: rgba(10,10,20,0.85); border: 1.5px solid var(--skill-color); border-radius: 16px; padding: 0.5rem 0.8rem; pointer-events: none; opacity: 0; transform: scale(0) translateY(0px); z-index: 20; backdrop-filter: blur(10px); box-shadow: 0 0 20px color-mix(in srgb, var(--skill-color) 40%, transparent); white-space: nowrap; }
.skill-flyout.flying { animation: flyOut 1.4s cubic-bezier(0.34,1.2,0.64,1) forwards; }
@keyframes flyOut { 0% { opacity: 0; transform: scale(0.3) translateY(0px); } 20% { opacity: 1; transform: scale(1.1) translateY(-12px); } 50% { opacity: 1; transform: scale(1) translateY(-28px); } 80% { opacity: 1; transform: scale(1) translateY(-36px); } 100% { opacity: 0; transform: scale(0.9) translateY(-50px); } }
.flyout-logo { width: 32px; height: 32px; object-fit: contain; filter: drop-shadow(0 1px 3px rgba(0,0,0,0.4)); }
.flyout-emoji { font-size: 1.4rem; font-weight: 700; }
.flyout-name { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; font-weight: 700; color: var(--skill-color); letter-spacing: 0.05em; }

.burst-wrap { position: absolute; inset: 0; pointer-events: none; z-index: 10; }
.burst-particle { position: absolute; top: 50%; left: 50%; border-radius: 50%; transform: translate(-50%, -50%); opacity: 0; }
.burst-wrap.bursting .burst-particle { animation: burst 0.5s ease-out forwards; }
@keyframes burst { 0% { transform: translate(-50%,-50%) rotate(var(--angle)) translateX(0) scale(1); opacity: 1; } 100% { transform: translate(-50%,-50%) rotate(var(--angle)) translateX(var(--dist)) scale(0); opacity: 0; } }
</style>