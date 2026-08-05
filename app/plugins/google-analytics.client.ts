export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const measurementId = config.public.gaMeasurementId

  if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
    return
  }

  useHead({
    script: [
      {
        async: true,
        src: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      },
      {
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `
      }
    ]
  })
})