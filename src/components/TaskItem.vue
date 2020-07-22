<template>
  <div class="taskItem" :data-task-id="task.id">
    <div class="taskTimes">
      <span class="taskSpent">{{ taskDuration }}</span> - <span class="taskStarted">{{ taskStartedAt }}</span> to <span class="taskEnded">{{ taskEndedAt }}</span>
    </div>
    <div class="taskTitle">{{ task.title }}</div>
    <div class="taskActions"><i class="fa fa-remove"></i></div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'TaskItem',
  props: {
    task: Object
  },
  computed: {
    taskStartedAt() { return this.momentFormat(this.task.started) },
    taskEndedAt() { return this.momentFormat(this.task.ended) },
    taskDuration() { return this.momentDuration(this.task.duration) }
  },
  methods: {
    momentFormat: function (date) {
      return moment(date).locale('fr').format('ddd D, HH:mm:ss')
    },
    momentDuration: function (seconds) {
      return moment.duration(seconds, 'seconds').locale('fr').humanize(false, { s: 60, m: 60, h: 24 }); // be more precise
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
