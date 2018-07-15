import Vue from 'vue'
import App from './App.vue'

import Buefy from 'buefy'
import 'buefy/lib/buefy.css'
import { apolloProvider } from './apollo'
Vue.config.productionTip = false
Vue.use(Buefy)

import router from './router'

new Vue({
  el: '#app',
  provide: apolloProvider.provide(),
  render: h => h(App),
  router: router,
  components: App
})

// new Vue({
//   el: '#app',
//   apolloProvider,
//   router,
//   store,
//   template: '<App />',
//   components: {App}
//   // watch: {
//   //   '$route' (to, from) {
//   //     console.log('route changed', to, from)
//   //   }
//   // }
// })
