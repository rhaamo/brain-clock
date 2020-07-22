<template>
  <div class="taskItem" :data-task-id="task.id">
    <div class="taskTimes">
      <span class="taskSpent">{{ taskDuration }}</span> <span class="taskSpan pull-right">{{ taskStartedAt }} to {{ taskEndedAt }}</span>
    </div>
    <b-row>
      <b-col class="taskTitle">
        <blockquote class="blockquote font-weight-light">
          {{ task.title }}
        </blockquote>
      </b-col>
      <b-col class="taskActions text-right" cols="2">
        <b-button variant="outline-danger" size="sm"><i class="fa fa-remove" aria-hidden="true"></i></b-button>
      </b-col>
    </b-row>
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
