<template>

  <el-aside width="isCollapse ? '64px' : '200px'">
    <div
      class="toggle-button"
      @click="toggleCollapse"
      background-color="3b53a5"
    >{{ isCollapse ? '&rArr;' : '&lArr;' }}</div>
    <!-- 侧边栏菜单区域 -->
    <el-menu
      background-color="#1A4968CE"
      text-color="#fff"
      active-text-color="#39C5BB"
      :unique-opened="true"
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
      :default-active="this.$route.path"
    >
      <!-- 一级菜单 -->
      <el-submenu
        :index="item.id + ''"
        v-for="item in menuList"
        :key="item.id"
      >
        <!-- 一级菜单的模板区 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>

        <!-- 二级菜单 -->
        <el-menu-item
          :index="'/'+subItem.path  "
          v-for="subItem in item.children"
          :key="subItem.id"
        >
          <template slot="title">
            <!-- 图标 -->
            <i class="el-icon-menu"></i>
            <!-- 文本 -->
            <span>{{subItem.authName}}</span>
          </template>
        </el-menu-item>

      </el-submenu>
      <el-menu-item index="/screenpage">
        <i class="iconfont icon-baobiao"></i>
        <span slot="title">数据视图</span>
        <i class="el-submenu__icon-arrow icon-share"></i>
      </el-menu-item>
    </el-menu>

  </el-aside>

</template>

<script>
export default {
  name: 'Aside',
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollapse: false,
      activePath: '/welcome',
    }
  },
  created() {
    this.getmenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 获取所有的菜单
    getmenuList() {
      this.$axios.get('/menus').then((res) => {
        if (res.data.meta.status != 200)
          return this.$message.error(res.data.meta.msg)
        this.menuList = res.data.data
        // console.log(this.menuList)
        this.menuList = this.menuList.filter((item) => {
          // 把每个菜单的id保存到一个数组中，切换的时候要用到
          // this.menusId.push(item.id)
          return item.authName != '数据统计'
        })
        // console.log(this.menuList)
        // console.log(res.data);
      })
    },
    //点击按钮,切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    //保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
  },
}
</script>

<style lang="less" scoped>
.el-aside {
  background-color: #7f9cfc;

  .el-menu {
    border-right: none;
  }
}

.toggle-button {
  background-color: #6377b8;
  font-size: 22px;
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
