<template>
  <div class="dashboard">

      <b-row align-h="center" class="text-center">
        <b-col cols="11">
          <DashboardChart :chart-data="chartDataFinal" :options="chartOptions" />
        </b-col>
      </b-row>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import DashboardChart from '@/components/DashboardChart.vue'

export default {
  data: () => ({
    days: [],
    chartData: [],
    chartOptions: {
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'dddd DD MMMM',
            displayFormats: {
              day: 'ddd DD MMM'
            }
          },
          distribution: 'serie'
        }],
        yAxes: [{
          type: 'linear',
          ticks: {
            min: 0
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: function (tti) {
            return moment.duration(tti.yLabel, 'hours').format('hh[h] mm[m] ss[s]')
          }
        }
      }
    }
  }),
  components: {
    DashboardChart
  },
  methods: {
    reloadDashboard () {
      // reset stuff
      this.days = this.chartData = []

      // compute list of days

      let start = moment(this.selectedTasksListWeek).startOf('isoWeek')
      let end = moment(this.selectedTasksListWeek).endOf('isoWeek')
      
      let day = start

      while(day <= end) {
        this.days.push(day.toDate())
        day = day.clone().add(1, 'd')
      }

      // now compute time spend each day

      this.chartData = this.days.map(x => {
        let time = 0

        let timeDay = this.tasks[moment(x).format('DD.MM.YYYY')]
        if (timeDay) {
          for (let i=0; i<timeDay.length;i++) {
            time += timeDay[i].duration
            }
        } else {
          time = 0
        }
        let t = time / 3600
        return Math.round(t * 100) / 100
      })

    }
  },
  mounted () {
    moment.locale(this.$i18n.locale)
    this.reloadDashboard()
  },
  computed: {
    ...mapState(['selectedTasksListWeek', 'tasks']),
    chartDataFinal() {
      return {
        labels: this.days,
        datasets: [
          {
            label: 'Time spent',
            data: this.chartData,
            backgroundColor: "#d7ecfa"
          }
        ]
      }
    }
  },
  watch: {
    'selectedTasksListWeek': function () {
      this.reloadDashboard()
    }
  }
}
</script>
