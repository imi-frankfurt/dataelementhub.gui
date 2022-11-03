<template>
  <v-row>
    <v-col cols="4">
      <v-textarea
        :value="designation"
        :rules="designationRules"
        :label="label[0]"
        rows="1"
        auto-grow
        @input="$emit('designation', $event)"
      />
    </v-col>
    <v-col cols="4">
      <v-textarea
        :value="definition"
        :rules="definitionRules"
        :label="label[1]"
        rows="1"
        auto-grow
        @input="$emit('definition', $event)"
      />
    </v-col>
    <v-col cols="4">
      <v-select
        :value="language"
        :items="languageItems"
        :label="label[2]"
        required
        @change="$emit('language', $event)"
      />
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: {
    designation: { required: false, default: '', type: String },
    definition: { required: false, default: '', type: String },
    language: { required: false, default: 'en', type: String }
  },
  data () {
    return {
      defaultDefinition: {
        designation: '', definition: '', language: 'en'
      },
      languageItems: [
        'en',
        'de',
        'bg',
        'es',
        'cz',
        'da',
        'de',
        'et',
        'el',
        'fr',
        'ga',
        'hr',
        'it',
        'lv',
        'lt',
        'hu',
        'mt',
        'nl',
        'pl',
        'pt',
        'ro',
        'sk',
        'sl',
        'fi',
        'sv'
      ]
    }
  },
  computed: {
    designationRules () {
      return [
        v => !!v || this.$t('global.form.validation.messages.designationRequired'),
        v => v.length <= 255 || this.$t('global.form.validation.messages.maxChars')
      ]
    },
    definitionRules () {
      return [
        v => v.length <= 65000 || this.$t('global.form.validation.messages.maxChars')
      ]
    },
    label () {
      return [
        this.$t('global.designation'),
        this.$t('global.definition'),
        this.$t('global.language')
      ]
    }
  }
}
</script>
