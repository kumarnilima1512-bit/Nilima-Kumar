<template>
  <div class="contact-root" :class="colorMode.value">
    <section class="contact-section">

      <div class="section-title-wrap">
        <h2 class="section-title">Get In <span class="highlight">Touch</span></h2>
        <div class="title-line" />
      </div>

      <div class="contact-layout">

        <!-- Official LinkedIn Profile Badge -->
        <div class="linkedin-badge-wrap">
          <div class="linkedin-badge-scale">
            <div
              class="badge-base LI-profile-badge"
              data-locale="en_US"
              data-size="medium"
              :data-theme="colorMode.value === 'light' ? 'light' : 'dark'"
              data-type="VERTICAL"
              data-vanity="nilimakumar"
              data-version="v1"
            >
              <a
                class="badge-base__link LI-simple-link"
                href="https://in.linkedin.com/in/nilimakumar?trk=profile-badge"
                target="_blank"
                rel="noopener"
              >Nilima Kumar</a>
            </div>
          </div>
        </div>

        <div class="contact-grid">

          <!-- Email Card -->
          <a :href="`mailto:${contact.email}`" class="contact-card">
            <div class="contact-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" class="contact-icon">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="contact-body">
              <p class="contact-label">Email</p>
              <p class="contact-value">{{ contact.email }}</p>
            </div>
            <svg viewBox="0 0 24 24" fill="none" class="go-arrow">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>

          <!-- WhatsApp Card -->
          <a :href="whatsappLink" target="_blank" rel="noopener" class="contact-card">
            <div class="contact-icon-wrap">
              <svg viewBox="0 0 24 24" fill="currentColor" class="contact-icon">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.02c-.24.68-1.4 1.32-1.94 1.4-.5.08-1.12.11-1.8-.11-.42-.14-.95-.3-1.64-.6-2.88-1.24-4.76-4.13-4.9-4.32-.14-.19-1.17-1.55-1.17-2.96 0-1.4.73-2.09 1-2.38.24-.26.53-.32.7-.32.18 0 .36 0 .51.01.17.01.38-.06.6.45.24.56.8 1.95.87 2.09.07.14.11.3.02.48-.09.19-.14.3-.27.46-.14.16-.28.35-.4.47-.14.13-.28.28-.12.55.16.28.72 1.19 1.55 1.93 1.06.94 1.96 1.24 2.24 1.38.28.14.44.11.6-.07.17-.19.7-.82.89-1.1.19-.28.37-.23.63-.14.26.1 1.63.77 1.9.91.28.14.46.21.53.33.07.12.07.68-.17 1.36z"/>
              </svg>
            </div>
            <div class="contact-body">
              <p class="contact-label">WhatsApp</p>
              <p class="contact-value">{{ contact.whatsappDisplay }}</p>
            </div>
            <svg viewBox="0 0 24 24" fill="none" class="go-arrow">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>

          <!-- Google Form Card -->
          <a :href="contact.googleFormUrl" target="_blank" rel="noopener" class="contact-card">
            <div class="contact-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" class="contact-icon">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 2v6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 13l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="contact-body">
              <p class="contact-label">Form</p>
              <p class="contact-value">Google Form</p>
            </div>
            <svg viewBox="0 0 24 24" fill="none" class="go-arrow">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>

        </div>

      </div>

    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'

const colorMode = useColorMode()

const contact = {
  email: 'kumarnilima1512@gmail.com',
  whatsappNumber: '918240946460', // country code (91) + number, no + or spaces
  whatsappDisplay: '+91 82409 46460',
  googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScqYO2207ZRokAdkYayIi7HMXd4s3eg3NGr2gktvCg0VUxQ2w/viewform?usp=publish-editor'
}

const whatsappLink = computed(() => `https://wa.me/${contact.whatsappNumber}`)

