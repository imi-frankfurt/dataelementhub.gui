<template>
  <div>
    <v-col
      class="d-flex"
      cols="12"
      sm="6"
    >
      <v-select
        v-model="selectedSourceId"
        :items="terminologyServers"
        label="Select terminology server"
        item-value="id"
        item-text="name"
        clearable
      >
        Search in
      </v-select>

      <v-select
        v-if="isSemlookpSelected"
        v-model="selectedTerminologyId"
        :items="terminologyList"
        item-value="id"
        item-text="label"
        label="Ontologie auswählen"
        clearable
      />
      <v-btn
        color="primary"
        rounded
        small
        @click="fetchTerminologyData(designation)"
      >
        <v-icon dark>
          mdi-magnify
        </v-icon>
        search in Terminology Server
      </v-btn>
    </v-col>
    <v-row>
      <v-col cols="4">
        <v-text-field
          v-model="currentConcept.system"
          :counter="255"
          :rules="rules"
          :label="label[0]"
          required
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="currentConcept.version"
          :counter="255"
          :rules="rules"
          :label="label[1]"
          required
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="currentConcept.term"
          :counter="255"
          :rules="rules"
          :label="label[2]"
          required
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-text-field
          v-model="currentConcept.text"
          :counter="65000"
          :rules="rules"
          :label="label[3]"
          required
        />
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="currentConcept.linktype"
          :items="linkTypes"
          :label="label[4]"
          required
        />
      </v-col>
    </v-row>
    <ConceptSearchResultTable
      :show="showResultsModal"
      :concept-search-result="searchResults"
      @close="showResultsModal = false"
      @select="fillFormFromResult"
    />
  </div>
</template>
<script>
import ConceptSearchResultTable from '~/components/tables/conceptSearchResult-table.vue'

export default {
  components: { ConceptSearchResultTable },
  props: {
    conceptAssociation: { required: false, default: () => this.defaultConcept, type: Object }
  },
  data () {
    return {
      ajax: {
        sourceIdUrl: process.env.mdrBackendUrl + '/v1/source/'
      },
      sourceIds: [],
      terminologyServers: [],
      currentConcept: this.conceptAssociation,
      defaultConcept: {
        system: '',
        version: '',
        term: '',
        text: '',
        linktype: 'undefined'
      },
      linkTypes: [
        'undefined',
        'equal',
        'equivalent',
        'wider',
        'subsumes',
        'narrower',
        'specializes',
        'inexact'
      ],
      endpointMap: {
        SnomedCT: {
          url: process.env.mdrBackendUrl + '/v1/snomed/search',
          param: 'term'
        },
        LOINC: {
          url: process.env.mdrBackendUrl + '/v1/loinc/regenstrief/search',
          param: 'query'
        },
        Semlookp: {
          url: process.env.mdrBackendUrl + '/v1/semlookp/search',
          param: 'query',
          ontology: 'id'
        },
        UMLS: {
          url: process.env.mdrBackendUrl + '/v1/umls/search',
          param: 'term'
        }
      },
      searchResults: [],
      sourceName: '',
      showResultsModal: false,
      selectedTerminologyId: '',
      terminologyList: [],
      selectedSourceId: null
    }
  },
  computed: {
    designation () {
      return this.$store.getters.getDesignation
    },
    rules () {
      return [
        v => !!v || this.$t('global.form.validation.messages.requiredField')
      ]
    },
    label () {
      return [
        this.$t('global.system'),
        this.$t('global.version'),
        this.$t('global.term'),
        this.$t('global.text'),
        this.$t('global.linkType')
      ]
    },
    selectedSource () {
      return this.terminologyServers.find(server => server.id === this.selectedSourceId)
    },
    isSemlookpSelected () {
      return this.selectedSource?.name?.toLowerCase() === 'semlookp'
    }
  },
  watch: {
    currentConcept () {
      this.$emit('conceptChanged', this.currentConcept)
    },
    selectedSourceId (newId) {
      this.currentConcept.sourceId = newId
    }
  },
  mounted () {
    this.getSourceId()
    this.loadSemlookpOntologies()
  },
  methods: {
    async getSourceId () {
      try {
        const res = await this.$axios.$get(this.ajax.sourceIdUrl)
        this.sourceIds = res

        // Filter only Terminology Server
        this.terminologyServers = this.sourceIds.filter(
          elem => elem.type === 'TERMINOLOGY_SERVER'
        )
        // Set a preselection or leave the field empty
        this.currentConcept.sourceId = this.terminologyServers[0]?.id || null
      } catch (error) {
        console.error('Fehler beim Laden der Source IDs:', error)
      }
    },

    async loadSemlookpOntologies () {
      try {
        const response = await fetch(process.env.mdrBackendUrl + '/v1/semlookp/ids')
        const data = await response.json()
        this.terminologyList = data.map(id => ({
          id,
          label: id
        }))
      } catch (error) {
        console.error('Fehler beim Laden der SemLookp-Ontologien:', error)
      }
    },
    async fetchTerminologyData (query) {
      const selectedId = this.currentConcept.sourceId
      const selectedSource = this.terminologyServers.find(s => s.id === selectedId)

      if (!selectedSource) {
        console.warn('Keine Terminologiequelle ausgewählt.')
        return
      }
      const selected = this.endpointMap[selectedSource.name]
      if (!selected) {
        console.warn('Kein API-Endpunkt definiert für:', selectedSource.name)
        return
      }

      try {
        if (selectedSource.name?.toLowerCase() === 'semlookp') {
          if (!this.selectedTerminologyId) {
            console.warn('Keine Ontologie für Semlookp ausgewählt.')
            return
          }

          const response = await fetch(`${selected.url}?` +
            new URLSearchParams({
              [selected.param]: query,
              ontology: this.selectedTerminologyId
            })
          )
          const results = await response.json()
          this.searchResults = results
          this.showResultsModal = true
          console.log('Ergebnisse:', results)
          return
        }

        // Other Terminologyservers
        const result = await this.$axios.$get(`${selected.url}?${selected.param}=${encodeURIComponent(query)}`)
        this.searchResults = result
        this.showResultsModal = true
        console.log('Ergebnisse:', result)
      } catch (error) {
        console.error('Fehler beim Abrufen der Terminologie:', error)
      }
    },
    fillFormFromResult (item) {
      this.currentConcept.term = item.term
      this.currentConcept.text = item.text
      this.currentConcept.system = item.system
      this.currentConcept.version = item.version
      this.showResultsModal = false
    }
  }
}
</script>
