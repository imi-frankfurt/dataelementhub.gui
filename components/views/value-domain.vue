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
            v-if="valueDomainMetaData.values[n-1] !== false &&
              valueDomainMetaData.values[n-1] !== true &&
              valueDomainMetaData.values[n-1] !== null &&
              valueDomainMetaData.values[n-1] !== ''"
            class="pa-2"
            outlined
            tile
          >
            {{ valueDomainMetaData.keys[n-1] }}: {{ valueDomainMetaData.values[n-1] }}
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <PermittedValuesTable
      v-if="valueDomain.type === 'ENUMERATED'"
      :values="valueDomain.permittedValues"
      :clickable="true"
    />
    <concept-association-table
      v-if="valueDomain.conceptAssociations.length > 0"
      :associations="valueDomain.conceptAssociations"
    />
  </div>
</template>
<script>
import Ajax from '~/config/ajax'
import ConceptAssociationTable from '~/components/tables/concept-association-table'
import PermittedValuesTable from '~/components/tables/permitted-values-table'
export default {
  components: {
    ConceptAssociationTable,
    PermittedValuesTable
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
      selectedPermittedValueUrn: null,
      valueDomainMetaData: {
        keys: [],
        values: []
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
      let range = ''
      switch (this.valueDomain.type) {
        case 'STRING':
          this.valueDomainMetaData.keys.push(this.$i18n.t('global.regEx'),
            this.$i18n.t('global.maximumLength'))
          this.valueDomainMetaData.values.push(this.valueDomain.text.regEx,
            this.valueDomain.text.maximumLength)
          break
        case 'NUMERIC':
          this.valueDomainMetaData.values[0] = this.valueDomain.numeric.type
          if (this.valueDomain.numeric.minimum || this.valueDomain.numeric.maximum) {
            range = 'x'
          }
          if (this.valueDomain.numeric.minimum) {
            range = this.valueDomain.numeric.minimum + ' <= ' + range
          }
          if (this.valueDomain.numeric.maximum) {
            range = range + ' <= ' + this.valueDomain.numeric.maximum
          }
          this.valueDomainMetaData.keys.push(this.$i18n.t('global.range'),
            this.$i18n.t('global.form.label.unitOfMeasure'))
          this.valueDomainMetaData.values.push(range, this.valueDomain.numeric.unitOfMeasure)
          break
        case 'ENUMERATED':
          break
        case 'TIME':
          this.valueDomainMetaData.keys.push(this.$i18n.t('global.time'),
            this.$i18n.t('global.hourFormat'))
          this.valueDomainMetaData.values.push(this.valueDomain.datetime.time,
            this.valueDomain.datetime.hourFormat)
          break
        case 'DATE':
          this.valueDomainMetaData.keys.push(this.$i18n.t('global.date'))
          this.valueDomainMetaData.values.push(this.valueDomain.datetime.date)
          break
        case 'DATETIME':
          this.valueDomainMetaData.keys.push(this.$i18n.t('global.time'),
            this.$i18n.t('global.hourFormat'), this.$i18n.t('global.date'))
          this.valueDomainMetaData.values.push(this.valueDomain.datetime.time,
            this.valueDomain.datetime.hourFormat, this.valueDomain.datetime.date)
          break
        default:
          break
      }
    },
    async fetchValueDomain () {
      this.$log.debug('Fetching Value Domain of URN: ' + this.urn)
      await this.$axios.$get(this.ajax.dataElementUrl + this.urn + '/valuedomain',
        Ajax.header.preferredLanguage)
        .then(function (res) {
          this.valueDomain = res
        }.bind(this))
        .catch(function (err) {
          this.$log.error('Unable to fetch ValueDomain:' + err)
        }.bind(this))
    }
  }
}
</script>
