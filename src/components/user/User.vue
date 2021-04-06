<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb></Breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="Query" :clearable="true" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="this.$store.state.userList" :border="true" :stripe="true">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            {{scope.row.mg_state}}
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.$store.state.queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="this.$store.state.queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.$store.state.total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主题区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisable" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户: {{userInfo.username}}</p>
        <p>当前的角色: {{userInfo.role_name}}</p>
        <p>
          分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const Breadcrumb = () => import('./Breadcrumb/breadcrumb.vue')
export default {
  components: {
    Breadcrumb,
  },
  data() {
    // 验证手机号的规则
    const checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在 3 到 10 个字符之间',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 15,
            message: '密码的长度在 6 到 15 个字符之间',
          },
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
          },
          // {
          //   type: 'email',
          //   message: '请输入正确的邮箱地址',
          //   trigger: ['blur', 'change'],
          // },
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机',
            trigger: 'blur',
          },
          // {
          //   validator: checkMobile,
          //   trigger: 'blur',
          // },
        ],
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisable: false,
      // 修改查询到的用户信息对象
      editForm: {},
      // 修改表单的校验规则对象
      editFormRules: {},
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色列表
      rolesList: [],
      // 已选中的角色
      selectedRoleId: '',
    }
  },
  created() {
    this.getUserList()
    //  this.$store.dispatch('getUserList')
  },
  computed: {
    // 根据 ID 查询用户信息
    Query: {
      get() {
        return this.$store.state.queryInfo.query
      },
      set(value) {
        this.$store.commit('setQuery', value)
      },
    },
  },
  methods: {
    getUserList() {
      this.$store.dispatch('getUserList')
    },

    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.$store.commit('setPagesize', newSize)
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.$store.commit('setPagenum', newPage)
      this.getUserList()
    },
    // 监听 switch开关 状态的改变
    userStateChanged(userinfo) {
      console.log(userinfo.mg_state)
      this.$axios
        .put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        .then((res) => {
          if (res.data.meta.status != 200) {
            userinfo.mg_state = !userinfo.mg_state
            return this.$message.error('更新用户状态失败!')
          }
          this.$message.success('更新用户状态成功')
        })
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮,添加新用户
    addUser() {
      this.$refs.addFormRef.validate((valid) => {
        console.log(valid)
        if (!valid) return
        // 校验数据格式成功,发起添加用户的网络请求
        this.$axios.post('users', this.addForm).then((res) => {
          if (res.data.meta.status != 201) {
            this.$message.error('添加用户失败!')
          }
          this.$message.success('添加用户成功!')
          // 隐藏添加用户的对话框
          this.addDialogVisible = false
          // 重新获取用户列表
          this.getUserList()
        })
      })
    },
    // 展示根据id编辑用户的对话框
    showEditDialog(id) {
      this.$axios.get('users/' + id).then((res) => {
        if (res.data.meta.status != 200) {
          return this.$message.error('查询用户信息失败!')
        }
        this.editForm = res.data.data
      })
      this.editDialogVisable = true
      console.log(id)
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return
        //校验数据格式成功,发起修改用户的网络请求
        this.$axios
          .put('users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          })
          .then((res) => {
            if (res.data.meta.status != 200) {
              return this.$message.error('修改用户信息失败!')
            }
            this.$message.success('修改用户信息成功!')
            // 隐藏修改用户的对话框
            this.editDialogVisable = false
            // 重新获取用户列表
            this.getUserList()
          })
      })
    },
    // 根据ID删除对应的用户信息
    removeUserById(id) {
      // 弹框确认是否删除
      const result = this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .catch((err) => err)
        .then((res) => {
          // 如果用户确认删除，则返回字符串confirm
          if (res !== 'confirm') {
            return this.$message.info('已取消删除!')
          }
          this.$axios.delete('users/' + id).then((res) => {
            if (res.data.meta.status != 200) {
              return this.$message.error({
              message: res.data.meta.msg,
              duration:1000,
              })
            }
            this.$message.success('删除用户成功!')
            // 重新获取用户列表
            this.getUserList()
          })
        })
    },
    // 展示分配角色的显示与隐藏
    setRole(userInfo) {
      this.userInfo = userInfo
      // 显示对话框前获取角色列表
      this.$axios.get('roles').then((res) => {
        if (res.data.meta.status != 200) {
          return this.$message.error({
          message: res.data.meta.msg,
          duration:1000,
          })
        }
        this.$message.success({
        message:'获取角色列表成功',
        duration:1000,
        })
        this.rolesList = res.data.data
      })
      this.setRoleDialogVisible = true
    },
    // 分配角色
    saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error({
        message: res.data.meta.msg,
        duration:1000,
        })
      }
      this.$axios
        .put(`users/${this.userInfo.id}/role`, {
          rid: this.selectedRoleId,
        })
        .then((res) => {
          if (res.data.meta.status != 200) {
            console.log(res)
            return this.$message.error({
            message: res.data.meta.msg,
            duration:1000,
            })
          }
          this.$message.success('分配角色成功')
          this.getUserList()
          this.setRoleDialogVisible = false
        })
    },
    setRoleDialogClosed() {
      this.userInfo = {}
      this.selectedRoleId = ''
    },
  },
}
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 15px;
}
</style>
