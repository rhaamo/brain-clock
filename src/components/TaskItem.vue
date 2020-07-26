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
            <textarea v-model="edit.taskDescription" name="taskText" id="taskText" cols="35" rows="3" placeholder="OwO ?"></textarea>
          </b-col>

          <b-col cols="4" align="center">
            <b-button size="sm" type="submit" variant="primary">{{ $t("tasks.form.update") }}</b-button>
          </b-col>
        </b-row>

        <b-form-datepicker id="manualTaskTime" size="sm" today-button :locale="$i18n.locale" value-as-date v-model="edit.taskDay" start-weekday="1"></b-form-datepicker>

        <b-row>
          <div class="col">
            <b-form-timepicker id="manualTaskFrom" size="sm" :state="fromToState" :placeholder="$t('header.manual.from')" now-button :show-seconds="false" :hide-header="true" :hour12="false" :locale="$i18n.locale" v-model="edit.taskFrom"></b-form-timepicker>
          </div>
          <div class="col">
            <b-form-timepicker id="manualTaskTo" size="sm" :state="fromToState" :placeholder="$t('header.manual.to')" :hour12="false" :show-seconds="false" :hide-header="true" :locale="$i18n.locale" v-model="edit.taskTo"></b-form-timepicker>
          </div>
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
    edit: {
      taskDescription: null,
      taskDay: null,
      taskFrom: null,
      taskTo: null
    }
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
    editId() { return `editTask${this.task.id}` },
    fromToState() { return timeUtils.fromSupTo(this.task.started, this.task.ended) ? false : null },
  },
  mounted () {
    this.edit.taskDescription = this.task.title
    this.edit.taskDay = new Date(this.task.started)
    this.edit.taskFrom = this.taskFrom
    this.edit.taskTo = this.taskTo
  },
  methods: {
    deleteTask: function (taskId) {
      window.ipcRenderer.send('deleteTask', taskId)
    },
    saveTask (event) {
      event.preventDefault()

      let fromHours = this.edit.taskFrom.split(":")[0]
      let fromMinutes = this.edit.taskFrom.split(":")[1]

      let startDate = this.edit.taskDay
      startDate.setHours(fromHours)
      startDate.setMinutes(fromMinutes)
      startDate.setSeconds(0)

      let duration = timeUtils.deltaHms(this.edit.taskFrom, this.edit.taskTo)

      let res = window.ipcRenderer.sendSync('updateTask', {taskId: this.task.id, start: startDate, duration: duration, title: this.edit.taskDescription})
      console.log(res)
      if (res === true) {
        this.task.title = this.edit.taskDescription
        this.task.started = startDate
        this.task.duration = duration
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
