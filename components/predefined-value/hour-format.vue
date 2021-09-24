<template>
  <v-select
    :items="hourFormats"
    :value="hourFormat"
    @change="$emit('hourFormatChange', $event)"
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
  }
}
</script>
