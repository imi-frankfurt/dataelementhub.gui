<script>
import Ajax from '~/config/ajax'
import Common from '~/assets/js/common'
import AlertIcon from '~/components/common/alert-icon'

export default {
  name: 'TreeView',
  components: { AlertIcon },
  props: {
    elements: { required: false, default: () => [], type: Array },
    parentElement: { required: false, default: () => {}, type: Object },
    depth: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      treeItems: this.elements,
      ajax: {
        namespaceUrl: process.env.mdrBackendUrl + '/v1/namespaces/',
        elementUrl: process.env.mdrBackendUrl + '/v1/element/'
      },
      dialog: {
        urn: '',
        showNamespace: false,
        showDataElement: false,
        showDataElementGroup: false,
        type: 'None',
        namespaceUrn: '',
        parentUrn: '',
        response: {}
      }
    }
  },
  computed: {
    loggedIn () {
      return this.$auth.loggedIn
    }
  },
  watch: {
    treeItems: {
      handler () {
        this.$emit('updateParentWarnings', { element: this.parentElement, newChildren: this.treeItems })
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    this.refreshNodes()
    this.$root.$on('updateTreeView', () => {
      this.updateTreeItems()
    })
  },
  beforeMount () {
    if (this.depth === 0) {
      this.fetchNamespaces()
    }
  },
  methods: {
    updateParentWarnings (event) {
      this.$log.debug('Update parentElement warnings.')
      const element = event.element
      const newChildren = event.newChildren
      for (let i = 0; i < this.treeItems.length; i++) {
        if (this.treeItems[i].urn.toUpperCase() === element.urn.toUpperCase()) {
          const parentElement = this.treeItems[i]
          parentElement.children = newChildren
          this.treeItems[i].warnings = this.checkWarnings(parentElement)
          break
        }
      }
    },
    refreshNodes () {
      if (this.parentElement) {
        this.updateTreeItems()
      }
    },
    refreshTreeItems (newItems) {
      this.treeItems = []
      this.treeItems = [...newItems]
    },
    ignoreUrnRevision (urn) {
      return urn.substring(0, urn.lastIndexOf(':') + 1)
    },
    getNextUrnRevision (urn) {
      const currentVersion = urn.split(':').pop()
      return urn.substring(0, urn.lastIndexOf(':') + 1) + (parseInt(currentVersion) + 1)
    },
    async updateTreeItems () {
      if (this.depth === 0) {
        this.$log.debug('Update treeItems (Namespaces)')
        await this.$axios.$get(this.ajax.namespaceUrl)
          .then(function (res) {
            let namespaces
            namespaces = Array.from(res.READ)
            if (res.ADMIN) {
              namespaces = Array.from(namespaces.concat(res.ADMIN, res.WRITE))
            }
            const newItems = []
            for (let i = 0; i < namespaces.length; i++) {
              const namespace = namespaces[i]
              if (namespace.identification.status !== 'OUTDATED') {
                const previousItem = this.treeItems.filter(item => this.ignoreUrnRevision(item.urn) === this.ignoreUrnRevision(namespace.identification.urn))[0]
                const newItem = {
                  id: this.generateItemId(),
                  urn: namespace.identification.urn,
                  namespaceUrn: namespace.identification.namespaceUrn,
                  isPreferredLanguage: Ajax.preferredLanguage.includes(
                    namespace.definitions[0].language),
                  editable: !res.READ.includes(namespace),
                  designation: namespace.definitions[0].designation,
                  type: 'NAMESPACE',
                  elementStatus: namespace.identification.status,
                  expanded: previousItem ? previousItem.expanded : false,
                  children: previousItem ? previousItem.children : []
                }
                newItem.warnings = this.checkWarnings(newItem)
                newItems.push(newItem)
              }
            }
            this.treeItems = newItems
          }.bind(this))
      } else if (this.depth === 1) {
        const parentElementUrn = this.parentElement.urn
        this.$log.debug('Update treeItems ' + parentElementUrn)
        await this.$axios.$get(this.ajax.namespaceUrl + parentElementUrn.split(':')[3] +
          '/members?hideSubElements=true', Ajax.header.listView)
          .then(function (res) {
            const members = []
            const resMembers = Array.from(res)
            for (let i = 0; i < resMembers.length; i++) {
              const member = resMembers[i]
              const type = member.elementType.toUpperCase()
              const urn = 'urn:' + parentElementUrn.split(':')[1] + ':' +
                type.toLowerCase() + ':' + member.identifier + ':' + member.revision
              if (member.status === 'OUTDATED') {
                continue
              }
              const previousItem = this.treeItems.filter(item => this.ignoreUrnRevision(item.urn) === this.ignoreUrnRevision(urn))[0]
              const newMember = {
                id: this.generateItemId(),
                parentUrn: parentElementUrn,
                namespaceUrn: this.parentElement.namespaceUrn,
                urn,
                editable: this.parentElement.editable,
                isPreferredLanguage: Ajax.preferredLanguage.includes(member.definitions[0].language),
                designation: member.definitions[0].designation,
                type,
                expanded: previousItem ? previousItem.expanded : false,
                children: previousItem ? previousItem.children : [],
                elementStatus: member.status
              }
              newMember.warnings = this.checkWarnings(newMember)
              members.push(newMember)
            }
            this.treeItems = members
          }.bind(this))
      } else {
        await this.$axios.$get(this.ajax.elementUrl + this.parentElement.urn)
          .then(function (res) {
            let parentElementUrn
            if (res.identification.status.toUpperCase() === 'OUTDATED') {
              parentElementUrn = this.getNextUrnRevision(this.parentElement.urn)
            } else {
              parentElementUrn = this.parentElement.urn
            }
            this.$log.debug('Update treeItems ' + parentElementUrn)
            this.$axios.$get(this.ajax.elementUrl + parentElementUrn + '/members', Ajax.header.listView)
              .then(function (res1) {
                const resMembers = Array.from(res1)
                const members = []
                for (let i = 0; i < resMembers.length; i++) {
                  const member = resMembers[i]
                  const type = member.urn.split(':')[2].toUpperCase()
                  const urn = member.urn
                  const previousItem = this.treeItems.filter(item => this.ignoreUrnRevision(item.urn) === this.ignoreUrnRevision(urn))[0]
                  const newMember = {
                    id: this.generateItemId(),
                    parentUrn: parentElementUrn,
                    namespaceUrn: this.parentElement.namespaceUrn,
                    urn,
                    editable: this.parentElement.editable,
                    isPreferredLanguage: Ajax.preferredLanguage.includes(member.definitions[0].language),
                    designation: member.definitions[0].designation,
                    type,
                    expanded: previousItem ? previousItem.expanded : false,
                    children: previousItem ? previousItem.children : [],
                    elementStatus: member.status
                  }
                  newMember.warnings = this.checkWarnings(newMember)
                  members.push(newMember)
                }
                this.refreshTreeItems(members, parentElementUrn)
              }.bind(this))
          }.bind(this))
      }
    },
    createElement (parentNode, type) {
      this.dialog.parentUrn = parentNode.urn
      this.dialog.type = type
      this.dialog.namespaceUrn = parentNode.namespaceUrn
      switch (type) {
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
    activeElement (element) {
      return this.$store.getters.getActiveTreeItemUrn === element.urn
    },
    generateItemId () {
      this.$store.commit('generateItemId')
      return this.$store.getters.getItemId
    },
    async fetchNamespaces () {
      this.$log.debug('Fetching treeView namespaces..')
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
              const newNamespace = {
                id: this.generateItemId(),
                urn: namespace.identification.urn,
                namespaceUrn: namespace.identification.namespaceUrn,
                isPreferredLanguage: Ajax.preferredLanguage.includes(
                  namespace.definitions[0].language),
                editable: !res.READ.includes(namespace),
                designation: namespace.definitions[0].designation,
                type: 'NAMESPACE',
                expanded: false,
                children: [],
                elementStatus: namespace.identification.status
              }
              newNamespace.warnings = this.checkWarnings(newNamespace)
              this.treeItems.push(newNamespace)
            }
          }
        }.bind(this))
    },
    checkWarnings (element) {
      const warnings = []
      if (element.children.length > 0) {
        if (this.containsOutdatedMembers(element)) {
          warnings.push(this.$t('global.alerts.outdatedMembers'))
        }
      }
      if (element.elementStatus.toUpperCase() === 'OUTDATED') {
        warnings.push(this.$t('global.alerts.outdatedElement'))
      }
      return [...new Set(warnings)]
    },
    activateNode (node) {
      this.$log.debug('Activate Node ' + node.urn)
      if (this.$store.getters.getActiveTreeItemUrn !== node.urn) {
        this.$store.commit('changeActiveTreeItemUrn', node.urn)
        this.$root.$emit('changeActiveElement', node)
      } else {
        this.$store.commit('changeActiveTreeItemUrn', '')
      }
    },
    containsOutdatedMembers (element) {
      return element.children.some(member => member.elementStatus.toUpperCase() === 'OUTDATED')
    },
    nodeClicked (node) {
      node.expanded = !node.expanded
      node = this.fetchAndReplaceMembers(node)
    },
    fetchAndReplaceMembers (element) {
      this.$log.debug('Fetch members ' + element.urn)
      this.$axios.$get(!Common.isNamespace(element.urn)
        ? this.ajax.elementUrl + element.urn +
        '/members'
        : this.ajax.namespaceUrl + element.urn.split(':')[3] +
        '/members?hideSubElements=true', Ajax.header.listView)
        .then(function (res) {
          const members = []
          const resMembers = Array.from(res)
          for (let i = 0; i < resMembers.length; i++) {
            let urn
            let type
            const member = resMembers[i]
            if (!Common.isNamespace(element.urn)) {
              type = member.urn.split(':')[2].toUpperCase()
              urn = member.urn.toLowerCase()
            } else {
              type = member.elementType.toUpperCase()
              urn = 'urn:' + element.urn.split(':')[1] + ':' +
                member.elementType.toLowerCase() + ':' + member.identifier + ':' + member.revision
            }
            if (member.status === 'OUTDATED' && Common.isNamespace(element.urn)) {
              continue
            }
            const newMember = {
              id: this.generateItemId(),
              parentUrn: element.urn,
              namespaceUrn: element.namespaceUrn,
              urn,
              editable: element.editable,
              isPreferredLanguage: Ajax.preferredLanguage.includes(member.definitions[0].language),
              designation: member.definitions[0].designation,
              type,
              elementStatus: member.status,
              expanded: false,
              children: []
            }
            newMember.warnings = this.checkWarnings(newMember)
            members.push(newMember)
          }
          element.children = members
          element.warnings = this.checkWarnings(element)
          return element
        }.bind(this))
      return element
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

<template>
  <div>
    <div v-if="treeItems.length === 0 && depth === 0" align="middle">
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
    <div v-for="(element, index) in treeItems" :key="`${element.urn}-${index}`" class="nodes-container" :class="{ namespaceHover: depth === 0 }">
      <div
        class="node"
        :class="{ activeNode: activeElement(element) }"
      >
        <div class="node-container" :style="{'padding-left': `${depth*20}px`}">
          <div v-if="element.type !== 'DATAELEMENT'" class="node-container-child" @click="nodeClicked(element)">
            <v-icon v-if="element.expanded">
              mdi-chevron-down
            </v-icon>
            <v-icon v-else>
              mdi-chevron-right
            </v-icon>
          </div>
          <div v-else class="node-container-child" :style="{'padding-left': `${depth*20}px`}">
            <v-icon />
          </div>
          <div class="designation node-container-child" @click="activateNode(element)">
            <div>
              <div class="node-container-child">
                <v-icon
                  v-if="element.type === 'NAMESPACE'"
                  color="white"
                >
                  mdi-garage-variant
                </v-icon>
                <v-icon
                  v-else-if="element.type === 'DATAELEMENT'"
                  color="white"
                >
                  mdi-vector-arrange-below
                </v-icon>
                <v-icon
                  v-else-if="element.type === 'DATAELEMENTGROUP'"
                  color="white"
                >
                  mdi-group
                </v-icon>
                <v-icon
                  v-else-if="element.type === 'RECORD'"
                  color="white"
                >
                  mdi-group
                </v-icon>
              </div>
              <div class="node-container-child">
                {{ element.designation }}
              </div>
            </div>
          </div>
          <div class="extras-section">
            <div class="alert-icon-class">
              <AlertIcon
                v-if="element.warnings.length > 0"
                :title="$t('global.alerts.warning')"
                :alerts="element.warnings"
              />
            </div>
            <div class="create-button">
              <v-menu
                bottom
                offset-y
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-if="element.type !== 'DATAELEMENT' && element.editable && loggedIn"
                    x-small
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
                    @click="() => {createElement(element, elementType)}"
                  >
                    <v-list-item-title>
                      <v-icon>mdi-plus-box</v-icon>
                      {{ 'CREATE ' + elementType }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </div>
      </div>
      <div v-if="element.expanded && element.children.length > 0" class="tree-view-child">
        <TreeView
          :elements="element.children"
          :parent-element="element"
          :depth="depth+1"
          @updateParentWarnings="updateParentWarnings($event)"
        />
      </div>
    </div>
    <div v-if="dialog.showDataElement || dialog.showDataElementGroup || dialog.showNamespace">
      <DialogsNamespaceDialog
        v-if="dialog.type === 'NAMESPACE'"
        :id="0"
        :show="dialog.showNamespace"
        @save="updateTreeItems(); showSaveSuccessSnackbar()"
        @saveFailure="handleSaveFailure($event)"
        @dialogClosed="dialog.showNamespace = false"
      />
      <DialogsDataElementDialog
        v-if="dialog.type === 'DATAELEMENT'"
        :show="dialog.showDataElement"
        :namespace-urn="dialog.namespaceUrn"
        @save="updateTreeItems(); showSaveSuccessSnackbar()"
        @saveFailure="handleSaveFailure($event)"
        @dialogClosed="dialog.showDataElement = false"
      />
      <DialogsGroupRecordDialog
        v-if="(dialog.type === 'DATAELEMENTGROUP' || dialog.type === 'RECORD')"
        :show="dialog.showDataElementGroup"
        :namespace-urn="dialog.namespaceUrn"
        :element-type="dialog.type"
        @save="updateTreeItems(); showSaveSuccessSnackbar()"
        @saveFailure="handleSaveFailure($event)"
        @dialogClosed="dialog.showDataElementGroup = false"
      />
    </div>
  </div>
</template>

<style lang="scss">

.extras-section {
  position: absolute;
  display: inline-block;
  right: 15px;
  margin-top: 0.35rem;
  z-index: 999;
}

.alert-icon-class {
  //float: right;
  display: inline-block;
  width: 16px;
  margin-right: 5px;
  z-index: 999;
  //margin-right: 0.35rem;
  //margin-top: 0.35rem;
}

.create-button {
  //float: right;
  display: inline-block;
  width: 80px;
  //margin-right: 0.35rem;
  //margin-top: 0.35rem;
}

.designation {
  width: 70%;
  height: 100%;
  line-height: 2.2rem;
  font-family: Arial, serif;
  text-overflow: ellipsis;
  overflow: hidden;
}

.tree-view-child {
  position: relative;
}

.node-container {
  white-space: nowrap;
  margin: 0;
  position: relative;
  height: 100%;
  width: 100%;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.node-container-child {
  display: inline-block;
  margin-left: 0.3rem;
  vertical-align: middle;
}

.nodes-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.node {
  position: relative;
  background-color: transparent;
  color: black;
  font-size: 0.9rem;
  height: 2.2rem;

  &:hover {
    background: transparentize(#d1ecff, 0.8);
    border-radius: 0 1rem 1rem 0;
  }

  &:active {
    background: transparentize(#d1ecff, 0.4);
    border-radius: 0 0.3rem 0.3rem 0;
  }
}

.namespaceHover {
  &:hover {
    background: transparentize(#d1ecff, 0.85);
    border-radius: 0 1rem 1rem 0;
    border-left: 3px solid transparentize(#d1ecff, 0.2) !important;
  }
}

.activeNode {
  background: transparentize(#d1ecff, 0.4);
  border-radius: 0 1rem 1rem 0;
}

</style>
