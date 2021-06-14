import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import NewUser from '../views/NewUser.vue'
import Dashboard from '../views/Dashboard'
import Activities from '../views/Activities'
import ViewActivity from '../views/ViewActivity'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/new-user',
    name: 'New User',
    component: NewUser
  },
  {
    path: '/',
    name: 'Dasboard',
    component: Dashboard,
    redirect: '/activities',
    children: [
      {
        path: "activities",
        name: "Activities",
        component: Activities
      },
      {
        path: "activities/view",
        name: "View Activity",
        component: ViewActivity
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
