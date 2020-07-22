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
  }
}
</script>
