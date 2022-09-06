<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="hideDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ dialogTitle }}</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="saveElement"
            >
              <v-icon>
                mdi-content-save
              </v-icon>
              {{ $t('global.button.save') }}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-form
          ref="form"
          v-model="form.valid"
          :lazy-validation="form.lazy"
        >
          <v-list class="mt-2">
            <v-list-item>
              <v-list-item-action>
                <v-select
                  v-model="element.identification.namespaceUrn"
                  :items="namespaces"
                  :rules="selectNamespaceRules"
                  item-value="identification.urn"
                  item-text="definitions[0].designation"
                  :label="$t('global.select.namespace')"
                />
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-list subheader>
            <v-list-item>
              <v-list-item-action>
                <v-radio-group v-model="element.identification.status">
                  <v-radio
                    v-for="radioItem in statuses"
                    :key="radioItem"
                    :label="radioItem"
                    :value="radioItem"
                  />
                </v-radio-group>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-list subheader>
            <v-subheader>{{ $t('global.definitions') }}</v-subheader>
            <v-list-item>
              <v-list-item-action>
                <v-btn
                  color="primary"
                  rounded
                  small
                  @click="addDefinition"
                >
                  <v-icon dark>
                    mdi-plus
                  </v-icon>
                  {{ $t('global.button.add') }}
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-list-item v-for="(itemDefinition, index) in element.definitions" :key="index">
              <v-row>
                <v-col cols="11">
                  <item-definition
                    :definition="itemDefinition.definition"
                    :designation="itemDefinition.designation"
                    :language="itemDefinition.language"
                    @definition="itemDefinition.definition = $event"
                    @designation="itemDefinition.designation = $event"
                    @language="itemDefinition.language = $event"
                  />
                </v-col>
                <v-col cols="1">
                  <v-list-item>
                    <v-list-item-action>
                      <v-btn
                        color="secondary"
                        rounded
                        small
                        :disabled="disableRemoveDefinitionAction"
                        @click="deleteDefinition(index)"
                      >
                        <v-icon dark>
                          mdi-delete
                        </v-icon>
                        {{ $t('global.button.delete') }}
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
          <v-list subheader>
            <v-subheader>{{ $t('global.slots') }}</v-subheader>
            <v-list-item>
              <v-list-item-action>
                <v-btn
                  color="primary"
                  rounded
                  small
                  @click="addSlot"
                >
                  <v-icon dark>
                    mdi-plus
                  </v-icon>
                  {{ $t('global.button.add') }}
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-list-item v-for="(itemSlot, index) in element.slots" :key="index">
              <v-row>
                <v-col cols="11">
                  <item-slot
                    :name="itemSlot.name"
                    :value="itemSlot.value"
                    @name="itemSlot.name = $event"
                    @value="itemSlot.value = $event"
                  />
                </v-col>
                <v-col cols="1">
                  <v-list-item>
                    <v-list-item-action>
                      <v-btn
                        color="secondary"
                        rounded
                        small
                        @click="deleteSlot(index)"
                      >
                        <v-icon dark>
                          mdi-delete
                        </v-icon>
                        {{ $t('global.button.delete') }}
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
          <v-list subheader>
            <v-subheader>{{ $t('global.members') }}</v-subheader>
            <v-list-item>
              <v-list-item-content
                v-if="element.identification.status === 'RELEASED'
                  && element.identification.elementType.toUpperCase().includes('RECORD')"
              >
                <members-table :members="element.members" />
              </v-list-item-content>
              <Members
                v-else
                :namespace-urn="namespaceUrn"
                :element-urn="urn"
                @selectedMembers="selectedMembers = $event; element.members =
                  convertMembersFormat($event)"
              />
            </v-list-item>
            <CheckUnreleasedMembers
              v-if="unreleasedMembersDialog.show"
              class="unreleasedMembersDialog"
              :show="unreleasedMembersDialog.show"
              :members="selectedMembers"
              @released="markAsReleased($event)"
              @closeUnreleasedMembersDialog="unreleasedMembersDialog.show = false"
            />
          </v-list>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import Ajax from '~/config/ajax'
