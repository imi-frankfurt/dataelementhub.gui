<template>
  <v-list>
    <v-list-item v-for="(value, index) in values" :key="index">
      <v-row>
        <v-col cols="2">
          <v-text-field
            :value="value.value"
            counter="255"
            :rules="valueRules"
            required
            :placeholder="$t('global.form.placeholder.value')"
            @input="$emit('valueInput', $event)"
          />
        </v-col>
      </v-row>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  props: {
    values: { required: false, default: () => [], type: Array }
  },
  computed: {
    valueRules () {
      return [
        v => !!v || this.$t('global.form.validation.messages.valueIsRequired')
      ]
    }
  }
}
</script>
