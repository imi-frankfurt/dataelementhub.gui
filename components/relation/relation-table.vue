<script>
import CreateRelationDialog from '~/components/relation/create-relation-dialog.vue'
import DataElementDetailViewChild from '~/components/views/data-element-detail-view-child.vue'

export default {
  components: {
    CreateRelationDialog,
    DataElementDetailViewChild
  },

  data: () => ({
    snackbarInfo: {
      show: false,
      text: '',
      color: ''
    },

    ajax: {
      relationsUrl: process.env.mdrBackendUrl + '/v1/relations/'
    },

    allRelations: [],
    designationCache: {},

    dialogDelete: false,
    deleteRelation: '',

    dataelementDetailViewDialog: {
      show: false,
      urn: ''
    },

    headers: [
      { text: 'Left Urn', align: 'center', sortable: true, value: 'leftDesignation' },
      { text: 'Relation Type', align: 'center', sortable: true, value: 'relation' },
      { text: 'Right Urn', align: 'center', sortable: true, value: 'rightDesignation' },
      { text: 'Timestamp', align: 'center', sortable: true, value: 'createdAt' },
      { text: 'Created By', align: 'center', sortable: true, value: 'createdBy' },
      { text: '', align: 'center', value: 'delete', sortable: false }
    ],

    showCreateRelationDialog: false
  }),

  mounted () {
    this.fetchAllRelations()
  },

  methods: {
    showDataElementDetailViewChildDialog (urn) {
      this.dataelementDetailViewDialog.show = true
      this.dataelementDetailViewDialog.urn = urn
    },

    changeTimestampFormat (timestamp) {
      const splittedTimestamp = timestamp.replace('.', 'T').split('T')
      return splittedTimestamp[0] + ' ' + splittedTimestamp[1]
    },

    async fetchAllRelations () {
      try {
        const relations = await this.$axios.$get(this.ajax.relationsUrl)

        const enhancedRelations = await Promise.all(
          relations.map(async (rel) => {
            const leftDesignation = await this.fetchDesignation(rel.leftUrn)
            const rightDesignation = await this.fetchDesignation(rel.rightUrn)

            return {
              ...rel,
              leftDesignation,
              rightDesignation
            }
          })
        )

        this.allRelations = enhancedRelations
      } catch (err) {
        this.snackbarInfo = {
          show: true,
          text: 'Failed to fetch relations: ' + (err.response?.data || err.message),
          color: 'error'
        }
      }
    },

    async fetchDesignation (urn) {
      if (this.designationCache[urn]) {
        return this.designationCache[urn]
      }

      try {
        const encodedUrn = encodeURIComponent(urn)
        const res = await this.$axios.$get(
          `${process.env.mdrBackendUrl}/v1/element/${encodedUrn}`
        )

        const designation = res.definitions?.[0]?.designation || '(no designation)'
        this.designationCache[urn] = designation
        return designation
      } catch {
        return '(failed to load)'
      }
    },

    async handleCreateRelation (relationObject) {
      this.showCreateRelationDialog = false

      const payload = [
        {
          leftUrn: relationObject.leftUrn,
          rightUrn: relationObject.rightUrn,
          relation: relationObject.relation,
          leftSource: relationObject.leftSource,
          rightSource: relationObject.rightSource
        }
      ]

      try {
        await this.$axios.$post(this.ajax.relationsUrl, payload, {
          headers: { 'Content-Type': 'application/json' }
        })

        this.snackbarInfo = {
          show: true,
          text: 'Relation successfully created!',
          color: 'success'
        }

        this.fetchAllRelations()
      } catch (err) {
        this.snackbarInfo = {
          show: true,
          text: 'Failed to create relation: ' + (err.response?.data || err.message),
          color: 'error'
        }
      }
    },

    deleteItem (item) {
      this.deleteRelation = item
      this.dialogDelete = true
    },

    closeDelete () {
      this.dialogDelete = false
    },

    async deleteItemConfirm () {
      this.closeDelete()

      const payload = {
        leftUrn: this.deleteRelation.leftUrn,
        leftSource: this.deleteRelation.leftSource,
        rightUrn: this.deleteRelation.rightUrn,
        rightSource: this.deleteRelation.rightSource,
        relation: this.deleteRelation.relation
      }

      try {
        await this.$axios.$delete(this.ajax.relationsUrl, {
          data: payload,
          headers: { 'Content-Type': 'application/json' }
        })

        this.snackbarInfo = {
          show: true,
          text: 'Relation successfully deleted!',
          color: 'success'
        }

        this.fetchAllRelations()
        this.deleteRelation = ''
      } catch (err) {
        this.snackbarInfo = {
          show: true,
          text: 'Failed to delete relation: ' + (err.response?.data || err.message),
          color: 'error'
        }
      }
    }
  }
}
</script>

