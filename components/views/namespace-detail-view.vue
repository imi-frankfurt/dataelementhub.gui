<template>
  <div v-if="fetchingNamespace">
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
    <namespace-dialog
      v-if="dialog"
      :id="namespaceIdentifier"
      :show="dialog"
      @dialogClosed="dialog = false"
    />
    <v-card
      v-if="!hideToolbar"
      color="grey lighten-4 ma-0 pa-0"
      flat
    >
      <detail-view-toolbar
        :element-path="[namespace.definitions[0]]"
        :element-urn="urn"
        :activate-navigation="false"
        :element-is-deletable="deletable"
        :element-is-editable="editable"
        @showDetailViewDialog="showDetailViewDialog($event)"
        @editElement="editNamespace"
        @deleteElement="deleteNamespace"
      />
    </v-card>
    <v-card outlined color="transparent" class="ma-0 pa-0">
      <meta-data
        :type="'NAMESPACE'"
        :data="namespace.identification"
      />
    </v-card>
    <v-list>
      <v-subheader>{{ $t('global.definitions') }}</v-subheader>
      <v-list-item>
        <v-list-item-content>
          <definition-table :definitions="namespace.definitions" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list>
      <template v-if="namespace.slots.length > 0">
        <v-subheader>{{ $t('global.slots') }}</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <slot-table :slots="namespace.slots" />
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
    <v-btn
      v-if="showJumpToElementButton"
      class="d-block mr-0 ml-auto"
      color="primary"
      rounded
      @click="$store.commit('changeActiveTreeViewNode', { ...getNodeFromElement } )"
    >
      {{ $t('global.button.showInTreeView') }}
      <v-icon dark>
        mdi-arrow-right-circle
      </v-icon>
    </v-btn>
  </div>
</template>
<script>
import Ajax from '~/config/ajax'
import DefinitionTable from '~/components/tables/definition-table'
import SlotTable from '~/components/tables/slot-table'
import MetaData from '~/components/item/meta-data'
import NamespaceDialog from '~/components/dialogs/namespace-dialog'
import DetailViewToolbar from '~/components/common/detail-view-toolbar'
export default {
  components: {
    DetailViewToolbar,
    DefinitionTable,
    SlotTable,
    MetaData,
    NamespaceDialog
  },
  props: {
    urn: { required: true, type: String },
    editable: { required: false, default: false, type: Boolean },
    deletable: { required: false, default: false, type: Boolean },
    showJumpToElementButton: { required: false, default: false, type: Boolean },
    hideToolbar: { required: false, default: false, type: Boolean }
  },
  data () {
    return {
      ajax: {
        namespaceUrl: process.env.backendUrl + '/v1/namespaces/'
      },
      detailViewDialog: {
        urn: '',
        show: false,
        namespaceIdentifier: -1
      },
      fetchingNamespace: true,
      namespaceIdentifier: -1,
      namespace: undefined,
      dialog: false
    }
  },
  computed: {
    getNodeFromElement () {
      return {
        id: this.generateItemId(),
        parentUrn: '',
        namespaceUrn: this.namespace.identification.namespaceUrn,
        urn: this.namespace.identification.urn,
        editable: this.editable,
        isPreferredLanguage: Ajax.preferredLanguage.includes(this.namespace.definitions[0].language),
        designation: this.namespace.definitions[0].designation,
        type: this.namespace.identification.elementType,
        elementStatus: this.namespace.identification.status,
        expanded: false,
        children: []
      }
    }
  },
  watch: {
    urn (n) {
      this.fetchingNamespace = true
      this.namespaceIdentifier = this.urn.split(':')[3]
      this.fetchNamespaceDetails()
    }
  },
  mounted () {
    this.$log.debug('Mounted Namespace view ...')
    this.namespaceIdentifier = parseInt(this.urn.split(':')[3])
    this.fetchNamespaceDetails()
  },
  methods: {
    generateItemId () {
      this.$store.commit('generateItemId')
      return this.$store.getters.getItemId
    },
    async fetchNamespaceDetails () {
      await this.$axios.$get(this.ajax.namespaceUrl + this.namespaceIdentifier,
        Ajax.header.ignoreLanguage)
        .then(function (res) {
          this.$log.debug('Fetching Namespace details ...')
          this.fetchingNamespace = false
          this.namespace = Object.assign({}, res)
        }.bind(this))
        .catch(function (err) {
          this.$log.error('Unable to fetch Namespace details: ' + err)
        }.bind(this))
    },
    editNamespace () {
      this.dialog = true
    },
    async deleteNamespace () {
      if (confirm(this.$i18n.t('global.itemDialog.deleteItemTitle').toString())) {
        await this.$axios.$delete(this.ajax.namespaceUrl + this.namespaceIdentifier)
          .then(function (res) {
            if (res !== undefined) {
              this.$root.$emit('showDeleteSuccessSnackbar')
              this.$root.$emit('updateTreeView')
            }
          }.bind(this))
          .catch(function (err) {
            this.$root.$emit('handleDeleteFailure', err.response)
            this.$log.debug('Could not delete this item: ' + err)
          }.bind(this))
      }
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
    }
  }
}
</script>
<style scoped>
.designationButton {
  min-width: 50px;
  width: 40px;
  display: inline-block;
  overflow-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detailViewCard {
  margin-bottom: 10px;
}
</style>
