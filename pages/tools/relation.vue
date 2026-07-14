<script>
import RelationTable from '~/components/relation/relation-table.vue'
export default {
  components: { RelationTable }
}
</script>

<template>
  <v-container>
    <h1>
      {{ $t('global.mainMenu.tools.relation') }}
    </h1>
    <v-row>
      <v-col cols="12" class="mt-6">
        <RelationTable />
      </v-col>
    </v-row>
  </v-container>
</template>
