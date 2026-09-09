<script>
export default {
  name: 'ConceptSearchResultTable',
  props: {
    conceptSearchResult: {
      type: Array,
      required: true
    },
    show: Boolean
  },
  computed: {
    internalShow: {
      get () {
        return this.show
      },
      set (value) {
        if (!value) {
          this.$emit('close')
        }
      }
    }
  },
  data () {
    return {
      headers: [
        { text: 'System', value: 'system' },
        { text: 'Version', value: 'version' },
        { text: 'Term', value: 'term' },
        { text: 'Text', value: 'text', align: 'start' }
      ],
      showModal: false
    }
  }
}
</script>

<template>
  <v-dialog v-model="internalShow" max-width="900">
    <v-card>
      <v-card-title>SearchResults</v-card-title>
      <v-card-text>
          <v-data-table
            :headers="headers"
            :items="conceptSearchResult"
            disable-sort
            @click:row="$emit('select', $event)"
          >
            <template v-slot:[`itemSystem`]="{ item }">
              <v-card outlined color="transparent">{{ item.system }}</v-card>
            </template>
            <template v-slot:[`itemversion`]="{ item }">
              <v-card outlined color="transparent">{{ item.system }}</v-card>
            </template>
            <template v-slot:[`itemterm`]="{ item }">
              <v-card outlined color="transparent">{{ item.system }}</v-card>
            </template>
            <template v-slot:[`itemtext`]="{ item }">
              <v-card outlined color="transparent">{{ item.system }}</v-card>
            </template>
          </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('close')">close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
