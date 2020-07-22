<template>
  <div id="app">
    <header id="appHeader">
      <b-container fluid>
        <b-row>
          <b-col cols="4">
            <textarea v-model="taskText" name="taskText" id="taskText" cols="20" rows="3" placeholder="OwO ?"></textarea>
          </b-col>
          <b-col cols="auto">
            {{ $t("header.started") }} <span id="timerStartDate">{{taskStartedAt}}</span><br />
            {{ $t("header.spent") }} <span id="timerSpentTime">{{taskTimeSpent}}</span>
          </b-col>
          <b-col align="right">
            <b-button v-on:click="toggleTimer" variant="primary" id="btTimer"><i :class="timer.icon" aria-hidden="true"></i></b-button>
          </b-col>
        </b-row>
      </b-container>
    </header>

    <div id="nav">
      <b-nav tabs justified>
        <b-nav-item :active='$route.name =="home"' :to="{ name: 'home' }">{{ $t("nav.tasks") }}</b-nav-item>
        <b-nav-item :active='$route.name =="settings"' :to="{ name: 'settings' }">{{ $t("nav.settings") }}</b-nav-item>
        <b-nav-item :active='$route.name =="about"' :to="{ name: 'about' }">{{ $t("nav.about") }}</b-nav-item>
      </b-nav>
    </div>

    <router-view/>
  </div>
</template>

<style lang="scss" src="./App.scss"></style>

<script>
import timeUtils from './utils/time'

export default {
  data: () => ({
    taskText: '',
    timer: {
      startedAt: null,
      ticking: false,
      spent: null,
      icon: 'fa fa-play'
    },
    timerInterval: null,
    preferences: {
      locale: 'en-US'
    }
  }),
  computed: {
    taskStartedAt() { return this.timer.startedAt === null ? this.$t("header.time.notYet") : timeUtils.formatShort(this.timer.startedAt, this.$i18n.locale) },
    taskTimeSpent() { return this.timer.spent === null ? this.$t("header.time.oNs") : timeUtils.secondsToDdHhMmSs(this.timer.spent, this.$i18n.locale) }
  },
  methods: {
    toggleTimer: function () {
      window.ipcRenderer.send('toggleTimer', this.taskText || '');
    },
    startTimer: function () {
      if (this.timer.ticking) {
        let delta = Date.now() - this.timer.startedAt;
        let seconds = Math.floor(delta / 1000);
        this.timer.spent = seconds; // TODO: moment js duration
      }
    }
  },
  mounted () {
    // timer started
    window.ipcRenderer.on('timerStarted', (_, startDate) => {
      console.log('started', startDate);
      this.timer.icon = 'fa fa-stop';
      this.timer.startedAt = startDate;
      this.timer.ticking = true;
      this.timerInterval = setInterval(this.startTimer, 1000);
    });

    // timer stopped
    window.ipcRenderer.on('timerStopped', (_, startDate, endDate) => {
      console.log('stopped', startDate, endDate);
      this.timer.icon = 'fa fa-play';
      this.timer.ticking = false;
      this.timer.startedAt = null;
      this.timer.spent = null;
      this.taskText = ''
      clearInterval(this.timerInterval)
    });

    // Get various preferences
    this.$root.$i18n.locale = this.preferences.locale = window.ipcRenderer.sendSync('getPreference', {key: 'locale'})
  },

}
</script>
