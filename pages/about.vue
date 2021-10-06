<template>
  <div>
    <h1>{{ $t('pages.about.title') }}</h1>
    <template v-if="backendData !== undefined">
      <h2>{{ $t('global.backend') }}</h2>
      <ul>
        <li>buildVersion: {{ backendData.buildVersion }}</li>
        <li>buildDate: {{ backendData.buildDate }}</li>
        <li>buildBranch: {{ backendData.buildBranch }}</li>
        <li>buildHash: {{ backendData.buildHash }}</li>
      </ul>
    </template>
    <h2>{{ $t('global.frontend') }}</h2>
    <ul>
      <li>buildVersion: 1.0.0</li>
      <li>buildDate: 2021-09-30</li>
      <li>buildBranch: develop</li>
    </ul>
    <h2>Github</h2>
    <p>
      <b>DataElementHub REST</b><br>
      <a href="https://github.com/mig-frankfurt/dataelementhub.rest" target="_blank">
        https://github.com/mig-frankfurt/dataelementhub.rest
      </a>
    </p>
    <p>
      <b>DataElementHub GUI</b><br>
      <a href="https://github.com/mig-frankfurt/dataelementhub.gui" target="_blank">
        https://github.com/mig-frankfurt/dataelementhub.gui
      </a>
    </p>
  </div>
</template>
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
  mounted () {
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
