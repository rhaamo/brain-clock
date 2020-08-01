<template>
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

    <b-collapse class="editProjectCollapse" :id="editId(project.id)">
      <b-row>
        <b-col cols="6">
          <b-form-input :value="project.name" ref="name" sm="2" size="sm" :placeholder="$t('projects.form.name')"></b-form-input>
        </b-col>
        <b-col cols="3">
          <b-form-input :value="project.si_id" ref="id" sm="2" size="sm" :placeholder="$t('projects.form.si_id')"></b-form-input>
        </b-col>
        <b-col cols="3">
          <b-button size="sm" type="submit" variant="primary" @click="updateProject(project.id)">{{ $t("projects.form.save") }}</b-button>
        </b-col>
      </b-row>
    </b-collapse>
  </b-list-group-item>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ProjectItem',
  props: {
    project: Object
  },
  data: () => ({
  }),
  components: {
  },
  mounted () {
  },
  methods: {
    openProjectUrl: function (si_id) {
      window.ipcRenderer.send('openProjectSiUrl', si_id)
    },
    deleteProject: function (projectId) {
      window.ipcRenderer.sendSync('deleteProject', projectId)
      this.$store.commit('loadProjects')
      this.$store.commit('reloadTasks')
    },
    editId(id) { return `editProject${id}` },
    updateProject(id) {
      let name = this.$refs.name.vModelValue
      let si_id = this.$refs.id.vModelValue
      window.ipcRenderer.sendSync('updateProject', {id: id, name: name, si_id: si_id})
      this.$store.commit('loadProjects')
    }
  },
  computed: {
    ...mapState(['si_project_url']),
  },
  watch: {
  }
}
</script>
