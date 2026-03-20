<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="nav-inner">

      <!-- Logo -->
      <div class="nav-logo">NK<span class="dot">.</span></div>

      <!-- Desktop: Links + Toggle -->
      <div class="nav-right">
        <ul class="nav-links">
          <li v-for="item in navItems" :key="item.id">
            <a
              :href="`#${item.id}`"
              class="nav-link"
              :class="{ active: activeSection === item.id }"
              @click.prevent="scrollTo(item.id)"
            >
              {{ item.label }}
              <span class="link-underline" />
            </a>
          </li>
        </ul>

        <!-- Sun/Moon Toggle -->
        <button class="theme-toggle" @click="toggleTheme" :title="isLight ? 'Switch to Dark' : 'Switch to Light'">
          <div class="toggle-track" :class="isLight ? 'is-light' : 'is-dark'">
            <svg class="icon moon-icon" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
            </svg>
            <svg class="icon sun-icon" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" fill="currentColor"/>
              <line x1="12" y1="1"  x2="12" y2="3"  stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="4.22" y1="4.22"   x2="5.64"  y2="5.64"  stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="1"  y1="12" x2="3"  y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div class="toggle-thumb" :class="isLight ? 'thumb-light' : 'thumb-dark'" />
          </div>
        </button>
      </div>

      <!-- Mobile: Toggle + Hamburger -->
      <div class="mobile-right">
        <button class="theme-toggle" @click="toggleTheme">
          <div class="toggle-track" :class="isLight ? 'is-light' : 'is-dark'">
            <svg class="icon moon-icon" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
            </svg>
            <svg class="icon sun-icon" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" fill="currentColor"/>
              <line x1="12" y1="1"  x2="12" y2="3"  stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="4.22" y1="4.22"   x2="5.64"  y2="5.64"  stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="1"  y1="12" x2="3"  y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div class="toggle-thumb" :class="isLight ? 'thumb-light' : 'thumb-dark'" />
          </div>
        </button>

        <button class="hamburger" @click="menuOpen = !menuOpen" aria-label="Toggle menu">
          <span class="bar" :class="{ open: menuOpen }" />
          <span class="bar" :class="{ open: menuOpen }" />
          <span class="bar" :class="{ open: menuOpen }" />
        </button>
      </div>

    </div>

    <!-- Mobile dropdown -->
    <transition name="mobile-menu">
      <ul v-if="menuOpen" class="mobile-links">
        <li v-for="item in navItems" :key="item.id">
          <a
            :href="`#${item.id}`"
            class="mobile-link"
            :class="{ active: activeSection === item.id }"
            @click.prevent="scrollTo(item.id); menuOpen = false"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const colorMode = useColorMode()
const isLight   = computed(() => colorMode.value === 'light')

function toggleTheme() {
  colorMode.preference = isLight.value ? 'dark' : 'light'
}

