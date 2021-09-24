<template>
  <div v-if="namespace !== undefined">
    <namespace-dialog
      :id="id"
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
        <v-toolbar-title>{{ $t('global.properties') }} {{ $t('global.of') }} <b>{{ urn }}</b></v-toolbar-title>
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
    id: { required: true, type: Number },
    urn: { required: true, type: String },
    editable: { required: false, default: false, type: Boolean },
    deletable: { required: false, default: false, type: Boolean }
  },
  data () {
    return {
      ajax: {
        namespaceUrl: process.env.mdrBackendUrl + '/v1/namespaces/'
      },
      namespace: undefined,
      dialog: false
    }
  },
  watch: {
    id (n) {
      this.fetchNamespaceDetails()
    }
  },
  mounted () {
    this.$log.debug('Mounted Namespace view ...')
    this.fetchNamespaceDetails()
  },
  methods: {
    async fetchNamespaceDetails () {
      await this.$axios.$get(this.ajax.namespaceUrl + this.id, Ajax.header.ignoreLanguage)
        .then(function (res) {
          this.$log.debug('Fetching Namespace details ...')
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
        await this.$axios.$delete(this.ajax.namespaceUrl + this.id)
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
    }
  }
}
</script>
