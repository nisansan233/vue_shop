<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb></Breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-table
        :data="rightsList"
        :border="true"
        :stripe="true"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="权限名称"
          prop="authName"
        ></el-table-column>
        <el-table-column
          label="路径"
          prop="path"
        ></el-table-column>
        <el-table-column
          label="权限等级"
          prop="level"
        >
          <template v-slot='scope'>
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag
              type="success"
              v-else-if="scope.row.level === '1'"
            >二级</el-tag>
            <el-tag
              type="warning"
              v-else
            >三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from 'components/power/Rights/Breadcrumb/breadcrumb'
export default {
  components: {
    Breadcrumb,
  },
  data() {
    return {
      // 权限列表
      rightsList: [],
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    getRightsList() {
      this.$axios('rights/list').then((res) => {
        if (res.data.meta.status != 200) {
          return this.$message.error({
            message: res.data.meta.msg,
            duration: 1500,
          })
        }
        this.$message.success({
          message: '获取权限列表成功',
          duration: 1000,
        })
        this.rightsList = res.data.data
        // console.log(this.rightsList);
      })
    },
  },
}
</script>

<style lang="less" scoped>
</style>