<template>
  <div class="home">
    <section class="hero">
      <v-container>
        <v-row no-gutters>
          <v-col md="4" offset="2" offset-md="0" class="bg-symbol-1 mt-12">
            <h4
              class="overline mb-4 mb-5"
            >
              {{ $t('pages.login.introduction') }}
            </h4>
            <h1
              class="display-1 font-weight-medium"
            >
              {{ $t('pages.login.dehub') }}
            </h1>
            <v-btn
              color="primary"
              class="mr-4"
              @click="loginWithKeycloak"
            >
              {{ $t('pages.login.loginButton') }}
            </v-btn>
          </v-col>
          <v-col id="hero__image-wrap" md="4">
            <v-img
              class="hero__image"
              contain
              :src="require('~/assets/images/logo/2.png')"
              :lazy-src="require('~/assets/images/logo/2.png')"
            />
          </v-col>
        </v-row>
      </v-container>
    </section>
    <section class="py-12 mt-12">
      <v-container>
        <v-row>
          <v-col offset="2" offset-sm="0" sm="6" md="3">
            <div
              v-scroll-reveal.reset="revealFromRightWithDelay(100)"
              class="icon-box"
            >
              <div class="icon-box__icon mb-7">
                <v-icon x-large>
                  #1
                </v-icon>
              </div>
              <h4 class="title">
                {{ $t('pages.login.1') }}
              </h4>
            </div>
          </v-col>
          <v-col offset="2" offset-sm="0" sm="6" md="3">
            <div
              v-scroll-reveal.reset="revealFromRightWithDelay(200)"
              class="icon-box"
            >
              <div class="icon-box__icon mb-7">
                <v-icon x-large>
                  #2
                </v-icon>
              </div>
              <h4 class="title">
                {{ $t('pages.login.1') }}
              </h4>
            </div>
          </v-col>
          <v-col offset="2" offset-sm="0" sm="6" md="3">
            <div
              v-scroll-reveal.reset="revealFromRightWithDelay(300)"
              class="icon-box"
            >
              <div class="icon-box__icon mb-7">
                <v-icon x-large>
                  #3
                </v-icon>
              </div>
              <h4 class="title">
                {{ $t('pages.login.3') }}
              </h4>
            </div>
          </v-col>
          <v-col offset="2" offset-sm="0" sm="6" md="3">
            <div
              v-scroll-reveal.reset="revealFromRightWithDelay(400)"
              class="icon-box"
            >
              <div class="icon-box__icon mb-7">
                <v-icon x-large>
                  #4
                </v-icon>
              </div>
              <h4 class="title">
                {{ $t('pages.login.4') }}
              </h4>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
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

.bg-symbol-1,
.bg-symbol-2 {
  position: relative;
  z-index: 2;

  &::before {
    background-repeat: no-repeat;
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

.hero {
  background-color: #e8f9fd;
  height: 590px;
  padding-top: 85px;
  position: relative;

  .hero__image {
    position: relative;
    top: -80px;
    right: -600px;
  }

  .bg-symbol-1 {
    &::before {
      background-image: url(~assets/images/startpage/symbol-bg2.png);
      left: -240px;
      top: -135px;
    }
  }
}

.dots-map {
  position: absolute;
  right: 0;
  bottom: -100px;
  height: 205px;
  width: 200px;
  margin-left: auto;
  background-image: url(~assets/images/startpage/dots.png);

  &.left {
    right: initial;
    left: 0;
  }
}

.icon-box {
  max-width: 250px;
  margin-right: 20px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  border-radius: 0 60px 0 0;

  .icon-box__icon {
    position: relative;
    z-index: 2;
    padding-top: 25px;
  }

  &:hover {
    background-color: #a4c2da;
  }

  &.active {
    background-color: #a4c2da;

    &::before {
      content: '';
      position: absolute;
      z-index: 1;
      top: -60px;
      left: -40px;
      width: 125%;
      height: 178px;
      background-color: #a4c2da;
      border-radius: 50%;
    }
  }
}

.pointed-img-wrap {
  position: relative;

  &::before {
    position: absolute;
    left: -50px;
    content: '';
    height: 205px;
    width: 200px;
    background-image: url(~assets/images/startpage/dots.png);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -67px;
    right: 130px;
    width: 40px;
    height: 200px;
    background-color: rgba(map-get($amber, 'darken-1'), 0.7);
    border-radius: 20px;
    transform: rotate(45deg);

    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      display: none;
    }
  }

  .pointed-img {
    height: 470px;
    width: 470px;
    border-radius: 50% 50% 0 50%;
  }

  &.left {
    .pointed-img {
      border-radius: 50% 50% 50% 0;
    }

    &::before {
      left: initial;
      right: 55px;
    }

    &::after {
      transform: rotate(-45deg);
      right: initial;
      left: 20px;
    }
  }
}
</style>
