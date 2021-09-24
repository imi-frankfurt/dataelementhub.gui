<template>
  <v-treeview
    :active.sync="activeElements"
    :items="treeItems"
    :load-children="fetchMembers"
    activatable
    color="warning"
    rounded
    hoverable
    transition
    @input="$emit('input', $event)"
    @update:active="$emit('update:active', $event)"
    @update:open="$emit('update:open', $event)"
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
  </v-treeview>
</template>
<script>
import Ajax from '~/config/ajax'
export default {
  data () {
    return {
      ajax: {
        namespaceUrl: process.env.mdrBackendUrl + '/v1/namespaces/',
        elementUrl: process.env.mdrBackendUrl + '/v1/element/'
      },
      treeItems: [],
      activeElements: [],
      selectedElement: undefined,
      valueDomainIsFetching: true
    }
  },
  computed: {
    selected () {
      if (this.activeElements.length) {
        return undefined
      } else {
        this.$emit('selected', this.selectedElement)
        return this.selectedElement
      }
    }
  },
  watch: {
    activeElements () {
      if (typeof this.activeElements[0] !== 'undefined') {
        this.fetchElement(this.activeElements[0])
      }
    }
  },
  created () {
    this.fetchNamespaces()
  },
  methods: {
    async fetchNamespaces () {
      await this.$axios.$get(this.ajax.namespaceUrl)
        .then(function (res) {
          for (const namespace of Array.from(res.ADMIN.concat(res.READ, res.WRITE))) {
            this.treeItems.push({
              id: namespace.identification.identifier,
              name: namespace.definition.designation,
              elementType: 'NAMESPACE',
              children: []
            })
          }
        }.bind(this))
    },
    async fetchMembers (element) {
      await this.$axios.$get(!this.isNamespace(element.id)
        ? this.ajax.elementUrl + element.id +
        '/members'
        : this.ajax.namespaceUrl + element.id +
        '/members', Ajax.header.listView)
        .then(function (res) {
          const members = []
          for (const member of Array.from(res)) {
            let id
            let elementType
            if (!this.isNamespace(element.id)) {
              elementType = member.urn.split(':')[2].toUpperCase()
              id = member.urn
            } else {
              elementType = member.elementType.toUpperCase()
              id = 'urn:' + element.id + ':' +
                member.elementType + ':' + member.identifier + ':' + member.revision
            }
            members.push({
              id,
              name: member.definition.designation,
              elementType,
              children: elementType === 'DATAELEMENT' ? undefined : []
            })
          }
          members.length > 0 ? element.children = members : element.children = undefined
          return members
        }.bind(this))
    },
    async fetchElement (urn) {
      await this.$axios.$get(!this.isNamespace(urn)
        ? this.ajax.elementUrl + urn
        : this.ajax.namespaceUrl + urn, Ajax.header.ignoreLanguage)
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
      return !/[a-zA-Z]/.test(id)
    }
  }
}
</script>
