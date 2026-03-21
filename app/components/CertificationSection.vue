<template>
  <div class="cert-root" :class="colorMode.value">
    <section class="cert-section">

      <div class="section-title-wrap">
        <h2 class="section-title">My <span class="highlight">Certifications</span></h2>
        <div class="title-line" />
      </div>

      <!-- Loading -->
      <div v-if="pending" class="loading-wrap">
        <div class="loader" />
        <p class="loading-text">Loading certifications...</p>
      </div>

      <div v-else-if="error" class="error-wrap">
        <p>Failed to load certifications.</p>
      </div>

      <div v-else-if="!certifications?.length" class="empty-wrap">
        <p>No certifications yet. Check back soon! 🚀</p>
      </div>

      <!-- Cards grid -->
      <div v-else class="cert-grid">
        <div
          v-for="(cert, i) in certifications"
          :key="cert.id"
          class="cert-card"
          :class="{ visible: visibleCards[i] }"
          :ref="el => cardRefs[i] = el"
          :style="{ '--delay': i * 0.1 + 's' }"
        >
          <!-- Certificate image / placeholder -->
          <div class="cert-thumb">
            <img v-if="cert.image" :src="cert.image" :alt="cert.title" class="thumb-img" />
            <div v-else class="thumb-placeholder">
              <svg viewBox="0 0 48 48" fill="none" class="cert-icon">
                <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                <path d="M24 14l2.5 7.5H34l-6 4.5 2.5 7.5-6-4.5-6 4.5 2.5-7.5-6-4.5h7.5L24 14z" fill="currentColor" opacity="0.6"/>
              </svg>
            </div>
            <div class="thumb-overlay" />
          </div>

          <!-- Card body -->
          <div class="cert-body">
            <h3 class="cert-title">{{ cert.title }}</h3>
            <p class="cert-issuer">
              <svg viewBox="0 0 24 24" fill="none" class="issuer-icon">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ cert.issuer }}
            </p>
            <p v-if="cert.date" class="cert-date">
              <svg viewBox="0 0 24 24" fill="none" class="issuer-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="2"/>
              </svg>
              {{ formatDate(cert.date) }}
            </p>
            <a v-if="cert.link" :href="cert.link" target="_blank" class="cert-link">
              View Certificate
              <svg viewBox="0 0 24 24" fill="none" class="link-arrow">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <polyline points="15,3 21,3 21,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const colorMode = useColorMode()
const cardRefs     = ref([])
const visibleCards = ref([])

const { data: certifications, pending, error } = await useFetch('/api/certifications')

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function checkVisibility() {
  const wh = window.innerHeight
  cardRefs.value.forEach((el, i) => {
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.top < wh * 0.88) visibleCards.value[i] = true
  })
}

onMounted(() => { window.addEventListener('scroll', checkVisibility); checkVisibility() })
onUnmounted(() => window.removeEventListener('scroll', checkVisibility))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@500;600&family=DM+Sans:wght@400;500&display=swap');

.cert-root {
  --bg: #0a0a0f; --bg2: #12121a; --accent: #7c3aed; --accent2: #a855f7;
  --text: #f1f0ff; --subtext: #9ca3af; --ring: rgba(124,58,237,0.5);
  --glow: rgba(124,58,237,0.25); --card: rgba(255,255,255,0.03); --border: rgba(124,58,237,0.2);
  background: var(--bg); transition: background 0.5s ease;
}
.cert-root.light {
  --bg: #f5f3ff; --bg2: #ede9fe; --accent: #6d28d9; --accent2: #7c3aed;
  --text: #1e1b4b; --subtext: #6b7280; --ring: rgba(109,40,217,0.4);
  --glow: rgba(109,40,217,0.12); --card: rgba(109,40,217,0.04); --border: rgba(109,40,217,0.18);
  background: var(--bg);
}
.cert-section { max-width: 1100px; margin: 0 auto; padding: 6rem 2rem; }
.section-title-wrap { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 4rem; }
.section-title { font-family: 'Syne', sans-serif; font-size: clamp(2rem,4vw,2.8rem); font-weight: 800; color: var(--text); white-space: nowrap; }
.highlight { background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.title-line { flex:1; height:1px; background: linear-gradient(90deg, var(--border), transparent); }

.loading-wrap { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 4rem 0; }
.loader { width: 40px; height: 40px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--accent2); animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text { font-family: 'DM Sans', sans-serif; color: var(--subtext); font-size: 0.9rem; }
.error-wrap, .empty-wrap { text-align: center; padding: 3rem; color: var(--subtext); font-family: 'DM Sans', sans-serif; }

/* Grid */
.cert-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem; }

.cert-card {
  background: var(--card); border: 1px solid var(--border); border-radius: 18px;
  overflow: hidden; backdrop-filter: blur(10px);
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.6s ease var(--delay), transform 0.6s cubic-bezier(0.34,1.2,0.64,1) var(--delay), border-color 0.3s ease, box-shadow 0.3s ease;
}
.cert-card.visible { opacity: 1; transform: translateY(0); }
.cert-card:hover { border-color: var(--accent2); box-shadow: 0 0 24px var(--glow), 0 8px 32px rgba(0,0,0,0.2); transform: translateY(-4px); }

/* Thumb */
.cert-thumb { position: relative; width: 100%; height: 150px; overflow: hidden; background: var(--bg2); }
.thumb-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.cert-card:hover .thumb-img { transform: scale(1.05); }
.thumb-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--accent2); }
.cert-icon { width: 48px; height: 48px; }
.thumb-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 50%, var(--bg2)); }

/* Body */
.cert-body { padding: 1rem 1.1rem 1.25rem; }
.cert-title { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700; color: var(--text); margin-bottom: 0.5rem; line-height: 1.3; }
.cert-issuer, .cert-date { display: flex; align-items: center; gap: 5px; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; color: var(--subtext); margin-bottom: 0.3rem; }
.issuer-icon { width: 12px; height: 12px; flex-shrink: 0; color: var(--accent2); }
.cert-link { display: inline-flex; align-items: center; gap: 5px; margin-top: 0.75rem; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 600; color: var(--accent2); text-decoration: none; transition: color 0.2s ease, gap 0.2s ease; }
.cert-link:hover { color: var(--text); gap: 8px; }
.link-arrow { width: 12px; height: 12px; }
</style>