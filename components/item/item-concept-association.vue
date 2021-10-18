<template>
  <div>
    <v-row>
      <v-col cols="4">
        <v-text-field
          v-model="currentConcept.system"
          :counter="255"
          :rules="rules"
          :label="label[0]"
          required
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="currentConcept.version"
          :counter="255"
          :rules="rules"
          :label="label[1]"
          required
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="currentConcept.term"
          :counter="255"
          :rules="rules"
          :label="label[2]"
          required
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-text-field
          v-model="currentConcept.text"
          :counter="65000"
          :rules="rules"
          :label="label[3]"
          required
        />
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="currentConcept.linktype"
          :items="linkTypes"
          :label="label[4]"
          required
        />
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  props: {
    conceptAssociation: { required: false, default: () => this.defaultConcept, type: Object }
  },
  data () {
    return {
      ajax: {
        sourceIdUrl: process.env.mdrBackendUrl + '/v1/source/'
      },
      sourceIds: [],
      currentConcept: this.conceptAssociation,
      defaultConcept: {
        system: '',
        version: '',
        term: '',
        text: '',
        linktype: 'undefined'
      },
      linkTypes: [
        'undefined',
        'equal',
        'equivalent',
        'wider',
        'subsumes',
        'narrower',
        'specializes',
        'inexact'
      ]
    }
  },
  computed: {
    rules () {
      return [
        v => !!v || this.$t('global.form.validation.messages.requiredField')
      ]
    },
    label () {
      return [
        this.$t('global.system'),
        this.$t('global.version'),
        this.$t('global.term'),
        this.$t('global.text'),
        this.$t('global.linkType')
      ]
    }
  },
  watch: {
    currentConcept () {
      this.$emit('conceptChanged', this.currentConcept)
    }
  },
  mounted () {
    this.getSourceId()
  },
  methods: {
    async getSourceId () {
      await this.$axios.$get(this.ajax.sourceIdUrl)
        .then(function (res) {
          this.sourceIds = res
          this.currentConcept.sourceId = this.sourceIds.find(elem => elem.type ===
          'DATAELEMENTHUB').id
        }.bind(this))
    }
  }
}
</script>
