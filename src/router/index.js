import Vue from 'vue'
import VueRouter from 'vue-router'
import '@/assets/js/gt.js'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/welcome'
},
{
  path: '/login',
  name: 'login',
  component: () => import('@/views/login')
},
{
  path: '/home',
  name: 'home',
  redirect: '/welcome',
  component: () => import('@/views/home'),
  children: [
    {
      path: '/welcome',
      name: 'welcome',
      component: () => import('@/views/welcome')
    },
    {
      path: '/article',
      name: 'article',
      component: () => import('@/views/article')
    },
    {
      path: '/articleadd',
      name: 'articleadd',
      component: () => import('@/views/articleadd/articleadd.vue')
    }
  ]
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
