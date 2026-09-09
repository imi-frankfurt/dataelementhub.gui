<template>
  <v-dialog v-model="internalShow" max-width="900">
    <v-card>
      <v-card-title>
        <div v-if="!selectedValueSet">
          Select a ValueSet
        </div>
        <div v-else>
          Search Results – {{ selectedValueSet.name }}
        </div>
      </v-card-title>

      <v-card-text>
        <!-- Selection display -->
        <div v-if="!selectedValueSet">
          <v-row dense>
            <v-col
              v-for="vs in definedSearchResult"
              :key="vs.subsetUri"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card
                class="pa-2 hoverable"
                elevation="1"
                style="cursor: pointer; height: 100%;"
                @click="handleValueSetSelection(vs)"
              >
                <v-card-text class="pa-2">
                  <div :title="vs.name" class="font-weight-medium mb-1">
                    {{ vs.name }}
                  </div>
                  <div class="text-caption grey--text">
                    Code: {{ vs.id }}
                  </div>
                  <div class="text-caption grey--text">
                    Version: {{ vs.version }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <!-- Detailed view -->
        <div v-else>
          <div v-if="selectedValueSet?.version">
            <strong>Version:</strong> {{ selectedValueSet.version }}
          </div>
          <div v-if="selectedValueSet?.subsetUri">
            <strong>Subset URI:</strong>
            <a :href="selectedValueSet.subsetUri" target="_blank">
              {{ selectedValueSet.subsetUri }}
            </a>
          </div>
          <v-divider class="my-4" />
          <v-data-table
            :headers="headers"
            :items="valueSetItems"
            disable-sort
            @click:row="handleRowClick"
          >
            <template #item="{ item }">
              <tr>
                <td>
                  <v-card outlined color="transparent">
                    {{ item.code }}
                  </v-card>
                </td>
                <td>
                  <v-card outlined color="transparent">
                    {{ item.display }}
                  </v-card>
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn
          v-if="selectedValueSet"
          color="primary"
          :disabled="valueSetItems.length === 0"
          @click="$emit('add-all', valueSetItems)"
        >
          Add all as Permitted Values
        </v-btn>

        <v-spacer />
        <v-btn text @click="handleClose">
          {{ selectedValueSet ? 'Back' : 'Close' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DefinedVDSearchResultTable',
  props: {
    definedSearchResult: {
      type: Array,
      required: true
    },
    show: Boolean
  },
  data () {
    return {
      headers: [
        { text: 'Code', value: 'code' },
        { text: 'Display', value: 'display', align: 'start' }
      ],
      selectedValueSet: null
    }
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
    },
    valueSetItems () {
      // fallback to empty array if undefined
      return this.selectedValueSet?.items || []
    }
  },
  methods: {
    handleRowClick (item) {
      this.$emit('add-single', item)
    },
    handleClose () {
      if (this.selectedValueSet) {
        this.selectedValueSet = null
      } else {
        this.$emit('close')
      }
    },
    handleValueSetSelection (vs) {
      this.selectedValueSet = vs
      this.$emit('select-value-set', vs)
    }
  }
}
</script>
