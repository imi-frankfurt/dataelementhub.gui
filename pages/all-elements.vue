<template>
  <v-container fluid class="py-0 px-0 d-flex flex-column flex-grow-1 fill-parent-height align-start">
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
        <div v-if="treeItems.length === 0" align="middle">
          <v-icon size="100">
            mdi-plus
          </v-icon>
          <h3 class="text-h2 mb-2">
            {{ $t('global.noItems') }}
          </h3>
          <h3 class="text-h6 mb-2">
            {{ $t('global.addNamespaces') }}
          </h3>
        </div>
        <v-treeview
          :key="componentKey"
          :v-model="treeItems"
          :active="activeElements"
          :open.sync="openNodes"
          :items="treeItems"
          :load-children="fetchAndReplaceMembers"
          multiple-active
          return-object
          activatable
          color="warning"
          rounded
          hoverable
          transition
          @update:active="setActiveElements"
        >
          <template #prepend="{ item }">
            <v-icon
              v-if="item.elementType === 'NAMESPACE'"
              color="white"
            >
              mdi-garage-variant
            </v-icon>
            <v-icon
              v-else-if="item.elementType === 'DATAELEMENT'"
              color="white"
            >
              mdi-vector-arrange-below
            </v-icon>
            <v-icon
              v-else-if="item.elementType === 'DATAELEMENTGROUP'"
              color="white"
            >
              mdi-group
            </v-icon>
            <v-icon
              v-else-if="item.elementType === 'RECORD'"
              color="white"
            >
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
                  v-if="item.elementType !== 'DATAELEMENT' && item.editable && loggedIn"
                  class="d-block mr-0 ml-auto"
                  rounded
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-plus</v-icon>
                  {{ $t('global.button.create') }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(elementType, i) in ['DATAELEMENT', 'DATAELEMENTGROUP', 'RECORD']"
                  :key="i"
                  @click="() => {elementToBeCreated(elementType, item.urn)}"
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
      <v-col cols="8" class="auto-scroll detail-view-col pa-6 pt-8">
        <div>
          <DataElementDetailView
            v-if="selected && selectedElement.identification.elementType === 'DATAELEMENT'"
            :urn="selectedElement.identification.urn"
            :parent-urn="activeElements.slice(-1)[0].parentUrn"
            :editable="loggedIn && selectedElement.editable"
            :deletable="loggedIn && selectedElement.editable"
            @save="snackbar.saveSuccess = true"
            @saveFailure="snackbar.saveFailure = true"
            @delete="updateTree(selectedElement) ; snackbar.deleteSuccess = true"
            @deleteFailure="snackbar.deleteFailure = true"
          />
          <GroupsRecordsDetailView
            v-if="selected && (selectedElement.identification.elementType === 'DATAELEMENTGROUP'
              || selectedElement.identification.elementType === 'RECORD' )"
            :urn="selectedElement.identification.urn"
            :parent-urn="activeElements.slice(-1)[0].parentUrn"
            :editable="loggedIn && selectedElement.editable"
            :deletable="loggedIn && selectedElement.editable"
            @save="snackbar.saveSuccess = true"
            @saveFailure="snackbar.saveFailure = true"
            @reloadMembers="updateTree($event)"
            @delete="snackbar.deleteSuccess = true"
            @deleteFailure="snackbar.deleteFailure = true"
          />
          <NamespaceDetailView
            v-if="selected && selectedElement.identification.elementType === 'NAMESPACE'"
            :urn="selectedElement.identification.urn"
            :editable="loggedIn && selectedElement.editable"
            :deletable="loggedIn && selectedElement.editable"
            @save="snackbar.saveSuccess = true"
            @saveFailure="snackbar.saveFailure = true"
            @delete="updateTree(selectedElement) ; snackbar.deleteSuccess = true"
            @deleteFailure="snackbar.deleteFailure = true"
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
          @save="showSaveSuccessSnackbar()"
          @saveFailure="showSaveFailureSnackbar()"
          @dialogClosed="dialog.showNamespace = false"
        />
        <DataElementDialog
          v-if="dialog.elementType === 'DATAELEMENT'"
          :show="dialog.showDataElement"
          :namespace-urn="dialog.namespaceUrn"
          @save="showSaveSuccessSnackbar()"
          @saveFailure="showSaveFailureSnackbar()"
          @dialogClosed="dialog.showDataElement = false"
        />
        <GroupRecordDialog
          v-if="(dialog.elementType === 'DATAELEMENTGROUP' || dialog.elementType === 'RECORD')"
          :show="dialog.showDataElementGroup"
          :namespace-urn="dialog.namespaceUrn"
          :element-type="dialog.elementType"
          @save="showSaveSuccessSnackbar()"
          @saveFailure="showSaveFailureSnackbar()"
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

