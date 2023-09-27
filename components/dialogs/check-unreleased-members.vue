<template>
  <v-dialog
    v-if="items.length > 0"
    v-model="dialog"
    max-width="290"
  >
    <v-card>
      <v-card-title class="text-h5">
        {{ $t('global.unreleasedMembersDialog.message1') }}
      </v-card-title>
      <v-card-text>
        {{ $t('global.unreleasedMembersDialog.message2') }}
      </v-card-text>
      <v-list
        v-model="selectedItem"
        max-height="200px"
        class="overflow-y-auto"
      >
        <v-list-item
          v-for="(item) in onlyDraftItems(items)"
          :key="item.id"
          @click="editElementDialog(item.id)"
        >
          <v-list-item-icon>
            <v-icon v-if="item.elementType.toUpperCase() === 'DATAELEMENT'">
              mdi-vector-arrange-below
            </v-icon>
            <v-icon
              v-else-if="item.elementType.toUpperCase() === 'DATAELEMENTGROUP'"
            >
              mdi-group
            </v-icon>
            <v-icon v-else-if="item.elementType.toUpperCase() === 'RECORD'">
              mdi-group
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.designation" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="green darken-1"
          text
          @click="dialog = false; $emit('closeUnreleasedMembersDialog') "
        >
          {{ $t('global.cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-row
      v-if="editDialog.urn.includes('DATAELEMENT') & editDialog.show"
      justify="center"
    >
      <DataElementDialog
        :key="editDialog.show"
        :urn="editDialog.urn"
        :show="editDialog.show"
        @dialogClosed="editDialog.show = false; removeIfReleased(editDialog.urn)"
      />
    </v-row>
    <v-row
      v-if="editDialog.urn.includes('DATAELEMENTGROUP') || editDialog.urn.includes('RECORD') &&
        editDialog.show"
      justify="center"
    >
      <GroupRecordDialog
        :key="editDialog.show"
        :show="editDialog.show"
        :urn="editDialog.urn"
        :element-type="dialog.elementType"
        @dialogClosed="editDialog.show = false; removeIfReleased(editDialog.urn)"
      />
    </v-row>
  </v-dialog>
</template>

<script>
import DataElementDialog from '~/components/dialogs/data-element-dialog'
import GroupRecordDialog from '~/components/dialogs/group-record-dialog'
import Ajax from '~/config/ajax'
export default {
  components: {
    DataElementDialog,
    GroupRecordDialog
  },
  props: {
    show: { required: true, type: Boolean },
    members: { required: true, type: Array }
  },
  data () {
    return {
      ajax: {
        dataElementUrl: process.env.backendUrl + '/v1/element/',
        namespaceUrl: process.env.backendUrl + '/v1/namespaces/'
      },
      dialog: this.show,
      selectedItem: 1,
      items: this.members,
      editDialog: {
        show: true,
        urn: ''
      }
    }
  },
  watch: {
    show () {
      if (this.show === false) {
        this.$emit('closeUnreleasedMembersDialog')
      }
    }
  },
  methods: {
    onlyDraftItems (items) {
      return items.filter(elem => elem.status.toUpperCase().includes('DRAFT'))
    },
    editElementDialog (urn) {
      this.editDialog.show = true
      this.editDialog.urn = urn
    },
    async removeIfReleased (urn) {
      await this.$axios.$get(this.ajax.dataElementUrl + urn, Ajax.header.ignoreLanguage)
        .then(function (res) {
          this.$log.debug('Check unreleased members: Fetching DataElement details ...')
          if (res.identification.status.toUpperCase() === 'RELEASED') {
            const urn = res.identification.urn.toUpperCase()
            this.items = this.items.filter(elem => !elem.id.toUpperCase().includes(urn))
            this.$emit('released', urn)
          }
        }.bind(this))
        .catch(function (err) {
          this.$log.error('Unable to fetch DataElement details: ' + err)
        }.bind(this))
    }
  }
}
</script>
