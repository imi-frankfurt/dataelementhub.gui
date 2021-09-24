import colors from 'vuetify/es5/util/colors'

export default {
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    mdrBackendUrl: process.env.MDR_BACKEND_URL || 'http://localhost:8090',
    snackbarTimeout: process.env.SNACKBAR_TIMEOUT || 2000
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Data Element Hub',
    title: 'Data Element Hub',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/scss/mdr.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/i18n.js',
    '~/plugins/vuetify.js',
    '~/plugins/vuejs-logger.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    [
      'nuxt-i18n',
      {
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: 'i18n_current',
          onlyOnRoot: true
        },
        locales: [
          {
            code: 'en',
            name: 'English',
            file: 'en-US.js'
          },
          {
            code: 'de',
            name: 'Deutsch',
            file: 'de-DE.js'
          }
        ],
        lazy: true,
        langDir: 'locales/',
        defaultLocale: 'en'
      }
    ],
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // retry: { retries: 3 }
  },
  auth: {
    strategies: {
      local: false,
      keycloak: {
        scheme: 'oauth2',
        endpoints: {
          authorization: process.env.KEYCLOAK_URL + '/auth/realms/' + process.env.KEYCLOAK_REALM + '/protocol/openid-connect/auth',
          userInfo: process.env.KEYCLOAK_URL + '/auth/realms/' + process.env.KEYCLOAK_REALM + '/protocol/openid-connect/userinfo',
          token: process.env.KEYCLOAK_URL + '/auth/realms/' + process.env.KEYCLOAK_REALM + '/protocol/openid-connect/token',
          logout: process.env.KEYCLOAK_URL + '/auth/realms/' + process.env.KEYCLOAK_REALM + '/protocol/openid-connect/logout?redirect_uri=' + encodeURIComponent(process.env.BASE_URL)
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          name: 'Authorization',
          maxAge: 1800
        },
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30
        },
        redirect: {
          login: '/',
          logout: '/',
          callback: '/',
          home: '/about'
        },
        vuex: {
          namespace: 'auth'
        },
        responseType: 'code',
        grantType: 'authorization_code',
        clientId: 'dehub',
        scope: ['openid', 'profile', 'email'],
        codeChallengeMethod: 'S256'
      }
    }
  },
  router: {
    middleware: ['auth']
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    defaultAssets: false,
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
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

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      'vuetify/lib'
    ],
    devtools: true
  }
}
