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

    <b-row class="projects_list" align-h="center">
      <b-col class="col-11">
        <b-list-group class="project_item" v-for="project in projects" :key="project.id">
          <b-list-group-item>
            <b-row>
              <b-col cols="9">
                <div v-if="si_project_url && project.si_id">
                  <a href="#" @click="openProjectUrl(project.si_id)">{{ project.si_id }}</a> - {{ project.name }}
                </div>
                <div v-else>
                  {{ project.name }}
                </div>
              </b-col>

              <b-col cols="3">
                <div class="buttons">
                  <b-button @click.prevent v-b-toggle="editId(project.id)" v-b-tooltip.hover :title="$t('projects.edit')" variant="outline-secondary" size="sm"><i class="fa fa-edit" aria-hidden="true"></i></b-button>
                  &nbsp;
                  <b-button v-on:click="deleteProject(project.id)" v-b-tooltip.hover :title="$t('projects.delete')" variant="outline-danger" size="sm"><i class="fa fa-remove" aria-hidden="true"></i></b-button>
                </div>
              </b-col>
            </b-row>

            <b-collapse :id="editId(project.id)" :data-project-id="project.id">
              <b-row>
                <b-col cols="8">TODO</b-col>
                <b-col cols="4"></b-col>
              </b-row>
            </b-collapse>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
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
    },
    deleteProject: function (projectId) {
      window.ipcRenderer.sendSync('deleteProject', projectId)
      this.$store.commit('loadProjects')
    },
    editId(id) { return `editProject${id}` }
  },
  computed: {
    ...mapState(['si_project_url', 'projects']),
  },
  watch: {
  }
}
</script>
