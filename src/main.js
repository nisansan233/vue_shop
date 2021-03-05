import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'plugins/element.js'
// 导入字体图标
import 'assets/fonts/iconfont.css'
// 导入全局样式表
import 'assets/CSS/global.css'

// 导入axios配置
import {} from '@/network/base.js'

import store from './store'
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
