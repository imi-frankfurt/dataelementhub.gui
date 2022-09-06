<template>
  <v-container>
    <v-row dense>
      <v-col>
        <MetaDataCard
          :title="data.elementType.toUpperCase()"
          :subtitle="$t('global.elementType')"
        />
      </v-col>
      <v-col>
        <MetaDataCard
          :title="data.status.toUpperCase()"
          :subtitle="$t('global.status')"
        />
      </v-col>
      <v-col>
        <v-card
          class="meta-data-card d-flex align-center justify-center pt-4"
        >
          <card>
            <v-list-item two-line class="two-line-list">
              <v-list-item-content>
                <v-list-item-subtitle class="text-h9 text-center" v-text="$t('global.urn')" />
                <v-list-item-title class="text-h7 text-center">
                  <v-menu
                    v-model="showUrnInfo"
                    absolute
                    offset-y
                    style="max-width: 300px;"
                  >
                    <template #activator="{ on, attrs }">
                      <v-div
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
                            <v-icon style="padding-left: 3px; margin-top: -2.1px;">
                              mdi-information-outline
                            </v-icon>
                          </span>
                        </p>
                      </v-div>
                    </template>
                    <v-list>
                      <v-list-item>
                        <card v-if="showUrnInfo" class="meta-data-card" style="text-align: left;">
                          <p style="color: #e4002c; height: 5px;">
                            {{ $t('global.namespaceIdentifier') }}
                          </p>
                          <p style="color: #0080c8; height: 5px;">
                            {{ $t('global.elementType').toUpperCase() }}
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
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </card>
        </v-card>
      </v-col>
      <v-col v-if="type === 'NAMESPACE'">
        <MetaDataCard
          :title="data.hideNamespace ? $t('global.private') : $t('global.public')"
          :subtitle="$t('global.accessibility')"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import MetaDataCard from '~/components/item/meta-data-card'
export default {
  components: { MetaDataCard },
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
  min-height: 40px;
  align-items: center;
}
</style>
