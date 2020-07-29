<template>
  <div class="tasks">
    <div class="tasksDay" v-for="(tasks, day) in tasksDays" :key="day" :tasks="tasksDays[tasks]">
      <div class="taskDayHeader">{{ getLocalDay(day) }}</div>
      <TaskItem v-for="task in tasks" :key="task.id" :task="task" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TaskItem from '@/components/TaskItem.vue'
import moment from 'moment'

export default {
  name: 'Home',
  data: () => ({
    tasksDays: []
  }),
  components: {
    TaskItem
},
  mounted () {
    this.loadSelectedWeekTasks(this.$store.getters.selectedWeek)

    // A task has been removed
    window.ipcRenderer.on('taskRemoved', (_, {taskId}) => {
      for (var d in this.tasksDays) {
        for (var i = 0; i < this.tasksDays[d].length; i++) {
          if (this.tasksDays[d][i].id === taskId) {
            this.tasksDays[d].splice(i, 1)
            i--
          }
        }
      }
    });

    // A task has been added
    window.ipcRenderer.on('taskAdded', (_, taskObject) => {
      let day = moment(taskObject.started).hours(0).minutes(0).seconds(0).milliseconds(0).toISOString()
      for (var d in this.tasksDays) {
        if (d === day) {
          this.tasksDays[d].unshift(taskObject)
        }
      }
    });
  },
  methods: {
    loadSelectedWeekTasks: function (day) {
      let mday = moment(day)
      let startDay = mday.startOf('isoWeek').toDate()
      let endDay = mday.endOf('isoWeek').toDate()
      this.tasksDays = window.ipcRenderer.sendSync('getTasksBetween', {from: startDay, to: endDay})
      console.log(this.tasksDays)
    },
    getLocalDay: function (day) {
      return moment(day).locale(this.$i18n.locale).format('dddd, DD MMMM')
    }
  },
  computed: {
    ...mapState(['selectedTasksListWeek'])
  },
  watch: {
    'selectedTasksListWeek': function (val, ) {
      this.loadSelectedWeekTasks(val)
    }
  }
}
</script>
