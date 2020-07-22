<template>
  <div class="taskItem" :data-task-id="task.id">
    <div class="taskTimes">
      <span class="taskSpent">{{ taskDuration }}</span> <span class="taskSpan pull-right">{{ taskStartedAt }} {{ $t('tasks.to') }} {{ taskEndedAt }}</span>
    </div>
    <b-row>
      <b-col class="taskTitle">
        <blockquote class="blockquote font-weight-light">
          {{ task.title || $t('tasks.noDescription') }}
        </blockquote>
      </b-col>
      <b-col class="taskActions text-right" cols="2">
        <b-button v-on:click="deleteTask(task.id)" :title="$t('tasks.removeThisTask')" variant="outline-danger" size="sm"><i class="fa fa-remove" aria-hidden="true"></i></b-button>
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
    taskStartedAt() { return timeUtils.formatShort(this.task.started, this.$i18n.locale) },
    taskEndedAt() { return timeUtils.formatShort(this.task.ended, this.$i18n.locale) },
    taskDuration() { return timeUtils.secondsToDdHhMmSs(this.task.duration, this.$i18n.locale) }
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
