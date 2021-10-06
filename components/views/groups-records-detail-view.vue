<template>
  <div v-if="element !== undefined">
    <GroupRecordDialog
      :show="dialog"
      :urn="urn"
      :namespace-urn="element.identification.namespaceUrn"
      :element-type="elementType"
      @save="$emit('save', $event); loadDetails()"
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
    <meta-data :data="element.identification" />
    <v-list v-if="element.members.length > 0">
      <v-subheader>{{ $t('global.members') }}</v-subheader>
      <v-list-item>
        <v-list-item-content>
          <members-table :members="element.members" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>
<script>
import Common from '~/assets/js/common'
import Ajax from '~/config/ajax'
import MetaData from '~/components/item/meta-data'
import MembersTable from '~/components/tables/members-table'
import GroupRecordDialog from '~/components/dialogs/group-record-dialog'
export default {
  components: {
    MetaData,
    MembersTable,
    GroupRecordDialog
  },
  props: {
    urn: { required: true, type: String },
    editable: { required: false, default: false, type: Boolean },
    deletable: { required: false, default: false, type: Boolean }
  },
  data () {
    return {
      ajax: {
        elementUrl: process.env.mdrBackendUrl + '/v1/element/'
      },
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
      this.loadDetails()
    }
  },
  mounted () {
    this.loadDetails()
  },
  methods: {
    async loadDetails () {
      await this.$axios.$get(this.ajax.elementUrl + this.urn, Ajax.header.ignoreLanguage)
        .then(function (res) {
          this.element = res
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
    }
  }
}
</script>
