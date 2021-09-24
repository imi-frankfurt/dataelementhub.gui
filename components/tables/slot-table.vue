<template>
  <v-data-table
    :headers="table.headers"
    :items="slots"
    :items-per-page="5"
    class="elevation-1"
  />
</template>
<script>
export default {
  props: {
    slots: { required: false, default: () => [], type: Array }
  },
  data () {
    return {
      table: {
        headers: [
          {
            text: this.$i18n.t('global.name'),
            align: 'start',
            sortable: false,
            value: 'name'
          },
          {
            text: this.$i18n.t('global.value'),
            sortable: false,
            value: 'value'
          }
        ]
      }
    }
  }
}
</script>
