<script>
import ImportsTable from '~/components/import-export/imports-table'
import ExportsTable from '~/components/import-export/exports-table'
export default {
  components: { ExportsTable, ImportsTable }
}
</script>

<template>
  <v-container>
    <h1>
      {{ $t('global.mainMenu.tools.importExport') }}
    </h1>
    <v-row>
      <v-col cols="12" class="mt-6">
        <ImportsTable />
      </v-col>
      <v-col cols="12" class="mt-6">
        <ExportsTable />
      </v-col>
    </v-row>
  </v-container>
</template>