<template>
  <v-container fluid fill-height>
    <snackbars-default-snackbar
      :text="snackbarInfo.text"
      :show="snackbarInfo.show"
      :color="snackbarInfo.color"
      @hideSnackbar="snackbarInfo.show = false"
    />

    <v-row class="mb-3" align="center">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="allRelations"
          class="elevation-1 py-3"
          height="400px"
          hide-default-footer
          fixed-header
        >
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>ALL RELATION</v-toolbar-title>

              <v-divider class="mx-4" inset vertical />

              <v-btn @click="fetchAllRelations">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-spacer />
              <v-btn
                color="primary"
                dark
                class="mb-2"
                @click="showCreateRelationDialog = true"
              >
                <v-icon class="pr-2">
                  mdi-plus
                </v-icon>
                {{ $t('pages.tools.relation.newRelation') }}
              </v-btn>
              <!-- Delete Dialog -->
              <v-dialog v-model="dialogDelete" max-width="700px">
                <v-card>
                  <v-card-title class="text-h5">
                    {{ $t('pages.tools.relation.relationMessage.deleteRelationConfirmation') }}
                  </v-card-title>

                  <v-card-actions>
                    <v-spacer />
                    <v-btn text @click="closeDelete">
                      {{ $t('pages.tools.relation.relationMessage.buttons.cancel') }}
                    </v-btn>
                    <v-btn text @click="deleteItemConfirm">
                      {{ $t('pages.tools.relation.relationMessage.buttons.ok') }}
                    </v-btn>
                    <v-spacer />
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>

          <template #[`item.leftDesignation`]="{ item }">
            <div class="font-weight-medium">
              {{ item.leftDesignation }}
            </div>
            <v-btn small text @click="showDataElementDetailViewChildDialog(item.leftUrn)">
              {{ item.leftUrn }}
            </v-btn>
          </template>

          <template #[`item.rightDesignation`]="{ item }">
            <div class="font-weight-medium">
              {{ item.rightDesignation }}
            </div>
            <v-btn small text @click="showDataElementDetailViewChildDialog(item.rightUrn)">
              {{ item.rightUrn }}
            </v-btn>
          </template>

          <template #[`item.createdAt`]="{ item }">
            {{ changeTimestampFormat(item.createdAt) }}
          </template>

          <template #[`item.delete`]="{ item }">
            <v-icon small @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>

          <template #no-data>
            No relations found.
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Data Element Detail Dialog -->
    <v-dialog
      v-model="dataelementDetailViewDialog.show"
      max-width="700px"
    >
      <v-card class="pa-8">
        <data-element-detail-view-child
          :urn="dataelementDetailViewDialog.urn"
          :hide-toolbar="true"
        />
      </v-card>
    </v-dialog>

    <!-- Create Relation Dialog -->
    <CreateRelationDialog
      :show="showCreateRelationDialog"
      @createRelation="handleCreateRelation"
      @update:show="showCreateRelationDialog = $event"
    />
  </v-container>
</template>
