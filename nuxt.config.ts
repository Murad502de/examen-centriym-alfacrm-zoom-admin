export default defineNuxtConfig({
  ssr: false,
  css: ['vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.min.css'],
  build: {
    transpile: ['vuetify'],
  },
  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: '123',
    // Keys within public are also exposed client-side
    public: {
      API_BASE_URL: process.env.NUXT_API_BASE_URL,
      APP_BASE_URL: process.env.NUXT_APP_BASE_URL,
    }
  },
  modules: [
    '@pinia/nuxt',
  ],
});
