import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'plugins/element.js'
// 导入字体图标
import 'assets/fonts/iconfont.css'
import 'assets/font/iconfont.css'
// 导入全局样式表
import 'assets/CSS/global.css'
// 导入webScoket配置，调用连接方法
import SocketService from './utils/socket_service'
// 对服务端进行WebScoket连接
SocketService.Instance.connect()
// 其他的组件 this..$socket 
Vue.prototype.$socket =  SocketService.Instance
// 导入axios配置
import {} from '@/network/base.js'

import store from './store'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme
// 将全局的echarts对象挂载到Vue的原型对象上
Vue.prototype.$echarts = window.echarts
Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor, /* { default global options } */ )
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')