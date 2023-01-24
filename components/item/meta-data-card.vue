<script>
export default {
  props: {
    title: { required: true, type: String },
    subtitle: { required: true, type: String }
  }
}
</script>

<template>
  <v-card
    class="meta-data-card d-flex align-left justify-center ma-0 pa-ß"
  >
    <card>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-subtitle class="text-h9 text-center" v-text="subtitle" />
          <v-list-item-title class="text-h7 text-center" v-text="title" />
        </v-list-item-content>
      </v-list-item>
    </card>
  </v-card>
</template>

<style scoped>

.meta-data-card {
  border-radius: 75px;
  elevation: level;
  height: 100%;
  min-height: 40px;
  align-items: center;
  justify-items: center;
}

</style>
