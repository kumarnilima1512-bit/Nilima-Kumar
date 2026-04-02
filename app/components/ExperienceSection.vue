<template>
  <div class="exp-root" :class="colorMode.value">
    <section class="exp-section">

      <div class="section-title-wrap">
        <h2 class="section-title">My <span class="highlight">Experience</span></h2>
        <div class="title-line" />
      </div>

      <div v-if="pending" class="loading-wrap">
        <div class="loader" />
        <p class="loading-text">Loading experience...</p>
      </div>

      <div v-else-if="error" class="error-wrap">
        <p>Failed to load experience.</p>
      </div>

      <div v-else class="timeline-wrap" ref="timelineRef">
        <div class="timeline-track">
          <div class="timeline-progress" :style="{ height: progressHeight + '%' }" />
        </div>

        <div
          v-for="(exp, i) in experiences"
          :key="exp.id"
          class="exp-item"
          :class="[i % 2 === 0 ? 'item-left' : 'item-right', { visible: visibleItems[i] }]"
          :ref="el => itemRefs[i] = el"
        >
          <div class="timeline-dot" :class="{ active: visibleItems[i] }">
            <div class="dot-inner" />
            <div class="dot-ring" />
          </div>

          <div class="exp-card">
            <!-- Dynamic color top bar — cycles through colors -->
            <div class="card-top-bar" :style="{ background: topBarColor(i) }" />

            <div class="card-header">
              <div>
                <h3 class="card-role">{{ exp.role }}</h3>
                <p class="card-company">{{ exp.company }}</p>
              </div>
            </div>

            <div class="card-meta">
              <span class="meta-badge">
                <svg viewBox="0 0 24 24" fill="none" class="meta-icon">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                  <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="2"/>
                </svg>
                {{ exp.period }}
              </span>
              <span class="meta-badge">
                <svg viewBox="0 0 24 24" fill="none" class="meta-icon">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
                {{ exp.location }}
              </span>
              <span class="meta-badge type-badge">{{ exp.type }}</span>
            </div>

            <ul class="card-points">
              <li v-for="point in exp.points" :key="point" class="point">
                <span class="point-dot" />{{ point }}
              </li>
            </ul>

            <div class="card-tags">
              <span v-for="tag in exp.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const colorMode      = useColorMode()
const timelineRef    = ref(null)
const itemRefs       = ref([])
const visibleItems   = ref([])
const progressHeight = ref(0)

const { data: experiences, pending, error } = await useFetch('/api/experience')

// Cycles through colors — works for any number of experiences
const colors = [
  'linear-gradient(90deg, #7c3aed, #a855f7)',
  'linear-gradient(90deg, #06b6d4, #0891b2)',
  'linear-gradient(90deg, #10b981, #059669)',
  'linear-gradient(90deg, #f59e0b, #d97706)',
  'linear-gradient(90deg, #ec4899, #db2777)',
  'linear-gradient(90deg, #6366f1, #4f46e5)',
]

function topBarColor(i) {
  return colors[i % colors.length]
}

function checkVisibility() {
  const wh = window.innerHeight
  itemRefs.value.forEach((el, i) => {
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.top < wh * 0.85) visibleItems.value[i] = true
  })
  if (timelineRef.value) {
    const rect = timelineRef.value.getBoundingClientRect()
    const seen = Math.min(window.innerHeight - rect.top, rect.height)
    progressHeight.value = Math.max(0, Math.min(100, (seen / rect.height) * 100))
  }
}

onMounted(() => { window.addEventListener('scroll', checkVisibility); checkVisibility() })
onUnmounted(() => window.removeEventListener('scroll', checkVisibility))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@500;600&family=DM+Sans:wght@400;500&display=swap');

.exp-root {
  --bg: #0a0a0f; --bg2: #12121a; --accent: #7c3aed; --accent2: #a855f7;
  --text: #f1f0ff; --subtext: #9ca3af; --ring: rgba(124,58,237,0.5);
  --glow: rgba(124,58,237,0.25); --card: rgba(255,255,255,0.03); --border: rgba(124,58,237,0.2);
  background: var(--bg); transition: background 0.5s ease;
}
.exp-root.light {
  --bg: #f5f3ff; --bg2: #ede9fe; --accent: #6d28d9; --accent2: #7c3aed;
  --text: #1e1b4b; --subtext: #6b7280; --ring: rgba(109,40,217,0.4);
  --glow: rgba(109,40,217,0.12); --card: rgba(109,40,217,0.04); --border: rgba(109,40,217,0.18);
  background: var(--bg);
}

