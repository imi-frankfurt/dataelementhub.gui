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
        <h4 class="text-h4 mb-2">
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
            @save="updateTree($event); snackbar.saveSuccess = true"
            @saveFailure="handleSaveFailure($event)"
            @delete="updateTree(selectedElement) ; snackbar.deleteSuccess = true"
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
            @reloadMembers="updateTree($event)"
            @delete="updateTree(selectedElement) ; snackbar.deleteSuccess = true"
            @deleteFailure="handleDeleteFailure ($event)"
          />
          <NamespaceDetailView
            v-if="showDetailedView && selectedElement.identification.elementType === 'NAMESPACE'"
            :urn="selectedElement.identification.urn"
            :editable="loggedIn && selectedElement.editable"
            :deletable="loggedIn && selectedElement.editable"
            @save="updateTree($event); snackbar.saveSuccess = true"
            @saveFailure="handleSaveFailure($event)"
            @delete="updateTree(selectedElement) ; snackbar.deleteSuccess = true"
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
          @save="updateTree($event); showSaveSuccessSnackbar()"
          @saveFailure="handleSaveFailure($event)"
          @dialogClosed="dialog.showNamespace = false"
        />
        <DataElementDialog
          v-if="dialog.elementType === 'DATAELEMENT'"
          :show="dialog.showDataElement"
          :namespace-urn="dialog.namespaceUrn"
          @save="updateTree($event); showSaveSuccessSnackbar()"
          @saveFailure="handleSaveFailure($event)"
          @dialogClosed="dialog.showDataElement = false"
        />
        <GroupRecordDialog
          v-if="(dialog.elementType === 'DATAELEMENTGROUP' || dialog.elementType === 'RECORD')"
          :show="dialog.showDataElementGroup"
          :namespace-urn="dialog.namespaceUrn"
          :element-type="dialog.elementType"
          @save="updateTree($event); showSaveSuccessSnackbar()"
          @saveFailure="handleSaveFailure($event)"
          @dialogClosed="dialog.showDataElementGroup = false"
        />
      </v-col>
    </v-row>
  </v-container>
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
import TreeView from '~/components/trees/TreeView'
import Common from '~/assets/js/common'

