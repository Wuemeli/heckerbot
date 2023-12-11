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
    },
  },
  css: ['~/assets/css/style.css', '~/assets/css/bootstrap.min.css', '~/assets/css/main.css'],


  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

})