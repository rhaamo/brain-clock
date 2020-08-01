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
        <ProjectItem v-for="project in projects" :key="project.id" :project="project" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProjectItem from '@/components/ProjectItem.vue'

export default {
  name: 'Home',
  data: () => ({
    newProject: {
      name: "",
      si_id: ""
    }
  }),
  components: {
    ProjectItem
  },
  mounted () {
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
  },
  computed: {
    ...mapState(['projects']),
  },
  watch: {
  }
}
</script>
