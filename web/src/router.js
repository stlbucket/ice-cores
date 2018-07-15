import Vue from 'vue'
import VueRouter from 'vue-router'

import CoreList from './components/core/List'
import CoreDetail from './components/core/Detail'

const routes = [
  {
    path: '/',
    component: CoreList
  },
  {
    path: '/cores',
    component: CoreList
  },
  {
    path: '/core/:name',
    component: CoreDetail
  }
]

Vue.use(VueRouter)

// console.log('Router.currentRoute: ', Router.currentRoute)
export default new VueRouter({
  routes
})
