<template>
  <div class="tasks">
    .
  </div>
</template>

<script>
// TODO: move projects list into global state
export default {
  name: 'Home',
  data: () => ({
    projects: []
  }),
  components: {
},
  mounted () {
    this.loadProjects()

    // A task has been removed
    window.ipcRenderer.on('projectRemoved', (_, {projectId}) => {
      console.log(projectId)
    });

    // A task has been added
    window.ipcRenderer.on('projectAdded', (_, projectObject) => {
      console.log(projectObject)
    });
  },
  methods: {
    loadProjects: function () {
      this.projects = window.ipcRenderer.sendSync('getProjects')
    }
  },
  computed: {
  },
  watch: {
  }
}
</script>
