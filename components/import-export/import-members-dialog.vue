<script>
import Common from '~/assets/js/common'
export default {
  filters: {
    pretty (value) {
      return JSON.stringify(value, null, 2)
    }
  },
  props: {
    show: { required: true, type: Boolean },
    importId: { required: true, type: Number },
    namespaceUrn: { required: true, type: String }
  },
  data: () => ({
    ajax: {
      importUrl: process.env.mdrBackendUrl + '/v1/import/'
    },
    loadingTableData: false,
    stagedElementDialog: {
      show: false,
      stagedElement: {}
    },
    allImportMembers: [],
    dialog: false,
    importFile: '',
    singleSelect: false,
    selected: [],
    headers: [
      {
        text: 'Designation',
        align: 'start',
        sortable: false,
        value: 'designation'
      },
      {
        text: 'Element Type',
        sortable: true,
        value: 'elementType'
      },
      {
        text: 'Staged Element ID',
        sortable: true,
        value: 'stagedElementId'
      },
      {
        text: 'Element URN',
        sortable: true,
        value: 'elementUrn'
      },
      {
        text: 'Import Status',
        align: 'start',
        sortable: false,
        value: 'importStatus'
      }
    ]
  }),
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
    this.fetchImportMembers(this.importId)
  },
  methods: {
    showStagedElementDialog (stagedElementId) {
      this.stagedElementDialog.show = true
      this.fetchStagedElement(this.importId, stagedElementId)
    },
    getColor (elementUrn) {
      return elementUrn !== undefined && elementUrn.toLowerCase().includes('urn') ? 'green' : 'grey'
    },
    async convertSelectedMembersToDraft (importId) {
      this.loadingTableData = true
      const selectedUrns = this.selected.map((member) => {
        return member.stagedElementId
      })
      await this.$axios.$post(this.ajax.importUrl + importId + '/convert', selectedUrns)
        .then(function (res) {
          if (res !== undefined) {
            this.fetchImportMembers(this.importId)
            this.selected = []
            this.loadingTableData = false
          }
        }.bind(this))
    },
    cutString (str, len) {
      return Common.cutString(str, len)
    },
    fetchImportMembers (importId) {
      this.$axios.$get(this.ajax.importUrl + importId + '/members')
        .then(function (res) {
          this.allImportMembers = res
        }.bind(this))
    },
    async fetchStagedElement (importId, stagedElementId) {
      await this.$axios.$get(this.ajax.importUrl + importId + '/' + stagedElementId)
        .then(function (res) {
          this.stagedElementDialog.stagedElement = res
        }.bind(this))
    }
  }
}
</script>

<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="1400px"
  >
    <v-card
      v-if="stagedElementDialog.show"
    >
      <v-system-bar
        color="header"
        dark
        height="50px"
      >
        <v-card-title class="white--text">
          <v-btn
            text
            @click="stagedElementDialog.show = false"
          >
            <v-icon small>
              mdi-arrow-left
            </v-icon>
            {{ $t('dialogs.importMembersDialog.buttons.back') }}
          </v-btn>
        </v-card-title>
        <v-spacer />
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>
                mdi-information-outline
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t('dialogs.importMembersDialog.infoTexts.1') }}</span>
        </v-tooltip>
      </v-system-bar>
      <v-card-text class="pt-4 pl-4" style="height: 400px; overflow-y: auto;">
        <v-text-area>
          <pre>{{ stagedElementDialog.stagedElement | pretty }}</pre>
        </v-text-area>
      </v-card-text>
    </v-card>
    <v-card v-else>
      <v-data-table
        v-model="selected"
        :items="allImportMembers"
        :headers="headers"
        :single-select="false"
        :loading="loadingTableData"
        item-key="stagedElementId"
        show-select
        class="elevation-1 pa-8"
        fixed-header
        hide-default-footer
        height="400px"
      >
        <template #top>
          <v-toolbar
            flat
          >
            <v-toolbar-title>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $t('dialogs.importMembersDialog.importedMembers') }}
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ $t('dialogs.importMembersDialog.importId') }}: {{ importId }} | {{ $t('dialogs.importMembersDialog.namespaceUrn') }}: {{ namespaceUrn }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-toolbar-title>
            <v-spacer />
            <v-btn
              color="primary"
              dark
              class="mb-2"
              @click="convertSelectedMembersToDraft(importId)"
            >
              {{ $t('dialogs.importMembersDialog.buttons.convertToDraft') }}
            </v-btn>
          </v-toolbar>
        </template>
        <template #[`item.designation`]="{ item }">
          {{ cutString(item.designation, 25) }}
        </template>
        <template #[`item.importStatus`]="{ item }">
          <v-chip
            small
            :color="getColor(item.elementUrn)"
            dark
          >
            <v-span>
              {{ item.elementUrn !== undefined && item.elementUrn.toLowerCase().includes('urn') ? 'CONVERTED' : 'STAGED' }}
            </v-span>
          </v-chip>
        </template>
        <template #[`item.stagedElementId`]="{ item }">
          <v-btn
            small
            color="blue darken-1"
            text
            @click="showStagedElementDialog(item.stagedElementId)"
          >
            {{ item.stagedElementId }}
          </v-btn>
        </template>
        <template #[`item.elementUrn`]="{ item }">
          {{ item.elementUrn ? item.elementUrn.toUpperCase() : '' }}
        </template>
      </v-data-table>
      <v-card-actions>
        <v-btn
          text
          color="blue darken-1"
          @click="dialog = false; $emit('closeImportedMembersDialog')"
        >
          {{ $t('dialogs.importMembersDialog.buttons.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
