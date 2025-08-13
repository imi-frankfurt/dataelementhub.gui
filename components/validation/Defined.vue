<template>
  <div>
    <v-card-text>
      <v-form ref="form" v-model="formValid">
        <v-btn
          color="primary"
          rounded
          small
          @click="showPermittedValueSearch = true"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
          Add Defined Permitted Value
        </v-btn>
        <div v-if="showPermittedValueSearch" style="margin-top: 20px;">
          <v-row>
            <v-col cols="3">
              <v-select
                v-model="terminologyServer"
                :items="terminologyServers"
                label="Select terminology server"
                item-value="id"
                item-text="name"
                :return-object="false"
                clearable
                @change="onSourceChange"
              />
            </v-col>
            <v-col v-if="showCustomSearch" cols="3">
              <v-text-field
                v-model="searchterm"
                label="Add search term"
                required
              />
            </v-col>
            <v-col cols="3">
              <v-btn
                color="primary"
                rounded
                small
                @click="fetchTerminologyData(showCustomSearch ? searchterm : designation)"
              >
                <v-icon dark>
                  mdi-magnify
                </v-icon>
                Search in Terminology Server
              </v-btn>
              <v-btn
                color="primary"
                rounded
                small
                @click="showCustomSearch = !showCustomSearch"
              >
                <v-icon left>
                  {{ showCustomSearch ? 'mdi-close' : 'mdi-pencil' }}
                </v-icon>
                {{ showCustomSearch ? 'Close custom search term' : 'Use custom search term' }}
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <div v-if="definedPermittedValues.some(v => v.value)">
          <v-row>
            <v-col cols="12" sm="6">
              <item-definition
                :designation="localDefinitions[0]?.designation"
                :definition="localDefinitions[0]?.definition"
                :language="localDefinitions[0]?.language"
                :definition-readonly="true"
                @designation="localDefinitions[0].designation = $event"
                @definition="localDefinitions[0].definition = $event"
                @language="localDefinitions[0].language = $event"
              />
            </v-col>
            <v-col cols="2">
              <v-list-item>
                <v-list-item-action>
                  <v-btn
                    v-if="definedPermittedValues.length > 0 || localDefinitions[0]?.designation"
                    color="secondary"
                    rounded
                    small
                    :disabled="disableRemoveDefinedValueAction"
                    @click="clearDefinedValues"
                  >
                    <v-icon dark>
                      mdi-delete
                    </v-icon>
                    {{ $t('global.button.delete') }}
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-col>
          </v-row>
          <h3 style="margin-top: 20px;">
            Defined Value Domain permitted values
          </h3>
          <v-list>
            <v-list-item
              v-for="(dpv, index) in definedPermittedValues"
              :key="index"
              class="mb-4"
            >
              <v-container fluid>
                <v-row>
                  <v-col cols="3">
                    <v-text-field
                      v-model="dpv.value"
                      label="Value"
                      :rules="[v => !!v || 'Value is required']"
                      required
                      readonly
                      @value="dpv.value = $event"
                    />
                  </v-col>
                  <v-col cols="9">
                    <item-definition
                      :definition="dpv.definitions[0].definition"
                      :designation="dpv.definitions[0].designation"
                      :language="dpv.language"
                      @definition="dpv.definitions[0].definition = $event"
                      @designation="dpv.definitions[0].designation = $event"
                      @language="dpv.language = $event"
                    />
                  </v-col>
                </v-row>
              </v-container>
              <v-divider class="my-2" />
            </v-list-item>
          </v-list>
        </div>
      </v-form>
    </v-card-text>
    <DefinedVDSearchResultTable
      :show="showResultsModal"
      :defined-search-result="searchResults"
      @select-value-set="selectValueSet"
      @close="showResultsModal = false"
      @add-all="addAllPermittedValues"
      @add-single="addSinglePermittedValue"
    />
    <!-- Snackbar for user feedback -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      top
      right
    >
      {{ snackbar.message }}
      <v-btn
        text
        @click="snackbar.show = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import DefinedVDSearchResultTable from '~/components/tables/definedVDSearchResult-table.vue'
import ItemDefinition from '~/components/item/item-definition.vue'
import Common from '~/assets/js/common'

