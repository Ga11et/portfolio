import pwa_config from './pwa_config.json';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/seo', '@vite-pwa/nuxt'],

  site: {
    url: 'https://ga1eta-domain.ru',
    name: 'Сайт-визитка Frontend разработчика Фёдора Сивкова',
    indexable: false,
  },

  css: ['~/assets/scss/reset.scss', '~/assets/scss/fonts.scss'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
              @import "@/assets/scss/_vars.scss";
            `,
        },
      },
    },
  },

  pwa: pwa_config,
});
