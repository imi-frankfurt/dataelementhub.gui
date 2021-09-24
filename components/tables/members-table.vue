<template>
  <v-data-table
    :headers="table.headers"
    :items="members"
    :items-per-page="5"
    class="elevation-1"
  />
</template>
<script>
export default {
  props: {
    members: { required: false, default: () => [], type: Array }
  },
  data () {
    return {
      table: {
        headers: [
          {
            text: this.$i18n.t('global.urn'),
            align: 'start',
            sortable: false,
            value: 'elementUrn'
          },
          {
            text: this.$i18n.t('global.status'),
            sortable: false,
            value: 'status'
          }
        ]
      }
    }
  }
}
</script>
