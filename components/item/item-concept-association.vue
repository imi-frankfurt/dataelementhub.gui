<template>
  <div>
    <v-row
      class="d-flex"
      cols="12"
      sm="6"
    >
      <v-col cols="3">
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
          :items="semlookpOptions"
          item-value="id"
          item-text="label"
          label="Select Ontology"
          clearable
        />
        <v-select
          v-if="isUmlsSelected"
          v-model="selectedTerminologyId2"
          :items="umlsOptions"
          item-value="id"
          item-text="label"
          label="select source"
          clearable
        />
      </v-col>
      <v-col v-if="showCustomSearch" cols="3">
        <v-text-field
          v-model="searchterm"
          label="Add search term"
          required
        />
      </v-col>
      <v-col class="d-flex flex-nowrap ga-2 overflow-x-auto">
        <v-btn
          color="primary"
          rounded
          small
          class="mr-2"
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
        'SNOMED-CT': {
          url: process.env.mdrBackendUrl + '/v1/snomed/search',
          param: 'term'
        },
        LOINC: {
          url: process.env.mdrBackendUrl + '/v1/loinc/regenstrief/search',
          param: 'query'
        },
        Semlookp: {
          searchAllUrl: process.env.mdrBackendUrl + '/v1/semlookp/searchInAllOntology',
          searchInOntologyUrl: process.env.mdrBackendUrl + '/v1/semlookp/search',
          param: 'query',
          ontology: 'id'
        },
        UMLS: {
          searchAllUrl2: process.env.mdrBackendUrl + '/v1/umls/search',
          searchInOntologyUrl: process.env.mdrBackendUrl + '/v1/umls/searchInOntology',
          param: 'term',
          sabs: 'id'
        },
        'FHIR-TX': {
          url: process.env.mdrBackendUrl + '/v1/fhirTx/searchTerm',
          param: 'query'
        }
      },
      searchResults: [],
      sourceName: '',
      showResultsModal: false,
      selectedTerminologyId: '',
      selectedTerminologyId2: '',
      rawOntologies: [],
      rawOntologies2: [],
      selectedSourceId: null,
      showCustomSearch: false,
      searchterm: '',
      snackbar: {
        show: false,
        message: '',
        color: 'error'
      }
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
    },
    isUmlsSelected () {
      return this.selectedSource?.name?.toLowerCase() === 'umls'
    },
    semlookpOptions () {
      // add all ontologies in the select
      return [
        { id: '', label: '🌐 All Ontologies' },
        ...this.rawOntologies
      ]
    },
    umlsOptions () {
      // add all ontologies in the select
      return [
        { id: '', label: '🌐 All sources' },
        ...this.rawOntologies2
      ]
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
    this.loadUmlsOntologies()
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
        console.error('Error loading source identifiers:', error)
      }
    },

    async loadSemlookpOntologies () {
      try {
        const response = await fetch(process.env.mdrBackendUrl + '/v1/semlookp/ids')
        const data = await response.json()
        this.rawOntologies = data.map(id => ({
          id,
          label: id
        }))
      } catch (error) {
        console.error('Error loading SemLookp-Ontologies:', error)
      }
    },
    async loadUmlsOntologies () {
      try {
        const response = await fetch(process.env.mdrBackendUrl + '/v1/umls/ids')
        const data = await response.json()
        this.rawOntologies2 = data.map(id => ({
          id,
          label: id
        }))
      } catch (error) {
        console.error('Error loading UMLS-Ontologies:', error)
      }
    },
    async fetchTerminologyData (query) {
      const selectedId = this.currentConcept.sourceId
      const selectedSource = this.terminologyServers.find(s => s.id === selectedId)
      const q = (query ?? '').trim()
      if (!q) {
        this.showSnackbar('Enter designation or search term')
        return
      }
      const selected = this.endpointMap[selectedSource.name]
      if (!selected) {
        console.warn('No API endpoint defined for:', selectedSource.name)
        return
      }
      if (!selectedSource) {
        this.showSnackbar('No valid terminology server selected.')
        return
      }
      // Semlookp
      try {
        if (selectedSource.name?.toLowerCase() === 'semlookp') {
          if (this.selectedTerminologyId === null || this.selectedTerminologyId === undefined) {
            alert('Please select either ‘All ontologies’ or a specific ontology before searching')
            return
          }
          let url
          if (!this.selectedTerminologyId) {
            url = `${selected.searchAllUrl}?` + new URLSearchParams({
              query: q,
              obsoletes: 'false'
            }).toString()
          } else {
            url = `${selected.searchInOntologyUrl}?` + new URLSearchParams({
              query: q,
              ontology: this.selectedTerminologyId,
              obsoletes: 'false'
            }).toString()
          }
          const res = await fetch(url, { cache: 'no-store' })
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`)
          }
          const data = await res.json()

          this.searchResults = data.items ?? data
          this.showResultsModal = true
          console.log('response:', this.searchResults)
          return
        }
        // UMLS
        if (selectedSource.name?.toLowerCase() === 'umls') {
          if (this.selectedTerminologyId2 === null || this.selectedTerminologyId2 === undefined) {
            alert('Please select either ‘All sources’ or a specific source before searching')
            return
          }
          let url
          if (!this.selectedTerminologyId2 || this.selectedTerminologyId2 === 'ALL') {
            url = `${selected.searchAllUrl2}?` + new URLSearchParams({
              term: q
            }).toString()
          } else {
            url = `${selected.searchInOntologyUrl}?` + new URLSearchParams({
              query: q,
              sabs: this.selectedTerminologyId2
            }).toString()
          }
          const res = await fetch(url, { cache: 'no-store' })
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`)
          }
          const data = await res.json()

          this.searchResults = data.items ?? data
          this.showResultsModal = true
          console.log('response:', this.searchResults)
          return
        }

        // Other Terminologyservers
        const url = `${selected.url}?` + new URLSearchParams({
          [selected.param]: q
        }).toString()
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const data = await res.json()

        this.searchResults = data
        this.showResultsModal = true
        console.log('response:', this.searchResults)
      } catch (error) {
        console.error('Error retrieving terminology:', error)
      }
    },
    fillFormFromResult (item) {
      this.currentConcept.term = item.term
      this.currentConcept.text = item.text
      this.currentConcept.system = item.system
      this.currentConcept.version = item.version
      this.showResultsModal = false
    },
    showSnackbar (message, color = 'error') {
      this.snackbar = { show: true, message, color }
    }
  }
}
</script>
