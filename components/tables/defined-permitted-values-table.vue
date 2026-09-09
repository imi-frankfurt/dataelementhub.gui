<template>
  <div>
    <div>
      <v-data-table
        :headers="headers"
        :items="values"
        :items-per-page="5"
        class="elevation-1"
        @click:row="handleDefinedPermittedValueClicked"
      />
    </div>
    <div>
      <v-dialog
        v-model="showDefinedPermittedValueDetailView"
        width="600"
      >
        <v-card>
          <DefinedPermittedValueDetailView
            :urn="selectedDefinedPermittedValueUrn"
            :editable="false"
            :deletable="false"
          />
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import DefinedPermittedValueDetailView from '~/components/views/defined-permitted-value-detail-view.vue'

export default {
  components: {
    DefinedPermittedValueDetailView
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
    },
    metadata: {
      required: false,
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      showDefinedPermittedValueDetailView: false,
      selectedDefinedPermittedValueUrn: ''
    }
  },
  computed: {
    headers () {
      return [
        {
          text: this.$i18n.t('global.definedPermittedValue'),
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
    handleDefinedPermittedValueClicked (value) {
      if (!this.clickable) {
        return
      }
      this.showDefinedPermittedValueDetailView = true
      this.selectedDefinedPermittedValueUrn = value.identification.urn
    }
  }
}
</script>
