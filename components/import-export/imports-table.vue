<script>

import StartImportDialog from '~/components/import-export/start-import-dialog'
import ImportMembersDialog from '~/components/import-export/import-members-dialog'
import NamespaceDetailView from '~/components/views/namespace-detail-view'
export default {
  components: { NamespaceDetailView, ImportMembersDialog, StartImportDialog },
  data: () => ({
    snackbarInfo: {
      show: false,
      text: '',
      color: ''
    },
    ajax: {
      importUrl: process.env.mdrBackendUrl + '/v1/import/'
    },
    importMembersDialog: {
      show: false,
      importId: -1,
      namespaceUrn: ''
    },
    namespaceDetailViewDialog: {
      show: false,
      urn: ''
    },
    showStartImportDialog: false,
    allImports: [],
    dialog: false,
    dialogDelete: false,
    deleteImport: '',
    headers: [
      {
        text: 'Import ID',
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
        text: 'Namespace Urn',
        align: 'center',
        sortable: true,
        value: 'namespaceUrn'
      },
      {
        text: 'Timestamp',
        align: 'center',
        sortable: true,
        value: 'timestamp'
      },
      {
        text: 'Converted Elements',
        align: 'center',
        sortable: true,
        value: 'converted'
      },
      { text: '', align: 'center', value: 'delete', sortable: false },
      { text: '', align: 'center', value: 'manageMembers', sortable: false }
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
    this.fetchAllImports()
  },

  methods: {
    showNamespaceDetailViewDialog (urn) {
      this.namespaceDetailViewDialog.show = true
      this.namespaceDetailViewDialog.urn = urn
    },
    changeTimestampFormat (timestamp) {
      const splittedTimestamp = timestamp.replace('.', 'T').split('T')
      return splittedTimestamp[0] + ' ' + splittedTimestamp[1]
    },
    showImportMembersDialog (importItem) {
      this.importMembersDialog.show = true
      this.importMembersDialog.importId = importItem.id
      this.importMembersDialog.namespaceUrn = importItem.namespaceUrn
    },
    async startImport (startImportObject) {
      this.showStartImportDialog = false
      const namespaceUrn = startImportObject.namespaceUrn
      const importFile = startImportObject.importFile
      const formdata = new FormData()
      formdata.append('files', importFile)
      await this.$axios.$post(this.ajax.importUrl, formdata, {
        params: {
          namespaceUrn
        },
        headers: {
          'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
        }
      })
        .then(function (res) {
          if (res !== undefined) {
            this.fetchAllImports()
          }
        }.bind(this))
        .catch(function (err) {
          this.$log.debug('Could not start import: ' + err.response.data)
          this.snackbarInfo = {
            text: err.response.data,
            color: 'error',
            show: true
          }
        }.bind(this))
    },
    async fetchAllImports () {
      await this.$axios.$get(this.ajax.importUrl)
        .then(function (res) {
          this.allImports = res
        }.bind(this))
    },

    deleteItem (item) {
      this.deleteImport = item
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      this.closeDelete()
      await this.$axios.$delete(this.ajax.importUrl + this.deleteImport.id)
        .then(function (res) {
          if (res !== undefined) {
            this.fetchAllImports()
            this.deleteImport = ''
          }
        }.bind(this))
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
      if (status === 'COMPLETED') { return 'green' } else if (status === 'PROCESSING') { return 'orange' } else { return 'red' }
    }
  }
}
</script>

<template>
  <v-container fluid fill-height>
    <snackbars-default-snackbar
      :text="snackbarInfo.text"
      :show="snackbarInfo.show"
      :color="snackbarInfo.color"
      @hideSnackbar="snackbarInfo.show = false"
    />
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="allImports"
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
              <v-toolbar-title>ALL IMPORTS</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              />
              <v-btn
                icon
                @click="fetchAllImports()"
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
                @click="showStartImportDialog = !showStartImportDialog"
              >
                <v-icon class="pr-2">
                  mdi-plus
                </v-icon>
                {{ $t('pages.tools.importExport.import.newImport') }}
              </v-btn>
              <v-dialog v-model="dialogDelete" max-width="700px">
                <v-card>
                  <v-card-title class="text-h5">
                    {{ $t('pages.tools.importExport.import.deleteImportConfirmation') }}
                  </v-card-title>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="closeDelete">
                      {{ $t('pages.tools.importExport.import.buttons.cancel') }}
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm()">
                      {{ $t('pages.tools.importExport.import.buttons.ok') }}
                    </v-btn>
                    <v-spacer />
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template #[`item.converted`]="{ item }">
            {{ item.converted.toFixed(2) * 100 + ' %' }}
          </template>
          <template #[`item.namespaceUrn`]="{ item }">
            <v-btn
              small
              color="blue darken-1"
              text
              @click="showNamespaceDetailViewDialog(item.namespaceUrn)"
            >
              {{ item.namespaceUrn }}
            </v-btn>
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
                {{ item.status !== 'PROCESSING' ? item.status : item.status + ' ' + item.staged * 100 + ' %' }}
              </v-span>
            </v-chip>
          </template>
          <template #[`item.delete`]="{ item }">
            <v-icon
              small
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <template #[`item.manageMembers`]="{ item }">
            <v-btn
              text
              @click="showImportMembersDialog(item)"
            >
              {{ $t('pages.tools.importExport.import.manageImportedElements') }}
              <v-icon class="pl-1" small>
                mdi-arrow-right
              </v-icon>
            </v-btn>
          </template>
          <template #no-data>
            {{ $t('pages.tools.importExport.import.noImportsAvailable') }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row v-if="namespaceDetailViewDialog.show">
      <v-dialog
        v-model="namespaceDetailViewDialog.show"
        max-width="700px"
      >
        <v-card class="pa-8">
          <namespace-detail-view
            :urn="namespaceDetailViewDialog.urn"
            :hide-toolbar="true"
          />
        </v-card>
      </v-dialog>
    </v-row>
    <StartImportDialog
      v-if="showStartImportDialog"
      :show="showStartImportDialog"
      @startImport="startImport($event)"
      @reFetchImportInfo="fetchAllImports()"
    />
    <ImportMembersDialog
      v-if="importMembersDialog.show"
      :show="importMembersDialog.show"
      :import-id="importMembersDialog.importId"
      :namespace-urn="importMembersDialog.namespaceUrn"
      @startImport="startImport($event)"
      @closeImportedMembersDialog="importMembersDialog.show = false; importMembersDialog.importId = -1; fetchAllImports()"
    />
  </v-container>
</template>
