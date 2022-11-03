<script>
export default {
  auth: false,

  data () {
    return {
      ajax: {
        versionUrl: process.env.mdrBackendUrl + '/v1/version'
      },
      backendData: undefined
    }
  },
  beforeMount () {
    this.loadBackendVersion()
  },
  methods: {
    async loadBackendVersion () {
      await this.$axios.$get(this.ajax.versionUrl)
        .then(function (res) {
          this.backendData = res
        }.bind(this))
    }
  }
}
</script>

<template>
  <v-container fluid>
    <v-row class="first-row">
      <v-col>
        <div class="title">
          <h1 class="h1-1">
            {{ $t('pages.about.title') }}
          </h1>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="current-setup-row">
          <v-container fluid>
            <v-row>
              <v-col>
                <h1 class="current-setup-title">
                  {{ $t('pages.about.currentSetup') }}
                </h1>
                <p class="current-setup-subtitle" />
              </v-col>
            </v-row>
            <v-row class="second-row">
              <v-col>
                <div class="text-center">
                  <img
                    src="@/assets/images/others/3.png"
                    height="250px"
                  >
                  <p class="center-1">
                    {{ $t('pages.about.backend') }}
                  </p>
                  <p v-if="backendData !== undefined" class="center-4">
                    {{ $t('pages.about.version') }}: {{ backendData.buildVersion }}
                  </p>
                </div>
              </v-col>
              <v-col>
                <v-card v-if="backendData !== undefined" class="version-card">
                  <v-container fluid>
                    <v-row class="version-row">
                      <v-col>
                        {{ $t('pages.about.buildDate') }}: {{ backendData.buildDate }}
                      </v-col>
                    </v-row>
                    <v-divider />
                    <v-row class="version-row">
                      <v-col>
                        {{ $t('pages.about.buildBranch') }}: {{ backendData.buildBranch }}
                      </v-col>
                    </v-row>
                    <v-divider />
                    <v-row class="version-row">
                      <v-col>
                        {{ $t('pages.about.buildHash') }}: {{ backendData.buildHash }}
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
              <v-col>
                <v-divider vertical />
              </v-col>
              <v-col>
                <div class="text-center">
                  <img
                    src="@/assets/images/others/4.png"
                    height="250px"
                  >
                  <p class="center-1">
                    {{ $t('pages.about.frontend') }}
                  </p>
                  <p v-if="backendData !== undefined" class="center-4">
                    {{ $t('pages.about.version') }}: 1.0.0
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="github-row">
          <h1 class="github-title">
            {{ $t('pages.about.weAreOnGithub') }}
          </h1>
          <p class="github-subtitle">
            {{ $t('pages.about.weAreOnGithubSubtitle') }}
          </p>
          <v-container>
            <v-row class="github-repos-row">
              <v-col>
                <a class="button" href="https://github.com/imi-frankfurt/dataelementhub.rest">
                  <img src="@/assets/images/others/6.png" height="150px">
                  <h3 class="github-repo-text">{{ $t('pages.about.rest') }}</h3>
                </a>
              </v-col>
              <v-col>
                <a class="button" href="https://github.com/imi-frankfurt/dataelementhub.gui">
                  <img src="@/assets/images/others/8.png" height="150px">
                  <h3 class="github-repo-text">{{ $t('pages.about.gui') }}</h3>
                </a>
              </v-col>
              <v-col>
                <a class="button" href="https://github.com/imi-frankfurt/dataelementhub.model">
                  <img src="@/assets/images/others/5.png" height="150px">
                  <h3 class="github-repo-text">{{ $t('pages.about.model') }}</h3>
                </a>
              </v-col>
              <v-col>
                <a class="button" href="https://github.com/imi-frankfurt/dataelementhub.dal">
                  <img src="@/assets/images/others/7.png" height="150px">
                  <h3 class="github-repo-text">{{ $t('pages.about.dal') }}</h3>
                </a>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="contact-card text-center">
          <v-card>
            <img
              height="180"
              src="@/assets/images/logo/2.png"
            >
            <v-card-subtitle>
              {{ $t('pages.about.footer') }} <a href="mailto:info@dataelementhub.de">info@dataelementhub.de</a>.
            </v-card-subtitle>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss">

.title {
  padding-top: 3rem;
  width: 80%;
  margin: 0 auto;
}

.version-row {
  padding: 0.3rem;
}

.version-card {
  padding: 0.3rem;
  margin-left: -2rem;
  background: linear-gradient(#ffbebf, #dbddfa);
}

.current-setup-row {
  padding-top: 4rem;
  width: 80%;
  margin: 0 auto;
}

.current-setup-title {
  font-weight: 900;
  letter-spacing: 3px;
}

.current-setup-subtitle {
  font-weight: 20;
  color: darkgrey;
  letter-spacing: -0.6px;
}

.github-repo-text {
  padding-top: 1rem;
  padding-left: 3.2rem;
}

.github-repos-row {
  width: 80%;
  margin: 0 auto;
}

a {
  color: black;
  text-decoration: none;
}

.github-subtitle {
  font-weight: 20;
  color: darkgrey;
  letter-spacing: -0.6px;
}

.github-title {
  font-weight: 900;
  letter-spacing: 6px;
}

.github-row {
  padding-top: 4rem;
  width: 80%;
  margin: 0 auto;
}

.center-1 {
  padding-top: 5px;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.0125em;
  line-height: 2rem;
  word-break: break-all;
}

.center-4 {
  margin-top: -18px;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem;
  letter-spacing: 0.0071428571em;
}

.second-row {
  padding-top: 4rem;
  padding-left: 8%;
}

.third-col {
  padding-left: 30%;
}

.contact-card {
  padding-top: 8rem;
  width: 80%;
  margin: 0 auto;
}

.footer-row {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3rem;
  text-align: center;
}

.faq-table {
  width: 60%;
}

.first-col {
  padding-left: 15%;
  padding-top: 4%;
  width: 30%;
}

.p-1 {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1.3rem;
  margin-bottom: 2rem;
}

.h1-1 {
  color: white;
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: -0.025rem;
  line-height: 3.6rem;
}

.first-row {
  position: relative;
  font-family: "Lato", sans-serif;
  height: 30vh;
  background-image: linear-gradient(to right bottom, rgba(172, 206, 248, 0.81), rgba(6, 130, 196, 0.73));
  background-size: cover;
  background-position: top;
  -webkit-clip-path: polygon(0 0, 100% 0, 100% 20%, 0 100%);
  clip-path: polygon(0 0, 100% 0, 100% 50%, 0 100%);
}
</style>
