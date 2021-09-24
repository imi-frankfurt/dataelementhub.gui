<template>
  <div>
    <div v-if="dataElement !== undefined">
      <data-element-dialog
        :urn="urn"
        :show="dialog"
        @save="$emit('save', $event); fetchDataElementDetails()"
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
      <v-list>
        <v-subheader>{{ $t('global.definitions') }}</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <definition-table :definitions="dataElement.definitions" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-if="dataElement.slots.length > 0">
        <v-subheader>{{ $t('global.slots') }}</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <slot-table :slots="dataElement.slots" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-subheader>{{ $t('global.valueDomain') }}</v-subheader>
      <v-list-item>
        <v-list-item-content>
          <value-domain :urn="dataElement.identification.urn" />
        </v-list-item-content>
      </v-list-item>
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
      <v-list v-if="dataElement.conceptAssociations.length > 0">
        <v-subheader>{{ $t('global.conceptAssociations') }}</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <concept-association-table :associations="dataElement.conceptAssociations" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
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
export default {
  components: {
    DefinitionTable,
    SlotTable,
    MetaData,
    DataElementDialog,
    RelationTable,
    ConceptAssociationTable,
    ValueDomain
  },
  props: {
    urn: { required: true, type: String },
    editable: { required: false, default: false, type: Boolean },
    deletable: { required: false, default: false, type: Boolean },
    relationDetailViewAvailable: { required: false, default: false, type: Boolean }
  },
  data () {
    return {
      ajax: {
        dataElementUrl: process.env.mdrBackendUrl + '/v1/element/'
      },
      dataElement: undefined,
      dialog: false
    }
  },
  watch: {
    urn (n) {
      this.fetchDataElementDetails()
    }
  },
  mounted () {
    this.$log.debug('Mounted DataElement view ...')
    this.fetchDataElementDetails()
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
