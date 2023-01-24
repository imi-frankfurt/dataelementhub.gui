<template>
  <div v-if="fetchingValueDomain">
    <v-container fluid>
      <v-row>
        <v-col
          align="center"
          justify="center"
        >
          <v-progress-circular
            :size="400"
            color="primary"
            indeterminate
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
  <div v-else>
    <div v-if="valueDomain !== undefined" class="detailView">
      <v-card
        v-if="!hidePath"
        color="grey lighten-4"
        flat
      >
        <common-detail-view-toolbar
          :element-path="elementPathInTree"
          :element-urn="urn"
          :activate-navigation="activatePathNavigation"
          :element-is-deletable="deletable"
          :element-is-editable="editable"
          @showDetailViewDialog="showDetailViewDialog($event)"
          @editElement="editValueDomain"
          @deleteElement="deleteValueDomain"
        />
      </v-card>
      <v-card outlined color="transparent" class="ma-0 pa-0">
        <MetaData
          :type="'ENUMERATED_VALUE_DOMAIN'"
          :data="valueDomain.identification"
        />
      </v-card>
      <v-card v-if="hidePath" class="detailViewCard">
        <v-list>
          <v-subheader>
            {{ $t('global.paths') }}
            <div class="choose-button-wrapper">
              <button
                :class="getLeftButtonClass()"
                @click="selectedElementPathType = 'DESIGNATION'"
              >
                {{ $t('global.designation') }}
              </button>
              <button
                :class="getRightButtonClass()"
                @click="selectedElementPathType = 'URN'"
              >
                {{ $t('global.urn') }}
              </button>
            </div>
          </v-subheader>
          <v-list-item>
            <v-list-item-content>
              <paths-table :paths="allElementPathsAsString" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <v-card class="detailViewCard">
        <v-list>
          <v-subheader>{{ $t('global.definitions') }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <definition-table :definitions="valueDomain.definitions" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <v-card class="detailViewCard">
        <v-list v-if="valueDomain.slots.length > 0">
          <v-subheader>{{ $t('global.slots') }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <slot-table :slots="valueDomain.slots" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <v-card class="detailViewCard">
        <v-list v-if="valueDomain.conceptAssociations.length > 0">
          <v-subheader>{{ $t('global.conceptAssociations') }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <concept-association-table :associations="valueDomain.conceptAssociations" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <v-card class="detailViewCard">
        <v-list v-if="valueDomain.conceptAssociations.length > 0">
          <v-subheader>{{ $t('global.conceptAssociations') }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <concept-association-table :associations="valueDomain.conceptAssociations" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <PermittedValuesTable
        v-if="valueDomain.type === 'ENUMERATED'"
        :values="valueDomain.permittedValues"
        :clickable="true"
      />
      <v-btn
        v-if="showJumpToElementButton"
        class="d-block mr-0 ml-auto"
        color="primary"
        rounded
        @click="dialog.elementType = 'NAMESPACE'; dialog.showNamespace = true"
      >
        {{ $t('global.button.showInTreeView') }}
        <v-icon dark>
          mdi-arrow-right-circle
        </v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script>
import Ajax from '~/config/ajax'
import DefinitionTable from '~/components/tables/definition-table'
import SlotTable from '~/components/tables/slot-table'
import MetaData from '~/components/item/meta-data'
import ConceptAssociationTable from '~/components/tables/concept-association-table'
import PathsTable from '~/components/tables/paths-table'
import PermittedValuesTable from '~/components/tables/permitted-values-table'
export default {
  components: {
    PathsTable,
    DefinitionTable,
    SlotTable,
    MetaData,
    ConceptAssociationTable,
    PermittedValuesTable
  },
  props: {
    urn: { required: true, type: String },
    parentUrn: { required: false, default: '', type: String },
    hidePath: { required: false, default: false, type: Boolean },
    activatePathNavigation: { required: false, default: true, type: Boolean },
    editable: { required: false, default: false, type: Boolean },
    deletable: { required: false, default: false, type: Boolean },
    relationDetailViewAvailable: { required: false, default: false, type: Boolean },
    showJumpToElementButton: { required: false, default: false, type: Boolean }
  },
  data () {
    return {
      ajax: {
        valueDomainUrl: process.env.mdrBackendUrl + '/v1/element/'
      },
      detailViewDialog: {
        urn: '',
        parentUrn: '',
        show: false,
        namespaceIdentifier: -1
      },
      showAllPaths: false,
      fetchingValueDomain: true,
      valueDomain: undefined,
      dialog: false,
      elementPathInTree: [],
      allElementPaths: [],
      allElementPathsAsString: [],
      selectedElementPathType: 'DESIGNATION'
    }
  },
  watch: {
    allElementPaths () {
      this.allElementPathsAsString = this.getElementPathsAsStrings(this.selectedElementPathType)
    },
    selectedElementPathType () {
      this.allElementPathsAsString = this.getElementPathsAsStrings(this.selectedElementPathType)
    },
    urn (n) {
      this.fetchingValueDomain = true
      this.fetchDataElementDetails()
      this.fetchElementPath()
    }
  },
  mounted () {
    this.$log.debug('Mounted ValueDomain view ...')
    this.fetchDataElementDetails()
    this.fetchElementPath()
  },
  methods: {
    getLeftButtonClass () {
      return {
        'left-button-marked': this.selectedElementPathType === 'DESIGNATION',
        'left-button': this.selectedElementPathType !== 'DESIGNATION'
      }
    },
    getRightButtonClass () {
      return {
        'right-button-marked': this.selectedElementPathType === 'URN',
        'right-button': this.selectedElementPathType !== 'URN'
      }
    },
    async fetchDataElementDetails () {
      this.$log.debug('ValueDomain DetailView: Fetching ValueDomain details ...')
      await this.$axios.$get(this.ajax.valueDomainUrl + this.urn, Ajax.header.ignoreLanguage)
        .then(function (res) {
          this.fetchingValueDomain = false
          this.valueDomain = Object.assign({}, res)
        }.bind(this))
        .catch(function (err) {
          this.$log.error('Unable to fetch ValueDomain details: ' + err)
        }.bind(this))
    },
    editValueDomain () {
      this.dialog = true
    },
    async deleteValueDomain () {
      if (confirm(this.$i18n.t('global.itemDialog.deleteItemTitle').toString())) {
        await this.$axios.$delete(this.ajax.valueDomainUrl + this.urn)
          .then(function (res) {
            this.$emit('delete', {
              urn: this.urn
            })
          }.bind(this))
          .catch(function (err) {
            this.$emit('deleteFailure', err.response)
            this.$log.debug('Could not delete this item: ' + err)
          }.bind(this))
      }
    },
    async fetchElementPath () {
      this.$log.debug('ValueDomain DetailView: Fetching ValueDomain path ...')
      await this.$axios.$get(this.ajax.valueDomainUrl + this.urn + '/paths',
        Ajax.header.ignoreLanguage)
        .then(function (res) {
          this.allElementPaths = res
          for (let i = 0; i < res.length; i++) {
            if (res[i][res[i].length - 2].urn === this.parentUrn) {
              this.elementPathInTree = res[i]
              break
            }
          }
        }.bind(this))
        .catch(function (err) {
          this.elementPath = []
          this.$log.error('Unable to fetch ValueDomain paths: ' + err)
        }.bind(this))
    },
    getElementPathsAsStrings (type) {
      let pathsAsStrings = []
      for (let i = 0; i < this.allElementPaths.length; i++) {
        let path = ''
        for (let j = 0; j < this.allElementPaths[i].length; j++) {
          if (type.toUpperCase() === 'URN') {
            path = path + this.allElementPaths[i][j].urn
          } else {
            path = path + this.allElementPaths[i][j].designation
          }
          if (j !== this.allElementPaths[i].length - 1) {
            path = path + ' / '
          }
        }
        pathsAsStrings.push(path)
      }
      pathsAsStrings = pathsAsStrings.map(function (item) {
        return {
          item
        }
      })
      return pathsAsStrings
    },
    showDetailViewDialog (urn) {
      if (urn.toUpperCase().includes('DATAELEMENT:')) {
        return
      }
      this.detailViewDialog.urn = urn
      if (!urn.toUpperCase().includes('NAMESPACE')) {
        for (let i = 0; i < this.elementPathInTree.length; i++) {
          if (this.elementPathInTree[i].urn === urn) {
            this.detailViewDialog.parentUrn = this.elementPathInTree[i - 1].urn
            break
          }
        }
      }
      this.detailViewDialog.show = true
    }
  }
}
</script>
<style scoped>

.detailView {
  padding: 2px 10px;
}

.dialogCard {
  padding-top: 40px;
  padding-bottom: 25px;
  padding-left: 20px;
  padding-right: 20px;
}

.detailViewCard {
  margin-bottom: 10px;
}

.designationButton {
  min-width: 150px;
  max-width: 150px;
  width: 150px;
  overflow: hidden;
  text-overflow: fade;
}

.left-button {
  background-color: white;
  color: #21587f;
  border-radius: 6.5rem 0 0 6.5rem;
  border: solid 0.1rem #21587f;
  width: 110px;
  height: 35px;
  font-size: 1rem;
  cursor: pointer;
}

.left-button-marked {
  background-color: #21587f;
  color: white;
  border-radius: 6.5rem 0 0 6.5rem;
  border: none;
  width: 110px;
  height: 35px;
  font-size: 1rem;
  cursor: pointer;
}

.right-button {
  background-color: white;
  color: #21587f;
  border-radius: 0 6.5rem 6.5rem 0;
  border: solid 0.1rem #21587f;
  width: 110px;
  height: 35px;
  font-size: 1rem;
  cursor: pointer;
}

.right-button-marked {
  background-color: #21587f;
  color: white;
  border-radius: 0 6.5rem 6.5rem 0;
  border: none;
  width: 110px;
  height: 35px;
  font-size: 1rem;
  cursor: pointer;
}

.choose-button-wrapper {
  position: absolute;
  right: 20px;
}
</style>
