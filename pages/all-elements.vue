<template>
  <div>
    <default-snackbar
      :text="$t('global.itemDialog.snackbar.deleteFailure')"
      :show="snackbar.deleteFailure"
      color="error"
    />
    <default-snackbar
      :text="$t('global.itemDialog.snackbar.deleteSuccess')"
      :show="snackbar.deleteSuccess"
    />
    <default-snackbar
      :text="$t('global.itemDialog.snackbar.saveFailure')"
      :show="snackbar.saveFailure"
      color="error"
    />
    <default-snackbar
      :text="$t('global.itemDialog.snackbar.saveSuccess')"
      :show="snackbar.saveSuccess"
    />
    <NamespaceDialog
      v-if="dialog.elementType === 'NAMESPACE'"
      :id="0"
      :show="dialog.showNamespace"
      @save="updateTree($event); snackbar.saveSuccess = true"
      @saveFailure="snackbar.saveFailure = true"
      @dialogClosed="dialog.showNamespace = false"
    />
    <DataElementDialog
      v-if="dialog.elementType === 'DATAELEMENT'"
      :show="dialog.showDataElement"
      :namespace-urn="dialog.namespaceUrn"
      @save="updateTree($event); snackbar.saveSuccess = true"
      @saveFailure="snackbar.saveFailure = true"
      @dialogClosed="dialog.showDataElement = false"
    />
    <GroupRecordDialog
      v-if="(dialog.elementType === 'DATAELEMENTGROUP' || dialog.elementType === 'RECORD')"
      :show="dialog.showDataElementGroup"
      :namespace-urn="dialog.namespaceUrn"
      :element-type="dialog.elementType"
      @save="updateTree($event); snackbar.saveSuccess = true"
      @saveFailure="snackbar.saveFailure = true"
      @dialogClosed="dialog.showDataElementGroup = false"
    />
    <v-row
      class="pa-4"
      justify="space-between"
    >
      <v-col cols="4">
        <v-btn
          class="d-block mr-0 ml-auto"
          color="primary"
          rounded
          @click="dialog.elementType = 'NAMESPACE'; dialog.showNamespace = true"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
          {{ $t('pages.namespaces.actions.createNamespace') }}
        </v-btn>
        <v-treeview
          :key="componentKey"
          :v-model="treeItems"
          :active.sync="activeElements"
          :open.sync="openNodes"
          :items="treeItems"
          :load-children="fetchMembers"
          activatable
          color="warning"
          rounded
          hoverable
          transition
        >
          <template #prepend="{ item }">
            <v-icon v-if="item.elementType === 'NAMESPACE'">
              mdi-alphabetical-variant
            </v-icon>
            <v-icon v-else-if="item.elementType === 'DATAELEMENT'">
              mdi-vector-arrange-below
            </v-icon>
            <v-icon
              v-else-if="item.elementType === 'DATAELEMENTGROUP'"
            >
              mdi-group
            </v-icon>
            <v-icon v-else-if="item.elementType === 'RECORD'">
              mdi-group
            </v-icon>
          </template>
          <template #append="{ item }">
            <AlertIcon
              v-if="!item.isPreferredLanguage"
              :title="$t('global.alerts.warning')"
              :alerts="[$t('global.alerts.defineLanguage')]"
            />
            <v-menu
              bottom
              offset-y
            >
              <template #activator="{ on, attrs }">
                <v-btn
                  v-if="item.elementType !== 'DATAELEMENT' && item.editable"
                  fab
                  x-small
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(elementType, i) in ['DATAELEMENT', 'DATAELEMENTGROUP', 'RECORD']"
                  :key="i"
                  @click="() => {elementToBeCreated(elementType, item.id)}"
                >
                  <v-list-item-title>
                    <v-icon>mdi-plus-box</v-icon>
                    {{ 'CREATE ' + elementType }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-treeview>
      </v-col>
      <v-divider vertical />
      <v-col
        fluid
      >
        <div>
          <DataElementDetailView
            v-if="selected && selectedElement.identification.elementType === 'DATAELEMENT'"
            :urn="selectedElement.identification.urn"
            :editable="true"
            :deletable="true"
            @save="updateTree($event); snackbar.saveSuccess = true"
            @saveFailure="snackbar.saveFailure = true"
            @delete="updateTree(selectedElement) ; snackbar.deleteSuccess = true"
            @deleteFailure="snackbar.deleteFailure = true"
          />
          <GroupsRecordsDetailView
            v-if="selected && (selectedElement.identification.elementType === 'DATAELEMENTGROUP'
              || selectedElement.identification.elementType === 'RECORD' )"
            :urn="selectedElement.identification.urn"
            :editable="true"
            :deletable="true"
            @save="snackbar.saveSuccess = true"
            @saveFailure="snackbar.saveFailure = true"
            @delete="updateTree(selectedElement) ; snackbar.deleteSuccess = true"
            @deleteFailure="snackbar.deleteFailure = true"
          />
          <NamespaceDetailView
            v-if="selected && selectedElement.identification.elementType === 'NAMESPACE'"
            :id="selectedElement.identification.identifier"
            :urn="selectedElement.identification.urn"
            :editable="true"
            :deletable="true"
            @save="updateTree($event); snackbar.saveSuccess = true"
            @saveFailure="snackbar.saveFailure = true"
            @delete="updateTree(selectedElement) ; snackbar.deleteSuccess = true"
            @deleteFailure="snackbar.deleteFailure = true"
          />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Ajax from '~/config/ajax'
