import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import {
  Message
} from 'element-ui';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userList: [],
    total: 0,
     // 这是登录表单的数据绑定对象
     loginForm: {
      username: 'admin',
      password: '123456'
    },
    queryInfo: {
      query: '',
      // 当前的页数
      pagenum: 1,
      // 当前每页显示多少条数据
      pagesize: 10
    },
  },
  mutations: {
    setUserList(state, obj) {
      state.userList = obj
    },
    setTotal(state, obj) {
      state.total = obj
    },
    setQuery(state,obj){
      state.queryInfo.query=obj
    },
    setPagenum(state,obj){
      state.queryInfo.pagenum=obj
    },
    setPagesize(state,obj){
      state.queryInfo.pagesize=obj
    }
  },
  actions: {
    // 封装一个axios方法
    getUserList(context) {
      axios.get('users', {
        params: this.state.queryInfo
      }).then(res => {
        if (res.data.meta.status != 200)
          return Message.error('获取用户列表失败!');

        context.commit('setUserList', res.data.data.users)
        context.commit('setTotal', res.data.data.total)
        // console.log(res.data)
      })
    },
  },
  modules: {}
})
