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
      @click="snackbar = false"
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
    }
  }
}
</script>
