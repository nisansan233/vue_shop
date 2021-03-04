<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" :border="true" :stripe="true">
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mf_state"></el-table-column>
        <el-table-column label="操作" ></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 获取用户列表的参数对象
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        userList: [],
        total: 0
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      getUserList() {
        this.$axios.get('users', {
          params: this.queryInfo
        }).then(res => {
          if (res.data.meta.status != 200)
            return this.$message.error('获取用户列表失败!');
          this.userList=res.data.data.users
          this.total=res.data.data.total
          console.log(res.data)
        })
      }
    },
  }

</script>

<style lang="less" scoped>

</style>
