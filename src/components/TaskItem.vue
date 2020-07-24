<template>
  <div>
    <div class="taskItem" :data-task-id="task.id">
      <div class="taskTimes">
        <span class="taskSpent">{{ taskDuration }}</span> <span class="taskSpan pull-right">{{ taskDay }}, {{ taskFrom }} {{ $t('tasks.to') }} {{ taskTo }}</span>
      </div>
      <b-row>
        <b-col class="taskTitle">
          <blockquote class="blockquote font-weight-light">
            {{ task.title || $t('tasks.noDescription') }}
          </blockquote>
        </b-col>
        <b-col class="taskActions text-right" cols="3">
          <b-button @click.prevent v-b-toggle="editId" :title="$t('tasks.editThisTask')" variant="outline-secondary" size="sm"><i class="fa fa-edit" aria-hidden="true"></i></b-button>
          &nbsp;
          <b-button v-on:click="deleteTask(task.id)" :title="$t('tasks.removeThisTask')" variant="outline-danger" size="sm"><i class="fa fa-remove" aria-hidden="true"></i></b-button>
        </b-col>
      </b-row>
    </div>

    <b-collapse class="taskEdit" :id="editId" :data-task-id="task.id">
      <b-form @submit="saveTask">
        <b-row>
          <b-col cols="8">
            <textarea v-model="taskDescription" name="taskText" id="taskText" cols="35" rows="3" placeholder="OwO ?"></textarea>
          </b-col>

          <b-col cols="4" align="center">
            <b-button size="sm" type="submit" variant="primary">{{ $t("tasks.form.update") }}</b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-collapse>
  </div>
</template>

<script>
import timeUtils from '../utils/time'

export default {
  name: 'TaskItem',
  data: () => ({
    taskDescription: null
  }),
  props: {
    task: Object
  },
  computed: {
    taskDay() { return timeUtils.formatShort(this.task.started, this.$i18n.locale) },
    taskFrom() { return timeUtils.formatShort(this.task.started, this.$i18n.locale, 'HH:mm:ss') },
    taskTo() { 
      let endDate = new Date(this.task.started)
      endDate.setSeconds(endDate.getSeconds() + this.task.duration)
      return timeUtils.formatShort(endDate, this.$i18n.locale, 'HH:mm:ss')
      },
    taskDuration() { return timeUtils.secondsToDdHhMmSs(this.task.duration, this.$i18n.locale) },
    editId() { return `editTask${this.task.id}` }
  },
  mounted () {
    this.taskDescription = this.task.title
  },
  methods: {
    deleteTask: function (taskId) {
      window.ipcRenderer.send('deleteTask', taskId)
    },
    saveTask (event) {
      event.preventDefault()
      let res = window.ipcRenderer.sendSync('updateTask', {taskId: this.task.id, start: this.task.started, duration: this.task.duration, title: this.taskDescription})
      if (res === true) {
        this.task.title = this.taskDescription
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
