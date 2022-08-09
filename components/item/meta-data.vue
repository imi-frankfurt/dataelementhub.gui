<template>
  <v-container>
    <v-row dense>
      <v-col>
        <v-card
          class="meta-data-card d-flex align-center justify-center"
        >
          {{ data.elementType.toUpperCase() }}
        </v-card>
      </v-col>
      <v-col>
        <v-card
          class="meta-data-card d-flex align-center justify-center"
        >
          {{ data.status.toUpperCase() }}
        </v-card>
      </v-col>
      <v-col>
        <v-card
          class="meta-data-card d-flex align-center justify-center pt-4"
        >
          <v-menu
            v-model="showUrnInfo"
            absolute
            offset-y
            style="max-width: 300px;"
          >
            <template #activator="{ on, attrs }">
              <div
                v-bind="attrs"
                v-on="on"
              >
                <p style="display: inline-flex;">
                  <span>
                    {{ data.urn.toUpperCase().split(':')[0] }}:
                  </span>
                  <span :style="showUrnInfo ? 'color: #e4002c;' : 'color: #000000;'">
                    {{ data.urn.toUpperCase().split(':')[1] }}:
                  </span>
                  <span :style="showUrnInfo ? 'color: #0080c8;' : 'color: #000000;'">
                    {{ data.urn.toUpperCase().split(':')[2] }}:
                  </span>
                  <span :style="showUrnInfo ? 'color: #5b2282;' : 'color: #000000;'">
                    {{ data.urn.toUpperCase().split(':')[3] }}:
                  </span>
                  <span :style="showUrnInfo ? 'color: #f6a200;' : 'color: #000000;'">
                    {{ data.urn.toUpperCase().split(':')[4] }}
                  </span>
                  <span>
                    <v-icon style="padding-left: 3px;">
                      mdi-information-outline
                    </v-icon>
                  </span>
                </p>
              </div>
            </template>
            <v-list>
              <v-list-item>
                <card class="meta-data-card" v-if="showUrnInfo" style="text-align: left;">
                  <p style="color: #e4002c; height: 5px;">
                    {{ $t('global.namespaceIdentifier') }}
                  </p>
                  <p style="color: #0080c8; height: 5px;">
                    {{ $t('global.elementType') }}
                  </p>
                  <p style="color: #5b2282; height: 5px;">
                    {{ $t('global.elementIdentifier') }}
                  </p>
                  <p style="color: #f6a200; height: 5px;">
                    {{ $t('global.elementVersion') }}
                  </p>
                </card>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card>
      </v-col>
      <v-col v-if="type === 'NAMESPACE'">
        <v-card
          class="meta-data-card d-flex align-center justify-center"
        >
          {{ data.hideNamespace ? $t('global.hidden') : $t('global.public') }}
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {
    data: { required: true, type: Object },
    type: { required: false, default: 'DATAELEMENT', type: String }
  },
  data () {
    return {
      showUrnInfo: false
    }
  }
}
</script>
<style>
.meta-data-card {
  border-radius: 75px;
  elevation: level;
  height: 100%;
  padding-inline: 15px;
  min-height: 50px;
}
</style>
