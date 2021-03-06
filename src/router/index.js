import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

function route(path) {
  return () => import('@/views/' + path)
}

const routes = [{
  path: '/login',
  component: route('login')
}, {
  path: '/home',
  component: route('home'),
  children: [{
    path: '/users',
    component: route('user/userlist')
  }, {
    path: '/rights',
    component: route('authrization/authlist')
  }, {
    path: '/roles',
    component: route('authrization/rolelist')
  }]
}]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router