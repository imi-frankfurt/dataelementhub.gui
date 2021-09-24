<template>
  <v-list>
    <v-list-item v-if="enableDateFormat">
      <v-row>
        <v-col cols="4">
          <date-format
            :date-format="dateFormat"
            @dateFormatChange="$emit('dateFormatChange', $event)"
          />
        </v-col>
      </v-row>
    </v-list-item>
    <v-list-item v-if="enableTimeFormat">
      <v-row>
        <v-col cols="4">
          <time-format
            :time-format="timeFormat"
            @timeFormatChange="$emit('timeFormatChange', $event)"
          />
        </v-col>
      </v-row>
    </v-list-item>
    <v-list-item v-if="enableHourFormat">
      <v-row>
        <v-col cols="4">
          <hour-format
            :hour-format="hourFormat"
            @hourFormatChange="$emit('hourFormatChange', $event)"
          />
        </v-col>
      </v-row>
    </v-list-item>
  </v-list>
</template>
<script>
import HourFormat from '~/components/predefined-value/hour-format'
import DateFormat from '~/components/predefined-value/date-format'
import TimeFormat from '~/components/predefined-value/time-format'
export default {
  components: {
    HourFormat,
    DateFormat,
    TimeFormat
  },
  props: {
    enableDateFormat: { required: false, default: true, type: Boolean },
    dateFormat: { required: false, default: DateFormat.props.dateFormat.default, type: String },
    enableTimeFormat: { required: false, default: true, type: Boolean },
    timeFormat: { required: false, default: TimeFormat.props.timeFormat.default, type: String },
    enableHourFormat: { required: false, default: true, type: Boolean },
    hourFormat: { required: false, default: HourFormat.props.hourFormat.default, type: String }
  }
}
</script>