export default {
  auth: false,
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
    changeActiveElement (urn) {
      const item = this.getJsonObjects(this.treeItems, 'urn', urn)[0]
      this.activeElements = []
      this.selectedElement = null
      this.activeElements.unshift(item)
      this.setActiveElements(this.activeElements)
    },
    updateTree (element) {
      this.$log.debug('Element saved now update the Tree ...')
      this.$log.debug(element)
      const findAnd = require('find-and')
      const item = {
        id: this.generateItemId(),
        urn: element.identification.urn,
        editable: true,
        name: element.definitions[0].designation,
        elementType: element.identification.elementType,
        children: element.identification.elementType === 'DATAELEMENT' ? undefined : [],
        isPreferredLanguage: Ajax.preferredLanguage.includes(element.definitions[0].language)
      }
      switch (element.identification.elementType) {
        case 'NAMESPACE': {
          if (element.action === 'CREATE') {
            this.treeItems.push(item)
          } else if (element.action === 'UPDATE') {
            const previousItem =
              this.getJsonObjects(this.treeItems, 'urn', element.previousUrn)[0]
            item.children = previousItem.children
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
          if (element.action === 'UPDATE') {
            const currentElement =
              this.getJsonObjects(this.treeItems, 'urn', element.previousUrn)[0]
            item.id = currentElement.id
            item.parentUrn = currentElement.parentUrn
            this.treeItems =
              findAnd.replaceObject(this.treeItems, { urn: element.previousUrn }, item)
            if (element.identification.elementType === 'DATAELEMENTGROUP' ||
              element.identification.elementType === 'RECORD') {
              this.fetchAndReplaceMembers(item)
            }
            this.changeActiveElement(item.urn)
          }
          if (element.action === 'CREATE') {
            const parentElement = this.getJsonObjects(this.treeItems, 'urn', this.dialog.parentUrn)[0]
            parentElement.children.push(item)
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
        if (typeof obj[i] === 'object') {
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
          for (const namespace of namespaces) {
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
          for (const member of Array.from(res)) {
            let urn
            let elementType
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
            // this.setActiveElements(this.activeElements)
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
      const elementInTree = this.getJsonObjects(this.treeItems, 'id', element.id)[0]
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
      for (const member of fetchedMembers) {
        let filteredArray = currentMembers.filter(e => e.urn === member.urn)
        if (filteredArray.length === 0) { // is not a current member
          filteredArray =
            currentMembers.filter(e => e.urn.slice(0, e.urn.lastIndexOf(':')) ===
              member.urn.slice(0, member.urn.lastIndexOf(':')))
          if (filteredArray.length !== 0) {
            const newMember = member
            newMember.id = filteredArray[0].id
            newMember.children = filteredArray[0].children
            updatedMembers.push(newMember)
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
      for (const member of currentMembers) {
        const filteredArray = fetchedMembers.filter(e => e.urn === member.urn)
        if (filteredArray.length === 0) {
          updatedMembers = updatedMembers.filter(e => e.urn !== member.urn)
        }
      }
      return updatedMembers
    },
    UpdateAllOpenNodes () {
      const nodesToUpdate = this.openNodes.reverse()
      for (const element of nodesToUpdate) {
        this.fetchAndUpdateMembers(element)
      }
    },
    async fetchElement (urn, parentUrn) {
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
            res.editable = this.getNamespace(urn).editable
            this.selectedElement = res
            this.selectedElement.parentUrn = parentUrn
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
      await new Promise(resolve => setTimeout(resolve, 1500))
      this.snackbar.saveSuccess = false
    },
    async showDeleteSuccessSnackbar () {
      this.snackbar.deleteSuccess = true
      await new Promise(resolve => setTimeout(resolve, 1500))
      this.snackbar.deleteSuccess = false
    },
    async showSaveFailureSnackbar () {
      this.snackbar.saveFailure = true
      await new Promise(resolve => setTimeout(resolve, 1500))
      this.snackbar.saveFailure = false
    },
    async showDeleteFailureSnackbar () {
      this.snackbar.deleteFailure = true
      await new Promise(resolve => setTimeout(resolve, 1500))
      this.snackbar.deleteFailure = false
    }
  }
}
</script>

<style>
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
