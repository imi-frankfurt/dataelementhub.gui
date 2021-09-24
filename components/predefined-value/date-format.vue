<template>
  <v-select
    :items="dateFormats"
    :value="dateFormat"
    @change="$emit('dateFormatChange', $event)"
  />
</template>
<script>
export default {
  props: {
    dateFormat: { required: false, default: 'YYYY-MM-DD', type: String }
  },
  data () {
    return {
      dateFormats: [
        'YYYY-MM-DD',
        'YYYY-MM',
        'DD.MM.YYYY',
        'MM.YYYY'
      ]
    }
  }
}
</script>
