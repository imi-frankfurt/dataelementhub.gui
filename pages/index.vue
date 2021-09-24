<template>
  <v-row>
    <v-col cols="12">
      <h1>
        <v-icon x-large>
          mdi-hand-peace
        </v-icon>
        {{ $t('pages.home.content.howdy') }}
      </h1>
      <p v-html="$t('pages.home.content.preAlpha')" />
      <p v-html="$t('pages.home.content.bugReport')" />
      <p v-html="$t('pages.home.content.dockerImage')" />
      <p v-html="$t('pages.home.content.thanks')" />

      <div v-if="!$auth.loggedIn">
        <h2>{{ $t('pages.login.title') }}</h2>
        <v-alert
          border="left"
          colored-border
          type="info"
          elevation="2"
        >
          <span v-html="$t('pages.login.infoAlert.text')" /><br><br>
          <address>
            <b>{{ $t('global.address.name1') }}</b><br>
            {{ $t('global.address.name2') }}<br>
            {{ $t('global.address.additionToAddress') }}<br>
            {{ $t('global.address.street') }}<br>
            {{ $t('global.address.zip') }} {{ $t('global.address.city') }}<br>
            <a href="https://www.mig-frnkfurt.de" target="_blank"><v-icon>mdi-open-in-new</v-icon>{{ $t('global.address.web') }}</a>
          </address>
        </v-alert>
        <v-btn
          color="success"
          class="mr-4"
          @click="loginWithKeycloak"
        >
          {{ $t('pages.login.loginButton') }}
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  auth: false,
  methods: {
    async loginWithKeycloak () {
      try {
        await this.$auth.loginWith('keycloak')
      } catch (err) {
      }
    }
  }

}
</script>
