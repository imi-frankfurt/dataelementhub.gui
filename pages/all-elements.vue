<template>
  <v-container fluid class="py-0 px-0 d-flex flex-column flex-grow-1 fill-parent-height align-start">
    <default-snackbar
      :text="$t('global.itemDialog.snackbar.deleteFailure') + ': ' + dialog.response.data"
      :show="snackbar.deleteFailure"
      color="error"
    />
    <default-snackbar
      :text="$t('global.itemDialog.snackbar.deleteSuccess')"
      :show="snackbar.deleteSuccess"
    />
    <default-snackbar
      :text="$t('global.itemDialog.snackbar.saveFailure') + ': ' + dialog.response.data"
      :show="snackbar.saveFailure"
      color="error"
    />
    <default-snackbar
      :text="$t('global.itemDialog.snackbar.saveSuccess')"
      :show="snackbar.saveSuccess"
    />
    <v-row no-gutters class="top-row flex-grow-0 flex-shrink-0">
      <v-col cols="2" class="create-namespace-col pa-3">
        <h4 class="text-h5">
          {{ $t('global.mainMenu.namespaces') }}:
        </h4>
        <v-divider />
      </v-col>
      <v-col cols="2" class="create-namespace-col pa-3">
        <v-btn
          v-if="loggedIn"
          class="d-block mr-0 ml-auto"
          color="primary"
          rounded
          @click="dialog.elementType = 'NAMESPACE'; dialog.showNamespace = true"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
          {{ $t('global.button.create') }}
        </v-btn>
      </v-col>
      <v-col cols="8" class="detail-view-col" />
    </v-row>
    <v-row
      no-gutters
      class="bottom-row flex-grow-1 flex-shrink-1 align-stretch"
    >
      <v-col cols="4" class="auto-scroll tree-view-col pa-2">
        <TreeView />
      </v-col>
      <v-col cols="8" class="auto-scroll detail-view-col pa-6 pt-8">
        <div v-if="selectedElement">
          <DataElementDetailView
            v-if="showDetailedView && selectedElement.identification.elementType === 'DATAELEMENT'"
            :urn="selectedElement.identification.urn"
            :parent-urn="selectedElement.parentUrn"
            :editable="loggedIn && selectedElement.editable"
            :deletable="loggedIn && selectedElement.editable"
            @save="$root.$emit('updateTreeView'); snackbar.saveSuccess = true"
            @saveFailure="handleSaveFailure($event)"
            @delete="$root.$emit('updateTreeView') ; snackbar.deleteSuccess = true"
            @deleteFailure="handleDeleteFailure ($event)"
          />
          <GroupsRecordsDetailView
            v-if="showDetailedView && selectedElement.identification.elementType === 'DATAELEMENTGROUP'
              || selectedElement.identification.elementType === 'RECORD'"
            :urn="selectedElement.identification.urn"
            :parent-urn="selectedElement.parentUrn"
            :editable="loggedIn && selectedElement.editable"
            :deletable="loggedIn && selectedElement.editable"
            @save="snackbar.saveSuccess = true"
            @saveFailure="handleSaveFailure($event)"
            @reloadMembers="$root.$emit('updateTreeView')"
            @delete="$root.$emit('updateTreeView') ; snackbar.deleteSuccess = true"
            @deleteFailure="handleDeleteFailure ($event)"
          />
          <NamespaceDetailView
            v-if="showDetailedView && selectedElement.identification.elementType === 'NAMESPACE'"
            :urn="selectedElement.identification.urn"
            :editable="loggedIn && selectedElement.editable"
            :deletable="loggedIn && selectedElement.editable"
            @save="$root.$emit('updateTreeView'); snackbar.saveSuccess = true"
            @saveFailure="handleSaveFailure($event)"
            @delete="$root.$emit('updateTreeView'); snackbar.deleteSuccess = true"
            @deleteFailure="handleDeleteFailure ($event)"
          />
        </div>
      </v-col>
    </v-row>
    <v-row v-if="dialog.showDataElement || dialog.showDataElementGroup || dialog.showNamespace">
      <v-col>
        <NamespaceDialog
          v-if="dialog.elementType === 'NAMESPACE'"
          :id="0"
          :show="dialog.showNamespace"
          @save="$root.$emit('updateTreeView'); showSaveSuccessSnackbar()"
          @saveFailure="handleSaveFailure($event)"
          @dialogClosed="dialog.showNamespace = false"
        />
        <DataElementDialog
          v-if="dialog.elementType === 'DATAELEMENT'"
          :show="dialog.showDataElement"
          :namespace-urn="dialog.namespaceUrn"
          @save="$root.$emit('updateTreeView'); showSaveSuccessSnackbar()"
          @saveFailure="handleSaveFailure($event)"
          @dialogClosed="dialog.showDataElement = false"
        />
        <GroupRecordDialog
          v-if="(dialog.elementType === 'DATAELEMENTGROUP' || dialog.elementType === 'RECORD')"
          :show="dialog.showDataElementGroup"
          :namespace-urn="dialog.namespaceUrn"
          :element-type="dialog.elementType"
          @save="$root.$emit('updateTreeView'); showSaveSuccessSnackbar()"
          @saveFailure="handleSaveFailure($event)"
          @dialogClosed="dialog.showDataElementGroup = false"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NamespaceDialog from '~/components/dialogs/namespace-dialog'
