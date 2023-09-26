<script>
import StartExportDialog from '~/components/import-export/start-export-dialog'
import ExportedUrnsList from '~/components/import-export/exported-urns-list'
export default {
  components: { ExportedUrnsList, StartExportDialog },
  data: () => ({
    ajax: {
      exportUrl: process.env.mdrBackendUrl + '/v1/export/'
    },
    allExports: [],
    exportedUrns: [],
    showExportedUrnsDialog: false,
    openStartNewExportDialog: false,
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: 'Export ID',
        align: 'center',
        sortable: true,
        value: 'id'
      },
      {
        text: 'Status',
        align: 'center',
        sortable: true,
        value: 'status'
      },
      {
        text: 'Timestamp',
        align: 'center',
        sortable: true,
        value: 'timestamp'
      },
      { text: '', align: 'center', value: 'exported-urns', sortable: false },
      { text: '', align: 'center', value: 'download', sortable: false }
    ]
  }),

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },
  mounted () {
    this.fetchAllExports()
  },
  methods: {
    fetchExportedUrns (exportId) {
      const exportUrl = this.ajax.exportUrl + exportId + '?onlyUrns=true'
      this.$axios.get(exportUrl).then((response) => {
        this.exportedUrns = response.data.split('\r\n').filter(urn => urn !== '')
      })
    },
    async startDownload (exportId) {
      const fileUrl = this.ajax.exportUrl + exportId
      await this.$axios.get(fileUrl, { responseType: 'blob' }).then((response) => {
        const fileNameHeader = 'Content-Disposition'
        const suggestedFileName = response.headers[fileNameHeader]
        const effectiveFileName = (suggestedFileName === undefined
          ? 'dehub-export-file.zip'
          : suggestedFileName)
        const FileSaver = require('file-saver')
        FileSaver.saveAs(response.data, effectiveFileName)
      })
    },
    async fetchAllExports () {
      await this.$axios.$get(this.ajax.exportUrl)
        .then(function (res) {
          this.allExports = res
        }.bind(this))
    },
    changeTimestampFormat (timestamp) {
      const splittedTimestamp = timestamp.replace('.', 'T').split('T')
      return splittedTimestamp[0] + ' ' + splittedTimestamp[1]
    },

    deleteItemConfirm () {
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
      })
    },
    getColor (status) {
      if (status === 'DONE') { return 'green' } else if (status === 'PROCESSING') { return 'orange' } else { return 'grey' }
    }
  }
}
</script>

<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="allExports"
          sort-by="id"
          sort-desc
          class="elevation-1 py-3"
          height="400px"
          hide-default-footer
          fixed-header
        >
          <template #top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>ALL EXPORTS</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              />
              <v-btn
                icon
                @click="fetchAllExports()"
              >
                <v-icon>
                  mdi-refresh
                </v-icon>
              </v-btn>
              <v-spacer />
              <v-btn
                color="primary"
                dark
                class="mb-2"
                @click="openStartNewExportDialog = true"
              >
                <v-icon class="pr-2">
                  mdi-plus
                </v-icon>
                {{ $t('pages.tools.importExport.export.newExport') }}
              </v-btn>
            </v-toolbar>
          </template>
          <template #[`item.timestamp`]="{ item }">
            {{ changeTimestampFormat(item.timestamp) }}
          </template>
          <template #[`item.status`]="{ item }">
            <v-chip
              small
              :color="getColor(item.status)"
              dark
            >
              <v-span>
                {{ item.status !== 'PROCESSING' ? item.status.replace('DONE', 'COMPLETED') : item.status + ' ' + item.progress.toFixed(2) * 100 + ' %' }}
              </v-span>
            </v-chip>
          </template>
          <template #[`item.download`]="{ item }">
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  :disabled="item.status !== 'DONE'"
                  v-on="on"
                  @click="startDownload(item.id)"
                >
                  <v-icon
                    color="primary"
                  >
                    mdi-download-box-outline
                  </v-icon>
                </v-btn>
              </template>
              <span>
                {{ $t('pages.tools.importExport.export.downloadExportFile') }}
              </span>
            </v-tooltip>
          </template>
          <template #[`item.exported-urns`]="{ item }">
            <v-btn
              text
              small
              color="blue"
              :disabled="item.status !== 'DONE'"
              @click="fetchExportedUrns(item.id); showExportedUrnsDialog = true"
            >
              {{ $t('pages.tools.importExport.export.exportedElementsUrns') }}
              <v-icon class="pl-1" small>
                mdi-eye-outline
              </v-icon>
            </v-btn>
          </template>
          <template #no-data>
            {{ $t('pages.tools.importExport.export.noExportsAvailable') }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <StartExportDialog
      v-if="openStartNewExportDialog"
      @dialogClosed="openStartNewExportDialog = false; fetchAllExports()"
    />
    <v-dialog v-model="showExportedUrnsDialog" max-width="400px">
      <exportedUrnsList :exported-urns="exportedUrns" />
    </v-dialog>
  </v-container>
</template>
