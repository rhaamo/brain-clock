<template>
  <div class="tasks"> 
    <TaskItem v-for="task in tasks" :key="task.id" :task="task" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TaskItem from '@/components/TaskItem.vue'
import moment from 'moment'

export default {
  name: 'Home',
  data: () => ({
    tasks: []
  }),
  components: {
    TaskItem
},
  mounted () {
    this.loadSelectedWeekTasks(this.$store.getters.selectedWeek)

    // A task has been removed
    window.ipcRenderer.on('taskRemoved', (_, {taskId}) => {
      for (var i = 0; i < this.tasks.length; i++) {
        if (this.tasks[i].id === taskId) {
          this.tasks.splice(i, 1)
          i--
        }
      }
    });

    // A task has been added
    window.ipcRenderer.on('taskAdded', (_, taskObject) => {
      this.tasks.unshift(taskObject)
    });
  },
  methods: {
    loadSelectedWeekTasks: function (day) {
      let mday = moment(day)
      let startDay = mday.startOf('isoWeek').toDate()
      let endDay = mday.endOf('isoWeek').toDate()
      this.tasks = window.ipcRenderer.sendSync('getTasksBetween', {from: startDay, to: endDay})
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
