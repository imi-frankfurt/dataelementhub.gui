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
          v-model="form.valid"
          :lazy-validation="form.lazy"
        >
          <v-list subheader>
            <v-subheader>{{ $t('global.properties') }}</v-subheader>
            <v-list-item>
              <v-list-item-action>
                <v-checkbox
                  v-model="namespace.identification.hideNamespace"
                  :label="$t('pages.namespaces.itemDialog.form.publicNamespace')"
                  :disabled="released"
                />
              </v-list-item-action>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
                <v-radio-group
                  v-model="namespace.identification.status"
                  :disabled="released"
                >
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
            <v-list-item v-for="(itemDefinition, index) in namespace.definitions" :key="index">
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
            <v-list-item v-for="(itemSlot, index) in namespace.slots" :key="index">
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
</template>
<script>
import Ajax from '~/config/ajax'
import Common from '~/assets/js/common'
import ItemDefinition from '~/components/item/item-definition'
export default {
  props: {
    id: { required: false, default: 0, type: Number }, // If ID is 0 we assume that we want to create a new Namespace.
    show: { required: true, type: Boolean }
  },
  data () {
    return {
      ajax: {
        namespaceUrl: process.env.mdrBackendUrl + '/v1/namespaces/'
      },
      dialog: false,
      namespace: Object.assign({}, Common.defaultNamespace()),
      form: {
        valid: true,
        lazy: false
      },
      statuses: Common.elementStatuses(),
      released: false
    }
  },
  computed: {
    dialogTitle () {
      return this.id === 0
        ? this.$i18n.t('pages.namespaces.itemDialog.title.create')
        : this.$i18n.t('pages.namespaces.itemDialog.title.update')
    },
    disableRemoveDefinitionAction () {
      return this.namespace.definitions.length === 1
    }
  },
  watch: {
    show (n) {
      this.dialog = n
      if (this.dialog && this.id > 0) {
        this.loadNamespace(this.id)
      }
    }
  },
  mounted () {
    this.$log.debug('Dialog mounted ...')
    this.dialog = this.show
  },
  methods: {
    hideDialog () {
      this.dialog = false
      this.$emit('dialogClosed')
    },
    async loadNamespace (id) {
      this.$log.debug('Loading namespace with ID ' + id)
      await this.$axios.$get(this.ajax.namespaceUrl + this.id, Ajax.header.ignoreLanguage)
        .then(function (res) {
          this.$log.debug('Fetching Namespace details ...')
          this.namespace = Object.assign({}, res)
          this.released = (this.namespace.identification.status === 'RELEASED')
        }.bind(this))
        .catch(function (err) {
          this.$log.error('Unable to fetch Namespace details: ' + err)
        }.bind(this))
    },
    async saveNamespace () {
      this.$refs.form.validate()
      if (this.form.valid) {
        this.$log.debug('Saving Namespace ...')
        if (this.id === 0) { // If the Namespace ID is 0 we have to save it ...
          await this.$axios.post(this.ajax.namespaceUrl,
            this.namespace)
            .then(function (res) {
              this.$axios.$get(res.headers.location)
                .then(function (res1) {
                  this.namespace.identification.urn = res1.identification.urn
                  this.namespace.parentUrn = ''
                  this.namespace.action = 'CREATE'
                  this.$emit('save', this.namespace)
                  this.hideDialog()
                }.bind(this))
            }.bind(this))
            .catch(function (err) {
              this.$log.debug('Could not save Namespace: ' + err)
              this.$emit('saveFailure')
            }.bind(this))
        } else { // ... otherwise we update it.
          await this.$axios.put(this.ajax.namespaceUrl + this.namespace.identification.identifier,
            this.namespace)
            .then(function (res) {
              this.$axios.$get(res.headers.location)
                .then(function (res1) {
                  this.namespace.previousUrn = this.namespace.identification.urn
                  this.namespace.identification.urn = res1.identification.urn
                  this.namespace.parentUrn = ''
                  this.namespace.action = 'UPDATE'
                  this.$emit('save', this.namespace)
                  this.hideDialog()
                }.bind(this))
            }.bind(this))
            .catch(function (err) {
              this.$log.debug('Could not save Namespace: ' + err)
              this.$emit('saveFailure', this.namespace)
            }.bind(this))
        }
      }
    },
    addDefinition () {
      this.namespace.definitions.push(ItemDefinition.data().defaultDefinition)
    },
    deleteDefinition (index) {
      this.namespace.definitions.splice(index, 1)
    },
    addSlot () {
      this.namespace.slots.push({ name: '', value: '', language: 'en' })
    },
    deleteSlot (index) {
      this.namespace.slots.splice(index, 1)
    }
  }
}
</script>
