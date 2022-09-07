<template>
  <v-select
    :items="timeFormats"
    :value="timeFormat"
  />
</template>
<script>
export default {
  props: {
    timeFormat: { required: false, default: 'hh:mm:ss', type: String }
  },
  data () {
    return {
      timeFormats: [
        'hh:mm:ss',
        'hh:mm'
      ]
    }
  },
  watch: {
    timeFormat: {
      handler () {
        this.$emit('timeFormatChange', this.timeFormat)
      },
      immediate: true
    }
  }
}
</script>
