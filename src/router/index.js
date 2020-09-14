import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

function route(path) {
  return () => import('@/views/' + path)
}

const routes = [{
  path: '/login',
  component: route('login')
}]

const router = new VueRouter({
  routes
})

export default router