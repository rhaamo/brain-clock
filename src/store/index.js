import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedTasksListWeek: null
  },
  mutations: {
    setSelectedTasksListWeek (state, day) {
      state.selectedTasksListWeek = day
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    selectedWeek: state => {
      return state.selectedTasksListWeek
    }
  }
})
