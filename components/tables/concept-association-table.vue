<template>
  <v-data-table
    :headers="table.headers"
    :items="associations"
    :items-per-page="5"
    class="elevation-1"
  />
</template>
<script>
export default {
  props: {
    associations: { required: false, default: () => [], type: Array }
  },
  data () {
    return {
      table: {
        headers: [
          {
            text: this.$i18n.t('global.system'),
            align: 'start',
            sortable: false,
            value: 'system'
          },
          {
            text: this.$i18n.t('global.text'),
            sortable: false,
            value: 'text'
          },
          {
            text: this.$i18n.t('global.term'),
            sortable: false,
            value: 'term'
          },
          {
            text: this.$i18n.t('global.linkType'),
            sortable: false,
            value: 'linkType'
          },
          {
            text: this.$i18n.t('global.version'),
            sortable: false,
            value: 'version'
          }
        ]
      }
    }
  }
}
</script>
