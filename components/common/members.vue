<template>
  <v-row
    class="pa-4"
  >
    <v-col cols="5" class="elevation-1 pa-3 ma-2">
      <v-row>
        <v-col>
          <v-text-field
            v-model="search.query"
            :counter="255"
            :label="$t('global.searchText')"
            @input="executeSearch()"
          />
        </v-col>
      </v-row>
      <v-list
        max-height="300px"
        class="overflow-y-auto"
      >
        <draggable v-model="membersToChooseFrom" :options="{group:'people'}" min-height="100px">
          <template v-for="item in membersToChooseFrom">
            <v-list :key="item.id">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>{{ item.designation }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.definition }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </template>
        </draggable>
      </v-list>
    </v-col>
    <v-col cols="5" class="elevation-1 pa-3 ma-2">
      <v-subheader>
        Selected Members:
      </v-subheader>
      <v-list
        max-height="300px"
        class="overflow-y-auto"
      >
        <draggable v-model="selectedMembers" :options="{group:'people'}">
          <template v-for="item in selectedMembers">
            <v-list :key="item.id" min-height="50px">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>{{ item.designation }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.definition }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </template>
          <div v-if="selectedMembers.length === 0" align="middle">
            <v-icon size="70">
              mdi-hand-pointing-up
            </v-icon>
            <h3 class="text-h2 mb-2">
              ADD ITEM
            </h3>
            <h3 class="text-h6 mb-2">
              simply drag and drop
            </h3>
          </div>
        </draggable>
      </v-list>
    </v-col>
  </v-row>
</template>
<script>
import draggable from 'vuedraggable'
import Ajax from '~/config/ajax'
export default {
  components: {
    draggable
  },
  props: {
    namespaceUrn: { required: true, type: String },
    elementUrn: { required: false, default: '', type: String }
  },
  data () {
    return {
      search: {
        query: '',
        type: [],
        status: [],
        section: [],
        filteredMembers: []
      },
      ajax: {
        namespaceUrl: process.env.mdrBackendUrl + '/v1/namespaces/',
        elementUrl: process.env.mdrBackendUrl + '/v1/element/'
      },
      namespaceMembers: [],
      selectedMembers: [],
      membersToChooseFrom: []
    }
  },
  computed: {
    excludeSelectedMembers () {
      return this.namespaceMembers.filter(n => !this.selectedMembers.includes(n))
    }
  },
  watch: {
    $props: {
      handler () {
        this.fetchNamespaceMembers(this.namespaceUrn)
        if (this.elementUrn !== '') { // load group/record members only in edit mode
          this.fetchElementMembers(this.elementUrn)
        }
      },
      deep: true,
      immediate: true
    },
    'search.query': {
      handler () {
        if (this.search.query) {
          this.membersToChooseFrom = this.search.filteredMembers
        } else {
          this.membersToChooseFrom = this.excludeSelectedMembers
        }
      },
      deep: true,
      immediate: true
    },
    namespaceMembers () {
      if (this.search.query) {
        this.membersToChooseFrom = this.search.filteredMembers
      } else {
        this.membersToChooseFrom = this.excludeSelectedMembers
      }
    },
    selectedMembers () {
      this.$emit('selectedMembers', this.selectedMembers)
    }
  },
  methods: {
    async fetchNamespaceMembers (namespaceUrn) {
      const namespaceIdentifier = namespaceUrn.split(':')[1]
      await this.$axios.$get(this.ajax.namespaceUrl + namespaceIdentifier +
        '/members', Ajax.header.listView)
        .then(function (res) {
          const members = []
          for (const member of Array.from(res)) {
            const id = 'urn:' + namespaceIdentifier + ':' +
            member.elementType + ':' + member.identifier + ':' + member.revision
            members.push({
              id,
              elementType: member.elementType,
              designation: member.definition.designation,
              definition: member.definition.definition,
              status: member.status
            })
          }
          this.namespaceMembers = members
        }.bind(this))
    },
    async fetchElementMembers (elementUrn) {
      await this.$axios.$get(this.ajax.elementUrl + elementUrn +
        '/members', Ajax.header.listView)
        .then(function (res) {
          const members = []
          for (const member of Array.from(res)) {
            const elementType = member.urn.split(':')[2]
            members.push({
              id: member.urn,
              elementType,
              designation: member.definition.designation,
              definition: member.definition.definition
            })
          }
          this.selectedMembers = members
        }.bind(this))
    },
    executeSearch () {
      this.search.filteredMembers = this.namespaceMembers.filter(elem =>
        elem.designation.includes(this.search.query) || elem.definition.includes(this.search.query))
    }
  }
}
</script>