import AlertIcon from '~/components/common/alert-icon'
import NamespaceDialog from '~/components/dialogs/namespace-dialog'
import DataElementDialog from '~/components/dialogs/data-element-dialog'
import GroupRecordDialog from '~/components/dialogs/group-record-dialog'
import DataElementDetailView from '~/components/views/data-element-detail-view.vue'
import GroupsRecordsDetailView from '~/components/views/groups-records-detail-view'
import NamespaceDetailView from '~/components/views/namespace-detail-view.vue'
import DefaultSnackbar from '~/components/snackbars/default-snackbar'
export default {
  components: {
    AlertIcon,
    NamespaceDialog,
    DataElementDialog,
    GroupRecordDialog,
    DataElementDetailView,
    NamespaceDetailView,
    GroupsRecordsDetailView,
    DefaultSnackbar
  },
  data: () => ({
    componentKey: 0,
    ajax: {
      namespaceUrl: process.env.mdrBackendUrl + '/v1/namespaces/',
      elementUrl: process.env.mdrBackendUrl + '/v1/element/',
      preferredLanguage: 'de,en-US;q=0.7,en;q=0.3'
    },
    dialog: {
      urn: '',
      showNamespace: false,
      showDataElement: false,
      showDataElementGroup: false,
      elementType: 'None',
      namespaceUrn: '',
      parentUrn: ''
    },
    snackbar: {
      deleteFailure: false,
      deleteSuccess: false,
      saveFailure: false,
      saveSuccess: false
    },
    treeItems: [],
    openNodes: [],
    activeElements: [],
    selectedElement: null,
    valueDomainIsFetching: true
  }),
  computed: {
    selected () {
      if (!this.activeElements.length) { return undefined }
      return this.selectedElement
    }
  },
  watch: {
    activeElements () {
      if (typeof this.activeElements[0] !== 'undefined') {
        this.fetchElement(this.activeElements[0])
      }
    },
    'dialog.show' () {
      if (this.dialog.show === false) {
        this.refreshTree()
      }
    }
  },
  mounted () {
    this.fetchNamespaces()
  },
  methods: {
    updateTree (element) {
      this.$log.debug('Element saved now update the Tree ...')
      this.$log.debug(element)
      const findAnd = require('find-and')
      const item = {
        id: element.identification.urn,
        editable: true,
        name: element.definitions[0].designation,
        elementType: element.identification.elementType,
        children: element.identification.elementType === 'DATAELEMENT' ? undefined : []
      }
      switch (element.identification.elementType) {
        case 'NAMESPACE': {
          if (element.action === 'CREATE') {
            item.children = []
            this.treeItems.push(item)
          } else if (element.action === 'UPDATE') {
            const previousItem = findAnd.returnFound(this.treeItems, { id: element.previousUrn })
            item.children = previousItem.children
            this.treeItems = findAnd.replaceObject(this.treeItems, { id: element.previousUrn }, item)
          } else {
            this.treeItems = findAnd.removeObject(this.treeItems, { id: element.identification.urn })
          }
          break
        }
        case 'DATAELEMENT':
        case 'DATAELEMENTGROUP':
        case 'RECORD': {
          if (element.action === 'CREATE') {
            const parentElement = findAnd.returnFound(this.treeItems, { id: this.dialog.parentUrn })
            parentElement.children.push(item)
            this.treeItems = findAnd.replaceObject(this.treeItems, { id: this.dialog.parentUrn }, parentElement)
          } else if (element.action === 'UPDATE') {
            this.treeItems = findAnd.replaceObject(this.treeItems, { id: element.previousUrn }, item)
          } else {
            this.treeItems = findAnd.removeObject(this.treeItems, { id: element.identification.urn })
          }
          break
        }
      }
    },
    async fetchNamespaces () {
      await this.$axios.$get(this.ajax.namespaceUrl)
        .then(function (res) {
          this.treeItems = []
          for (const namespace of Array.from(res.ADMIN.concat(res.READ, res.WRITE))) {
            if (namespace.identification.status !== 'OUTDATED') {
              this.treeItems.push({
                id: namespace.identification.urn,
                editable: !res.READ.includes(namespace),
                isPreferredLanguage: this.ajax.preferredLanguage.includes(namespace.definitions[0].language),
                name: namespace.definitions[0].designation,
                elementType: 'NAMESPACE',
                children: []
              })
            }
          }
        }.bind(this))
    },
    async fetchMembers (element) {
      this.$log.debug('Fetching members ...')
      this.$log.debug(element)
      await this.$axios.$get(!this.isNamespace(element.id)
        ? this.ajax.elementUrl + element.id +
        '/members'
        : this.ajax.namespaceUrl + element.id.split(':')[3] +
        '/members', Ajax.header.listView)
        .then(function (res) {
          const members = []
          for (const member of Array.from(res)) {
            let id
            let elementType
            if (!this.isNamespace(element.id)) {
              elementType = member.urn.split(':')[2].toUpperCase()
              id = member.urn.toLowerCase()
            } else {
              elementType = member.elementType.toUpperCase()
              id = 'urn:' + element.id.split(':')[1] + ':' +
              member.elementType.toLowerCase() + ':' + member.identifier + ':' + member.revision
            }
            if (member.status !== 'OUTDATED') {
              members.push({
                id,
                editable: this.getNamespace(id).editable,
                isPreferredLanguage: this.preferredLanguage.includes(member.definitions[0].language),
                name: member.definitions[0].designation,
                elementType,
                children: elementType === 'DATAELEMENT' ? undefined : []
              })
            }
          }
          element.children = members
          return members
        }.bind(this))
    },
    async fetchElement (urn) {
      await this.$axios.$get(!this.isNamespace(urn)
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
            this.selectedElement = res
            if (this.selectedElement.identification.elementType === 'DATAELEMENT') {
              this.valueDomainIsFetching = true
              this.fetchElement(this.selectedElement.valueDomainUrn)
            }
          } else {
            this.selectedElement.valueDomain = res
            this.valueDomainIsFetching = false
          }
        }.bind(this))
    },
    isNamespace (id) {
      return id.toUpperCase().includes('NAMESPACE')
    },
    elementToBeCreated (elementType, parentId) {
      const namespaceUrn = this.getNamespace(parentId).id
      this.dialog.elementType = elementType
      this.dialog.namespaceUrn = namespaceUrn
      this.dialog.namespaceDesignation = this.treeItems.find(elem => elem.id === namespaceUrn).name
      switch (elementType) {
        case 'NAMESPACE':
          this.dialog.showNamespace = true
          break
        case 'DATAELEMENT':
          this.dialog.showDataElement = true
          break
        case 'DATAELEMENTGROUP':
        case 'RECORD':
          this.dialog.showDataElementGroup = true
          break
        default:
          this.$log.debug('Element type could not be determined.')
          break
      }
      this.dialog.parentUrn = parentId
    },
    getNamespace (id) {
      const namespaceIdentifier = id.split(':')[1]
      return this.isNamespace(id)
        ? this.treeItems.find(elem => elem.id === id)
        : this.treeItems.find(elem => elem.id.split(':')[1] ===
          namespaceIdentifier).id
    }
  }
}
</script>
