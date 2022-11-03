<template>
  <v-container fluid class="hero-container">
    <v-row class="hero-row">
      <v-col cols="6" class="bg-symbol-1 introduction-col">
        <div class="introduction-container">
          <h1
            class="introduction-text mb-5"
          >
            {{ $t('pages.home.introduction') }}
          </h1>
          <h3
            class="dehub-text mb-5"
          >
            {{ $t('pages.home.dehub') }}
          </h3>
        </div>
      </v-col>
      <v-col cols="5" class="logo-col">
        <v-img
          height="60%"
          contain
          :src="require('~/assets/images/logo/2.png')"
          :lazy-src="require('~/assets/images/logo/2.png')"
        />
      </v-col>
    </v-row>
    <v-row class="second-row">

    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {

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

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';

.second-row {
  background: #eaf3fa;
}

.hero-row {
  display: flex;
  background-color: #e8f9fd;
}

.introduction-col {
  margin: 0 auto;
}

.logo-col {
  position: relative;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.dehub-text {
  font-size: 1.5rem;
  font-weight: 200;
}

.introduction-text {
  margin-top: 10vh;
  font-size: 4rem;
  font-weight: 300;
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

  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    &::before {
      display: none;
    }
  }
}
</style>
