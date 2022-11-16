<template>
  <v-container fluid class="main-container">
    <v-row class="hero-row pb-10">
      <v-col class="bg-symbol-1 logo-col">
        <v-img
          height="600px"
          max-height="45vw"
          contain
          :src="require('~/assets/images/logo/2.png')"
          :lazy-src="require('~/assets/images/logo/2.png')"
        />
      </v-col>
      <v-col>
        <v-container fill-height fluid>
          <v-row align="center" justify="center">
            <v-col class="mx-4">
              <h1
                class="introduction-text mb-5"
              >
                {{ $t('pages.login.introduction') }}
              </h1>
              <h3
                class="dehub-text mb-5"
              >
                {{ $t('pages.login.dehub') }}
              </h3>
              <v-btn
                color="primary"
                class="mr-4"
                @click="loginWithKeycloak"
              >
                {{ $t('pages.login.loginButton') }}
              </v-btn>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-icon
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-information-outline
                  </v-icon>
                </template>
                <span>
              {{ $t('pages.help.faqList.demoAccount[0].answer') }}
            </span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-row class="second-row py-8">
      <v-col>
        <div class="markdown-class" v-html="markdownToHtml" />
      </v-col>
    </v-row>
    <v-row class="extern-logos-row">
      <v-col v-for="logo in externalLogos" :key="logo">
        <v-img
          height="80px"
          contain
          :src="require('~/assets/images/logo/extern/' + logo)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { marked } from 'marked'
import HomepageText from '@/assets/others/homepage.md'

export default {
  data () {
    return {
      markdown: HomepageText,
      externalLogos: process.env.externalLogos
    }
  },
  computed: {
    markdownToHtml () {
      return marked(this.markdown)
    }
  },
  methods: {
    async loginWithKeycloak () {
      try {
        await this.$auth.loginWith('keycloak')
      } catch (err) {
      }
    },
    revealFromRightWithDelay (delay) {
      return {
        distance: '100%',
        origin: 'right',
        delay
      }
    },
    revealFromTopWithDelay (delay) {
      return {
        distance: '50%',
        origin: 'top',
        delay
      }
    }
  }
}
</script>

<style scoped lang="scss">

.extern-logos-row {
  background: #e8f9fd;
}

.main-container {
  height: 100%;
  width: 100%;
}

.markdown-class {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.hero-row {
  background-color: #e8f9fd;
}

.introduction-col {
  margin: 0 auto;
}

.logo-col {
  position: relative;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
}

.dehub-text {
  font-size: 1.5rem;
  font-weight: 200;
}

.introduction-container {
  min-height: 60%;
  max-width: 80%;
  justify-content: center;
}

.introduction-text {
  font-size: 4rem;
  font-weight: 250;
}

.bg-symbol-1 {
  position: relative;
  z-index: 2;

  &::before {
    background-repeat: no-repeat;
    background-image: url(~assets/images/startpage/symbol-bg2.png);
    left: -100px;
    top: -90px;
    width: 470px;
    height: 400px;
    content: '';
    z-index: -1;
    position: absolute;
  }
}
</style>