export default {
  auth: false,
  components: {
    TreeView,
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
    itemId: -1,
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
    treeItems: [],
    openNodes: [],
    activeElements: [],
    selectedElement: null,
    valueDomainIsFetching: true
  }),
  computed: {
    showDetailedView () {
      return this.$store.getters.getActiveTreeItemUrn !== ''
    },
    selected () {
      if (!this.activeElements.length) {
        return undefined
      }
      return this.selectedElement
    },
    loggedIn () {
      return this.$auth.loggedIn
    }
  },
  watch: {
    '$store.state.activeTreeViewNode' () {
      this.fetchElement({ ...this.$store.getters.getActiveTreeViewNode })
    },
    activeElements () {
      if (typeof this.activeElements[0] !== 'undefined') {
        this.fetchElement(this.activeElements.slice(-1)[0].urn,
          this.activeElements.slice(-1)[0].parentUrn)
      }
    }
  },
  mounted () {
    this.fetchNamespaces()
    this.$root.$on('changeActiveElement', (urn) => {
      this.changeActiveElement(urn)
    })
    this.$root.$on('updateTreeView', (element) => {
      this.updateTree(element)
    })
  },
  methods: {
    /*
    * fetches a dataElementGroup / record / dataElement (with its valueDomain) and saves it.
    */
    async fetchElement (node) {
      const urn = node.urn
      if (urn === '') {
        return
      }
    changeActiveElement (urn) {
      const item = this.getJsonObjects(this.treeItems, 'urn', urn)[0]
      this.activeElements = []
      this.selectedElement = null
      this.activeElements.unshift(item)
      this.setActiveElements(this.activeElements)
    }
    updateTree (element) {
      this.$log.debug('Element saved now update the Tree ...')
      this.$log.debug(element)
      const findAnd = require('find-and')
      if (element.identification === undefined) {
        this.treeItems =
          findAnd.removeObject(this.treeItems, { urn: element.urn })
        this.UpdateAllOpenNodes()
        return this.treeItems
      }
      const currentElement = this.getJsonObjects(this.treeItems, 'urn', element.previousUrn)[0]
      const parentElement = this.getJsonObjects(this.treeItems, 'urn', this.dialog.parentUrn)[0]
      const item = {
        id: this.generateItemId(),
        urn: element.identification.urn,
        editable: element.identification.status.toUpperCase() !== 'OUTDATED',
        name: element.definitions[0].designation,
        elementType: element.identification.elementType,
        children: element.identification.elementType === 'DATAELEMENT' ? undefined : [],
        isPreferredLanguage: Ajax.preferredLanguage.includes(element.definitions[0].language)
      }
      switch (element.identification.elementType) {
        case 'NAMESPACE': {
          if (element.action === 'CREATE') {
            item.children = []
            this.treeItems.push(item)
          } else if (element.action === 'UPDATE') {
            const previousItem =
                this.getJsonObjects(this.treeItems, 'urn', element.previousUrn)[0]
            item.children = previousItem.children
            item.id = previousItem.id
            this.treeItems =
                findAnd.replaceObject(this.treeItems, { urn: element.previousUrn }, item)
            this.changeActiveElement(item.urn)
          } else {
            this.treeItems =
                findAnd.removeObject(this.treeItems, { urn: element.identification.urn })
          }
          break
        }
        case 'RECORD':
        case 'DATAELEMENTGROUP':
        case 'DATAELEMENT': {
          item.parentUrn = this.dialog.parentUrn
          if (element.action === 'UPDATE' && currentElement !== undefined) {
            const parentElement = this.getJsonObjects(this.treeItems, 'urn', currentElement.parentUrn)[0]
            item.parentUrn = currentElement.parentUrn
            item.id = currentElement.id
            parentElement.children =
                findAnd.replaceObject(parentElement.children, { urn: element.previousUrn }, item)
            this.treeItems =
                findAnd.changeProps(this.treeItems, { urn: parentElement.urn }, parentElement.children)
            if (element.identification.elementType === 'DATAELEMENTGROUP' ||
                element.identification.elementType === 'RECORD') {
              this.fetchAndReplaceMembers(item)
              this.openNodes = findAnd.replaceObject(this.openNodes, { urn: element.previousUrn }, item)
            }
            this.changeActiveElement(item.urn)
          }
          if (element.action === 'CREATE' && parentElement !== undefined) {
            parentElement.children.push(item)
            if (parentElement.children.length === 1) {
              this.fetchAndReplaceMembers(parentElement)
            }
            this.treeItems =
                findAnd.changeProps(this.treeItems,
                  { urn: this.dialog.parentUrn },
                  { children: parentElement.children })
          }
          break
        }
      }
      this.UpdateAllOpenNodes()
    },
    getJsonObjects (obj, key, val) {
      let objects = []
      for (const i in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (!obj.hasOwnProperty(i)) { continue }
        if (obj[i] !== null && typeof obj[i] === 'object') {
          objects = objects.concat(this.getJsonObjects(obj[i], key, val))
        } else if (i === key && obj[key] === val) {
          objects.push(obj)
        }
      }
      return objects
    },
    async fetchNamespaces () {
      await this.$axios.$get(this.ajax.namespaceUrl)
        .then(function (res) {
          this.treeItems = []
          let namespaces
          namespaces = Array.from(res.READ)
          if (res.ADMIN) {
            namespaces = Array.from(namespaces.concat(res.ADMIN, res.WRITE))
          }
          for (let i = 0; i < namespaces.length; i++) {
            const namespace = namespaces[i]
            if (namespace.identification.status !== 'OUTDATED') {
              this.treeItems.push({
                id: this.generateItemId(),
                urn: namespace.identification.urn,
                isPreferredLanguage: Ajax.preferredLanguage.includes(
                  namespace.definitions[0].language),
                editable: !res.READ.includes(namespace),
                name: namespace.definitions[0].designation,
                elementType: 'NAMESPACE',
                children: []
              })
            }
          }
        }.bind(this))
    },
    async fetchAndReplaceMembers (element) {
      const findAnd = require('find-and')
      this.$log.debug('Fetching members ...')
      this.$log.debug(element)
      await this.$axios.$get(!this.isNamespace(element.urn)
        ? this.ajax.elementUrl + element.urn +
        '/members'
        : this.ajax.namespaceUrl + element.urn.split(':')[3] +
        '/members?hideSubElements=true', Ajax.header.listView)
        .then(function (res) {
          const members = []
          const resMembers = Array.from(res)
          for (let i = 0; i < resMembers.length; i++) {
            let urn
            let elementType
            const member = resMembers[i]
            if (!this.isNamespace(element.urn)) {
              elementType = member.urn.split(':')[2].toUpperCase()
              urn = member.urn.toLowerCase()
            } else {
              elementType = member.elementType.toUpperCase()
              urn = 'urn:' + element.urn.split(':')[1] + ':' +
                member.elementType.toLowerCase() + ':' + member.identifier + ':' + member.revision
            }
            if (member.status === 'OUTDATED' && this.isNamespace(element.urn)) {
              continue
            }
            members.push({
              id: this.generateItemId(),
              parentUrn: element.urn,
              urn,
              editable: this.getNamespace(urn).editable,
              isPreferredLanguage: Ajax.preferredLanguage.includes(member.definitions[0].language),
              name: member.definitions[0].designation,
              elementType,
              children: elementType === 'DATAELEMENT' ? undefined : []
            })
            this.treeItems =
              findAnd.changeProps(this.treeItems,
                { urn: element.urn },
                { children: members })
          }
          return members
        }.bind(this))
    },
    async fetchAndUpdateMembers (element) {
      this.$log.debug('Fetching members ...')
      this.$log.debug(element)
      const findAnd = require('find-and')
      const elementInTree = this.getJsonObjects(this.treeItems, 'urn', element.urn)[0]
      const parentElementIsNamespace = this.isNamespace(element.urn)
      const members = []
      await this.$axios.$get(!parentElementIsNamespace
        ? this.ajax.elementUrl + element.urn +
        '/members'
        : this.ajax.namespaceUrl + element.urn.split(':')[3] +
        '/members?hideSubElements=true', Ajax.header.listView)
        .then(function (res) {
          const fetchedMembers = Array.from(res)
          for (let i = 0; i < fetchedMembers.length; i++) {
            let urn
            let elementType
            const member = fetchedMembers[i]
            if (!parentElementIsNamespace) {
              elementType = member.urn.split(':')[2].toUpperCase()
              urn = member.urn.toLowerCase()
            } else {
              elementType = member.elementType.toUpperCase()
              urn = 'urn:' + element.urn.split(':')[1] + ':' +
                member.elementType.toLowerCase() + ':' + member.identifier + ':' + member.revision
            }
            if (member.status === 'OUTDATED' && parentElementIsNamespace) {
              continue
            }
            members.push({
              id: this.generateItemId(),
              parentUrn: element.urn,
              urn,
              editable: this.getNamespace(urn).editable,
              isPreferredLanguage: Ajax.preferredLanguage.includes(member.definitions[0].language),
              name: member.definitions[0].designation,
              elementType,
              children: elementType === 'DATAELEMENT' ? undefined : []
            })
          }
          const updatedMembers = this.removeDuplicates(members, elementInTree.children)
          updatedMembers.sort((a, b) => a.id - b.id)
          this.treeItems =
            findAnd.changeProps(this.treeItems,
              { urn: element.urn },
              { children: updatedMembers })
        }.bind(this))
    },
    removeDuplicates (fetchedMembers, currentMembers) {
      let updatedMembers = []
      for (let i = 0; i < fetchedMembers.length; i++) {
        const member = fetchedMembers[i]
        let filteredArray = currentMembers.filter(e => e.urn === member.urn)
        if (filteredArray.length === 0) { // is not a current member
          filteredArray =
            currentMembers.filter(e => e.urn.slice(0, e.urn.lastIndexOf(':')) ===
              member.urn.slice(0, member.urn.lastIndexOf(':')))
          if (filteredArray.length !== 0) {
            const newMember = member
            newMember.id = filteredArray[0].id
            newMember.children = filteredArray[0].children
            updatedMembers.push(member)
          } else {
            updatedMembers.push(member)
          }
        } else {
          const newMember = member
          newMember.id = filteredArray[0].id
          newMember.children = filteredArray[0].children
          updatedMembers.push(newMember)
        }
      }
      for (let i = 0; i < currentMembers.length; i++) {
        const member = currentMembers[i]
        const filteredArray = fetchedMembers.filter(e => e.urn === member.urn)
        if (filteredArray.length === 0) {
          updatedMembers = updatedMembers.filter(e => e.urn !== member.urn)
        }
      }
      return updatedMembers
    },
    UpdateAllOpenNodes () {
      const nodesToUpdate = this.openNodes.reverse()
      for (let i = 0; i < nodesToUpdate.length; i++) {
        const element = nodesToUpdate[i]
        this.fetchAndUpdateMembers(element)
      }
    },
    async fetchElement (urn, parentUrn) {
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
    isNamespace (urn) {
      return urn.toUpperCase().includes('NAMESPACE')
    },
    elementToBeCreated (elementType, parentUrn) {
      const namespaceUrn = this.getNamespace(parentUrn).urn
      this.dialog.parentUrn = parentUrn
      this.dialog.elementType = elementType
      this.dialog.namespaceUrn = namespaceUrn
      this.dialog.namespaceDesignation = this.treeItems.find(elem => elem.urn === namespaceUrn).name
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
      this.dialog.parentUrn = parentUrn
    },
    getNamespace (urn) {
      const namespaceIdentifier = urn.split(':')[1]
      return this.isNamespace(urn)
        ? this.treeItems.find(elem => elem.urn === urn)
        : this.treeItems.find(elem => elem.urn.split(':')[1] ===
          namespaceIdentifier)
    },
    generateItemId () {
      this.itemId = this.itemId + 1
      return this.itemId
    },
    setActiveElements (elements) {
      if (elements.length < this.activeElements.length) {
        this.activeElements = []
        return
      }
      if (elements.length > 0) {
        const itemUrn = elements.slice(-1)[0].urn
        let activeItems =
          this.getJsonObjects(this.treeItems, 'urn', itemUrn)[0]
        if (activeItems === undefined) {
          const itemVersion = itemUrn.slice(itemUrn.lastIndexOf(':') + 1, -1)
          const nextVersion = parseInt(itemVersion) + 1
          const nextVersionUrn = itemUrn.slice(0, itemUrn.lastIndexOf(':')) + nextVersion
          activeItems = this.getJsonObjects(this.treeItems, 'urn', nextVersionUrn)[0]
        }
        this.activeElements = Array.isArray(activeItems) ? activeItems : [activeItems]
      } else {
        this.activeElements = []
      }
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

<style scoped lang="scss">
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
