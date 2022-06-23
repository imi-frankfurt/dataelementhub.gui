<template>
  <div v-if="fetchingElement">
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
          >
          </v-progress-circular>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <div v-else>
    <GroupRecordDialog
      :show="dialog"
      :urn="urn"
      :namespace-urn="element.identification.namespaceUrn"
      :element-type="elementType"
      @save="saveElement($event)"
      @saveFailure="$emit('saveFailure', $event)"
      @dialogClosed="dialog = false"
    />
    <v-card
      class="detailViewCard"
      color="grey lighten-4"
      flat
    >
      <!-- Namespace Toolbar TODO: Check of this could be outsourced ...-->
      <v-toolbar>
        <v-toolbar-title>
          <v-container class="text-center">
            <v-row no-gutters>
              <v-col v-for="item in elementPath" :key="item.urn">
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
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              v-if="editable"
              icon
              color="primary"
              v-bind="attrs"
              v-on="on"
              @click="updateMembers"
            >
              <v-icon>mdi-arrow-up-box</v-icon>
            </v-btn>
          </template>
          <span>Update Members</span>
        </v-tooltip>
        <v-btn
          v-if="editable"
          icon
          color="primary"
          @click="editItem"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          v-if="deletable"
          icon
          @click="deleteItem"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
    <v-card outlined color="transparent" class="ma-0 pa-0">
      <meta-data
        :data="element.identification"
      />
    </v-card>
    <v-card class="detailViewCard">
      <v-list>
        <v-subheader>{{ $t('global.definitions') }}</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <definition-table :definitions="element.definitions" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
    <v-card class="detailViewCard">
      <v-list v-if="element.members.length > 0">
        <v-subheader>{{ $t('global.members') }}</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <members-table :members="element.members" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
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
          :urn="detailViewDialog.urn"
          :editable="false"
          :deletable="false"
        />
      </v-card>
    </v-dialog>
    <v-btn
      v-if="showJumpToElementButton"
      class="d-block mr-0 ml-auto"
      color="primary"
      rounded
      @click="$root.$emit('changeActiveElement', urn)"
    >
      {{ $t('global.button.showInTreeView') }}
      <v-icon dark>
        mdi-arrow-right-circle
      </v-icon>
    </v-btn>
  </div>
</template>
<script>
import Common from '~/assets/js/common'
import Ajax from '~/config/ajax'
import DefinitionTable from '~/components/tables/definition-table'
import MetaData from '~/components/item/meta-data'
import MembersTable from '~/components/tables/members-table'
import GroupRecordDialog from '~/components/dialogs/group-record-dialog'
import NamespaceDetailView from '~/components/views/namespace-detail-view.vue'
export default {
  components: {
    MetaData,
    DefinitionTable,
    MembersTable,
    GroupRecordDialog,
    GroupsRecordsDetailView: () => import('~/components/views/groups-records-detail-view'),
    NamespaceDetailView
  },
  props: {
    urn: { required: true, type: String },
    parentUrn: { required: false, default: '', type: String },
    editable: { required: false, default: false, type: Boolean },
    deletable: { required: false, default: false, type: Boolean },
    activatePathNavigation: { required: false, default: true, type: Boolean },
    showJumpToElementButton: { required: false, default: false, type: Boolean }
  },
  data () {
    return {
      ajax: {
        elementUrl: process.env.mdrBackendUrl + '/v1/element/'
      },
      detailViewDialog: {
        urn: '',
        parentUrn: '',
        show: false,
        namespaceIdentifier: -1
      },
      fetchingElement: true,
      elementPath: [],
      element: undefined,
      dialog: false
    }
  },
  computed: {
    elementType () {
      return Common.findElementType(this.urn)
    }
  },
  watch: {
    urn (n) {
      this.fetchingElement = true
      this.loadDetails()
      this.fetchElementPath()
    }
  },
  mounted () {
    this.loadDetails()
    this.fetchElementPath()
  },
  methods: {
    async loadDetails () {
      await this.$axios.$get(this.ajax.elementUrl + this.urn, Ajax.header.ignoreLanguage)
        .then(function (res) {
          this.fetchingElement = false
          this.element = res
        }.bind(this))
    },
    async updateMembers () {
      await this.$axios.post(this.ajax.elementUrl + this.urn + '/updateMembers')
        .then(function (res) {
          this.$axios.$get(res.headers.location)
            .then(function (res1) {
              this.element = res1
              this.element.previousUrn = this.urn
              this.element.action = 'UPDATE'
              this.$emit('reloadMembers', this.element)
            }.bind(this))
        }.bind(this))
        .catch(function (err) {
          this.$log.debug('Could not update Members: ' + err)
        }.bind(this))
    },
    editItem () {
      this.dialog = true
    },
    async deleteItem () {
      if (confirm(this.$i18n.t('global.itemDialog.deleteItemTitle').toString())) {
        await this.$axios.$delete(this.ajax.elementUrl + this.urn)
          .then(function (res) {
            this.$emit('delete', {
              urn: this.urn
            })
          }.bind(this))
          .catch(function (err) {
            this.$emit('deleteFailure', {
              urn: this.urn
            })
            this.$log.debug('Could not delete this item: ' + err)
          }.bind(this))
      }
    },
    async fetchElementPath () {
      this.$log.debug('DataElement DetailView: Fetching DataElement path ...')
      await this.$axios.$get(this.ajax.elementUrl + this.urn + '/paths',
        Ajax.header.ignoreLanguage)
        .then(function (res) {
          for (let i = 0; i < res.length; i++) {
            if (res[i][res[i].length - 2].urn === this.parentUrn) {
              this.elementPath = res[i]
              break
            }
          }
        }.bind(this))
        .catch(function (err) {
          this.$log.error('Unable to fetch DataElement paths: ' + err)
        }.bind(this))
    },
    showDetailViewDialog (urn) {
      if (this.elementPath.length > 0 && this.elementPath.slice(-1)[0].urn === urn) {
        return
      }
      this.detailViewDialog.urn = urn
      if (!urn.toUpperCase().includes('NAMESPACE')) {
        for (let i = 0; i < this.elementPath.length; i++) {
          if (this.elementPath[i].urn === urn) {
            this.detailViewDialog.parentUrn = this.elementPath[i - 1].urn
            break
          }
        }
      }
      this.detailViewDialog.show = true
    },
    saveElement (element) {
      this.$emit('saveSuccess', element)
      this.loadDetails()
      this.fetchElementPath()
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
  min-width: 50px;
  width: 40px;
  display: inline-block;
  overflow-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
