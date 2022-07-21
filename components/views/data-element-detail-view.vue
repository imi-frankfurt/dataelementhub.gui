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
        @save="$emit('save', $event); fetchDataElementDetails()"
        @saveFailure="$emit('saveFailure', $event)"
        @dialogClosed="dialog = false"
      />
      <v-card
        v-if="hidePath"
      >
        <!-- Namespace Toolbar TODO: Check of this could be outsourced ...-->
        <v-container>
          <v-row>
            <v-col
              v-if="select.abbr === 'DE'"
              sm="10"
            >
              <v-list>
                <v-list-item-group>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        <b>
                          {{ dataElement.definitions[0].designation }}
                        </b>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>
            <v-col
              v-else-if="select.abbr === 'PUR'"
              sm="10"
            >
              <v-list>
                <v-list-item-group
                  color="indigo"
                >
                  <v-list-item
                    v-for="(item, i) in getElementPathsAsStrings('urn')"
                    :key="i"
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="item.toLowerCase()" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>
            <v-col
              v-else-if="select.abbr === 'PDE'"
              sm="10"
            >
              <v-list>
                <v-list-item-group
                  color="indigo"
                >
                  <v-list-item
                    v-for="(item, i) in getElementPathsAsStrings('de')"
                    :key="i"
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="item.toLowerCase()" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>
            <div v-else>
              <v-col
                v-for="item in elementPathInTree"
                :key="item.urn"
                sm="10"
              >
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
            </div>
            <v-col sm="2">
              <div class="detailViewCard1">
                <v-select
                  v-model="select"
                  :items="items"
                  item-text="state"
                  item-value="abbr"
                  label="Select"
                  persistent-hint
                  return-object
                  single-line
                />
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <v-card
        v-else
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
      <meta-data :data="dataElement.identification" />
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
export default {
  components: {
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
    hidePath: { required: false, default: false, type: Boolean },
    parentUrn: { required: false, default: '', type: String },
    activatePathNavigation: { required: false, default: true, type: Boolean },
    editable: { required: false, default: false, type: Boolean },
    deletable: { required: false, default: false, type: Boolean },
    relationDetailViewAvailable: { required: false, default: false, type: Boolean },
    showJumpToElementButton: { required: false, default: false, type: Boolean }
  },
  data () {
    return {
      ajax: {
        dataElementUrl: process.env.mdrBackendUrl + '/v1/element/'
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
      select: { state: 'DESIGNATION', abbr: 'DE' },
      items: [
        { state: 'DESIGNATION', abbr: 'DE' },
        { state: 'PATHS [URN]', abbr: 'PUR' },
        { state: 'PATHS [DESIGNATIONS]', abbr: 'PDE' }
      ]
    }
  },
  watch: {
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
          this.$log.error('Unable to fetch DataElement paths: ' + err)
        }.bind(this))
    },
    getElementPathsAsStrings (type) {
      const pathsAsStrings = []
      for (let i = 0; i < this.allElementPaths.length; i++) {
        let path = i + 1 + '.   '
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
</style>
