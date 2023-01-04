<template>
  <div v-if="fetchingDataElement">
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
    <div v-if="dataElement !== undefined">
      <data-element-dialog
        :urn="urn"
        :show="dialog"
        @save="$emit('saveSuccess', $event); fetchDataElementDetails(); fetchElementPath()"
        @saveFailure="$emit('saveFailure', $event)"
        @dialogClosed="dialog = false"
      />
      <v-card
        v-if="!hidePath"
        class="detailViewCard"
        color="grey lighten-4"
        flat
      >
        <!-- Namespace Toolbar TODO: Check of this could be outsourced ...-->
        <v-toolbar>
          <v-toolbar-title>
            <v-container class="text-center">
              <v-row no-gutters>
                <v-col v-for="item in elementPathInTree" :key="item.urn">
                  <v-icon v-if="!item.urn.includes('namespace')">
                    mdi-slash-forward
                  </v-icon>
                  <v-btn
                    width="130"
                    class="designationButton"
                    color="grey lighten-4"
                    rounded
                    :disabled="!activatePathNavigation"
                    @click="showDetailViewDialog(item.urn)"
                  >
                    <div
                      v-if="item.urn === urn"
                      style="text-align: center; width: 100%; white-space: normal;"
                    >
                      {{ item.designation }}
                    </div>
                    <a
                      v-if="item.urn !== urn"
                      style="text-align: center; width: 100%; white-space: normal;"
                    >
                      {{ item.designation }}
                    </a>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            v-if="editable"
            icon
            color="primary"
            @click="editDataElement"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="deletable"
            icon
            @click="deleteDataElement"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card>
      <v-card outlined color="transparent" class="ma-0 pa-0">
        <MetaData
          :type="'DATAELEMENT'"
          :data="dataElement.identification"
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
              <definition-table :definitions="dataElement.definitions" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <v-card class="detailViewCard">
        <v-list>
          <v-subheader>{{ $t('global.valueDomain') }} : {{ dataElement.valueDomainUrn }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <value-domain :urn="dataElement.identification.urn" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <v-card class="detailViewCard">
        <v-list v-if="dataElement.slots.length > 0">
          <v-subheader>{{ $t('global.slots') }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <slot-table :slots="dataElement.slots" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <v-card class="detailViewCard">
        <v-list v-if="dataElement.relations.length > 0">
          <v-subheader>{{ $t('global.relations') }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <relation-table
                :relations="dataElement.relations"
                :detail-view-available="relationDetailViewAvailable"
              />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
      <v-card class="detailViewCard">
        <v-list v-if="dataElement.conceptAssociations.length > 0">
          <v-subheader>{{ $t('global.conceptAssociations') }}</v-subheader>
          <v-list-item>
            <v-list-item-content>
              <concept-association-table :associations="dataElement.conceptAssociations" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
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
    <v-dialog
      v-model="detailViewDialog.show"
      width="600"
    >
      <v-card class="dialogCard">
        <GroupsRecordsDetailView
          v-if="detailViewDialog.urn.toUpperCase().includes('DATAELEMENTGROUP')
            || detailViewDialog.urn.toUpperCase().includes('RECORD')"
          :urn="detailViewDialog.urn"
          :parent-urn="detailViewDialog.parentUrn"
          :activate-path-navigation="false"
          :show-jump-to-element-button="true"
          :editable="false"
          :deletable="false"
        />
        <NamespaceDetailView
          v-if="detailViewDialog.urn.toUpperCase().includes('NAMESPACE')"
          :show-jump-to-element-button="true"
          :urn="detailViewDialog.urn"
          :editable="false"
          :deletable="false"
        />
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Ajax from '~/config/ajax'
import DefinitionTable from '~/components/tables/definition-table'
import SlotTable from '~/components/tables/slot-table'
import MetaData from '~/components/item/meta-data'
import DataElementDialog from '~/components/dialogs/data-element-dialog'
import RelationTable from '~/components/tables/relation-table'
import ConceptAssociationTable from '~/components/tables/concept-association-table'
import ValueDomain from '~/components/views/value-domain'
import NamespaceDetailView from '~/components/views/namespace-detail-view.vue'
import PathsTable from '~/components/tables/paths-table'
export default {
  components: {
    PathsTable,
    DefinitionTable,
    SlotTable,
    MetaData,
    DataElementDialog,
    RelationTable,
    ConceptAssociationTable,
    ValueDomain,
    GroupsRecordsDetailView: () => import('~/components/views/groups-records-detail-view'),
    NamespaceDetailView
  },
  props: {
    urn: { required: true, type: String },
    parentUrn: { required: true, type: String },
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
        dataElementUrl: process.env.backendUrl + '/v1/element/'
      },
      detailViewDialog: {
        urn: '',
        parentUrn: '',
        show: false,
        namespaceIdentifier: -1
      },
      showAllPaths: false,
      fetchingDataElement: true,
      dataElement: undefined,
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
      this.fetchingDataElement = true
      this.fetchDataElementDetails()
      this.fetchElementPath()
    }
  },
  mounted () {
    this.$log.debug('Mounted DataElement view ...')
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
      this.$log.debug('DataElement DetailView: Fetching DataElement details ...')
      await this.$axios.$get(this.ajax.dataElementUrl + this.urn, Ajax.header.ignoreLanguage)
        .then(function (res) {
          res.relations = []
          this.dataElement = Object.assign({}, res)
          this.$log.debug('Fetching DataElement relations ...')
          this.$axios.$get(this.ajax.dataElementUrl + this.urn + '/relations', Ajax.header.ignoreLanguage)
            .then(function (res1) {
              this.dataElement.relations = res1
              this.fetchingDataElement = false
            }.bind(this))
            .catch(function (err) {
              this.$log.error('Could not fetch relations: ' + err)
            }.bind(this))
        }.bind(this))
        .catch(function (err) {
          this.$log.error('Unable to fetch DataElement details: ' + err)
        }.bind(this))
    },
    editDataElement () {
      this.dialog = true
    },
    async deleteDataElement () {
      if (confirm(this.$i18n.t('global.itemDialog.deleteItemTitle').toString())) {
        await this.$axios.$delete(this.ajax.dataElementUrl + this.urn)
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
      this.$log.debug('DataElement DetailView: Fetching DataElement path ...')
      await this.$axios.$get(this.ajax.dataElementUrl + this.urn + '/paths',
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
          this.$log.error('Unable to fetch DataElement paths: ' + err)
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
<style>
.dialogCard {
  padding-top: 40px;
  padding-bottom: 25px;
  padding-left: 20px;
  padding-right: 20px;
}

.detailViewCard {
  margin-bottom: 30px;
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
