<template>
  <div v-if="valueDomain !== undefined">
    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col
          v-for="n in valueDomainMetaData.keys.length"
          :key="n"
          cols="12"
          sm="4"
        >
          <v-card
            class="pa-2"
            outlined
            tile
          >
            {{ valueDomainMetaData.keys[n-1] }}: {{ valueDomainMetaData.values[n-1] }}
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-data-table
      v-if="valueDomain.type === 'ENUMERATED'"
      :headers="permittedValuesTable.headers"
      :items="valueDomain.permittedValues"
      :items-per-page="5"
      class="elevation-1"
      @click:row="handlePermittedValueClicked"
    />
    <concept-association-table v-if="valueDomain.conceptAssociations.length > 0" :associations="valueDomain.conceptAssociations" />
    <v-dialog
      v-model="showPermittedValueDetailView"
      width="600"
    >
      <v-card>
        <PermittedValueDetailView
          :urn="selectedPermittedValueUrn"
          :editable="true"
          :deletable="true"
          @save="updateTree($event); snackbar.saveSuccess = true"
          @saveFailure="snackbar.saveFailure = true"
          @delete="updateTree(selectedElement) ; snackbar.deleteSuccess = true"
          @deleteFailure="snackbar.deleteFailure = true"
        />
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Ajax from '~/config/ajax'
import ConceptAssociationTable from '~/components/tables/concept-association-table'
import PermittedValueDetailView from '~/components/views/permitted-value-detail-view'
export default {
  components: {
    PermittedValueDetailView,
    ConceptAssociationTable
  },
  props: {
    urn: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      ajax: {
        dataElementUrl: process.env.mdrBackendUrl + '/v1/element/'
      },
      valueDomain: undefined,
      showPermittedValueDetailView: false,
      selectedPermittedValueUrn: null,
      valueDomainMetaData: {
        keys: [],
        values: []
      },
      permittedValuesTable: {
        headers: [
          {
            text: this.$i18n.t('global.permittedValue'),
            align: 'start',
            sortable: false,
            value: 'value'
          },
          {
            text: this.$i18n.t('global.definition'),
            align: 'start',
            sortable: false,
            value: 'definitions[0].definition'
          },
          {
            text: this.$i18n.t('global.designation'),
            sortable: false,
            value: 'definitions[0].designation'
          },
          {
            text: this.$i18n.t('global.language'),
            sortable: false,
            value: 'definitions[0].language'
          },
          {
            text: this.$i18n.t('global.urn'),
            sortable: false,
            value: 'identification.urn'
          }
        ]
      }
    }
  },
  watch: {
    urn (n) {
      this.fetchValueDomain()
    },
    valueDomain () {
      this.defineValueDomainMetaData()
    }
  },
  mounted () {
    this.fetchValueDomain()
  },
  methods: {
    defineValueDomainMetaData () {
      this.valueDomainMetaData.keys = []
      this.valueDomainMetaData.values = []
      this.valueDomainMetaData.keys.push('Type')
      this.valueDomainMetaData.values.push(this.valueDomain.type)
      switch (this.valueDomain.type) {
        case 'STRING':
          this.valueDomainMetaData.keys.push(this.$i18n.t('global.form.label.useRegEx'), this.$i18n.t('global.regEx'), this.$i18n.t('global.form.label.useMaximumLength'), this.$i18n.t('global.maximumLength'))
          this.valueDomainMetaData.values.push(this.valueDomain.text.useRegEx, this.valueDomain.text.regEx, this.valueDomain.text.useMaximumLength, this.valueDomain.text.maximumLength)
          break
        case 'NUMERIC':
          this.valueDomainMetaData.values[0] = this.valueDomain.numeric.type
          this.valueDomainMetaData.keys.push(this.$i18n.t('global.form.label.useMinimum'), this.$i18n.t('global.form.label.useMaximum'), this.$i18n.t('global.minimum'), this.$i18n.t('global.maximum'), this.$i18n.t('global.form.label.unitOfMeasure'))
          this.valueDomainMetaData.values.push(this.valueDomain.numeric.useMinimum, this.valueDomain.numeric.useMaximum, this.valueDomain.numeric.minimum, this.valueDomain.numeric.maximum, this.valueDomain.numeric.unitOfMeasure)
          break
        case 'ENUMERATED':
          break
        case 'TIME':
          this.valueDomainMetaData.keys.push(this.$i18n.t('global.time'), this.$i18n.t('global.hourFormat'))
          this.valueDomainMetaData.values.push(this.valueDomain.datetime.time, this.valueDomain.datetime.hourFormat)
          break
        case 'DATE':
          this.valueDomainMetaData.keys.push(this.$i18n.t('global.date'))
          this.valueDomainMetaData.values.push(this.valueDomain.datetime.date)
          break
        case 'DATETIME':
          this.valueDomainMetaData.keys.push(this.$i18n.t('global.time'), this.$i18n.t('global.hourFormat'), this.$i18n.t('global.date'))
          this.valueDomainMetaData.values.push(this.valueDomain.datetime.time, this.valueDomain.datetime.hourFormat, this.valueDomain.datetime.date)
          break
        default:
          break
      }
    },
    async fetchValueDomain () {
      this.$log.debug('Fetching Value Domain of URN: ' + this.urn)
      await this.$axios.$get(this.ajax.dataElementUrl + this.urn + '/valuedomain', Ajax.header.preferredLanguage)
        .then(function (res) {
          this.valueDomain = res
        }.bind(this))
        .catch(function (err) {
          this.$log.error('Unable to fetch ValueDomain:' + err)
        }.bind(this))
    },
    handlePermittedValueClicked (value) {
      this.showPermittedValueDetailView = true
      this.selectedPermittedValueUrn = value.identification.urn
    }
  }
}
</script>
