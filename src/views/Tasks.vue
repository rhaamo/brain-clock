<template>
  <div class="tasks">
    <div class="tasksDay" v-for="(tasks, day) in tasks" :key="day" :tasks="tasks[tasks]">
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
  }),
  components: {
    TaskItem
},
  mounted () {
  },
  methods: {
    getLocalDay: function (day) {
      return moment(day, 'DD.MM.YYYY').locale(this.$i18n.locale).format('dddd, DD MMMM')
    }
  },
  computed: {
    ...mapState(['tasks'])
  }
}
</script>
