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
    availableLocales: [ { value: 'en-US', text: 'English'}, { value: 'fr-FR', text: 'Français' } ]
  }),
  mounted () {
    this.locale = this.$root.$i18n.locale
    console.log(this.locale)
  },
  methods: {
    saveSettings (event) {
      console.log("saving settings", this.locale)
      event.preventDefault();
      this.$root.$i18n.locale = this.locale
      window.ipcRenderer.send('setPreference', {key: 'locale', value: this.locale})
    }
  }
}
</script>