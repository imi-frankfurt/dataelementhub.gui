<template>
  <div>
    <div>
      <v-data-table
        :headers="headers"
        :items="values"
        :items-per-page="5"
        class="elevation-1"
        @click:row="handlePermittedValueClicked"
      />
    </div>
    <div>
      <v-dialog
        v-model="showPermittedValueDetailView"
        width="600"
      >
        <v-card>
          <PermittedValueDetailView
            :urn="selectedPermittedValueUrn"
            :editable="false"
            :deletable="false"
          />
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import PermittedValueDetailView from '~/components/views/permitted-value-detail-view'
export default {
  components: {
    PermittedValueDetailView
  },
  props: {
    values: {
      required: true,
      type: Array
    },
    clickable: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      showPermittedValueDetailView: false,
      selectedPermittedValueUrn: '',
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
  },
  methods: {
    handlePermittedValueClicked (value) {
      this.showPermittedValueDetailView = true
      this.selectedPermittedValueUrn = value.identification.urn
    }
  }
}
</script>
