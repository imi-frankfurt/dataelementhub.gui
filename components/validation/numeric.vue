<template>
  <v-list>
    <v-list-item>
      <v-row>
        <v-col cols="2">
          <v-switch
            :value="useMinimum"
            :label="label[0]"
            @change="$emit('useMinimumChange', $event)"
          />
        </v-col>
        <v-col cols="4">
          <template v-if="useMinimum">
            <v-text-field
              :value="minimum"
              counter="255"
              :rules="minimumRules"
              :placeholder="placeholder[0]"
              required
              @input="$emit('minimumInput', $event)"
            />
          </template>
        </v-col>
      </v-row>
    </v-list-item>
    <v-list-item>
      <v-row>
        <v-col cols="2">
          <v-switch
            :value="useMaximum"
            :label="label[1]"
            @change="$emit('useMaximumChange', $event)"
          />
        </v-col>
        <v-col cols="4">
          <template v-if="useMaximum">
            <v-text-field
              :value="maximum"
              counter="255"
              :rules="maximumRules"
              :placeholder="placeholder[1]"
              required
              @input="$emit('maximumInput', $event)"
            />
          </template>
        </v-col>
      </v-row>
    </v-list-item>
    <v-list-item>
      <v-row>
        <v-col cols="2">
          <v-text-field
            :value="unitOfMeasure"
            counter="255"
            :rules="unitOfMeasureRules"
            required
            :label="label[2]"
            @input="$emit('unitOfMeasureInput', $event)"
          />
        </v-col>
      </v-row>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  props: {
    useMinimum: { required: false, default: false, type: Boolean },
    minimum: { required: false, default: 0, type: Number },
    useMaximum: { required: false, default: false, type: Boolean },
    maximum: { required: false, default: 0, type: Number },
    unitOfMeasure: { required: false, default: '', type: String },
    type: { required: true, type: String }
  },
  computed: {
    minimumRules () {
      return [
        v => !!v || this.$t('global.form.validation.messages.minimumRequired')
      ]
    },
    maximumRules () {
      return [
        v => !!v || this.$t('global.form.validation.messages.maximumRequired')
      ]
    },
    unitOfMeasureRules () {
      return [
        v => !!v || this.$t('global.form.validation.messages.unitOfMeasureRequired')
      ]
    },
    placeholder () {
      return [
        this.$t('global.form.placeholder.minimum'),
        this.$t('global.form.placeholder.maximum')
      ]
    },
    label () {
      return [
        this.$t('global.form.label.useMinimum'),
        this.$t('global.form.label.useMaximum'),
        this.$t('global.form.label.unitOfMeasure')
      ]
    }
  }
}
</script>
