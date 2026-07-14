<template v-slot:item.action="{ item }">
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <v-icon
        small
        color="primary"
        dark
        v-bind="attrs"
        v-on="on"
      >
        mdi-alert-circle
      </v-icon>
    </template>
    <span>
      <div>
        <h4>{{ title }}</h4>
        <ul
          v-for="(item, i) in alerts"
          :key="i"
        >
          <li>{{ item }}</li>
        </ul>
      </div>
    </span>
  </v-tooltip>
</template>
<script>
export default {
  props: {
    title: { required: false, default: '', type: String },
    alerts: { required: true, type: Array }
  }
}
</script>
