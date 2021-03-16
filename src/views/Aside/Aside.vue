<template>

  <el-aside width="isCollapse ? '64px' : '200px'">
    <div class="toggle-button" @click="toggleCollapse">|||</div>
    <!-- 侧边栏菜单区域 -->
    <el-menu background-color="#333744" text-color="#fff" active-text-color="#39C5BB" :unique-opened="true"
      :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="this.$route.path">
      <!-- 一级菜单 -->
      <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
        <!-- 一级菜单的模板区 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>

        <!-- 二级菜单 -->
        <el-menu-item :index="'/'+subItem.path  " v-for="subItem in item.children" :key="subItem.id">
          <template slot="title">
            <!-- 图标 -->
            <i class="el-icon-menu"></i>
            <!-- 文本 -->
            <span>{{subItem.authName}}</span>
          </template>
        </el-menu-item>

      </el-submenu>
    </el-menu>

  </el-aside>

</template>

<script>
  export default {
    name: 'Aside',
    data() {
      return {
        // 左侧菜单数据
        menulist: [],
        iconsObj: {
          '125': 'iconfont icon-user',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao',
        },
        isCollapse: false


      }
    },
    created() {
      this.getMenuList()
    },
    methods: {
      // 获取所有的菜单
      getMenuList() {
        this.$axios.get('/menus').then(res => {
          if (res.data.meta.status != 200)
            return this.$message.error(res.data.meta.msg)
          this.menulist = res.data.data
          // console.log(res.data);
        })
      },
      //点击按钮,切换菜单的折叠与展开
      toggleCollapse() {
        this.isCollapse = !this.isCollapse
      },
      //保存链接的激活状态
      // saveNavState(activePath){
      //   window.sessionStorage.setItem('activePath',activePath)
      // }
    },
  }

</script>

<style lang="less" scoped>
  .el-aside {
    background-color: #333744;

    .el-menu {
      border-right: none;
    }
  }

  .toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }

  .iconfont {
    margin-right: 10px;
  }

</style>
