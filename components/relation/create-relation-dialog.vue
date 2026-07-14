<script>
export default {
  props: {
    show: { required: true, type: Boolean }
  },

  data: () => ({
    ajax: {
      namespaceUrl: process.env.mdrBackendUrl + '/v1/namespaces/',
      memberUrl: process.env.mdrBackendUrl + '/v1/namespaces/',
      elementUrl: process.env.mdrBackendUrl + '/v1/element/',
      relationPost: process.env.mdrBackendUrl + '/v1/relations/'
    },

    dialog: false,

    namespaceIdentifier: '',
    namespaceId: null,

    allAvailableNamespaces: [],
    dataElements: [],

    leftUrn: '',
    rightUrn: '',
    relationType: 'Undefined',

    leftSource: 1,
    rightSource: 1,

    relationTypes: [
      'Undefined',
      'equal',
      'equivalent',
      'wider',
      'subsumes',
      'narrower',
      'specializes',
      'inexact',
      'supersedes'
    ]
  }),

  computed: {
    filteredNamespaces () {
      return this.allAvailableNamespaces.filter(
        ns => ns.identification?.status !== 'OUTDATED'
      )
    },

    filteredRightElements () {
      return this.dataElements.filter(el => el.urn !== this.leftUrn)
    },

    selectNamespaceRules () {
      return [
        v =>
          (v !== null && v !== undefined && v !== '') ||
          this.$t('global.form.validation.messages.namespaceIsRequired')
      ]
    }
  },

  watch: {
    show: {
      immediate: true,
      handler (val) {
        this.dialog = val
      }
    },

    namespaceIdentifier (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fetchDataElements()
      }
    },

    dialog (val) {
      this.$emit('update:show', val)
    }
  },

  mounted () {
    this.fetchNamespaces()
  },

  methods: {
    async fetchNamespaces () {
      try {
        this.$log.debug('Fetching Namespaces')
        const res = await this.$axios.$get(this.ajax.namespaceUrl)

        // FIXED concat bug
        this.allAvailableNamespaces = res.ADMIN.concat(res.WRITE)
      } catch (err) {
        this.$log.error('Failed to fetch namespaces', err)
      }
    },

    async fetchDataElements () {
      if (!this.namespaceIdentifier) {
        this.dataElements = []
        return
      }

      const url = `${this.ajax.memberUrl}${this.namespaceIdentifier}/members?elementType=DATAELEMENT`

      try {
        const response = await this.$axios.$get(url)

        this.dataElements = (await Promise.all(
          response
            .filter(el => el.elementUrn)
            .map(async (el) => {
              const urn = el.elementUrn

              try {
                const elementDetail = await this.$axios.$get(
                  `${this.ajax.elementUrl}${encodeURIComponent(urn)}`
                )

                if (elementDetail?.identification?.status === 'OUTDATED') {
                  return null
                }

                const designation =
                  elementDetail.definitions?.[0]?.designation || ''

                return { urn, label: `${urn} - ${designation}` }
              } catch (err) {
                this.$log.error(`Failed to fetch element detail for ${urn}`, err)
                return { urn, label: `${urn} - (designation unavailable)` }
              }
            })
        )).filter(Boolean)
      } catch (err) {
        this.$log.error('Failed to fetch data elements', err)
      }
    },

    createRelation () {
      this.dialog = false

      this.$emit('createRelation', {
        leftUrn: this.leftUrn,
        rightUrn: this.rightUrn,
        relation: this.relationType,
        leftSource: this.leftSource,
        rightSource: this.rightSource
      })
    }
  }
}
</script>

<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="600px"
  >
    <v-card>
      <v-system-bar
        color="header"
        dark
        height="50px"
      >
        <v-card-title class="white--text">
          <span class="text-h5">NEW RELATION</span>
        </v-card-title>
      </v-system-bar>

      <v-card-text>
        <v-container>
          <v-row>
            <!-- Namespace -->
            <v-col cols="12">
              <v-select
                v-model="namespaceIdentifier"
                :items="filteredNamespaces"
                :rules="selectNamespaceRules"
                :item-value="item => item.identification.identifier"
                :item-text="item => item.definitions?.[0]?.designation || ''"
                :label="$t('global.select.namespace')"
              />
            </v-col>
            <!-- Left -->
            <v-col cols="12">
              <v-select
                v-model="leftUrn"
                :items="dataElements"
                item-value="urn"
                item-text="label"
                label="Left DataElement URN"
                :disabled="dataElements.length === 0"
              />
            </v-col>
            <!-- Right -->
            <v-col cols="12">
              <v-select
                v-model="rightUrn"
                :items="filteredRightElements"
                item-value="urn"
                item-text="label"
                label="Right DataElement URN"
                :disabled="dataElements.length === 0"
              />
            </v-col>
            <!-- Relation -->
            <v-col cols="12">
              <v-select
                v-model="relationType"
                :items="relationTypes"
                label="Relation Type"
              />
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="dialog = false"
        >
          Close
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="createRelation"
        >
          CREATE RELATION
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
