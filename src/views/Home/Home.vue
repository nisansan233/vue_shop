<template>
  <el-container class="home-container" direction="vertical">
    <!-- 头部区域 -->
    <div id="header">
      <Header></Header>
    </div>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <Aside></Aside>
      <!-- 右侧内容主体-->
      
        <Main></Main>
      
    </el-container>
  </el-container>
</template>

<script>
import Aside from 'views/Aside/Aside'
import Header from 'views/Header/Header'
import Main from 'views/Main/Main'
export default {
  components: {
    Aside,
    Header,
    Main,
  },
  methods: {},
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.main{
  width: 1000px i !important;
}
</style>
