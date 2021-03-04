import axios from 'axios'
import Vue from 'vue'
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
// 将axios方法注册到原型上方便全局使用
// 设置请求拦截器
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$axios = axios
