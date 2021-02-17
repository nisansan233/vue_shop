
import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () => import('views/Home/Home.vue')
const Login = () => import('views/Login/Login.vue')
Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
},

{
  path: '/login',
  component: Login
},
{
  path: '/Home',
  component: Home
}
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫,管理页面访问权限
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数,表示放行
  //  next()放行  next('/路径')强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
