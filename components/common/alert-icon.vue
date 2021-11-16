<template v-slot:item.action="{ item }">
  <v-hover v-slot="{ hover }">
    <v-badge
      :value="hover"
      color="#0000"
      left
      transition="slide-x-transition"
    >
      <span slot="badge">
        <v-card>
          <v-list>
            <v-list-item-title dark>{{ title }}</v-list-item-title>
            <v-list-item
              v-for="(item, i) in alerts"
              :key="i"
            >
              <v-list-item-subtitle>{{ '- ' + item }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </span>
      <v-icon>mdi-alert-circle</v-icon>
    </v-badge>
  </v-hover>
</template>
<script>
export default {
  props: {
    title: { required: false, default: '', type: String },
    alerts: { required: true, type: Array }
  }
}
</script>
