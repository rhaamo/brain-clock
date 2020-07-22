<template>
  <div class="about">

      <b-row align-h="center" class="text-center">
        <b-col cols="8">
          {{ $t('about.description') }}<br/><br/>
          <a href="#" @click="openAboutPage">{{ $t('about.sources') }}</a>
        </b-col>
      </b-row>

  </div>
</template>

<script>
export default {
  methods: {
    openAboutPage: function (event) {
      event.preventDefault()
      window.ipcRenderer.send('openAboutLink')
    }
  }
}
</script>