const navItems = [
  { id: 'home',           label: 'Home' },
  { id: 'about',          label: 'About' },
  { id: 'projects',       label: 'Projects' },
  { id: 'experience',     label: 'Experience' },
  { id: 'skills',         label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
]

const isScrolled    = ref(false)
const menuOpen      = ref(false)
const activeSection = ref('home')

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function onScroll() {
  isScrolled.value = window.scrollY > 20
  for (const item of [...navItems].reverse()) {
    const el = document.getElementById(item.id)
    if (el && window.scrollY >= el.offsetTop - 120) {
      activeSection.value = item.id
      break
    }
  }
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
/* ── Base ───────────────────────────────────────── */
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 9000;
  padding: 0 2rem;
  background: rgba(10, 10, 20, 0.3);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(124,58,237,0.15);
  transition: background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
}
.navbar.scrolled {
  background: rgba(10, 10, 20, 0.75);
  box-shadow: 0 4px 32px rgba(124,58,237,0.15);
  border-bottom-color: rgba(124,58,237,0.35);
}
:global(.light) .navbar {
  background: rgba(245,243,255,0.45);
  border-bottom-color: rgba(109,40,217,0.15);
}
:global(.light) .navbar.scrolled {
  background: rgba(245,243,255,0.82);
  box-shadow: 0 4px 32px rgba(109,40,217,0.1);
  border-bottom-color: rgba(109,40,217,0.25);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ── Logo ───────────────────────────────────────── */
.nav-logo {
  font-family: 'Syne', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: #a855f7;
  letter-spacing: -0.03em;
  cursor: default;
  user-select: none;
}
.dot { color: #22d3ee; }

/* ── Desktop right ──────────────────────────────── */
.nav-right {
  display: none;
  align-items: center;
  gap: 2.5rem;
}
@media (min-width: 768px) {
  .nav-right { display: flex; }
}

.nav-links {
  list-style: none;
  margin: 0; padding: 0;
  display: flex;
  gap: 2rem;
}

.nav-link {
  position: relative;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  color: #c4b5fd;
  text-decoration: none;
  padding: 0.25rem 0;
  transition: color 0.3s ease;
}
.nav-link:hover, .nav-link.active { color: #22d3ee; }

.link-underline {
  position: absolute;
  bottom: -2px; left: 0;
  width: 0; height: 2px;
  background: linear-gradient(90deg, #7c3aed, #22d3ee);
  border-radius: 2px;
  transition: width 0.3s ease;
  box-shadow: 0 0 8px rgba(34,211,238,0.6);
}
.nav-link:hover .link-underline,
.nav-link.active .link-underline { width: 100%; }

:global(.light) .nav-link { color: #6d28d9; }
:global(.light) .nav-link:hover,
:global(.light) .nav-link.active { color: #0891b2; }

/* ── Sun/Moon Toggle ────────────────────────────── */
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

.toggle-track {
  position: relative;
  width: 64px;
  height: 32px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  padding: 0 6px;
  overflow: hidden;
  transition: background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
}

.toggle-track.is-dark {
  background: #1e1b4b;
  border: 1px solid rgba(124,58,237,0.5);
  box-shadow: 0 0 14px rgba(124,58,237,0.5), inset 0 0 10px rgba(124,58,237,0.15);
}
.toggle-track.is-light {
  background: #fef9c3;
  border: 1px solid rgba(234,179,8,0.5);
  box-shadow: 0 0 14px rgba(234,179,8,0.55), inset 0 0 10px rgba(234,179,8,0.15);
}

.icon {
  width: 15px;
  height: 15px;
  position: absolute;
  transition: opacity 0.35s ease, transform 0.4s ease;
  z-index: 1;
}
.moon-icon { left: 8px;  color: #a5b4fc; }
.sun-icon  { right: 8px; color: #f59e0b; }

.is-dark .moon-icon  { opacity: 1; transform: scale(1) rotate(0deg); }
.is-dark .sun-icon   { opacity: 0; transform: scale(0.4) rotate(90deg); }
.is-light .moon-icon { opacity: 0; transform: scale(0.4) rotate(-90deg); }
.is-light .sun-icon  { opacity: 1; transform: scale(1) rotate(0deg); }

.toggle-thumb {
  position: absolute;
  width: 24px; height: 24px;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  transition: left 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.4s ease, box-shadow 0.4s ease;
  z-index: 2;
}
.thumb-dark {
  left: 4px;
  background: linear-gradient(135deg, #818cf8, #6366f1);
  box-shadow: 0 0 10px rgba(99,102,241,0.9), 0 0 22px rgba(99,102,241,0.5);
}
.thumb-light {
  left: 36px;
  background: linear-gradient(135deg, #fde68a, #f59e0b);
  box-shadow: 0 0 10px rgba(245,158,11,0.9), 0 0 22px rgba(245,158,11,0.5);
}

/* ── Mobile right ───────────────────────────────── */
.mobile-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
@media (min-width: 768px) {
  .mobile-right { display: none; }
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.bar {
  display: block;
  width: 24px; height: 2px;
  background: #a855f7;
  border-radius: 2px;
  transition: transform 0.3s ease, opacity 0.3s ease, background 0.3s ease;
}
.bar.open:nth-child(1) { transform: translateY(7px) rotate(45deg);   background: #22d3ee; }
.bar.open:nth-child(2) { opacity: 0; }
.bar.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); background: #22d3ee; }

/* ── Mobile menu ────────────────────────────────── */
.mobile-links {
  list-style: none;
  margin: 0;
  padding: 1rem 0 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background: rgba(10,10,20,0.92);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(124,58,237,0.2);
}
:global(.light) .mobile-links {
  background: rgba(245,243,255,0.95);
}
.mobile-link {
  display: block;
  padding: 0.75rem 2rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #c4b5fd;
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: color 0.2s, background 0.2s, border-color 0.2s;
}
.mobile-link:hover, .mobile-link.active {
  color: #22d3ee;
  background: rgba(34,211,238,0.06);
  border-left-color: #22d3ee;
}
:global(.light) .mobile-link { color: #6d28d9; }
:global(.light) .mobile-link:hover,
:global(.light) .mobile-link.active { color: #0891b2; border-left-color: #0891b2; }

.mobile-menu-enter-active, .mobile-menu-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.mobile-menu-enter-from, .mobile-menu-leave-to {
  opacity: 0; transform: translateY(-8px);
}
</style>