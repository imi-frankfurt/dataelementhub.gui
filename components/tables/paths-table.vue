<template>
  <v-data-table
    :headers="table.headers"
    :items="paths"
    hide-default-header
    hide-default-footer
    class="elevation-1"
  />
</template>
<script>
export default {
  props: {
    paths: { required: false, default: () => [], type: Array }
  },
  data () {
    return {
      table: {
        headers: [
          {
            text: this.$i18n.t('global.path'),
            align: 'start',
            sortable: false,
            value: 'item'
          }
        ]
      }
    }
  }
}
</script>
