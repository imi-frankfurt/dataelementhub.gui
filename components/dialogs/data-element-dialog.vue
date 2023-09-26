<template>
  <v-container fluid>
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
            <v-list class="mt-2">
              <v-list-item>
                <v-list-item-action>
                  <v-select
                    v-model="dataElement.identification.namespaceUrn"
                    :items="namespaces"
                    :rules="selectNamespaceRules"
                    item-value="identification.urn"
                    item-text="definitions[0].designation"
                    :label="$t('global.select.namespace')"
                  />
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-list>
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
            <v-list>
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
                <v-container fluid>
                  <v-row>
                    <v-col cols="9">
                      <item-definition
                        :definition="itemDefinition.definition"
                        :designation="itemDefinition.designation"
                        :language="itemDefinition.language"
                        @definition="itemDefinition.definition = $event"
                        @designation="itemDefinition.designation = $event"
                        @language="itemDefinition.language = $event"
                      />
                    </v-col>
                    <v-col cols="2">
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
                </v-container>
              </v-list-item>
            </v-list>
            <v-list>
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
            <v-list>
              <v-subheader>{{ $t('global.conceptAssociations') }}</v-subheader>
              <v-list-item>
                <v-list-item-action>
                  <v-btn
                    color="primary"
                    rounded
                    small
                    @click="addConceptAssociation"
                  >
                    <v-icon dark>
                      mdi-plus
                    </v-icon>
                    {{ $t('global.button.add') }}
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-list-item
                v-for="(concept, index) in dataElement.conceptAssociations"
                :key="index"
              >
                <v-row>
                  <v-col cols="11">
                    <item-concept-association
                      :concept-association="concept"
                      @conceptChanged="concept = $event"
                    />
                  </v-col>
                  <v-col cols="1">
                    <v-list-item>
                      <v-list-item-action>
                        <v-btn
                          color="secondary"
                          rounded
                          small
                          @click="deleteConceptAssociation(index)"
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
              <v-list>
                <v-subheader>{{ $t('global.valueDomain') }}</v-subheader>
                <v-list-item>
                  <v-list-item-action>
                    <v-select
                      v-model="dataElement.valueDomain.type"
                      :items="elementValueDomains"
                      :label="$t('global.select.valueDomainType')"
                      @change="changeValidation"
                    />
                  </v-list-item-action>
                  <v-list-item-subtitle
                    v-if="dataElement.valueDomain.type === 'ENUMERATED'"
                  >
                    {{ $t('dialogs.dataElement.infoTexts.1') }}
                    <a
                      :href="ajax.backendUrl+'/swagger-ui/index.html#/Element/Create-an-Element'"
                      target="_blank"
                    >
                      REST-API
                    </a>
                  </v-list-item-subtitle>
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
                <v-card v-if="dataElement.valueDomain.type === 'ENUMERATED'">
                  <v-card-subtitle>
                    {{ $t('dialogs.dataElement.infoTexts.2') }}
                  </v-card-subtitle>
                  <enumerated
                    :available-value-domains="availableEnumertedValueDomains"
                    :namespace-id="selectedNamespaceId"
                    @chooseValueDomain="dataElement.valueDomainUrn = $event; dataElement.valueDomain = defaultEnumeratedValueDomain"
                    @deleteValueDomainUrn="delete dataElement.valueDomainUrn"
                    @showValueDomainDialog="valueDomainDialog.urn = $event; valueDomainDialog.show = true"
                  />
                </v-card>
                <v-dialog
                  v-model="valueDomainDialog.show"
                  width="600"
                >
                  <v-card>
                    <EnumeratedValueDomainDetailView
                      :urn="valueDomainDialog.urn"
                      :editable="false"
                      :deletable="false"
                      :hide-path="true"
                    />
                  </v-card>
                </v-dialog>
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
                  :enable-time-format="true"
                  :time-format="dataElement.valueDomain.datetime.time"
                  :hour-format="dataElement.valueDomain.datetime.hourFormat"
                  @timeFormatChange="dataElement.valueDomain.datetime.time = $event"
                  @hourFormatChange="dataElement.valueDomain.datetime.hourFormat = $event"
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
  </v-container>
