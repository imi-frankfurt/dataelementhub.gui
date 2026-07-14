<script>
import Ajax from '~/config/ajax'
import Common from '~/assets/js/common'
import DataElementDetailView from '~/components/views/data-element-detail-view'
import GroupsRecordsDetailView from '~/components/views/groups-records-detail-view'
import NamespaceDetailView from '~/components/views/namespace-detail-view'

export default {
  components: { NamespaceDetailView, GroupsRecordsDetailView, DataElementDetailView },
  data: () => ({
    ajax: {
      namespaceUrl: process.env.mdrBackendUrl + '/v1/namespaces/',
      exportUrl: process.env.mdrBackendUrl + '/v1/export',
      elementUrl: process.env.mdrBackendUrl + '/v1/element/'
    },
    detailViewCard: {
      urn: null,
      elementType: null
    },
    itemId: 0,
    selection: [],
    selectedElement: null,
    activeElements: [],
    treeItems: [],
    namespaceMembersFilters: {
      status: [],
      elementType: []
    },
    startExportBody: {
      label: null,
      elementUrns: []
    },
    dialog: true,
    fullExport: false,
    detailViewElement: null,
    searchNamespaceMembers: null,
    namespaceUrn: null,
    allNamespaceMembers: [],
    importFile: null,
    allAvailableNamespaces: [],
    exportFormat: 'JSON'
  }),
  computed: {
    fullExportInfo () {
      if (this.fullExport) {
        return this.$t('dialogs.startExportDialog.fullExportDescription')
      }
      return null
    },
    filteredNamespaceMembers () {
      const allowedStatus = this.namespaceMembersFilters.status.reduce((statusNames, statusObject) => {
        if (statusObject.applied) {
          statusNames.push(statusObject.name)
        }
        return statusNames
      }, [])
      const allowedElementTypes = this.namespaceMembersFilters.elementType.reduce((typeNames, typeObject) => {
        if (typeObject.applied) {
          typeNames.push(typeObject.name)
        }
        return typeNames
      }, [])
      return this.allNamespaceMembers.filter((member) => {
        return allowedStatus.includes(member.status) &&
          allowedElementTypes.includes(member.elementType) &&
          (member.designation.toLowerCase().includes(this.searchNamespaceMembers.toLowerCase()) ||
            member.urn.toLowerCase().includes(this.searchNamespaceMembers.toLowerCase()))
      })
    },
    selectNamespaceRules () {
      return [
        v => (v !== null && v.toUpperCase().includes('NAMESPACE')) ||
          this.$t('global.form.validation.messages.namespaceIsRequired')
      ]
    }
  },
  watch: {
    activeElements () {
      if (typeof this.activeElements[0] !== 'undefined') {
        this.fetchElement(this.activeElements.slice(-1)[0].urn,
          this.activeElements.slice(-1)[0].parentUrn)
      }
    },
    namespaceUrn: {
      handler () {
        const namespace = this.allAvailableNamespaces.find(namespace => namespace.identification.urn === this.namespaceUrn)
        if (!namespace) { return }
        this.treeItems = [{
          id: this.generateItemId(),
          parentUrn: null,
          status: namespace.identification.status,
          urn: namespace.identification.urn,
          editable: false,
          isPreferredLanguage: Ajax.preferredLanguage.includes(namespace.definitions[0].language),
          name: namespace.definitions[0].designation,
          elementType: namespace.identification.elementType,
          children: []
        }]
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    this.fetchNamespaces()
  },
  methods: {
    handleDesignationClicked (allActiveElements) {
      if (!allActiveElements || allActiveElements.length < 1) {
        this.detailViewCard.urn = null
        return
      }
      const lastActivatedElement = allActiveElements[0]
      this.detailViewCard.elementType = lastActivatedElement.elementType
      this.detailViewCard.urn = lastActivatedElement.urn
    },
    getPrependIcon (elementType) {
      if (elementType === 'NAMESPACE') {
        return 'mdi-garage-variant'
      } else if (elementType === 'DATAELEMENTGROUP' || elementType === 'RECORD') {
        return 'mdi-group'
      } else {
        return 'mdi-vector-arrange-below'
      }
    },
    generateItemId () {
      this.itemId = this.itemId + 1
      return this.itemId
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
              status: member.status,
              editable: false,
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
    async fetchElement (urn, parentUrn) {
      await this.$axios.$get(!this.isNamespace(urn)
        ? this.ajax.elementUrl + urn
        : this.ajax.namespaceUrl + urn.split(':')[1])
        .then(function (res) {
          if
          (!['ENUMERATED_VALUE_DOMAIN', 'DESCRIBED_VALUE_DOMAIN']
            .includes(res.identification.elementType)) {
            res.editable = false
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
    closeDialog () {
      this.dialog = false
      this.$emit('dialogClosed')
    },
    getStatusColor (status) {
      return Common.getStatusColor(status)
    },
    async fetchNamespaceMembers (namespaceUrn) {
      const namespaceIdentifier = namespaceUrn.split(':')[1]
      await this.$axios.$get(this.ajax.namespaceUrl + namespaceIdentifier +
        '/members', Ajax.header.listView)
        .then(function (res) {
          const members = []
          for (const member of Array.from(res)) {
            const urn = 'urn:' + namespaceIdentifier + ':' +
              member.elementType + ':' + member.identifier + ':' + member.revision
            members.push({
              urn,
              selected: false,
              elementType: member.elementType,
              designation: member.definitions[0].designation,
              definition: member.definitions[0].definition,
              status: member.status
            })
          }
          this.allNamespaceMembers = members
        }.bind(this))
    },
    async fetchNamespaces () {
      this.$log.debug('Fetching Namespaces')
      await this.$axios.$get(this.ajax.namespaceUrl)
        .then(function (res) {
          this.allAvailableNamespaces = res.ADMIN
          this.allAvailableNamespaces.concat(res.WRITE)
          this.allAvailableNamespaces = this.allAvailableNamespaces.filter(namespace => namespace.identification.status !== 'OUTDATED')
        }.bind(this))
    },
    async startExport () {
      const elementUrns = this.selection.map(element => element.urn)
      this.startExportBody.elementUrns = elementUrns
      await this.$axios.$post(this.ajax.exportUrl + '?format=' + this.exportFormat + '&fullExport=' + this.fullExport, this.startExportBody)
        .then(function (res) {
          this.closeDialog()
        }.bind(this))
    }
  }
}
</script>

<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="1200px"
  >
    <v-card>
      <v-system-bar
        color="header"
        dark
        height="50px"
      >
        <v-card-title class="white--text">
          <span class="text-h5">{{ $t('dialogs.startExportDialog.newExport') }}</span>
        </v-card-title>
      </v-system-bar>
      <v-card-text>
        <v-container>
          <v-row v-if="detailViewElement === null">
            <v-col cols="8">
              <v-text-field
                v-model="startExportBody.label"
                :label="$t('dialogs.startExportDialog.exportLabel') + '*'"
                required
              />
            </v-col>
            <v-col cols="3">
              <v-switch
                v-model="fullExport"
                :label="$t('dialogs.startExportDialog.fullExport')"
                :hint="fullExportInfo"
                persistent-hint
                color="primary"
              />
            </v-col>
            <v-col cols="8">
              <v-select
                v-model="namespaceUrn"
                :items="allAvailableNamespaces"
                :rules="selectNamespaceRules"
                item-value="identification.urn"
                item-text="definitions[0].designation"
                :hint="namespaceUrn"
                persistent-hint
                :label="$t('global.select.namespace')"
              />
            </v-col>
            <v-col cols="4">
              <v-radio-group v-model="exportFormat" row>
                <template #label>
                  <div>{{ $t('dialogs.startExportDialog.exportFormat') + ':' }}</div>
                </template>
                <v-radio value="JSON" color="primary">
                  <template #label>
                    <div>{{ $t('dialogs.startExportDialog.json') }}</div>
                  </template>
                </v-radio>
                <v-radio value="XML" color="primary">
                  <template #label>
                    <div>{{ $t('dialogs.startExportDialog.xml') }}</div>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-col>
            <v-col v-if="namespaceUrn !== null" cols="12">
              <v-container fluid>
                <v-row
                  class="bottom-row flex-grow-1 flex-shrink-1 align-stretch"
                  style="height: 400px;"
                >
                  <v-col class="auto-scroll tree-view-col pa-2">
                    <v-treeview
                      v-model="selection"
                      :items="treeItems"
                      :load-children="fetchAndReplaceMembers"
                      selection-type="includeParents"
                      selectable
                      activatable
                      return-object
                      color="primary"
                      rounded
                      hoverable
                      transition
                      @update:active="handleDesignationClicked"
                    >
                      <template #prepend="{ item }">
                        <v-icon
                          small
                          color="primary"
                        >
                          {{ getPrependIcon(item.elementType) }}
                        </v-icon>
                      </template>
                      <template #label="{ item }">
                        <a>
                          {{ item.name }}
                        </a>
                      </template>
                      <template #append="{ item }">
                        <v-chip
                          x-small
                          :color="getStatusColor(item.status)"
                          dark
                        >
                          <v-span>
                            {{ item.status }}
                          </v-span>
                        </v-chip>
                      </template>
                    </v-treeview>
                  </v-col>
                  <v-divider vertical />
                  <v-col class="auto-scroll tree-view-col pa-2">
                    <v-card v-if="detailViewCard.urn !== null">
                      <DataElementDetailView
                        v-if="detailViewCard.elementType === 'DATAELEMENT'"
                        :urn="detailViewCard.urn"
                        :hide-path="true"
                      />
                      <GroupsRecordsDetailView
                        v-if="detailViewCard.elementType === 'DATAELEMENTGROUP'
                          || detailViewCard.elementType === 'RECORD'"
                        :urn="detailViewCard.urn"
                        :hide-path="true"
                      />
                      <NamespaceDetailView
                        v-if="detailViewCard.elementType === 'NAMESPACE'"
                        :urn="detailViewCard.urn"
                      />
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <small>*indicates required field</small>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="closeDialog()"
        >
          Close
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          :disabled="detailViewElement !== null"
          @click="startExport()"
        >
          START EXPORT
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">

.disable-events {
  pointer-events: none;
}

.v-list {
  height: 250px;
  overflow-y: auto;
}

.fill-parent-height {
  height: 100%;
}

.tree-view-col {
  height: 100%;
}

.detail-view-col {
  height: 100%;
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
