<template>
  <div>
    <h1>{{ $t('pages.login.title') }}</h1>
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
</template>

<script>
export default {
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
