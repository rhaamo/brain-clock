<template>
  <div class="taskItem">
    {{ task.id }}, {{ task.title }}
  </div>
</template>

<script>
export default {
  name: 'TaskItem',
  props: {
    task: Object
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