</template>
<script>
import Ajax from '~/config/ajax'
import Common from '~/assets/js/common'
import ItemDefinition from '~/components/item/item-definition'
import ItemConceptAssociation from '~/components/item/item-concept-association'
import ItemSlot from '~/components/item/item-slot'
import DataElement from '~/assets/js/data-element'
import TextValidation from '~/components/validation/text'
import NumericValidation from '~/components/validation/numeric'
import DatetimeValidation from '~/components/validation/datetime'
import Enumerated from '~/components/validation/enumerated'
import EnumeratedValueDomainDetailView from '~/components/views/enumerated-value-domain-detail-view'
export default {
  components: {
    Enumerated,
    ItemDefinition,
    ItemSlot,
    TextValidation,
    NumericValidation,
    ItemConceptAssociation,
    DatetimeValidation,
    EnumeratedValueDomainDetailView
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
        namespaceUrl: process.env.mdrBackendUrl + '/v1/namespaces/',
        backendUrl: process.env.mdrBackendUrl
      },
      dialog: false,
      dataElement: Object.assign({}, Common.defaultDataElement()),
      defaultEnumeratedValueDomain: Object.assign({}, Common.defaultEnumeratedValueDomain()),
      form: {
        valid: true,
        lazy: false
      },
      valueDomainDialog: {
        show: false,
        urn: ''
      },
      availableEnumertedValueDomains: [],
      selectedNamespaceId: -1,
      statuses: Common.elementStatuses(['OUTDATED']),
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
        this.selectedNamespaceId = this.namespaceUrn.split(':')[1]
        if (this.show) { this.fetchEnumeratedValueDomains() }
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
    this.$log.debug('DataElement dialog mounted ...')
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
    async fetchEnumeratedValueDomains () {
      this.$log.debug('Loading enumerated value domains in ' + this.dataElement.identification.namespaceUrn)
      await this.$axios.$get(this.ajax.namespaceUrl + this.selectedNamespaceId + '/members' +
        '?elementType=ENUMERATED_VALUE_DOMAIN', Ajax.header.listView)
        .then(function (res) {
          this.availableEnumertedValueDomains = res
        }.bind(this))
        .catch(function (err) {
          this.$log.error('Unable to fetch enumerated value domains: ' + err)
        }.bind(this))
    },
    async loadDataElement (urn) {
      this.$log.debug('Loading DataElement with URN ' + urn)
      await this.$axios.$get(
        this.ajax.dataElementUrl + this.urn, Ajax.header.ignoreLanguage)
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
        this.$log.debug('Releasing ValueDomain ...')
        if (this.dataElement.identification.status.toUpperCase() === 'RELEASED' &&
          this.dataElement.valueDomainUrn !== '') {
          await this.$axios.patch(this.ajax.dataElementUrl + this.dataElement.valueDomainUrn + '/release')
            .then(function (res) {
              this.$log.debug('ValueDomain ' + this.dataElement.valueDomainUrn + ' released successfully')
            }.bind(this))
            .catch(function () {
              this.$log.debug('Could not release valueDomain' + this.dataElement.valueDomainUrn)
            }.bind(this))
        }
        this.$log.debug('Saving DataElement ...')
        if (this.urn === '') { // If the DataElement URN is empty we have to save it ...
          const element = this.dataElement
          if (element.valueDomain.type === 'ENUMERATED') {
            delete element.valueDomain
          }
          await this.$axios.post(this.ajax.dataElementUrl, element)
            .then(function (res) {
              if (res !== undefined) {
                this.$root.$emit('showSaveSuccessSnackbar')
                this.$root.$emit('updateTreeView')
                this.hideDialog()
              }
            }.bind(this))
            .catch(function (err) {
              this.$log.debug('Could not save DataElement: ' + err)
              this.$root.$emit('handleSaveFailure', err.response)
            }.bind(this))
        } else { // ... otherwise we update it.
          delete this.dataElement.valueDomain // Remove this for current release
          await this.$axios.put(this.ajax.dataElementUrl + this.dataElement.identification.urn,
            this.dataElement)
            .then(function (res) {
              if (res !== undefined) {
                this.$root.$emit('showSaveSuccessSnackbar')
                this.$root.$emit('updateTreeView')
                this.hideDialog()
              }
            }.bind(this))
            .catch(function (err) {
              this.$log.debug('Could not save DataElement: ' + err)
              this.$root.$emit('handleSaveFailure', err.response)
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
    addConceptAssociation () {
      this.dataElement.conceptAssociations.push(ItemConceptAssociation.data().defaultConcept)
    },
    deleteConceptAssociation (index) {
      this.dataElement.conceptAssociations.splice(index, 1)
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
