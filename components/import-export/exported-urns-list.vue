<script>
export default {
  props: {
    exportedUrns: { required: true, type: Array }
  },
  data () {
    return {
      search: '',
      headers: [
        {
          text: '',
          align: 'start',
          value: 'urn'
        }
      ]
    }
  },
  computed: {
    filteredExportedUrns () {
      return this.exportedUrns.filter(urn => urn.toLowerCase().includes(this.search))
    }
  }
}
</script>

<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        :label="$t('global.searchText')"
        single-line
        hide-details
      />
    </v-card-title>
    <v-data-table
      hide-default-footer
      hide-default-header
      height="500px"
      :headers="headers"
      :items="filteredExportedUrns"
    >
      <template #[`item.urn`]="{ item }">
        {{ item }}
      </template>
      <template #no-data>
        {{ $t('pages.tools.importExport.export.infoTexts.1').toUpperCase() }}
      </template>
    </v-data-table>
  </v-card>
</template>
