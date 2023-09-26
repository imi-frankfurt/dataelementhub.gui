<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      color="navigation_drawer"
      :expand-on-hover="$vuetify.breakpoint.mdAndUp"
      permanent
      dark
      app
    >
      <div class="text-center">
        <img src="@/assets/images/logo/1.png" height="60">
      </div>
      <v-list>
        <v-list-item-group>
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon color="white">
                mdi-view-dashboard
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.home')" /></v-list-item-title>
          </v-list-item>
          <v-list-item to="/all-elements">
            <v-list-item-icon>
              <v-icon color="white">
                mdi-home
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.mainView')" /></v-list-item-title>
          </v-list-item>
        </v-list-item-group>
        <client-only>
          <div v-if="$auth.loggedIn">
            <v-subheader>{{ $t('global.mainMenu.tools.tools') }}</v-subheader>
            <v-list-item-group>
              <v-list-item to="/tools/search">
                <v-list-item-icon>
                  <v-icon color="white">
                    mdi-magnify
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.tools.search')" /></v-list-item-title>
              </v-list-item>
              <v-list-item to="/tools/import-export">
                <v-list-item-icon>
                  <v-icon color="white">
                    mdi-swap-vertical
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.tools.importExport')" /></v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </div>
        </client-only>
        <v-list-item-group class="fixedBottom">
          <v-divider />
          <v-list-item to="/about">
            <v-list-item-icon>
              <v-icon color="white">
                mdi-information
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.about')" /></v-list-item-title>
          </v-list-item>
          <v-list-item to="/help">
            <v-list-item-icon>
              <v-icon color="white">
                mdi-help-circle
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title><v-list-item-title v-text="$t('global.mainMenu.help')" /></v-list-item-title>
          </v-list-item>
          <v-list-item inactive>
            <v-list-item-icon>
              <v-icon color="white">
                &copy;
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <span>&copy; 2022 {{ $t('global.imi') }}</span>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      color="header"
      fixed
      app
    >
      <div class="dehubText">
        <img src="@/assets/images/logo/5.png" height="60">
      </div>
      <v-spacer />
      <v-btn
        v-if="!$auth.loggedIn && $route.path !== '/login'"
        color="primary"
        @click="loginWithKeycloak"
      >
        <v-icon>mdi-login</v-icon> {{ $t('global.login') }}
      </v-btn>
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
    <v-main style="height: 100vh;">
      <default-snackbar
        :text="$t('global.itemDialog.snackbar.deleteFailure') + ': ' + snackbar.msg.data"
        :show="snackbar.deleteFailure"
        color="error"
      />
      <default-snackbar
        :text="$t('global.itemDialog.snackbar.deleteSuccess')"
        :show="snackbar.deleteSuccess"
      />
      <default-snackbar
        :text="$t('global.itemDialog.snackbar.saveFailure') + ': ' + snackbar.msg.data"
        :show="snackbar.saveFailure"
        color="error"
      />
      <default-snackbar
        :text="$t('global.itemDialog.snackbar.saveSuccess')"
        :show="snackbar.saveSuccess"
      />
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import DefaultSnackbar from '~/components/snackbars/default-snackbar'
export default {
  components: {
    DefaultSnackbar
  },
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: true,
      right: true,
      rightDrawer: false,
      title: 'global.appName',
      snackbar: {
        msg: '',
        deleteFailure: false,
        deleteSuccess: false,
        saveFailure: false,
        saveSuccess: false
      }
    }
  },
  mounted () {
    this.$root.$on('showSaveSuccessSnackbar', () => {
      this.showSaveSuccessSnackbar()
    })
    this.$root.$on('showDeleteSuccessSnackbar', () => {
      this.showDeleteSuccessSnackbar()
    })
    this.$root.$on('handleSaveFailure', (msg) => {
      this.handleSaveFailure(msg)
    })
    this.$root.$on('handleDeleteFailure', (msg) => {
      this.handleDeleteFailure(msg)
    })
    window.addEventListener('storage', function (event) {
      if (event.key === 'auth._token.keycloak' && event.oldValue !== event.newValue && event.newValue === 'false') {
        location.reload()
      }
    })
  },
  methods: {
    async logout () {
      try {
        await this.$auth.logout()
      } catch (err) {

      }
    },
    async loginWithKeycloak () {
      try {
        await this.$auth.loginWith('keycloak')
      } catch (err) {
      }
    },
    async showSaveSuccessSnackbar () {
      this.snackbar.saveSuccess = true
      await new Promise(resolve => setTimeout(resolve, 2000))
      this.snackbar.saveSuccess = false
    },
    async showDeleteSuccessSnackbar () {
      this.snackbar.deleteSuccess = true
      await new Promise(resolve => setTimeout(resolve, 2000))
      this.snackbar.deleteSuccess = false
    },
    async handleSaveFailure (msg) {
      this.snackbar.msg = msg
      this.snackbar.saveFailure = true
      await new Promise(resolve => setTimeout(resolve, 3500))
      this.snackbar.saveFailure = false
    },
    async handleDeleteFailure (msg) {
      this.snackbar.msg = msg
      this.snackbar.deleteFailure = true
      await new Promise(resolve => setTimeout(resolve, 3500))
      this.snackbar.deleteFailure = false
    }
  }
}
</script>

<style>

.dehubText {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -25px;
  margin-left: -25px;
}

.fixedBottom {
  position: fixed !important;
  bottom: 0 !important;
  width: 100%;
}

</style>