import DataElementDialog from '~/components/dialogs/data-element-dialog'
import GroupRecordDialog from '~/components/dialogs/group-record-dialog'
import DataElementDetailView from '~/components/views/data-element-detail-view.vue'
import GroupsRecordsDetailView from '~/components/views/groups-records-detail-view'
import NamespaceDetailView from '~/components/views/namespace-detail-view.vue'
import DefaultSnackbar from '~/components/snackbars/default-snackbar'
import TreeView from '~/components/trees/TreeView'
import Common from '~/assets/js/common'

export default {
  auth: false,
  components: {
    TreeView,
    NamespaceDialog,
    DataElementDialog,
    GroupRecordDialog,
    DataElementDetailView,
    NamespaceDetailView,
    GroupsRecordsDetailView,
    DefaultSnackbar
  },
  data: () => ({
    ajax: {
      namespaceUrl: process.env.mdrBackendUrl + '/v1/namespaces/',
      elementUrl: process.env.mdrBackendUrl + '/v1/element/'
    },
    dialog: {
      urn: '',
      showNamespace: false,
      showDataElement: false,
      showDataElementGroup: false,
      elementType: 'None',
      namespaceUrn: '',
      parentUrn: '',
      response: {}
    },
    snackbar: {
      deleteFailure: false,
      deleteSuccess: false,
      saveFailure: false,
      saveSuccess: false
    },
    selectedElement: null,
    valueDomainIsFetching: true
  }),
  computed: {
    showDetailedView () {
      return this.$store.getters.getActiveTreeItemUrn !== ''
    },
    loggedIn () {
      return this.$auth.loggedIn
    }
  },
  watch: {
    '$store.state.activeTreeViewNode' () {
      this.fetchElement({ ...this.$store.getters.getActiveTreeViewNode })
    }
  },
  methods: {
    /*
    * fetches a dataElementGroup / record / dataElement (with its valueDomain) and saves it.
    */
    async fetchElement (node) {
      const urn = node.urn
      await this.$axios.$get(!Common.isNamespace(urn)
        ? this.ajax.elementUrl + urn
        : this.ajax.namespaceUrl + urn.split(':')[1],
      {
        headers: {
          'Accept-Language': ''
        }
      })
        .then(function (res) {
          if
          (!['ENUMERATED_VALUE_DOMAIN', 'DESCRIBED_VALUE_DOMAIN']
            .includes(res.identification.elementType)) {
            res.editable = node.editable && res.identification.status.toUpperCase() !== 'OUTDATED'
            this.selectedElement = res
            this.selectedElement.parentUrn = node.parentUrn
            if (this.selectedElement.identification.elementType === 'DATAELEMENT') {
              this.valueDomainIsFetching = true
              const valueDomainNode = Object.assign({}, { urn: this.selectedElement.valueDomainUrn })
              this.fetchElement(valueDomainNode)
            }
          } else {
            this.selectedElement.valueDomain = res
            this.valueDomainIsFetching = false
          }
        }.bind(this))
    },
    async showSaveSuccessSnackbar () {
      this.snackbar.saveSuccess = true
      await new Promise(resolve => setTimeout(resolve, 2000))
      this.snackbar.saveSuccess = false
    },
    async showDeleteSuccessSnackbar () {
      this.snackbar.deleteSuccess = true
      await new Promise(resolve => setTimeout(resolve, 2000))
      this.snackbar.deleteSuccess = false
    },
    async handleSaveFailure (response) {
      this.dialog.response = response
      this.snackbar.saveFailure = true
      await new Promise(resolve => setTimeout(resolve, 3500))
      this.snackbar.saveFailure = false
    },
    async handleDeleteFailure (response) {
      this.dialog.response = response
      this.snackbar.deleteFailure = true
      await new Promise(resolve => setTimeout(resolve, 3500))
      this.snackbar.deleteFailure = false
    }
  }
}
</script>

<style lang="scss">
.fill-parent-height {
  height: 100%;
}

.tree-view-col {
  height: 100%;
  background-color: #a4c2da;
}

.create-namespace-col {
  background-color: #a4c2da;
}

.detail-view-col {
  height: 100%;
  background-color: #eaf3fa;
}

.auto-scroll {
  overflow-y: auto;
}

.auto-scroll > p {
  height: 9000px;
}

.bottom-row {
  width: 100%;
  min-height: 0;
}

.top-row {
  width: 100%;
}
</style>
