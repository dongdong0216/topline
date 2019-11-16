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
    },
    {
      path: '/articleedit/:aid',
      name: 'articleedit',
      component: () => import('@/views/articleedit/articleedit.vue')
    },
    {
      path: '/account',
      name: 'aaccount',
      component: () => import('@/views/account/account.vue')
    },
    {
      path: '/material',
      name: 'amaterial',
      component: () => import('@/views/material/material.vue')
    },
    {
      path: '/pinglun',
      name: 'pinglun',
      component: () => import('@/views/pinglun/pinglun.vue')
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

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
