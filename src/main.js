import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

Vue.config.productionTip = false

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'fork-awesome/scss/fork-awesome.scss'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
