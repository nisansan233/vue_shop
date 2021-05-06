import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import( /* webpackChunkName: "login_Home_Welcome" */ "views/Login/Login")
const Home = () => import( /* webpackChunkName: "login_Home_Welcome" */ "views/Home/Home")
const Welcome = () => import( /* webpackChunkName: "login_Home_Welcome" */ "components/Welcome/Welcome")
const Users = () => import( /* webpackChunkName: "User_Rights_Roles" */ "components/user/User")
const Rights = () => import( /* webpackChunkName: "User_Rights_Roles" */ "components/power/Rights/Rights")
const Roles = () => import( /* webpackChunkName: "User_Rights_Roles" */ "components/power/Roles/roles")
const Cate = () => import( /* webpackChunkName: "Cate_Params" */ "components/goods/Cate/Cate")
const Params = () => import( /* webpackChunkName: "Cate_Params" */ "components/goods/Params/params")
const List = () => import( /* webpackChunkName: "List_Add" */ "components/goods/List/List")
const Add = () => import( /* webpackChunkName: "Cate_Params" */ "components/goods/Add/Add")
const Order = () => import( /* webpackChunkName: "Order_Report" */ "components/order/Order")
const ScreenPage=()=>import( /* webpackChunkName: "Order_Report" */ "views/DataView/ScreenPage")
// const SellerPage = () => import( /* webpackChunkName: "Order_Report" */ "views/DataView/SellerPage")
// const TrendPage = () => import( /* webpackChunkName: "Order_Report" */ "views/DataView/TrendPage")
// const MapPage=()=>import( /* webpackChunkName: "Order_Report" */ "views/DataView/MapPage")
// const RankPage=()=>import( /* webpackChunkName: "Order_Report" */ "views/DataView/RankPage")
// const StockPage=()=>import( /* webpackChunkName: "Order_Report" */ "views/DataView/StockPage")
// const HotPage=()=>import( /* webpackChunkName: "Order_Report" */ "views/DataView/HotPage")
// const Home = () => import('views/Home/Home')
// const Login = () => import('views/Login/Login')
// const Welcome = () => import('components/Welcome/Welcome')
// const Users = () => import('components/user/User')
// const Rights = () => import('components/power/Rights/Rights')
// const Roles = () => import('components/power/Roles/roles')
// const Cate = () => import('components/goods/Cate/Cate')
// const Params = () => import('components/goods/Params/params')
// const List = () => import('components/goods/List/List')
// const Add =()=>import('components/goods/Add/Add')
// const Order=()=>import('components/order/Order')
// const Report=()=>import('components/report/Report')
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
    component: Home,
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      // {
      //   path: '/reports',
      //   component: Seler
      // },
    ]
  },
  // {
  //   path: '/sellerpage',
  //   component: SellerPage
  // },
  // {
  //   path: '/trendpage',
  //   component: TrendPage
  // },
  // {
  //   path: '/mappage',
  //   component: MapPage
  // },
  // {
  //   path: '/rankpage',
  //   component: RankPage
  // },
  // {
  //   path: '/stockpage',
  //   component: StockPage
  // },
  // {
  //   path: '/hotpage',
  //   component: HotPage
  // },
  {
    path: '/screenpage',
    component: ScreenPage
  },

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
