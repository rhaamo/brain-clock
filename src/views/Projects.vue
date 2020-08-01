<template>
  <div class="projects">
    <div class="add_project">

      <b-form @submit="addProject">
        <b-row align-h="center">
          <b-col cols="6">
            <b-form-input v-model="newProject.name" class="mb-12" :placeholder="$t('projects.form.name')"></b-form-input>
          </b-col>

          <b-col cols="3">
            <b-form-input v-model="newProject.si_id" class="mb-12" :placeholder="$t('projects.form.si_id')"></b-form-input>
          </b-col>

          <b-col cols="2">
            <b-button type="submit" variant="primary">{{ $t("projects.form.save") }}</b-button>
          </b-col>
        </b-row>
      </b-form>

    </div>

    <div class="projects_list">
      <div class="project_item" v-for="project in projects" :key="project.id">
        <div v-if="si_project_url">
          <a href="#" @click="openProjectUrl(project.si_id)">{{ project.si_id }}</a> - {{ project.name }}
        </div>
        <div v-else>
          {{ project.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Home',
  data: () => ({
    newProject: {
      name: "",
      si_id: ""
    }
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
    },
    addProject: function (event) {
      event.preventDefault()
      if (this.newProject.name !== "") {
        window.ipcRenderer.sendSync('addProject', {name: this.newProject.name, si_id: this.newProject.si_id})
        this.newProject.name = this.newProject.si_id = ""
        this.$store.commit('loadProjects')
      }
    },
    openProjectUrl: function (si_id) {
      window.ipcRenderer.send('openProjectSiUrl', si_id)
    }
  },
  computed: {
    ...mapState(['si_project_url', 'projects']),
  },
  watch: {
  }
}
</script>
