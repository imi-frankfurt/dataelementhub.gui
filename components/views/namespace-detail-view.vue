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
          >
          </v-progress-circular>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <div v-else>
    <namespace-dialog
      :id="namespaceIdentifier"
      :show="dialog"
      @save="$emit('save', $event); fetchNamespaceDetails()"
      @saveFailure="$emit('saveFailure', $event)"
      @dialogClosed="dialog = false"
    />
    <v-card
      color="grey lighten-4"
      flat
    >
      <!-- Namespace Toolbar TODO: Check of this could be outsourced ...-->
      <v-toolbar>
        <v-btn
          width="140"
          class="designationButton"
          color="grey lighten-4"
          rounded
        >
          <div
            style="text-align: center; width: 100%; white-space: normal;"
          >
            {{ namespace.definitions[0].designation }}
          </div>
        </v-btn>
        <v-spacer />
        <v-btn
          v-if="editable"
          icon
          color="primary"
          @click="editNamespace"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          v-if="deletable"
          icon
          @click="deleteNamespace"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
    <meta-data type="NAMESPACE" :data="namespace.identification" />
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
import Ajax from '~/config/ajax'
import DefinitionTable from '~/components/tables/definition-table'
import SlotTable from '~/components/tables/slot-table'
import MetaData from '~/components/item/meta-data'
import NamespaceDialog from '~/components/dialogs/namespace-dialog'
export default {
  components: {
    DefinitionTable,
    SlotTable,
    MetaData,
    NamespaceDialog
  },
  props: {
    urn: { required: true, type: String },
    editable: { required: false, default: false, type: Boolean },
    deletable: { required: false, default: false, type: Boolean },
    showJumpToElementButton: { required: false, default: false, type: Boolean }
  },
  data () {
    return {
      ajax: {
        namespaceUrl: process.env.mdrBackendUrl + '/v1/namespaces/'
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
  watch: {
    urn (n) {
      this.fetchingNamespace = true
      this.namespaceIdentifier = this.urn.split(':')[3]
      this.fetchNamespaceDetails()
    }
  },
  mounted () {
    this.$log.debug('Mounted Namespace view ...')
    this.namespaceIdentifier = this.urn.split(':')[3]
    this.fetchNamespaceDetails()
  },
  methods: {
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
            this.$emit('delete', {
              id: this.id
            })
          }.bind(this))
          .catch(function (err) {
            this.$emit('deleteFailure', {
              id: this.id
            })
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
<style>
.designationButton {
  min-width: 50px;
  width: 40px;
  display: inline-block;
  overflow-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
