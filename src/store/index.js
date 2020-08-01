import Vue from 'vue'
import Vuex from 'vuex'

import moment from 'moment'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedTasksListWeek: null,
    projects: [],
    tasks: [],
    si_project_url: null
  },
  mutations: {
    setSelectedTasksListWeek (state, day) {
      state.selectedTasksListWeek = day
    },
    loadProjects (state ) {
      state.projects = window.ipcRenderer.sendSync('getProjects')
    },
    loadTasksBetween (state, startDay, endDay) {
      state.tasks = window.ipcRenderer.sendSync('getTasksBetween', {from: startDay, to: endDay})
    },
    setSelectedWeekAndReloadTasks (state, day) {
      state.selectedTasksListWeek = day
      let mday = moment(state.selectedTasksListWeek)
      let startDay = mday.startOf('isoWeek').toDate()
      let endDay = mday.endOf('isoWeek').toDate()
      state.tasks = window.ipcRenderer.sendSync('getTasksBetween', {from: startDay, to: endDay})
    },
    reloadTasks (state) {
      let mday = moment(state.selectedTasksListWeek)
      let startDay = mday.startOf('isoWeek').toDate()
      let endDay = mday.endOf('isoWeek').toDate()
      state.tasks = window.ipcRenderer.sendSync('getTasksBetween', {from: startDay, to: endDay})
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
    getTasks: state => { return state.tasks },
    getSiProjectUrl: state => { return state.si_project_url }
  }
})
