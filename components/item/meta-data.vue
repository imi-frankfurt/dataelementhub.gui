<template>
  <v-list>
    <v-subheader>{{ $t('global.metaData') }}</v-subheader>
    <v-list-item>
      <v-list-item-content>{{ $t('global.type') }}: {{ data.elementType }}</v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>{{ $t('global.status') }}: {{ data.status }}</v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>{{ $t('global.identifier') }}: {{ data.identifier }}</v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-content>{{ $t('global.revision') }}: {{ data.revision }}</v-list-item-content>
    </v-list-item>
    <v-list-item v-if="type === 'NAMESPACE'">
      <v-list-item-content>{{ $t('global.hidden') }}: {{ data.hideNamespace }}</v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  props: {
    data: { required: true, type: Object },
    type: { required: false, default: 'DATAELEMENT', type: String }
  }
}
</script>
