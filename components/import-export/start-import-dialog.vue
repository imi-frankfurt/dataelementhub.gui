<script>
export default {
  props: {
    show: { required: true, type: Boolean }
  },
  data: () => ({
    ajax: {
      namespaceUrl: process.env.mdrBackendUrl + '/v1/namespaces/'
    },
    dialog: false,
    namespaceUrn: '',
    importFile: '',
    allAvailableNamespaces: []
  }),
  computed: {
    filteredNamespaces () {
      return this.allAvailableNamespaces.filter(namespace => namespace.identification.status !== 'OUTDATED')
    },
    selectNamespaceRules () {
      return [
        v => v.toUpperCase().includes('NAMESPACE') ||
          this.$t('global.form.validation.messages.namespaceIsRequired')
      ]
    }
  },
  watch: {
    show: {
      handler () {
        this.dialog = this.show
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    this.fetchNamespaces()
  },
  methods: {
    downloadImportFileExample () {
      const FileSaver = require('file-saver')
      FileSaver.saveAs('/dehub-export-file.zip', 'dehub-import.zip')
    },
    async fetchNamespaces () {
      this.$log.debug('Fetching Namespaces')
      await this.$axios.$get(this.ajax.namespaceUrl)
        .then(function (res) {
          this.allAvailableNamespaces = res.ADMIN
          this.allAvailableNamespaces.concat(res.WRITE)
        }.bind(this))
    },
    startImport () {
      this.dialog = false
      this.$emit('startImport', {
        namespaceUrn: this.namespaceUrn,
        importFile: this.importFile
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
          <span class="text-h5">NEW IMPORT</span>
        </v-card-title>
      </v-system-bar>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="namespaceUrn"
                :items="filteredNamespaces"
                :rules="selectNamespaceRules"
                item-value="identification.urn"
                item-text="definitions[0].designation"
                :label="$t('global.select.namespace')"
              />
              <v-text-field
                v-model="namespaceUrn"
                label="Namespace URN*"
                required
              />
            </v-col>
            <v-col
              cols="11"
            >
              <v-file-input
                v-model="importFile"
                show-size
                counter
                label="File input*"
              />
            </v-col>
            <v-col class="pt-7 pr-1" cols="1">
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="downloadImportFileExample()"
                  >
                    <v-icon
                      color="primary"
                    >
                      mdi-download-box-outline
                    </v-icon>
                  </v-btn>
                </template>
                <span>
                  {{ $t('pages.tools.importExport.import.downloadImportFileExample') }}
                </span>
              </v-tooltip>
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
          @click="startImport()"
        >
          START IMPORT
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
