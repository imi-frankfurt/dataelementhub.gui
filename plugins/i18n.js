export default ({ app }) => {
  app.i18n.beforeLanguageSwitch = (oldLocale, newLocale) => {
    app.vuetify.framework.lang.current = newLocale
  }
}
