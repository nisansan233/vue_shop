<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
      <el-header>
      <div>
        <img id="headerImg" src="~assets/qiqi.jpg" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
     
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <Aside></Aside>
      <!-- 右侧内容主体-->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import Aside from 'views/Aside/Aside'
  export default {
    components: {
      Aside,
    },
    methods: {
      // 实现退出功能
      logout() {
        // 清空token
        sessionStorage.removeItem('token')
        // 跳转到登录页
        this.$router.push('/login')
      },
      // 获取所有的菜单
      
    }
  };

</script>

<style lang="less" scoped>
   .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    >div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }
    }
  }

  #headerImg {
    height: 50px;
    width: 50px;
    border-radius: 50%;
  }




  .el-main {
    background-color: #eaedf1;
  }

  .home-container {
    height: 100%;
  }

  
</style>
