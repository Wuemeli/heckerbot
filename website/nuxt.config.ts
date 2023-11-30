export default defineNuxtConfig({
  ssr: true,
  devtools: true,
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Heckerbot 🔥',
      htmlAttrs: {
        lang: 'en'
      },
      script: [
        { src: '~/assets/js/bootstrap.min.js' }
      ]
    },
  },
  css: ['~/assets/css/style.css', '~/assets/css/bootstrap.min.css'],
})