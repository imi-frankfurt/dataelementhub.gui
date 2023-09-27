import fs from 'fs'
import colors from 'vuetify/es5/util/colors'

let allExternalLogos
if (fs.existsSync('assets/images/logo/extern')) {
  allExternalLogos = fs.readdirSync('assets/images/logo/extern')
} else {
  allExternalLogos = []
}

export default {
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    backendUrl: process.env.BACKEND_URL || 'http://localhost:8090',
    snackbarTimeout: process.env.SNACKBAR_TIMEOUT || 2000,
    externalLogos: allExternalLogos
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
      { rel: 'icon', type: 'image/png', href: 'src/assets/images/logo/1.png' }
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
          onlyOnRoot: true,
          cookieSecure: true
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
    plugins: [
      '~/plugins/axios.js'
    ],
    cookie: {
      options: {
        httpOnly: true,
        secure: true
      }
    },
    strategies: {
      local: false,
      keycloak: {
        scheme: 'oauth2',
        endpoints: {
          authorization: process.env.KEYCLOAK_URL + '/realms/' + process.env.KEYCLOAK_REALM + '/protocol/openid-connect/auth',
          userInfo: process.env.KEYCLOAK_URL + '/realms/' + process.env.KEYCLOAK_REALM + '/protocol/openid-connect/userinfo',
          token: process.env.KEYCLOAK_URL + '/realms/' + process.env.KEYCLOAK_REALM + '/protocol/openid-connect/token',
          logout: process.env.KEYCLOAK_URL + '/realms/' + process.env.KEYCLOAK_REALM + '/protocol/openid-connect/logout?redirect_uri=' + encodeURIComponent(process.env.BASE_URL)
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          name: 'Authorization',
          maxAge: 1800
        },
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 3
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
        clientId: process.env.KEYCLOAK_CLIENT_ID,
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
      options: { customProperties: true },
      themes: {
        dark: {
          primary: {
            base: '#099b63',
            darken1: '#04c279'
          },
          accent: '#8f7d91',
          secondary: '#97812F',
          info: {
            base: '#1FFFF1',
            darken1: '#450b5a',
            darken2: '#1125c0',
            darken3: '#40bfa4'
          },
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          anchor: '#1FFFF1'
        },
        light: {
          primary: {
            base: '#022844',
            darken1: '#d6eec5'
          },
          header: {
            base: '#21587f'
          },
          footer: {
            base: '#edfceb'
          },
          background: {
            base: '#fcfffc'
          },
          navigation_drawer: {
            base: '#21587f'
          },
          accent: '#8f7d91',
          secondary: '#97812F',
          info: {
            base: '#4caff5',
            darken1: '#450b5a',
            darken2: '#1125c0',
            darken3: '#40bfa4'
          },
          warning: '#499ab0',
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          anchor: '#52b7f6'
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend (config) {
      config.module.rules.push({
        test: /\.md$/,
        loader: 'raw-loader'
      })
    },
    transpile: [
      'vuetify/lib'
    ],
    devtools: true
  }
}