// LinkedIn's official badge widget script - eta load na korle badge render hobe na
onMounted(() => {
  if (document.getElementById('linkedin-badge-script')) return
  const script = document.createElement('script')
  script.id = 'linkedin-badge-script'
  script.src = 'https://platform.linkedin.com/badges/js/profile.js'
  script.async = true
  script.defer = true
  document.body.appendChild(script)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@500;600&family=DM+Sans:wght@400;500&display=swap');

.contact-root {
  --bg: #0a0a0f; --bg2: #12121a; --accent: #7c3aed; --accent2: #a855f7;
  --text: #f1f0ff; --subtext: #9ca3af; --ring: rgba(124,58,237,0.5);
  --glow: rgba(124,58,237,0.25); --card: rgba(255,255,255,0.03); --border: rgba(124,58,237,0.2);
  --li-blue: #0a66c2;
  background: var(--bg); transition: background 0.5s ease;
}
.contact-root.light {
  --bg: #f5f3ff; --bg2: #ede9fe; --accent: #6d28d9; --accent2: #7c3aed;
  --text: #1e1b4b; --subtext: #6b7280; --ring: rgba(109,40,217,0.4);
  --glow: rgba(109,40,217,0.12); --card: rgba(109,40,217,0.04); --border: rgba(109,40,217,0.18);
  background: var(--bg);
}

.contact-section { max-width: 1100px; margin: 0 auto; padding: 6rem 2rem; }
.section-title-wrap { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 4rem; }
.section-title { font-family: 'Syne', sans-serif; font-size: clamp(2rem,4vw,2.8rem); font-weight: 800; color: var(--text); white-space: nowrap; }
.highlight { background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.title-line { flex:1; height:1px; background: linear-gradient(90deg, var(--border), transparent); }

/* Left (LinkedIn) + Right (Email/WhatsApp) layout */
.contact-layout { display: flex; gap: 1.5rem; align-items: stretch; flex-wrap: wrap; }

/* Email / WhatsApp stacked column */
.contact-grid { flex: 1 1 320px; display: flex; flex-direction: column; gap: 1.25rem; }

.contact-card {
  display: flex; align-items: center; gap: 1rem; padding: 1.25rem 1.5rem;
  background: var(--card); border: 1px solid var(--border); border-radius: 16px;
  text-decoration: none; backdrop-filter: blur(10px);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}
.contact-card:hover { border-color: var(--accent2); box-shadow: 0 0 24px var(--glow), 0 8px 32px rgba(0,0,0,0.2); transform: translateY(-3px); }

.contact-icon-wrap {
  flex-shrink: 0; width: 46px; height: 46px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #fff;
}
.contact-icon { width: 22px; height: 22px; }

.contact-body { flex: 1; min-width: 0; }
.contact-label { font-family: 'DM Sans', sans-serif; font-size: 0.75rem; color: var(--subtext); margin-bottom: 0.15rem; }
.contact-value { font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; font-weight: 600; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.go-arrow { width: 18px; height: 18px; color: var(--subtext); flex-shrink: 0; transition: transform 0.3s ease, color 0.3s ease; }
.contact-card:hover .go-arrow { transform: translateX(4px); color: var(--accent2); }

/* Official LinkedIn badge wrapper (left column) */
.linkedin-badge-wrap {
  flex: 0 0 auto; display: flex; justify-content: center; align-items: center;
  padding: 1.5rem;
  background: var(--card); border: 1px solid var(--border); border-radius: 18px;
  backdrop-filter: blur(10px);
  overflow: hidden; /* guard against the LinkedIn widget's fixed width on tiny screens */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.linkedin-badge-wrap:hover { border-color: var(--li-blue); box-shadow: 0 0 24px rgba(10,102,194,0.2), 0 8px 32px rgba(0,0,0,0.15); }

/* Wrapper that we can scale down as one unit if the badge (fixed px width from LinkedIn) is wider than the viewport allows */
.linkedin-badge-scale { transform-origin: center; }

.linkedin-badge-wrap :deep(.LI-simple-link),
.linkedin-badge-wrap :deep(.badge-base__link) {
  color: var(--accent2) !important;
  font-weight: 700 !important;
}
.linkedin-badge-wrap :deep(.LI-simple-link:hover) { color: var(--text) !important; }

/* ============ TABLET (≤ 900px) ============ */
@media (max-width: 900px) {
  .contact-section { padding: 4.5rem 1.5rem; }
  .section-title-wrap { margin-bottom: 3rem; gap: 1rem; }
  .contact-layout { gap: 1.25rem; }
}

/* ============ MOBILE (≤ 640px) ============ */
@media (max-width: 640px) {
  .contact-section { padding: 3rem 1.25rem; }

  .section-title-wrap { gap: 0.75rem; margin-bottom: 2rem; }
  .section-title { font-size: clamp(1.5rem, 7vw, 2rem); white-space: normal; }

  .contact-layout { flex-direction: column; gap: 1.25rem; }
  .linkedin-badge-wrap { width: 100%; padding: 1.25rem; }

  .contact-card { padding: 1rem 1.1rem; gap: 0.85rem; }
  .contact-icon-wrap { width: 40px; height: 40px; }
  .contact-icon { width: 19px; height: 19px; }
  .contact-value { font-size: 0.82rem; }

  /* Long email address: allow it to wrap instead of clipping on narrow phones */
  .contact-value { white-space: normal; word-break: break-word; }
}

/* ============ SMALL MOBILE (≤ 380px) ============ */
@media (max-width: 380px) {
  .contact-section { padding: 2.5rem 1rem; }
  .contact-card { padding: 0.9rem 1rem; }
  .contact-label { font-size: 0.7rem; }
  .contact-value { font-size: 0.78rem; }

  /* LinkedIn's official badge widget renders at a fixed pixel width (~ 258px+ for "medium").
     On very narrow phones we scale the whole badge down as one block so it never overflows. */
  .linkedin-badge-scale { transform: scale(0.85); }
}

@media (max-width: 320px) {
  .linkedin-badge-scale { transform: scale(0.75); }
}
</style>