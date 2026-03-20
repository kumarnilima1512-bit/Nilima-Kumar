<template>
  <div class="about-root" :class="colorMode.value">
    <section class="about-section">

      <!-- Section Title -->
      <div class="section-title-wrap">
        <h2 class="section-title">About <span class="highlight">Me</span></h2>
        <div class="title-line" />
      </div>

      <div class="about-inner">

        <!-- Left: Image with 3D tilt -->
        <div
          class="about-image-wrap"
          :class="{ loaded: mounted }"
          ref="tiltRef"
          @mousemove="onMouseMove"
          @mouseleave="onMouseLeave"
          :style="tiltStyle"
        >
          <div class="img-border" />
          <div class="img-corner corner-tl" />
          <div class="img-corner corner-br" />

          <!-- Shine overlay -->
          <div class="shine-overlay" :style="shineStyle" />

          <img src="/images/profile.jpg" alt="Nilima Kumar" class="about-img" />

          <div class="avail-badge">
            <span class="avail-dot" />
            Available for work
          </div>
        </div>

        <!-- Right: Bio + CV -->
        <div class="about-content" :class="{ loaded: mounted }">

          <p class="bio-text">
            Hey! I'm <span class="accent">Nilima Kumar</span>, a 21-year-old passionate
            <span class="accent">Full Stack Developer</span> currently pursuing my degree at
            <span class="accent">Dr. Sudhir Chandra Sur Institute of Technology and Sports Complex</span>.
            I completed my schooling from
            <span class="accent">Jadavpur Sammilita Balika Vidyalaya</span>.
          </p>

          <p class="bio-text">
            I'm deeply passionate about building modern web applications using
            cutting-edge frameworks and technologies. From crafting pixel-perfect UIs
            to writing clean, scalable backend logic — I love every part of the
            development journey.
          </p>

          <p class="bio-text">
            Currently focused on modern full-stack development, I'm always eager to
            explore new tools, contribute to real-world projects, and grow as a
            developer every single day.
          </p>

          <!-- CV Button -->
          <a href="/Nilima_Kumar_CV.pdf" download class="cv-btn">
            <svg viewBox="0 0 24 24" fill="none" class="btn-icon">
              <path d="M12 16l-4-4h2.5V4h3v8H16l-4 4z" fill="currentColor"/>
              <path d="M4 18h16v2H4v-2z" fill="currentColor"/>
            </svg>
            Download CV
            <span class="btn-glow" />
          </a>

        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const colorMode = useColorMode()
const mounted   = ref(false)
const tiltRef   = ref(null)

// ─── 3D Tilt ─────────────────────────────────────
const rotateX = ref(0)
const rotateY = ref(0)
const shineX  = ref(50)
const shineY  = ref(50)
const isHover = ref(false)

function onMouseMove(e) {
  const el   = tiltRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x    = e.clientX - rect.left
  const y    = e.clientY - rect.top
  const cx   = rect.width  / 2
  const cy   = rect.height / 2

  // Max tilt: 15deg
  rotateY.value =  ((x - cx) / cx) * 15
  rotateX.value = -((y - cy) / cy) * 15

  // Shine position
  shineX.value = (x / rect.width)  * 100
  shineY.value = (y / rect.height) * 100

  isHover.value = true
}

function onMouseLeave() {
  rotateX.value = 0
  rotateY.value = 0
  shineX.value  = 50
  shineY.value  = 50
  isHover.value = false
}

const tiltStyle = computed(() => ({
  transform: `perspective(800px) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg) scale3d(${isHover.value ? 1.04 : 1}, ${isHover.value ? 1.04 : 1}, 1)`,
  transition: isHover.value ? 'transform 0.1s ease' : 'transform 0.5s cubic-bezier(0.34,1.2,0.64,1)',
}))

const shineStyle = computed(() => ({
  background: `radial-gradient(circle at ${shineX.value}% ${shineY.value}%, rgba(255,255,255,0.18) 0%, transparent 65%)`,
  opacity: isHover.value ? 1 : 0,
  transition: 'opacity 0.3s ease',
}))