import Common from '~/assets/js/common'
import ItemDefinition from '~/components/item/item-definition'
import ItemSlot from '~/components/item/item-slot'
import Members from '~/components/common/members'
import CheckUnreleasedMembers from '~/components/dialogs/check-unreleased-members'
import MembersTable from '~/components/tables/members-table'
export default {
  components: {
    CheckUnreleasedMembers,
    ItemDefinition,
    MembersTable,
    ItemSlot,
    Members
  },
  props: {
    urn: { required: false, default: '', type: String }, // If URN is empty we assume that we want to create a new
    namespaceUrn: { required: false, default: '', type: String },
    elementType: { required: true, type: String },
    show: { required: true, type: Boolean }
  },
  data () {
    return {
      ajax: {
        elementUrl: process.env.mdrBackendUrl + '/v1/element/',
        namespaceUrl: process.env.mdrBackendUrl + '/v1/namespaces/'
      },
      dialog: false,
      element: Object.assign({}, this.defaultElement()),
      form: {
        valid: true,
        lazy: false
      },
      statuses: Common.elementStatuses(),
      namespaces: [],
      selectedMembers: [],
      unreleasedMembersDialog: {
        unreleasedMembers: [],
        show: false
      }
    }
  },
  computed: {
    dialogTitle () {
      if (this.urn === '') {
        if (this.elementType.toUpperCase() === 'RECORD') {
          return this.$i18n.t('pages.records.itemDialog.title.create')
        } else {
          return this.$i18n.t('pages.groups.itemDialog.title.create')
        }
      } else if (this.elementType.toUpperCase() === 'RECORD') {
        return this.$i18n.t('pages.records.itemDialog.title.update')
      } else {
        return this.$i18n.t('pages.groups.itemDialog.title.update')
      }
    },
    disableRemoveDefinitionAction () {
      return this.element.definitions.length === 1
    },
    selectNamespaceRules () {
      return [
        v => v.toUpperCase().includes('NAMESPACE') ||
          this.$t('global.form.validation.messages.namespaceIsRequired')
      ]
    }
  },
  watch: {
    namespaceUrn: {
      handler () {
        this.element.identification.namespaceUrn = this.namespaceUrn
      },
      immediate: true
    },
    show: {
      handler () {
        this.dialog = this.show
        if (this.dialog && this.urn !== '') {
          this.loadElement(this.urn)
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.$log.debug('Dialog mounted ...')
    this.fetchNamespaces()
    this.dialog = this.show
  },
  methods: {
    convertMembersFormat () {
      return this.selectedMembers.map(n => ({
        elementUrn: n.id,
        status: n.status
      }))
    },
    containsNoDraftMembers () {
      const members = this.element.members.filter(elem => elem.status.includes('DRAFT'))
      if (members.length > 0 && this.element.identification.status === 'RELEASED') {
        this.unreleasedMembersDialog.unreleasedMembers = members
        this.unreleasedMembersDialog.show = true
        return false
      }
      return true
    },
    markAsReleased (urn) {
      this.element.members.find(elem => elem.elementUrn.toUpperCase().includes(urn)).status = 'RELEASED'
      if (this.containsNoDraftMembers()) {
        this.unreleasedMembersDialog.show = false
      }
    },
    defaultElement () {
      return this.elementType === 'RECORD'
        ? Common.defaultRecord()
        : Common.defaultGroup()
    },
    hideDialog () {
      this.clearForm()
      this.dialog = false
      this.$emit('dialogClosed')
    },
    async fetchNamespaces () {
      this.$log.debug('Fetching Namespaces')
      await this.$axios.$get(this.ajax.namespaceUrl)
        .then(function (res) {
          this.namespaces = res.ADMIN
          this.namespaces.concat(res.WRITE)
        }.bind(this))
    },
    async loadElement (urn) {
      this.$log.debug('Loading Element with URN ' + urn)
      await this.$axios.$get(this.ajax.elementUrl + this.urn, Ajax.header.ignoreLanguage)
        .then(function (res) {
          this.element = Object.assign({}, res)
        }.bind(this))
        .catch(function (err) {
          this.$log.error('Unable to fetch Element details: ' + err)
        }.bind(this))
    },
    async saveElement () {
      this.$refs.form.validate()
      if (this.form.valid && this.containsNoDraftMembers()) {
        this.$log.debug('Saving Element ...')
        if (this.urn === '') { // If the Element URN is empty we have to save it ...
          await this.$axios.post(this.ajax.elementUrl,
            this.element)
            .then(function (res) {
              this.$axios.$get(res.headers.location)
                .then(function (res1) {
                  this.element.identification.urn = res1.identification.urn
                  this.element.parentUrn = ''
                  this.element.action = 'CREATE'
                  this.$root.$emit('updateTreeView', this.element)
                  this.$emit('saveSuccess', this.element)
                  this.hideDialog()
                }.bind(this))
            }.bind(this))
            .catch(function (err) {
              this.$log.debug('Could not save Element: ' + err)
              this.$emit('saveFailure', err.response)
            }.bind(this))
        } else { // ... otherwise we update it.
          await this.$axios.put(this.ajax.elementUrl + this.element.identification.urn,
            this.element)
            .then(function (res) {
              this.$axios.$get(res.headers.location)
                .then(function (res1) {
                  this.element.identification.urn = res1.identification.urn
                  this.element.previousUrn = this.urn
                  this.element.action = 'UPDATE'
                  this.$root.$emit('updateTreeView', this.element)
                  this.$emit('saveSuccess', this.element)
                  this.hideDialog()
                }.bind(this))
            }.bind(this))
            .catch(function (err) {
              this.$log.debug('Could not save Element: ' + err)
              this.$emit('saveFailure', err.response)
            }.bind(this))
        }
      }
    },
    addDefinition () {
      this.element.definitions.push(ItemDefinition.data().defaultDefinition)
    },
    deleteDefinition (index) {
      this.element.definitions.splice(index, 1)
    },
    addSlot () {
      this.element.slots.push({ name: '', value: '', language: 'en' })
    },
    deleteSlot (index) {
      this.element.slots.splice(index, 1)
    },
    clearForm () {
      this.element.definitions = [
        ItemDefinition.data().defaultDefinition
      ]
      this.element.slots = []
      this.element.members = []
    }
  }
}
</script>

<style>
.unreleasedMembersDialog {
  max-width: 40%;
}
</style>
