<template>
  <div>
    <v-snackbar
      v-model="defaultView.snackbar.success"
      :timeout="defaultView.snackbar.timeout"
      :top="true"
      :right="true"
      color="success"
    >
      {{ $t('pages.namespaces.messages.namespaceCreated') }}
    </v-snackbar>
    <h1>
      {{ $t('pages.namespaces.title') }}
    </h1>
    <h2 v-if="$t('pages.namespaces.subtitle')">
      {{ $t('pages.namespaces.subtitle') }}
    </h2>
    <v-row>
      <v-col cols="12">
        <v-btn
          color="primary"
          rounded
          @click="newNamespace"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
          {{ $t('pages.namespaces.actions.createNamespace') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h3>{{ $t('pages.namespaces.grantedNamespacesAdminSubtitle') }}</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="defaultView.table.header"
          :items="global.grantedNamespaces.admin"
          :items-per-page="10"
          :loading="defaultView.table.loading.admin"
          :loading-text="$t('global.table.loading')"
          sort-by="id"
          class="elevation-1"
        >
          <template #[`item.actions`]="{ item }">
            <template v-if="item.status != 'OUTDATED'">
              <v-btn
                x-small
                icon
                elevation="2"
                @click="editNamespace(item)"
              >
                <v-icon>
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-btn
                x-small
                icon
                elevation="2"
                @click="deleteNamespace(item)"
              >
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </template>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h3>{{ $t('pages.namespaces.grantedNamespacesWriteSubtitle') }}</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="defaultView.table.header"
          :items="global.grantedNamespaces.write"
          :items-per-page="5"
          :loading="defaultView.table.loading.write"
          :loading-text="$t('global.table.loading')"
          sort-by="id"
          class="elevation-1"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h3>{{ $t('pages.namespaces.grantedNamespacesReadSubtitle') }}</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="defaultView.table.header"
          :items="global.grantedNamespaces.read"
          :items-per-page="5"
          :loading="defaultView.table.loading.read"
          :loading-text="$t('global.table.loading')"
          sort-by="id"
          class="elevation-1"
        />
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-dialog
        v-model="dialog.namespaceDialog"
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
              @click="dialog.namespaceDialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ dialogTitle }}</v-toolbar-title>
            <v-spacer />
            <v-toolbar-items>
              <v-btn
                dark
                text
                @click="saveNamespace"
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
            v-model="dialog.namespaceForm.valid"
            :lazy-validation="dialog.namespaceForm.lazy"
          >
            <v-list subheader>
              <v-subheader>{{ $t('global.properties') }}</v-subheader>
              <v-list-item>
                <v-list-item-action>
                  <v-checkbox v-model="global.currentNamespace.identification.hideNamespace" :label="$t('pages.namespaces.itemDialog.form.publicNamepace')" />
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-action>
                  <v-radio-group v-model="global.currentNamespace.identification.status">
                    <v-radio
                      v-for="radioItem in dialog.selectNamespaceTypes"
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
              <v-list-item v-for="(itemDefinition, index) in global.currentNamespace.definitions" :key="index">
                <v-row>
                  <v-col cols="11">
                    <item-definition
                      :designation="itemDefinition.designation"
                      :definition="itemDefinition.definition"
                      :language="itemDefinition.language"
                      @designation="itemDefinition.designation = $event"
                      @definition="itemDefinition.definition = $event"
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
              <v-list-item v-for="(itemSlot, index) in global.currentNamespace.slots" :key="index">
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
          </v-form>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import ItemDefinition from '~/components/item/item-definition'
import ItemSlot from '~/components/item/item-slot'
import Ajax from '~/config/ajax'
import Namespace from '~/assets/js/namespace'
export default {
  components: {
    ItemDefinition,
    ItemSlot
  },
  data () {
    return {
      ajax: {
        namespaceUrl: process.env.mdrBackendUrl + '/namespaces/'
      },
      global: {
        currentNamespace: undefined,
        grantedNamespaces: {
          read: undefined,
          write: undefined,
          admin: undefined
        },
        namespaceTypes: {
          draft: 'DRAFT',
          released: 'RELEASED',
          outdated: 'OUTDATED',
          staged: 'STAGED'
        }
      },
      defaultView: {
        snackbar: {
          success: false,
          timeout: process.env.snackbarTimeout
        },
        table: {
          loading: {
            read: true,
            write: true,
            admin: true
          },
          showOutdatedNamespaces: {
            read: false,
            write: false,
            admin: false
          },
          header: [
            {
              text: this.$i18n.t('global.table.header.id'),
              align: 'start',
              sortable: true,
              value: 'identifier'
            },
            {
              text: this.$i18n.t('pages.namespaces.table.header.designation'),
              sortable: true,
              value: 'definition.designation'
            },
            {
              text: this.$i18n.t('pages.namespaces.table.header.revision'),
              sortable: true,
              value: 'revision'
            },
            {
              text: this.$i18n.t('pages.namespaces.table.header.status'),
              sortable: true,
              value: 'status'
            },
            {
              text: this.$i18n.t('global.table.header.actions'),
              value: 'actions',
              sortable: false
            }
          ]
        }
      },
      dialog: {
        namespaceDialog: false,
        editIndex: -1,
        selectNamespaceTypes: ['DRAFT', 'RELEASED'],
        namespaceForm: {
          valid: true,
          lazy: false
        }
      }
    }
  },
  computed: {
    // Computes the dialog title depending on the action taken.
    dialogTitle () {
      return this.dialog.editIndex === -1
        ? this.$i18n.t('pages.namespaces.itemDialog.title.create')
        : this.$i18n.t('pages.namespaces.itemDialog.title.update')
    },
    disableRemoveDefinitionAction () {
      return this.global.currentNamespace.definitions.length === 1
    }
  },
  // When Component is created we fetch all users namespaces and set an empty namespace.
  created () {
    this.fetchAdminNamespaces()
    this.fetchWriteableNamespaces()
    this.fetchReadableNamespaces()
    this.clearCurrentNamespace()
  },
  methods: {
    // Fetches all namespaces.
    async fetchAdminNamespaces () {
      this.defaultView.table.loading.admin = true
      await this.$axios.$get(this.ajax.namespaceUrl + '?scope=ADMIN', Ajax.header.listView)
        .then(function (res) {
          this.global.grantedNamespaces.admin = res.ADMIN
          this.defaultView.table.loading.admin = false
        }.bind(this))
    },
    async fetchWriteableNamespaces () {
      this.defaultView.table.loading.write = true
      await this.$axios.$get(this.ajax.namespaceUrl + '?scope=WRITE')
        .then(function (res) {
          this.global.grantedNamespaces.write = res.WRITE
          this.defaultView.table.loading.write = false
        }.bind(this))
    },
    async fetchReadableNamespaces () {
      this.defaultView.table.loading.read = true
      await this.$axios.$get(this.ajax.namespaceUrl + '?scope=READ')
        .then(function (res) {
          this.global.grantedNamespaces.read = res.READ
          this.defaultView.table.loading.read = false
        }.bind(this))
    },
    // Clears the data namespace.
    clearCurrentNamespace () {
      this.$delete(this.global, 'currentNamespace')
      this.$set(this.global, 'currentNamespace', Namespace.defaultNamespace())
    },
    // Create a namespace.
    newNamespace () {
      this.dialog.editIndex = -1
      this.clearCurrentNamespace()
      this.addDefinition()
      this.dialog.namespaceDialog = true
    },
    // Edit a namespace.
    async editNamespace (namespace) {
      this.dialog.editIndex = this.global.grantedNamespaces.admin.indexOf(namespace)
      await this.$axios.$get(this.ajax.namespaceUrl + namespace.identifier, Ajax.header.updateItem)
        .then(function (res) {
          this.global.currentNamespace = Object.assign({}, res)
          this.dialog.namespaceDialog = true
        }.bind(this))
    },
    // Delete a namespace.
    async deleteNamespace (namespace) {
      if (confirm(this.$i18n.t('global.itemDialog.deleteItemTitle').toString())) {
        await this.$axios.$delete(this.ajax.namespaceUrl + namespace.identifier)
          .then(function (res) {
            if (namespace.status === this.global.namespaceTypes.released) {
              namespace.status = this.global.namespaceTypes.outdated
            } else {
              this.global.grantedNamespaces.admin.splice(
                this.global.grantedNamespaces.admin.indexOf(namespace), 1)
            }
          }.bind(this))
      }
    },
    // Save a namespace.
    async saveNamespace () {
      this.$refs.form.validate()
      if (this.dialog.namespaceForm.valid) {
        // If this item has been edited we send a PUT request otherwise POST.
        this.$log.debug(this.dialog.editIndex)
        if (this.dialog.editIndex >= 0) {
          await this.$axios.put(this.ajax.namespaceUrl + this.global.currentNamespace.identification.identifier,
            this.global.currentNamespace)
            .then(function (res) {
              Object.assign(this.global.grantedNamespaces.admin[this.dialog.editIndex], Namespace.castToListViewItem(
                this.global.currentNamespace))
              this.dialog.namespaceDialog = false
              this.defaultView.snackbar.success = true
            }.bind(this))
        } else {
          await this.$axios.post(this.ajax.namespaceUrl, this.global.currentNamespace)
            .then(function (res) {
              this.dialog.namespaceDialog = false
              this.defaultView.snackbar.success = true
              this.$axios.$get(res.headers.location)
                .then(function (newRes) {
                  this.global.grantedNamespaces.admin.push(Namespace.castToListViewItem(newRes))
                }.bind(this))
            }.bind(this))
        }
      }
    },
    // Add Definition to data array.
    addDefinition () {
      if (this.global.currentNamespace.definitions === undefined) {
        this.global.currentNamespace.definitions = []
      }
      this.global.currentNamespace.definitions.push(ItemDefinition.data().defaultDefinition)
    },
    // Delete Definition from data array.
    deleteDefinition (index) {
      this.global.currentNamespace.definitions.splice(index, 1)
    },
    // Add Slot to data array.
    addSlot () {
      if (this.global.currentNamespace.slots === null) {
        this.global.currentNamespace.slots = []
      }
      this.global.currentNamespace.slots.push({ name: '', value: '' })
    },
    // Delete Slot from data array.
    deleteSlot (index) {
      this.global.currentNamespace.slots.splice(index, 1)
    }
  }
}
</script>