export default {
  components: { DefinedVDSearchResultTable },
  props: {
    // availableValueDomains: { required: true, type: Array },
    namespaceId: { required: true, type: String },
    definitions: { type: Array, required: true, default: () => [] },
    definedPermittedValues: { type: Array, required: true, default: () => this.defaultDefinedValueDomain.definedPermittedValues },
    valueDomainReferenceDTO: { type: Object, required: true, default: () => ({}) }
  },
  data () {
    return {
      ajax: {
        sourceIdUrl: process.env.mdrBackendUrl + '/v1/source/'
      },
      sourceIds: [],
      terminologyServers: [],
      terminologyServer: null, // v-model target
      searchResults: [], // initialized properly
      showResultsModal: false,
      selected: [],
      singleSelect: true,
      formValid: false,
      defaultDefinedValueDomain: Object.assign({}, Common.defaultDefinedValueDomain()),
      showPermittedValueSearch: false,
      search: '',
      snackbar: {
        show: false,
        message: '',
        color: 'error'
      },
      localDefinitions: [...this.definitions],
      valueSetMeta: {
        designation: '', // ← Name
        definition: '', // ← ID
        language: 'en'
      },
      showCustomSearch: false,
      searchterm: ''
    }
  },
  computed: {
    designation () {
      return this.$store.getters.getDesignation
    },
    valueRules () {
      return [
        v => !!v || this.$t('global.form.validation.messages.valueIsRequired')
      ]
    },
    disableRemoveDefinedValueAction () {
      return this.definedPermittedValues.length === 1
    }
  },
  watch: {
    selected: {
      handler () {
        if (this.selected.length > 0) {
          this.$emit('chooseValueDomain', this.selected[0].urn)
        } else {
          this.$emit('deleteValueDomainUrn')
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.getSourceId()
  },
  methods: {
    async getSourceId () {
      try {
        const res = await this.$axios.$get(this.ajax.sourceIdUrl)
        this.sourceIds = res

        // Filter only Terminology Server
        this.terminologyServers = this.sourceIds
          .filter(elem => elem.type === 'TERMINOLOGY_SERVER')
          .map(server => ({
            ...server,
            endpoint: this.getEndpointConfig(server.name)
          }))

        // Set a preselection or leave the field empty
        if (this.terminologyServers.length > 0) {
          this.terminologyServer = this.terminologyServers[0].id
          this.sourceName = this.terminologyServers[0].name
        }
      } catch (error) {
        this.showSnackbar('Failed to load terminology servers.')
      }
    },
    getEndpointConfig (name) {
      const baseUrl = process.env.mdrBackendUrl
      const endpoints = {
        SnomedCT: { url: `${baseUrl}/v1/snomed/search`, param: 'term' },
        LOINC: { url: `${baseUrl}/v1/loincFHIR/searchValueSet`, param: 'query' }
      }
      return endpoints[name] || null
    },
    onSourceChange (selectedId) {
      const selected = this.terminologyServers.find(ts => ts.id === selectedId)
      this.sourceName = selected ? selected.name : null
    },
    async fetchTerminologyData (query) {
      const selectedId = this.terminologyServer
      const selectedSource = this.terminologyServers.find(s => s.id === selectedId)

      if (!selectedSource || !selectedSource.endpoint) {
        this.showSnackbar('No valid terminology source selected.')
        return
      }

      const { url, param } = selectedSource.endpoint

      try {
        const data = await this.$axios.$get(`${url}?${param}=${encodeURIComponent(query)}`)

        if (!Array.isArray(data) || data.length === 0) {
          this.showSnackbar('No results found for the query.')
          return
        }

        // Save all results - user selects later
        this.searchResults = data
        this.selectedSourceId = selectedSource.id // For later emit
        this.showResultsModal = true
      } catch (error) {
        this.showSnackbar('Failed to fetch terminology data.')
      }
    },
    selectValueSet (valueSet) {
      this.valueSetMeta.designation = valueSet.name || ''
      this.valueSetMeta.definition = valueSet.id || ''
      this.$emit('update:valueDomainReferenceDTO', {
        codeSystem: {
          version: valueSet.version,
          sourceId: this.selectedSourceId
        },
        subsetUri: valueSet.subsetUri
      })
      this.localDefinitions = [
        {
          designation: valueSet.name || '',
          definition: valueSet.id || '',
          language: 'en'
        }
      ]
      this.$emit('update:definitions', this.localDefinitions)
    },
    handleValueDomainClicked (value) {
      this.$emit('showValueDomainDialog', value.urn)
    },
    showSnackbar (message, color = 'error') {
      this.snackbar = { show: true, message, color }
    },
    clearDefinedValues () {
      // Alle Defined Permitted Values löschen
      this.$emit('update:definedPermittedValues', [])

      // Definition zurücksetzen
      this.$emit('update:definitions', [
        {
          designation: '',
          definition: '',
          language: 'en'
        }
      ])
    },
    addDefinition () {
      this.defaultDefinedValueDomain.definitions.push(ItemDefinition.data().defaultDefinition)
    },
    deleteDefinition (index) {
      this.defaultDefinedValueDomain.definitions.splice(index, 1)
    },
    updateDesignation (index, value) {
      this.defaultDefinedValueDomain.definitions[index].designation = value
      this.$store.dispatch('updateDesignation', value) // Update Vuex
    },
    fillFormFromResult (item) {
      if (this.searchResults?.items) {
        const newValues = [...this.definedPermittedValues]

        this.searchResults.items.forEach((resultItem) => {
          newValues.push({
            definitions: [
              {
                designation: resultItem.display,
                definition: resultItem.display
              }
            ],
            value: resultItem.code
          })
        })

        this.$emit('update:definedPermittedValues', newValues)
      }
      this.showResultsModal = false
    },
    addAllPermittedValues (items) {
      const newValues = this.definedPermittedValues.filter(v => !!v.value)

      items.forEach((resultItem) => {
        if (!newValues.some(v => v.value === resultItem.code)) {
          newValues.push({
            definitions: [
              {
                designation: resultItem.display,
                definition: resultItem.display,
                language: 'de'
              }
            ],
            value: resultItem.code
          })
        }
      })

      this.$emit('update:definedPermittedValues', newValues)
      this.showResultsModal = false
      this.showPermittedValueSearch = false
    },
    addSinglePermittedValue (item) {
      let newValues = this.definedPermittedValues.filter(v => !!v.value)
      if (!this.definedPermittedValues.some(v => v.value === item.code)) {
        newValues = [
          ...this.definedPermittedValues,
          {
            definitions: [
              {
                designation: item.display,
                definition: item.display,
                language: 'de'
              }
            ],
            value: item.code
          }
        ]
        this.$emit('update:definedPermittedValues', newValues)
      }
      this.showResultsModal = false
      this.showPermittedValueSearch = false
    }
  }
}
</script>
