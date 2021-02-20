import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Management from '../views/Management.vue'
import Settings from '../views/Settings.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Main',
    component: Main
  },
  {
    path: '/mgmt',
    name: 'Management',
    component: Management
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
]

const router = new VueRouter({
  routes
})

export default router