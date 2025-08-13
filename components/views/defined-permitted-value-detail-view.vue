<template>
  <div class="definedPermittedValueDetailView">
    <div v-if="definedPermittedValue !== undefined">
      <v-card
        color="grey lighten-4"
        flat
      >
        <v-toolbar>
          <v-btn
            class="designationButton"
            color="grey lighten-4"
            rounded
            v-if="definedPermittedValue.definitions && definedPermittedValue.definitions.length > 0"
          >
            {{ definedPermittedValue.definitions[0].designation }}
          </v-btn>
          <v-spacer />
          <v-btn
            v-if="editable"
            icon
            color="primary"
            @click="editDefinedPermittedValue"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="deletable"
            icon
            @click="deleteDefinedPermittedValue"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card>
      <meta-data :data="definedPermittedValue.identification" />
      <v-list>
        <v-subheader v-if="definedPermittedValue.value">
          {{ $t('global.value') }}: {{ definedPermittedValue.value }}
        </v-subheader>
        <v-subheader> {{ $t('global.definitions') }} </v-subheader>
        <v-list-item>
          <v-list-item-content>
            <definition-table :definitions="definedPermittedValue.definitions" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-if="definedPermittedValue.slots.length > 0">
        <v-subheader>{{ $t('global.slots') }}</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <slot-table :slots="definedPermittedValue.slots" />
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
export default {
  components: {
    DefinitionTable,
    SlotTable,
    MetaData
  },
  props: {
    urn: { required: true, type: String },
    editable: { required: false, default: false, type: Boolean },
    deletable: { required: false, default: false, type: Boolean }
  },
  data () {
    return {
      ajax: {
        definedPermittedValueUrl: process.env.mdrBackendUrl + '/v1/element/'
      },
      definedPermittedValue: undefined,
      dialog: false
    }
  },
  watch: {
    urn (n) {
      this.fetchDefinedPermittedValueDetails()
    }
  },
  mounted () {
    this.$log.debug('Mounted permitted value detail view ...')
    this.fetchDefinedPermittedValueDetails()
  },
  methods: {
    async fetchDefinedPermittedValueDetails () {
      this.$log.debug('Defined PermittedValue DetailView: Fetching Defined PermittedValue details ...')
      await this.$axios.$get(this.ajax.definedPermittedValueUrl + this.urn, Ajax.header.preferredLanguage)
        .then(function (res) {
          this.definedPermittedValue = Object.assign({}, res)
        }.bind(this))
        .catch(function (err) {
          this.$log.error('Unable to fetch defined PermittedValue details: ' + err)
        }.bind(this))
    },
    editDefinedPermittedValue () {
      this.dialog = true
    },
    async deleteDefinedPermittedValue () {
      if (confirm(this.$i18n.t('global.itemDialog.deleteItemTitle').toString())) {
        await this.$axios.$delete(this.ajax.definedPermittedValueUrl + this.urn)
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
    }
  }
}
</script>
<style scoped>

.definedPermittedValueDetailView {
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
