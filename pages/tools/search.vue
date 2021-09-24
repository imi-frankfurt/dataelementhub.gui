<template>
  <div>
    <default-snackbar
      :text="$t('global.itemDialog.snackbar.deleteFailure')"
      :show="snackbar.deleteFailure"
      color="error"
    />
    <default-snackbar
      :text="$t('global.itemDialog.snackbar.deleteSuccess')"
      :show="snackbar.deleteSuccess"
    />
    <default-snackbar
      :text="$t('global.itemDialog.snackbar.saveFailure')"
      :show="snackbar.saveFailure"
      color="error"
    />
    <default-snackbar
      :text="$t('global.itemDialog.snackbar.saveSuccess')"
      :show="snackbar.saveSuccess"
    />
    <h1>{{ $t('pages.tools.search.title') }}</h1>
    <v-form>
      <v-row>
        <v-col>
          <v-text-field
            v-model="search.query"
            :counter="255"
            :rules="searchRules"
            :label="$t('global.searchText')"
            required
            @input="executeSearch()"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-select
            v-model="search.type"
            :items="elementTypes"
            attach
            chips
            :label="$t('global.elementTypes')"
            multiple
            outlined
            @change="executeSearch()"
          />
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="search.status"
            :items="elementStatuses"
            attach
            chips
            :label="$t('global.elementStatuses')"
            multiple
            outlined
            @change="executeSearch()"
          />
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="search.section"
            :items="elementSections"
            attach
            chips
            :label="$t('pages.tools.search.elementSections')"
            multiple
            outlined
            @change="executeSearch()"
          />
        </v-col>
      </v-row>
    </v-form>
    <template v-if="resultsAvailable">
      <v-row>
        <v-col>
          <h3>{{ $t('pages.tools.search.searchResult') }} <v-chip>{{ results.length }}</v-chip></h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-list-item-group v-model="selectedItem" mandatory @change="switchResult">
            <v-list-item v-for="(item, i) in results" :key="i">
              <v-list-item-icon>
                <v-icon v-text="item.icon" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.text" />
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-col>
        <v-col cols="10">
          <template v-if="showDetails">
            <namespace-detail-view
              v-if="detailItem.type == 'NAMESPACE'"
              :id="detailItem.id"
              :urn="detailItem.urn"
              @delete="executeSearch(); snackbar.deleteSuccess = true"
              @deleteFailure="snackbar.deleteFailure = true"
              @save="snackbar.saveSuccess = true"
              @saveFailure="snackbar.saveFailure = true"
            />
            <data-element-detail-view
              v-else-if="detailItem.type == 'DATAELEMENT'"
              :urn="detailItem.urn"
              :relation-detail-view-available="true"
              :editable="true"
              @delete="executeSearch(); snackbar.deleteSuccess = true"
              @deleteFailure="snackbar.deleteFailure = true"
              @save="snackbar.saveSuccess = true"
              @saveFailure="snackbar.saveFailure = true"
            />
            <groups-records-detail-view
              v-else-if="detailItem.type == 'DATAELEMENTGROUP' || detailItem.type == 'RECORD'"
              :urn="detailItem.urn"
            />
          </template>
        </v-col>
      </v-row>
    </template>
  </div>
</template>
<script>
import Common from '~/assets/js/common'
import NamespaceDetailView from '~/components/views/namespace-detail-view'
import DataElementDetailView from '~/components/views/data-element-detail-view'
import GroupsRecordsDetailView from '~/components/views/groups-records-detail-view'
import DefaultSnackbar from '~/components/snackbars/default-snackbar'
export default {
  components: {
    NamespaceDetailView,
    DataElementDetailView,
    GroupsRecordsDetailView,
    DefaultSnackbar
  },
  data () {
    return {
      ajax: {
        searchUrl: process.env.mdrBackendUrl + '/v1/search'
      },
      elementTypes: Common.elementTypes(),
      elementStatuses: Common.elementStatuses(),
      elementSections: [
        'definition',
        'designation',
        'slotKey',
        'slotValue',
        'conceptAssociationSystem',
        'conceptAssociationTerm',
        'conceptAssociationText',
        'dataType',
        'valueDomainDescription',
        'unitOfMeasure',
        'format'
      ],
      search: {
        query: '',
        type: [],
        status: [],
        section: []
      },
      results: [],
      selectedItem: 0,
      showDetails: false,
      detailItem: undefined,
      snackbar: {
        deleteFailure: false,
        deleteSuccess: false,
        saveFailure: false,
        saveSuccess: false
      }
    }
  },
  computed: {
    searchRules () {
      return [
        v => !!v || this.$t('global.form.validation.messages.valueIsRequired'),
        v => v.length <= 255 || this.$t('global.form.validation.messages.maxChars')
      ]
    },
    resultsAvailable () {
      return this.results.length > 0
    }
  },
  methods: {
    async executeSearch () {
      if (this.search.query.length > 0) {
        this.$log.debug('Executing Search ...')
        await this.$axios.$get(this.ajax.searchUrl,
          { params: this.search, paramsSerializer (params) { return Common.paramsSerializer(params) } })
          .then(function (res) {
            this.results.splice(0, this.results.length)
            this.selectedItem = 0
            for (let i = 0; i < res.length; i++) {
              const resultItem = Object
              switch (res[i].identification.elementType) {
                case 'NAMESPACE':
                  resultItem.icon = 'mdi-alphabetical-variant'
                  break
                case 'DATAELEMENT':
                  resultItem.icon = 'mdi-vector-arrange-below'
                  break
                case 'DATAELEMENTGROUP':
                case 'RECORD':
                  resultItem.icon = 'mdi-group'
                  break
                default:
                  this.$log.error('Could not determine object type ...')
                  resultItem.icon = ''
                  break
              }
              resultItem.id = res[i].identification.identifier
              resultItem.urn = res[i].identification.urn
              resultItem.text = res[i].identification.urn
              resultItem.type = res[i].identification.elementType
              this.results.push(Object.assign({}, resultItem))
            }
          }.bind(this))

        if (this.results.length > 0) {
          this.switchResult()
        }
      }
    },
    switchResult () {
      this.detailItem = Object.assign({}, this.results[this.selectedItem])
      this.showDetails = true
    }
  }
}
</script>
