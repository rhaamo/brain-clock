<template>
  <div id="app">
    <div class="sticky-top">
      <header id="appHeader">
          <div id="ahTaskText">
            <textarea v-model="taskText" name="taskText" id="taskText" cols="20" rows="3" placeholder="OwO ?"></textarea>
          </div>

          <div id="ahTimes" v-if="autoMode">
            {{ $t("header.started") }} <span id="timerStartDate">{{taskStartedAt}}</span><br />
            {{ $t("header.spent") }} <span id="timerSpentTime">{{taskTimeSpent}}</span>
          </div>
          <div id="ahTimes" v-else>
            <b-form-datepicker id="manualTaskTime" size="sm" today-button :locale="$i18n.locale" value-as-date v-model="manual.day" start-weekday="1"></b-form-datepicker>

            <div class="row">
              <div class="col">
                <b-form-timepicker id="manualTaskFrom" size="sm" :state="fromToState" :placeholder="$t('header.manual.from')" now-button :show-seconds="false" :hide-header="true" :hour12="false" :locale="$i18n.locale" v-model="manual.from"></b-form-timepicker>
              </div>
              <div class="col">
                <b-form-timepicker id="manualTaskTo" size="sm" :state="fromToState" :placeholder="$t('header.manual.to')" now-button :hour12="false" :show-seconds="false" :hide-header="true" :locale="$i18n.locale" v-model="manual.to"></b-form-timepicker>
              </div>
            </div>
            <br/>
          </div>

          <div id="ahBtns">
            <b-button v-on:click="toggleTimer" variant="primary" id="btTimer" :title="$t('header.btn.save')" ><i :class="timer.icon" aria-hidden="true"></i></b-button>
          </div>
          <div id="ahBtnManual">
            <b-button v-on:click="toggleManualTask" size="sm" variant="primary" id="btManualTask" :title="$t('header.btn.manual')" ><i class="fa fa-list-ul" aria-hidden="true"></i></b-button>
          </div>
      </header>

      <div id="nav">
        <b-nav tabs justified>
          <b-nav-item :active='$route.name =="home"' :to="{ name: 'home' }">{{ $t("nav.tasks") }}</b-nav-item>
          <b-nav-item :active='$route.name =="settings"' :to="{ name: 'settings' }">{{ $t("nav.settings") }}</b-nav-item>
          <b-nav-item :active='$route.name =="about"' :to="{ name: 'about' }">{{ $t("nav.about") }}</b-nav-item>
        </b-nav>
      </div>
    </div>

    <router-view/>

    <div class="weekSelector fixed-bottom">
      something something here
    </div>
  </div>
</template>

<style lang="scss" src="./App.scss"></style>

<script>
import timeUtils from './utils/time'

export default {
  data: () => ({
    autoMode: true,
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
    },
    manual: {
      day: null,
      from: null,
      to: null
    }
  }),
  computed: {
    taskStartedAt() { return this.timer.startedAt === null ? this.$t("header.time.notYet") : timeUtils.formatShort(this.timer.startedAt, this.$i18n.locale) },
    taskTimeSpent() { return this.timer.spent === null ? this.$t("header.time.oNs") : timeUtils.secondsToDdHhMmSs(this.timer.spent, this.$i18n.locale) },
    fromToState() { return timeUtils.fromSupTo(this.manual.from, this.manual.to) ? false : null }
  },
  methods: {
    toggleTimer: function () {
      if (!this.autoMode) {
        if (this.fromToState !== false) {
          let fromHours = this.manual.from.split(":")[0]
          let fromMinutes = this.manual.from.split(":")[1]

          let startDate = this.manual.day
          startDate.setHours(fromHours)
          startDate.setMinutes(fromMinutes)
          startDate.setSeconds(0)

          let duration = timeUtils.deltaHms(this.manual.from, this.manual.to)
          window.ipcRenderer.send('addManualTask', {startDate: startDate, duration: duration, text: this.taskText})

          // reset task text
          this.taskText = ''
        }
      } else {
        window.ipcRenderer.send('toggleTimer', this.taskText || '')
      }
    },
    startTimer: function () {
      if (this.timer.ticking) {
        let delta = Date.now() - this.timer.startedAt;
        let seconds = Math.floor(delta / 1000);
        this.timer.spent = seconds; // TODO: moment js duration
      }
    },
    toggleManualTask: function () {
      if (!this.timer.ticking) {
        if (this.autoMode) {
          let today = new Date()
          this.autoMode = false
          this.timer.icon = "fa fa-plus"
          this.manual.day = today
          this.manual.from = `${today.getHours()}:${today.getMinutes()}:00`

          let todayInTenMinutes = new Date(today.getTime() + 10*60000)
          this.manual.to = `${todayInTenMinutes.getHours()}:${todayInTenMinutes.getMinutes()}:00`
        } else {
          this.autoMode = true
          this.timer.icon = "fa fa-play"
        }
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
    window.ipcRenderer.on('timerStopped', (_, startDate) => {
      console.log('stopped', startDate);
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
