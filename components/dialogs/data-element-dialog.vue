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
              @click="saveDataElement"
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
                <v-select
                  v-model="dataElement.identification.namespaceUrn"
                  :items="namespaces"
                  :rules="selectNamespaceRules"
                  item-value="identification.urn"
                  item-text="definition.designation"
                  :label="$t('global.select.namespace')"
                />
              </v-list-item-action>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
                <v-radio-group
                  v-model="dataElement.identification.status"
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
            <v-list-item v-for="(itemDefinition, index) in dataElement.definitions" :key="index">
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
            <v-list-item v-for="(itemSlot, index) in dataElement.slots" :key="index">
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
          <template v-if="!released && !edit">
            <v-list subheader>
              <v-subheader>{{ $t('global.valueDomain') }}</v-subheader>
              <v-list-item>
                <v-list-item-action>
                  <v-select
                    v-model="dataElement.valueDomain.type"
                    :items="elementValueDomains"
                    :label="$t('global.select.valueDomain')"
                    @change="changeValidation"
                  />
                </v-list-item-action>
              </v-list-item>
              <text-validation
                v-if="dataElement.valueDomain.type === 'STRING'"
                :use-reg-ex="dataElement.valueDomain.text.useRegEx"
                :reg-ex="dataElement.valueDomain.text.regEx"
                :use-maximum-length="dataElement.valueDomain.text.useMaximumLength"
                :maximum-length="dataElement.valueDomain.text.maximumLength"
                @useRegExChange="dataElement.valueDomain.text.useRegEx = $event"
                @regExInput="dataElement.valueDomain.text.regEx = $event"
                @useMaximumLengthChange="dataElement.valueDomain.text.useMaximumLength = $event"
                @maximumLengthInput="dataElement.valueDomain.text.maximumLength = parseInt($event)"
              />
              <template v-if="dataElement.valueDomain.type === 'NUMERIC'">
                <v-list-item>
                  <v-list-item-action>
                    <v-select
                      v-model="dataElement.valueDomain.numeric.type"
                      :items="numericValueDomains"
                    />
                  </v-list-item-action>
                </v-list-item>
                <numeric-validation
                  :use-minimum="dataElement.valueDomain.numeric.useMinimum"
                  :minimum="dataElement.valueDomain.numeric.minimum"
                  :use-maximum="dataElement.valueDomain.numeric.useMaximum"
                  :maximum="dataElement.valueDomain.numeric.maximum"
                  :type="dataElement.valueDomain.numeric.type"
                  :unit-of-measure="dataElement.valueDomain.numeric.unitOfMeasure"
                  @useMinimumChange="dataElement.valueDomain.numeric.useMinimum = $event"
                  @minimumInput="dataElement.valueDomain.numeric.minimum = parseInt($event)"
                  @useMaximumChange="dataElement.valueDomain.numeric.useMaximum = $event"
                  @maximumInput="dataElement.valueDomain.numeric.maximum = parseInt($event)"
                  @unitOfMeasureInput="dataElement.valueDomain.numeric.unitOfMeasure = $event"
                />
              </template>
              <!--
              -->
              <permitted-values-validation
                v-if="dataElement.valueDomain.type === 'ENUMERATED'"
                :values="dataElement.valueDomain.permittedValues"
              />
              <datetime-validation
                v-if="dataElement.valueDomain.type === 'DATETIME'"
                :date-format="dataElement.valueDomain.datetime.date"
                :time-format="dataElement.valueDomain.datetime.time"
                :hour-format="dataElement.valueDomain.datetime.hourFormat"
                @dateFormatChange="dataElement.valueDomain.datetime.date = $event"
                @timeFormatChange="dataElement.valueDomain.datetime.time = $event"
                @hourFormatChange="dataElement.valueDomain.datetime.hourFormat = $event"
              />
              <datetime-validation
                v-if="dataElement.valueDomain.type === 'DATE'"
                :enable-time-format="false"
                :enable-hour-format="false"
                :date-format="dataElement.valueDomain.datetime.date"
                @dateFormatChange="dataElement.valueDomain.datetime.date = $event"
              />
              <datetime-validation
                v-if="dataElement.valueDomain.type === 'TIME'"
                :enable-date-format="false"
                :enable-time-format="false"
                :time-format="dataElement.valueDomain.datetime.time"
                @timeFormatChange="dataElement.valueDomain.datetime.time = $event"
              />
            </v-list>
          </template>
          <template v-else>
            <v-list>
              <v-list-item>
                <v-alert
                  type="warning"
                >
                  {{ $t('global.valueDomainNotEditable') }}
                </v-alert>
              </v-list-item>
            </v-list>
          </template>
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
import DataElement from '~/assets/js/data-element'
import TextValidation from '~/components/validation/text'
import NumericValidation from '~/components/validation/numeric'
import PermittedValuesValidation from '~/components/validation/permitted-values'
import DatetimeValidation from '~/components/validation/datetime'
export default {
  components: {
    ItemDefinition,
    ItemSlot,
    TextValidation,
    NumericValidation,
    PermittedValuesValidation,
    DatetimeValidation
  },
  props: {
    urn: { required: false, default: '', type: String }, // If URN is empty we assume that we want to create a new
    namespaceUrn: { required: false, default: '', type: String },
    show: { required: true, type: Boolean }
  },
  data () {
    return {
      ajax: {
        dataElementUrl: process.env.mdrBackendUrl + '/v1/element/',
        namespaceUrl: process.env.mdrBackendUrl + '/v1/namespaces/'
      },
      dialog: false,
      dataElement: Object.assign({}, Common.defaultDataElement()),
      form: {
        valid: true,
        lazy: false
      },
      statuses: Common.elementStatuses(),
      namespaces: [],
      elementValueDomains: Common.elementValueDomains(),
      released: false,
      edit: false,
      selectNumeric: 'INTEGER',
      numericValueDomains: Common.numericValueDomains()
    }
  },
  computed: {
    dialogTitle () {
      return this.urn === ''
        ? this.$i18n.t('pages.dataElements.itemDialog.title.create')
        : this.$i18n.t('pages.dataElements.itemDialog.title.update')
    },
    disableRemoveDefinitionAction () {
      return this.dataElement.definitions.length === 1
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
        this.dataElement.identification.namespaceUrn = this.namespaceUrn
      },
      immediate: true
    },
    show: {
      handler () {
        this.dialog = this.show
        if (this.dialog && this.urn !== '') {
          this.loadDataElement(this.urn)
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
    hideDialog () {
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
    async loadDataElement (urn) {
      this.$log.debug('Loading DataElement with URN ' + urn)
      await this.$axios.$get(this.ajax.dataElementUrl + this.urn, Ajax.header.ignoreLanguage)
        .then(function (res) {
          const dataElement = Object.assign({}, res)
          this.$axios.$get(this.ajax.dataElementUrl + urn + '/valuedomain', Ajax.header.ignoreLanguage)
            .then(function (res1) {
              this.$log.debug('Fetching value Domain ...')
              const valueDomain = {}
              valueDomain.type = res1.type
              if (res1.text !== undefined) { valueDomain.text = res1.text }
              if (res1.datetime !== undefined) { valueDomain.datetime = res1.datetime }
              if (res1.numeric !== undefined) { valueDomain.numeric = res1.numeric }
              if (res1.permittedValues !== undefined) {
                valueDomain.permittedValues = res1.permittedValues
              }
              dataElement.valueDomain = Object.assign({}, valueDomain)
              this.dataElement = Object.assign({}, dataElement)
              this.released = (this.dataElement.identification.status === 'RELEASED')
              this.edit = true
            }.bind(this))
        }.bind(this))
        .catch(function (err) {
          this.$log.error('Unable to fetch DataElement details: ' + err)
        }.bind(this))
    },
    async saveDataElement () {
      this.$refs.form.validate()
      if (this.form.valid) {
        this.$log.debug('Saving DataElement ...')
        if (this.urn === '') { // If the DataElement URN is empty we have to save it ...
          await this.$axios.post(this.ajax.dataElementUrl,
            this.dataElement)
            .then(function (res) {
              this.$axios.$get(res.headers.location)
                .then(function (res1) {
                  this.dataElement.identification.urn = res1.identification.urn
                  this.dataElement.parentUrn = ''
                  this.dataElement.action = 'CREATE'
                  this.$emit('save', this.dataElement)
                  this.hideDialog()
                }.bind(this))
            }.bind(this))
            .catch(function (err) {
              this.$log.debug('Could not save DataElement: ' + err)
              this.$emit('saveFailure', this.dataElement)
            }.bind(this))
        } else { // ... otherwise we update it.
          delete this.dataElement.valueDomain // Remove this for current release
          await this.$axios.put(this.ajax.dataElementUrl + this.dataElement.identification.urn,
            this.dataElement)
            .then(function (res) {
              this.$axios.$get(res.headers.location)
                .then(function (res1) {
                  this.dataElement.identification.urn = res1.identification.urn
                  this.dataElement.previousUrn = this.urn
                  this.dataElement.action = 'UPDATE'
                  this.$emit('save', this.dataElement)
                  this.hideDialog()
                }.bind(this))
            }.bind(this))
            .catch(function (err) {
              this.$log.debug('Could not save DataElement: ' + err)
              this.$emit('saveFailure', this.dataElement)
            }.bind(this))
        }
      }
    },
    addDefinition () {
      this.dataElement.definitions.push(ItemDefinition.data().defaultDefinition)
    },
    deleteDefinition (index) {
      this.dataElement.definitions.splice(index, 1)
    },
    addSlot () {
      this.dataElement.slots.push({ name: '', value: '', language: 'en' })
    },
    deleteSlot (index) {
      this.dataElement.slots.splice(index, 1)
    },
    changeValidation () {
      this.$log.debug('Changing Validation')
      const valueDomain = this.dataElement.valueDomain
      this.$log.debug(this.dataElement)
      this.$delete(valueDomain, 'text')
      this.$delete(valueDomain, 'numeric')
      this.$delete(valueDomain, 'datetime')
      this.$delete(valueDomain, 'permittedValues')
      this.$log.debug(this.dataElement)
      switch (valueDomain.type) {
        case 'NUMERIC':
          this.$set(valueDomain, 'numeric', DataElement.defaultNumericIntegerValidation())
          break
        case 'ENUMERATED':
          this.$set(valueDomain, 'permittedValues', DataElement.defaultPermittedValuesValueDomain())
          break
        case 'DATETIME':
          this.$set(valueDomain, 'datetime', DataElement.defaultDateTimeValidation())
          break
        case 'DATE':
          this.$set(valueDomain, 'datetime', DataElement.defaultDateValidation())
          break
        case 'TIME':
          this.$set(valueDomain, 'datetime', DataElement.defaultTimeValidation())
          break
        case 'TBD':
        case 'BOOLEAN':
          break
        default:
          this.$set(valueDomain, 'text', DataElement.defaultTextValidation())
          break
      }
    }
  }
}
</script>
