<script>
export default {
  props: {
    elementPath: {
      required: true,
      type: Array
    },
    elementUrn: {
      required: true,
      type: String
    },
    elementIsDeletable: {
      required: true,
      type: Boolean
    },
    elementIsEditable: {
      required: true,
      type: Boolean
    },
    activateNavigation: {
      required: true,
      type: Boolean
    }
  },
  methods: {
    getRightButtonClass () {
      return {
        'right-button-marked': this.selectedElementPathType === 'URN',
        'right-button': this.selectedElementPathType !== 'URN'
      }
    },
    getBreadCrumbItemColor (disabled) {
      return {
        'breadcrumb-item-disabled': disabled,
        'breadcrumb-item-activated': !disabled
      }
    }
  }
}
</script>

<template>
  <v-toolbar>
    <v-toolbar-title>
      <v-container class="text-center">
        <v-row no-gutters>
          <v-col>
            <v-breadcrumbs :items="elementPath">
              <template #item="{ item }">
                <v-breadcrumbs-item
                  link
                  :disabled="item.urn === elementUrn || !activateNavigation"
                  @click="$emit('showDetailViewDialog', item.urn)"
                >
                  <span :class="getBreadCrumbItemColor(item.urn === elementUrn || !activateNavigation)">
                    {{ item.designation.toUpperCase() }}
                  </span>
                </v-breadcrumbs-item>
              </template>
            </v-breadcrumbs>
          </v-col>
        </v-row>
      </v-container>
    </v-toolbar-title>
    <v-spacer />
    <v-btn
      v-if="elementIsEditable"
      icon
      color="primary"
      @click="$emit('editElement')"
    >
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <v-btn
      v-if="elementIsDeletable"
      icon
      @click="$emit('deleteElement')"
    >
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<style>
.breadcrumb-item-disabled {
  color: #3d3f3f;
}

.breadcrumb-item-activated {
  color: #0080c8;
  cursor: pointer;
}

</style>
