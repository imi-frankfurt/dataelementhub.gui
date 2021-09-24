<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item-group>
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>
            <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.home')" /></v-list-item-title>
          </v-list-item>
        </v-list-item-group>
        <client-only>
          <div v-if="$auth.loggedIn">
            <v-list-item-group>
              <v-list-item to="/all-elements">
                <v-list-item-icon>
                  <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.mainView')" /></v-list-item-title>
              </v-list-item>
            </v-list-item-group>
            <!--
            <v-divider />
            <v-subheader>{{ $t('global.mainMenu.workspace.workspace') }}</v-subheader>
            <v-list-item-group>
              <v-list-item to="/workspace/staging">
                <v-list-item-icon>
                  <v-icon>mdi-arrow-right-bold-box</v-icon>
                </v-list-item-icon>
                <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.workspace.staging')" /></v-list-item-title>
              </v-list-item>
              <v-list-item to="/workspace/drafts">
                <v-list-item-icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-list-item-icon>
                <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.workspace.drafts')" /></v-list-item-title>
              </v-list-item>
              <v-list-item to="/workspace/validate">
                <v-list-item-icon>
                  <v-icon>mdi-check-all</v-icon>
                </v-list-item-icon>
                <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.workspace.validate')" /></v-list-item-title>
              </v-list-item>
            </v-list-item-group>
            -->
            <!--
            <v-subheader>{{ $t('global.mainMenu.view.view') }}</v-subheader>
            <v-list-item-group>
              <v-list-item to="/view/my-data">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.view.myData')" /></v-list-item-title>
              </v-list-item>
              <v-list-item to="/view/public-data">
                <v-list-item-icon>
                  <v-icon>mdi-account-multiple</v-icon>
                </v-list-item-icon>
                <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.view.public')" /></v-list-item-title>
              </v-list-item>
              <v-list-item to="/view/value-sets">
                <v-list-item-icon>
                  <v-icon>mdi-view-headline</v-icon>
                </v-list-item-icon>
                <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.view.valueSets')" /></v-list-item-title>
              </v-list-item>
            </v-list-item-group>
            -->
            <v-subheader>{{ $t('global.mainMenu.tools.tools') }}</v-subheader>
            <v-list-item-group>
              <!--
              <v-list-item to="/tools/namespace-comparison">
                <v-list-item-icon>
                  <v-icon>mdi-ab-testing</v-icon>
                </v-list-item-icon>
                <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.tools.namespaceComparison')" /></v-list-item-title>
              </v-list-item>
              <v-list-item to="/tools/mapping">
                <v-list-item-icon>
                  <v-icon>mdi-arrow-decision</v-icon>
                </v-list-item-icon>
                <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.tools.mapping')" /></v-list-item-title>
              </v-list-item>
              <v-list-item to="/tools/visualizer">
                <v-list-item-icon>
                  <v-icon>mdi-eye</v-icon>
                </v-list-item-icon>
                <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.tools.visualizer')" /></v-list-item-title>
              </v-list-item>
              <v-list-item to="/tools/import-export">
                <v-list-item-icon>
                  <v-icon>mdi-swap-horizontal</v-icon>
                </v-list-item-icon>
                <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.tools.importExport')" /></v-list-item-title>
              </v-list-item>
              -->
              <v-list-item to="/tools/search">
                <v-list-item-icon>
                  <v-icon>mdi-magnify</v-icon>
                </v-list-item-icon>
                <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.tools.search')" /></v-list-item-title>
              </v-list-item>
            </v-list-item-group>
            <!--
            <v-list-item-group>
              <v-divider />
              <v-list-item to="/settings">
                <v-list-item-icon>
                  <v-icon>mdi-cog</v-icon>
                </v-list-item-icon>
                <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.settings')" /></v-list-item-title>
              </v-list-item>
            </v-list-item-group>
            -->
          </div>
        </client-only>
        <v-list-item-group>
          <v-divider />
          <v-list-item to="/about">
            <v-list-item-icon>
              <v-icon>mdi-information</v-icon>
            </v-list-item-icon>
            <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.about')" /></v-list-item-title>
          </v-list-item>
          <v-list-item to="/help">
            <v-list-item-icon>
              <v-icon>mdi-help-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.help')" /></v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="$t(title)" />
      <v-spacer />
      <client-only>
        <v-menu v-if="$auth.loggedIn" offset-y>
          <template #activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-account</v-icon> {{ $auth.user.name }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item link disabled>
              <v-icon>mdi-cog</v-icon>
              <v-list-item-title v-text="$t('global.mainMenu.settings')" />
            </v-list-item>
            <v-list-item
              link
              @click="logout"
            >
              <v-icon>mdi-logout</v-icon>
              <v-list-item-title v-text="$t('global.logout')" />
            </v-list-item>
          </v-list>
        </v-menu>
      </client-only>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; 2021 Medical Informatics Group</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'global.appName'
    }
  },
  methods: {
    async logout () {
      try {
        await this.$auth.logout()
      } catch (err) {

      }
    }
  }
}
</script>
