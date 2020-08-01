<template>
  <div class="settings">

      <b-form @submit="saveSettings">
        <b-row align-h="center">
          <b-col cols="5">
            <b-form-group
              id="igLocale"
              :label="$t('settings.form.locale')"
              label-for="locale"
            >
            <b-form-select v-model="locale" :options="availableLocales" class="mb-2"></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row align-h="center">
          <b-col cols="10">
            <b-form-group
              id="igSiProjectUrl"
              :label="$t('settings.form.si_project_url')"
              label-for="si_project_url"
            >
            <b-form-input v-model="si_project_url" class="mb-4"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row align-h="center">
          <b-col cols="4" align="center">
            <b-button type="submit" variant="primary">{{ $t("settings.form.save") }}</b-button>
          </b-col>
        </b-row>
      </b-form>

  </div>
</template>

<script>
export default {
  data: () => ({
    locale: 'en-US',  
    availableLocales: [ { value: 'en-US', text: 'English'}, { value: 'fr-FR', text: 'Français' } ],
    si_project_url: ""
  }),
  mounted () {
    // slightly delay that to ensure we have loaded the settings in store
    this.$nextTick(function () {
      this.locale = this.$root.$i18n.locale
      this.si_project_url = this.$store.getters.getSiProjectUrl
    })
  },
  methods: {
    saveSettings (event) {
      console.log("saving settings", this.locale)
      event.preventDefault();
      this.$root.$i18n.locale = this.locale
      window.ipcRenderer.send('setPreference', {key: 'locale', value: this.locale})
      window.ipcRenderer.send('setPreference', {key: 'si_project_url', value: this.si_project_url})
    }
  }
}
</script>