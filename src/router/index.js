import Vue from 'vue'
import VueRouter from 'vue-router'
import '@/assets/js/gt.js'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
},
{
  path: '/login',
  name: 'login',
  component: () => import('@/views/login')
},
{
  path: '/home',
  name: 'home',
  component: () => import('@/views/home')
}
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  let userinfo = window.sessionStorage.getItem('userinfo')
  if (!userinfo && to.path !== '/login') {
    return next('/login')
  }
  next()
})

export default router
