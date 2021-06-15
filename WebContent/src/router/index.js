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
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      guest: true
    }
  },
  {
    path: '/new-user',
    name: 'New User',
    component: NewUser,
    meta: {
      guest: true
    }
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

router.beforeEach((to, from, next) => {
  if (!router.app.loginChecked) {
    return;
  }

  if (to.matched.some(record => record.meta.guest)) {
    if (router.app.isLoggedIn) {
      next({ path: '/activities' });
    } else {
      next();
    }
  } else {
    if (router.app.isLoggedIn) {
      next();
    } else {
      next({ path: '/login' });
    }
  }
})

export default router
