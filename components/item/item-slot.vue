<template>
  <v-row>
    <v-col cols="4">
      <v-text-field
        :value="name"
        :counter="255"
        :rules="nameRules"
        :label="label[0]"
        required
        @input="$emit('name', $event)"
      />
    </v-col>
    <v-col cols="4">
      <v-text-field
        :value="value"
        :counter="255"
        :rules="valueRules"
        :label="label[1]"
        required
        @input="$emit('value', $event)"
      />
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: {
    name: { required: false, default: '', type: String },
    value: { required: false, default: '', type: String }
  },
  computed: {
    nameRules () {
      return [
        v => !!v || this.$t('global.form.validation.messages.nameIsRequired')
      ]
    },
    valueRules () {
      return [
        v => !!v || this.$t('global.form.validation.messages.valueIsRequired')
      ]
    },
    label () {
      return [
        this.$t('global.name'),
        this.$t('global.value')
      ]
    }
  }
}
</script>
