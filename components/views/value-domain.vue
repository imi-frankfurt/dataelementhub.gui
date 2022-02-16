<template>
  <div v-if="valueDomain !== undefined">
    <v-list-item-group>
      <v-list-item-content>TYPE: {{ valueDomain.type }}</v-list-item-content>
      <template v-if="valueDomain.type === 'STRING'">
        <v-list-item-content>{{ $t('global.form.label.useRegEx') }}: {{ valueDomain.text.useRegEx }}</v-list-item-content>
        <v-list-item-content>{{ $t('global.regEx') }}: {{ valueDomain.text.regEx }}</v-list-item-content>
        <v-list-item-content>{{ $t('global.form.label.useMaximumLength') }}: {{ valueDomain.text.useMaximumLength }}</v-list-item-content>
        <v-list-item-content>{{ $t('global.maximumLength') }}: {{ valueDomain.text.maximumLength }}</v-list-item-content>
      </template>
      <template v-if="valueDomain.type === 'NUMERIC'">
        <v-list-item-content>{{ $t('global.type') }}: {{ valueDomain.numeric.type }}</v-list-item-content>
        <v-list-item-content>{{ $t('global.form.label.useMinimum') }}: {{ valueDomain.numeric.useMinimum }}</v-list-item-content>
        <v-list-item-content>{{ $t('global.form.label.useMaximum') }}: {{ valueDomain.numeric.useMaximum }}</v-list-item-content>
        <v-list-item-content>{{ $t('global.minimum') }}: {{ valueDomain.numeric.minimum }}</v-list-item-content>
        <v-list-item-content>{{ $t('global.maximum') }}: {{ valueDomain.numeric.maximum }}</v-list-item-content>
        <v-list-item-content>{{ $t('global.form.label.unitOfMeasure') }}: {{ valueDomain.numeric.unitOfMeasure }}</v-list-item-content>
      </template>
      <template v-if="valueDomain.type === 'DATETIME'">
        <v-list-item-content>{{ $t('global.date') }}: {{ valueDomain.datetime.date }}</v-list-item-content>
        <v-list-item-content>{{ $t('global.time') }}: {{ valueDomain.datetime.time }}</v-list-item-content>
        <v-list-item-content>{{ $t('global.hourFormat') }}: {{ valueDomain.datetime.hourFormat }}</v-list-item-content>
      </template>
      <template v-if="valueDomain.type === 'ENUMERATED'">
        <v-card>
          <v-card-title>
            PERMITTEDVALUES
          </v-card-title>
          <v-data-table
            :headers="permittedValuesTable.headers"
            :items="valueDomain.permittedValues"
            :items-per-page="5"
            class="elevation-1"
            @click:row="handlePermittedValueClicked"
          />
        </v-card>
      </template>
    </v-list-item-group>
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
import PermittedValueDetailView from '~/components/views/permitted-value-detail-view'
export default {
  components: {
    PermittedValueDetailView
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
      permittedValuesTable: {
        headers: [
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
    }
  },
  mounted () {
    this.fetchValueDomain()
  },
  methods: {
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
