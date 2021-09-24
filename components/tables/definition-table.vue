<template>
  <v-data-table
    :headers="table.headers"
    :items="definitions"
    :items-per-page="5"
    class="elevation-1"
  />
</template>
<script>
export default {
  props: {
    definitions: { required: false, default: () => [], type: Array }
  },
  data () {
    return {
      table: {
        headers: [
          {
            text: this.$i18n.t('global.designation'),
            align: 'start',
            sortable: false,
            value: 'designation'
          },
          {
            text: this.$i18n.t('global.definition'),
            sortable: false,
            value: 'definition'
          },
          {
            text: this.$i18n.t('global.language'),
            sortable: false,
            value: 'language'
          }
        ]
      }
    }
  }
}
</script>
