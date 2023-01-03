<template>
  <v-snackbar
    v-model="snackbar"
    :top="true"
    :right="true"
    :color="color"
  >
    {{ text }}
    <v-btn
      text
      @click="snackbar = false; $emit('hideSnackbar')"
    >
      {{ $t('global.button.close') }}
    </v-btn>
  </v-snackbar>
</template>
<script>
export default {
  props: {
    show: { required: true, type: Boolean },
    text: { required: true, type: String },
    color: { required: false, default: 'success', type: String }
  },
  data () {
    return {
      snackbar: this.show
    }
  },
  watch: {
    show (n) {
      this.snackbar = n
      if (this.snackbar === true) {
        this.hideSnackbarAfter(3.5)
      }
    }
  },
  methods: {
    async hideSnackbarAfter (seconds) {
      await new Promise(resolve => setTimeout(resolve, seconds * 1000))
      this.snackbar = false
      this.$emit('hideSnackbar')
    }
  }
}
</script>
