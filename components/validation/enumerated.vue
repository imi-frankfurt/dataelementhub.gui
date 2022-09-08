<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              :label="$t('pages.tools.search.title')"
              single-line
              hide-details
            />
          </v-card-title>
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="convertedValueDomains"
            :single-select="singleSelect"
            :search="search"
            item-key="urn"
            show-select
            class="elevation-1"
            @click:row="handleValueDomainClicked"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  components: { },
  props: {
    availableValueDomains: { required: true, type: Array },
    namespaceId: { required: true, type: String }
  },
  data () {
    return {
      selected: [],
      search: '',
      singleSelect: true,
      showValueDomainDetailView: false,
      clickedValueDomainUrn: '',
      convertedValueDomains: [],
      selectedValueDomain: {},
      headers: [
        {
          text: this.$i18n.t('global.designation'),
          align: 'center',
          sortable: false,
          filterable: true,
          value: 'designation'
        },
        {
          text: this.$i18n.t('global.urn'),
          align: 'center',
          sortable: false,
          filterable: true,
          value: 'urn'
        }
      ]
    }
  },
  computed: {
    valueRules () {
      return [
        v => !!v || this.$t('global.form.validation.messages.valueIsRequired')
      ]
    }
  },
  watch: {
    availableValueDomains: {
      handler () {
        this.convertedValueDomains = this.availableValueDomains.map((obj) => {
          const newObj = {}
          const maxLength = 45
          const designation = obj.definitions[0].designation
          newObj.designation = designation.length > maxLength
            ? designation.substring(0, maxLength - 3) + '...'
            : designation
          newObj.urn = 'urn:' + this.namespaceId + ':' + 'valuedomain' + ':' + obj.identifier + ':' + obj.revision
          return newObj
        })
      },
      immediate: true
    },
    selected: {
      handler () {
        if (this.selected.length > 0) {
          this.$emit('chooseValueDomain', this.selected[0].urn)
        } else {
          this.$emit('deleteValueDomainUrn')
        }
      },
      immediate: true
    }
  },
  methods: {
    handleValueDomainClicked (value) {
      this.$emit('showValueDomainDialog', value.urn)
    }
  }
}
</script>
