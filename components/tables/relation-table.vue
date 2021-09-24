<template>
  <div>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
      >
        <v-card>
          <v-container>
            <data-element-detail-view-child
              :urn="relatedElementUrn"
              :relation-detail-view-available="false"
            />
          </v-container>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-1"
              text
              @click="dialog = false"
            >
              {{ $t('global.button.close') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-data-table
      :headers="table.headers"
      :items="relations"
      :items-per-page="5"
      class="elevation-1"
      @click:row="showRelatedElement"
    />
  </div>
</template>
<script>
import DataElementDetailViewChild from '~/components/views/data-element-detail-view-child'
export default {
  components: {
    DataElementDetailViewChild
  },
  props: {
    relations: { required: false, default: () => [], type: Array },
    detailViewAvailable: { required: false, default: false, type: Boolean }
  },
  data () {
    return {
      table: {
        headers: [
          {
            text: this.$i18n.t('global.urn'),
            align: 'start',
            sortable: true,
            value: 'leftUrn'
          },
          {
            text: this.$i18n.t('global.name'),
            sortable: true,
            value: 'leftSource.name'
          },
          {
            text: this.$i18n.t('global.prefix'),
            sortable: true,
            value: 'leftSource.prefix'
          },
          {
            text: this.$i18n.t('global.baseUrl'),
            sortable: true,
            value: 'leftSource.baseUrl'
          },
          {
            text: this.$i18n.t('global.type'),
            sortable: true,
            value: 'leftSource.type'
          }
        ]
      },
      dialog: false,
      relatedElementUrn: undefined
    }
  },
  methods: {
    showRelatedElement (el) {
      if (this.detailViewAvailable) {
        this.dialog = true
        this.relatedElementUrn = el.leftUrn
      }
    }
  }
}
</script>
