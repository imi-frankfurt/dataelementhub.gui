<template>
  <v-select
    :items="hourFormats"
    :value="hourFormat"
  />
</template>
<script>
export default {
  props: {
    hourFormat: { required: false, default: '24h', type: String }
  },
  data () {
    return {
      hourFormats: [
        '12h',
        '24h'
      ]
    }
  },
  watch: {
    hourFormat: {
      handler () {
        this.$emit('hourFormatChange', this.hourFormat)
      },
      immediate: true
    }
  }
}
</script>
