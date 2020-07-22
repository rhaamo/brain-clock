<template>
  <div class="taskItem" :data-task-id="task.id">
    <div class="taskTimes">
      <span class="taskSpent">{{ taskDuration }}</span> <span class="taskSpan pull-right">{{ taskStartedAt }} to {{ taskEndedAt }}</span>
    </div>
    <b-row>
      <b-col class="taskTitle">
        <blockquote class="blockquote font-weight-light">
          {{ task.title || 'No task description.' }}
        </blockquote>
      </b-col>
      <b-col class="taskActions text-right" cols="2">
        <b-button v-on:click="deleteTask(task.id)" variant="outline-danger" size="sm"><i class="fa fa-remove" aria-hidden="true"></i></b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import timeUtils from '../utils/time'

export default {
  name: 'TaskItem',
  props: {
    task: Object
  },
  computed: {
    taskStartedAt() { return timeUtils.formatShort(this.task.started) },
    taskEndedAt() { return timeUtils.formatShort(this.task.ended) },
    taskDuration() { return timeUtils.secondsToDdHhMmSs(this.task.duration) }
  },
  methods: {
    deleteTask: function (taskId) {
      window.ipcRenderer.send('deleteTask', taskId)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
