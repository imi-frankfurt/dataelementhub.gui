<template>
  <v-select
    :items="timeFormats"
    :value="timeFormat"
    @change="$emit('timeFormatChange', $event)"
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
  }
}
</script>