onMounted(() => {
  mounted.value = true
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@500;600&family=DM+Sans:wght@400;500&display=swap');

.about-root {
  --bg:      #0a0a0f;
  --bg2:     #12121a;
  --accent:  #7c3aed;
  --accent2: #a855f7;
  --text:    #f1f0ff;
  --subtext: #9ca3af;
  --ring:    rgba(124,58,237,0.5);
  --glow:    rgba(124,58,237,0.25);
  --card:    rgba(255,255,255,0.03);
  --border:  rgba(124,58,237,0.2);
  background: var(--bg);
  transition: background 0.5s ease;
}
.about-root.light {
  --bg:      #f5f3ff;
  --bg2:     #ede9fe;
  --accent:  #6d28d9;
  --accent2: #7c3aed;
  --text:    #1e1b4b;
  --subtext: #6b7280;
  --ring:    rgba(109,40,217,0.4);
  --glow:    rgba(109,40,217,0.12);
  --card:    rgba(109,40,217,0.04);
  --border:  rgba(109,40,217,0.18);
  background: var(--bg);
}

.about-section {
  max-width: 1100px;
  margin: 0 auto;
  padding: 6rem 2rem;
}

.section-title-wrap {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 4rem;
}
.section-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  color: var(--text);
  white-space: nowrap;
  transition: color 0.5s ease;
}
.highlight {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.title-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--border), transparent);
}

.about-inner {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
}
@media (min-width: 768px) {
  .about-inner {
    flex-direction: row;
    align-items: flex-start;
    gap: 5rem;
  }
}

/* ── Image + 3D tilt ─────────────────────────── */
.about-image-wrap {
  position: relative;
  width: 260px;
  height: 300px;
  flex-shrink: 0;
  opacity: 0;
  cursor: pointer;
  transform-style: preserve-3d;
  will-change: transform;
  /* entry animation */
  animation: none;
  transition: opacity 0.9s ease 0.2s;
}
.about-image-wrap.loaded {
  opacity: 1;
}

.about-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  display: block;
  position: relative;
  z-index: 1;
  border: 2px solid var(--border);
  pointer-events: none;
}

/* Shine overlay */
.shine-overlay {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  z-index: 2;
  pointer-events: none;
}

.img-border {
  position: absolute;
  inset: -8px;
  border-radius: 20px;
  border: 1.5px solid var(--accent2);
  opacity: 0.3;
  z-index: 0;
  pointer-events: none;
}
.img-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  z-index: 3;
  border-color: var(--accent2);
  border-style: solid;
  opacity: 0.8;
  pointer-events: none;
}
.corner-tl { top: -4px; left: -4px; border-width: 2px 0 0 2px; border-radius: 4px 0 0 0; }
.corner-br { bottom: -4px; right: -4px; border-width: 0 2px 2px 0; border-radius: 0 0 4px 0; }

/* Glow shadow on hover — done via filter in JS tiltStyle */
.about-image-wrap:hover {
  filter: drop-shadow(0 20px 40px var(--glow));
}

.avail-badge {
  position: absolute;
  bottom: -16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg2);
  border: 1px solid rgba(34,197,94,0.4);
  border-radius: 999px;
  padding: 0.3rem 0.9rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  color: #4ade80;
  white-space: nowrap;
  box-shadow: 0 0 16px rgba(34,197,94,0.15);
  pointer-events: none;
}
.avail-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 6px #4ade80;
  animation: pulse-green 1.8s ease-in-out infinite;
}
@keyframes pulse-green {
  0%,100% { opacity: 1; transform: scale(1); }
  50%     { opacity: 0.5; transform: scale(1.3); }
}

/* ── Content ─────────────────────────────────── */
.about-content {
  flex: 1;
  opacity: 0;
  transform: translateX(30px);
  transition: opacity 0.9s ease 0.4s, transform 0.9s cubic-bezier(0.34,1.2,0.64,1) 0.4s;
}
.about-content.loaded {
  opacity: 1;
  transform: translateX(0);
}

.bio-text {
  font-family: 'DM Sans', sans-serif;
  font-size: 1.05rem;
  line-height: 1.85;
  color: var(--subtext);
  margin-bottom: 1.2rem;
  transition: color 0.5s ease;
}
.accent {
  color: var(--accent2);
  font-weight: 600;
}

/* CV Button */
.cv-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 0.5rem;
  padding: 0.75rem 2rem;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: white;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  box-shadow: 0 0 20px var(--glow);
}
.cv-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 32px var(--ring);
}
.cv-btn:active { transform: translateY(0); }
.btn-icon { width: 18px; height: 18px; flex-shrink: 0; }
.btn-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
  border-radius: 999px;
  pointer-events: none;
}
</style>