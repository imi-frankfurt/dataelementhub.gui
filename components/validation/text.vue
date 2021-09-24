<template>
  <v-list>
    <v-list-item>
      <v-row>
        <v-col cols="2">
          <v-switch
            :value="useRegEx"
            :label="label[0]"
            @change="$emit('useRegExChange', $event)"
          />
        </v-col>
        <v-col cols="4">
          <template v-if="useRegEx">
            <v-text-field
              :value="regEx"
              counter="255"
              :rules="regExRules"
              :placeholder="placeholder[0]"
              required
              @input="$emit('regExInput', $event)"
            />
          </template>
        </v-col>
      </v-row>
    </v-list-item>
    <v-list-item>
      <v-row>
        <v-col cols="2">
          <v-switch
            :value="useMaximumLength"
            :label="label[1]"
            @change="$emit('useMaximumLengthChange', $event)"
          />
        </v-col>
        <v-col cols="4">
          <template v-if="useMaximumLength">
            <v-text-field
              :value="maximumLength"
              counter="3"
              :rules="maximumLengthRules"
              :placeholder="placeholder[1]"
              required
              @input="$emit('maximumLengthInput', $event)"
            />
          </template>
        </v-col>
      </v-row>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  props: {
    useRegEx: { required: false, default: false, type: Boolean },
    regEx: { required: false, default: '', type: String },
    useMaximumLength: { required: false, default: false, type: Boolean },
    maximumLength: { required: false, default: 0, type: Number }
  },
  computed: {
    regExRules () {
      return [
        v => !!v || this.$t('global.form.validation.messages.regExRequired')
      ]
    },
    maximumLengthRules () {
      return [
        v => !!v || this.$t('global.form.validation.messages.maximumLengthRequired')
      ]
    },
    placeholder () {
      return [
        this.$t('global.form.placeholder.regEx'),
        this.$t('global.form.placeholder.maximumLength')
      ]
    },
    label () {
      return [
        this.$t('global.form.label.useRegEx'),
        this.$t('global.form.label.useMaximumLength')
      ]
    }
  }
}
</script>
