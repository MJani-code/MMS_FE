import colors from 'vuetify/es5/util/colors';

export default {
  fetch: true,
  fetchOnServer: true,

  ssr: false,


  head: {
    titleTemplate: '%s - MMS',
    title: 'MMS',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: ''
      },
      {
        name: 'format-detection',
        content: 'telephone=no'
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },
  router: {
    mode: 'history'
  },


  css: ['@/assets/styles.scss'
  ],


  plugins: [],


  components: true,


  buildModules: [

    '@nuxtjs/eslint-module',

    '@nuxtjs/vuetify'
  ],


  modules: [],


  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#f07b00',
        },
        dark: {
          primary: '#d26d01',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },


  build: {},
  server: {
    host: '0.0.0.0',
    port: 3002
  }
};
