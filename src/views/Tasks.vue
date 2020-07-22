<template>
  <div class="tasks">
    <TaskItem v-for="task in tasks" :key="task.id" :task="task"   />
  </div>
</template>

<script>
import TaskItem from '@/components/TaskItem.vue'

export default {
  name: 'Home',
  data: () => ({
    tasks: []
  }),
  components: {
    TaskItem
},
  mounted () {
    this.tasks = window.ipcRenderer.sendSync('getAllTasks')
    console.log(this.tasks)
  }
}
</script>
