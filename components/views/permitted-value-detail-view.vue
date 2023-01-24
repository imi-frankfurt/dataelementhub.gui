<template>
  <div class="permittedValueDetailView">
    <div v-if="permittedValue !== undefined">
      <v-card
        color="grey lighten-4"
        flat
      >
        <v-toolbar>
          <v-btn
            class="designationButton"
            color="grey lighten-4"
            rounded
          >
            {{ permittedValue.definitions[0].designation }}
          </v-btn>
          <v-spacer />
          <v-btn
            v-if="editable"
            icon
            color="primary"
            @click="editPermittedValue"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="deletable"
            icon
            @click="deletePermittedValue"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card>
      <meta-data :data="permittedValue.identification" />
      <v-list>
        <v-subheader v-if="permittedValue.value">{{ $t('global.value') }}: {{ permittedValue.value }}</v-subheader>
        <v-subheader> {{ $t('global.definitions') }} </v-subheader>
        <v-list-item>
          <v-list-item-content>
            <definition-table :definitions="permittedValue.definitions" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-if="permittedValue.slots.length > 0">
        <v-subheader>{{ $t('global.slots') }}</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <slot-table :slots="permittedValue.slots" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-if="permittedValue.conceptAssociations.length > 0">
        <v-subheader>{{ $t('global.conceptAssociations') }}</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <concept-association-table :associations="permittedValue.conceptAssociations" />
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
import ConceptAssociationTable from '~/components/tables/concept-association-table'
export default {
  components: {
    DefinitionTable,
    SlotTable,
    MetaData,
    ConceptAssociationTable
  },
  props: {
    urn: { required: true, type: String },
    editable: { required: false, default: false, type: Boolean },
    deletable: { required: false, default: false, type: Boolean }
  },
  data () {
    return {
      ajax: {
        permittedValueUrl: process.env.mdrBackendUrl + '/v1/element/'
      },
      permittedValue: undefined,
      dialog: false
    }
  },
  watch: {
    urn (n) {
      this.fetchPermittedValueDetails()
    }
  },
  mounted () {
    this.$log.debug('Mounted permitted value detail view ...')
    this.fetchPermittedValueDetails()
  },
  methods: {
    async fetchPermittedValueDetails () {
      this.$log.debug('PermittedValue DetailView: Fetching PermittedValue details ...')
      await this.$axios.$get(this.ajax.permittedValueUrl + this.urn, Ajax.header.preferredLanguage)
        .then(function (res) {
          this.permittedValue = Object.assign({}, res)
        }.bind(this))
        .catch(function (err) {
          this.$log.error('Unable to fetch PermittedValue details: ' + err)
        }.bind(this))
    },
    editPermittedValue () {
      this.dialog = true
    },
    async deletePermittedValue () {
      if (confirm(this.$i18n.t('global.itemDialog.deleteItemTitle').toString())) {
        await this.$axios.$delete(this.ajax.permittedValueUrl + this.urn)
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
<style scoped>

.permittedValueDetailView {
  padding: 1rem;
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
