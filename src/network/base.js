import axios from 'axios'
import Vue from 'vue'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
axios.defaults.baseURL = `http://127.0.0.1:8888/api/private/v1/`
// 'http://127.0.0.1:8888/api/private/v1/'
// 'http://127.0.0.1:8099/api'
// `http://www.ysqorz.top:8888/api/private/v1/`
// 将axios方法注册到原型上方便全局使用
Vue.prototype.$axios = axios
// 注册数据可视化的api接口为全局
Vue.prototype.$http = axios.create({
  baseURL:'http://127.0.0.1:8099/api'
})
// 设置请求拦截器
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization=window.sessionStorage.getItem('token')
  // 在request拦截器中显示进度条
  Nprogress.start()
  return config
})
// 在resopnse拦截器中隐藏进度条
axios.interceptors.response.use(config=>{
  Nprogress.done()
  return config
})



