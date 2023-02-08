import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/views/Home.vue'
import Welcom from '@/views/Welcom.vue'
import Users from '@/components/user/Users.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/Login' },
  {
    path: '/login', component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/users',
    children: [
      { path: '/welcom', component: Welcom },
      { path: '/users', component: Users }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 如果用戶访问登录页面，直接放行
  if (to.path === '/login') {
    next()
  }
  const token = window.sessionStorage.getItem('token')
  if (token) {
    next()
  } else {
    next('/login')
  }
})

export default router