.exp-section { max-width: 1000px; margin: 0 auto; padding: 6rem 2rem; }
.section-title-wrap { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 5rem; }
.section-title { font-family: 'Syne', sans-serif; font-size: clamp(2rem,4vw,2.8rem); font-weight: 800; color: var(--text); white-space: nowrap; }
.highlight { background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.title-line { flex:1; height:1px; background: linear-gradient(90deg, var(--border), transparent); }

.loading-wrap { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 4rem 0; }
.loader { width: 40px; height: 40px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--accent2); animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text { font-family: 'DM Sans', sans-serif; color: var(--subtext); font-size: 0.9rem; }
.error-wrap { text-align: center; padding: 3rem; color: var(--subtext); font-family: 'DM Sans', sans-serif; }

.timeline-wrap { position: relative; padding: 1rem 0 2rem; }
.timeline-track { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: var(--border); transform: translateX(-50%); overflow: hidden; }
.timeline-progress { width: 100%; background: linear-gradient(to bottom, var(--accent), var(--accent2)); box-shadow: 0 0 12px var(--ring); transition: height 0.1s linear; }

.exp-item { position: relative; width: calc(50% - 3rem); margin-bottom: 4rem; opacity: 0; transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.34,1.2,0.64,1); }
.item-left { margin-right: auto; transform: translateX(-60px); }
.item-right { margin-left: auto; transform: translateX(60px); }
.exp-item.visible { opacity: 1; transform: translateX(0); }

@media (max-width: 768px) {
  .timeline-track { left: 1.5rem; }
  .exp-item { width: calc(100% - 3.5rem); margin-left: auto !important; margin-right: 0 !important; }
  .item-left, .item-right { transform: translateX(40px); }
  .exp-item.visible { transform: translateX(0); }
  .timeline-dot { left: -3rem !important; right: unset !important; }
}

.timeline-dot { position: absolute; top: 1.5rem; width: 16px; height: 16px; z-index: 5; }
.item-left .timeline-dot  { right: -3.6rem; }
.item-right .timeline-dot { left: -3.6rem; }
.dot-inner { width: 16px; height: 16px; border-radius: 50%; background: var(--bg2); border: 2px solid var(--border); position: relative; z-index: 2; transition: border-color 0.4s, background 0.4s; }
.timeline-dot.active .dot-inner { border-color: var(--accent2); background: var(--accent); box-shadow: 0 0 12px var(--ring); }
.dot-ring { position: absolute; inset: -5px; border-radius: 50%; border: 1.5px solid var(--accent2); opacity: 0; transform: scale(0.5); transition: opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s; }
.timeline-dot.active .dot-ring { opacity: 0.4; transform: scale(1); animation: ringPulse 2s ease-in-out infinite; }
@keyframes ringPulse { 0%,100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.3); } }

.exp-card { background: var(--card); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; backdrop-filter: blur(10px); transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s; }
.exp-card:hover { border-color: var(--accent2); box-shadow: 0 0 28px var(--glow), 0 8px 32px rgba(0,0,0,0.25); transform: translateY(-4px); }
.card-top-bar { height: 4px; width: 100%; }
.card-header { padding: 1.25rem 1.25rem 0.5rem; }
.card-role { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; color: var(--text); margin-bottom: 0.2rem; }
.card-company { font-family: 'DM Sans', sans-serif; font-size: 0.88rem; color: var(--accent2); font-weight: 600; }
.card-meta { display: flex; flex-wrap: wrap; gap: 0.5rem; padding: 0.5rem 1.25rem 0.75rem; }
.meta-badge { display: inline-flex; align-items: center; gap: 5px; font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: var(--subtext); background: var(--card); border: 1px solid var(--border); padding: 0.2rem 0.6rem; border-radius: 999px; }
.type-badge { color: var(--accent2); }
.meta-icon { width: 12px; height: 12px; flex-shrink: 0; }
.card-points { list-style: none; padding: 0 1.25rem 0.75rem; margin: 0; display: flex; flex-direction: column; gap: 0.45rem; }
.point { display: flex; align-items: flex-start; gap: 0.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; color: var(--subtext); line-height: 1.5; }
.point-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent2); flex-shrink: 0; margin-top: 0.45rem; }
.card-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; padding: 0 1.25rem 1.25rem; }
.tag { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; padding: 0.15rem 0.55rem; border-radius: 999px; background: var(--card); border: 1px solid var(--border); color: var(--accent2); }
</style>