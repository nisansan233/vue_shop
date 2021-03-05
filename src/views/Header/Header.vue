<template>
    <el-header>
      <div>
        <img id="headerImg" src="~assets/qiqi.jpg" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
</template>

<script>
  export default {
    name: 'Header',
    methods: {
      // 实现退出功能
      logout() {
        // 清空token
        sessionStorage.removeItem('token')
        // 跳转到登录页
        this.$router.push('/login')
      }
    },
  }
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

</style>