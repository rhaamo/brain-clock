import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedTasksListWeek: null,
    projects: [],
    si_project_url: null
  },
  mutations: {
    setSelectedTasksListWeek (state, day) {
      state.selectedTasksListWeek = day
    },
    loadProjects (state ) {
      state.projects = window.ipcRenderer.sendSync('getProjects')
    },
    setSiProjectUrl (state, si_project_url) {
      state.si_project_url = si_project_url
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    selectedWeek: state => { return state.selectedTasksListWeek },
    getProjects: state => { return state.projects },
    getSiProjectUrl: state => { return state.si_project_url }
  }
})
