<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb></Breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button
            type="primary"
            @click="addRoleVisible=true"
          >添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table
        :data="roleList"
        :border="true"
        :stripe="true"
        row-key="id"
      >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom',index1 ===0 ? 'bdtop':'','vcenter']"
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="6">
                <el-tag
                  :closable="true"
                  @close="removerRightById(scope.row,item1.id)"
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="18">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[index2 === 0 ? '' : 'bdtop','vcenter']"
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="warning"
                      :closable="true"
                      @close="removerRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="danger"
                      v-for="(item3,index3) in item2.children"
                      :key="item3.id"
                      :closable="true"
                      @close="removerRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column
          label="#"
          type="index"
        ></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="300px"
        >
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            >编辑</el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主题区域 -->
      <el-form
        :model="addRoleForm"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
        >
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addRole"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色的对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRoleVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主题区域 -->
      <el-form
        :model="editRoleForm"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
        >
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editRoleVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editRoleInfo"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @closed="setRightDialogClosed"
    >
      <!-- 树形空间 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        :show-checkbox="true"
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="allotRight()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from 'components/power/Roles/Breadcrumb/breadcrumb'
export default {
  components: {
    Breadcrumb,
  },
  data() {
    return {
      // 所有角色列表
      roleList: [],
      // 控制添加角色对话框的显示与隐藏
      addRoleVisible: false,
      // 控制修改角色对话框的显示与隐藏
      editRoleVisible: false,
      // 控制分配角色对话框的显示与隐藏
      setRightDialogVisible: false,
      // 添加角色的表单数据
      addRoleForm: {
        roleName: '',
        roleDesc: '',
      },
      // 修改角色的表单数据
      editRoleForm: {},
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 默认选中的结点ID值数组
      defKeys: [],
      // 当前即将分配权限的角色ID
      roleId: '',
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取所有角色列表
    getRoleList() {
      this.$axios.get('roles').then((res) => {
        if (res.data.meta.status != 200) {
          return this.$message.erroe({
          message: res.data.meta.msg,
          duration: 1500,
        })
        }
        this.roleList = res.data.data
      })
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮,添加新角色
    addRole() {
      // 无需校验格式,直接发起添加用户的网络请求
      this.$axios.post('roles', this.addRoleForm).then((res) => {
        if (res.data.meta.status != 201) {
          this.$message.error({
          message: res.data.meta.msg,
          duration:1000,
          })
        }
        this.$message.success({
        message:'添加角色成功!',
        duration:1000,
        })
        
        // 隐藏添加用户的对话框
        this.addRoleVisible = false
        // 重新获取用户列表
        this.getRoleList()
      })
    },
    // 监听修改角色对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 展示根据roleId编辑角色的对话框
    showEditDialog(id) {
      this.$axios.get('roles/' + id).then((res) => {
        if (res.data.meta.status != 200) {
          return this.$message.error({
            message: res.data.meta.msg,
            duration: 1500,
          })
        }
        this.editRoleForm = res.data.data
        this.editRoleVisible = true
      })
    },
    // 修改角色信息并提交
    editRoleInfo() {
      this.$axios
        .put('roles/' + this.editRoleForm.roleId, this.editRoleForm)
        .then((res) => {
          if (res.data.meta.status != 200) {
            return this.$message.error({
              message: res.data.meta.msg,
              duration: 1500,
            })
          }
          this.$message.success({
            message: '编辑角色信息成功!',
            duration: 1500,
          })
          this.editRoleVisible = false
          this.getRoleList()
        })
    },
    // 根据ID删除对于的角色信息
    removeRoleById(id) {
      // 弹框确认是否删除
      const result = this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
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
            return this.$message.info({
              message: '已取消删除',
              duration: 1500,
            })
          }
          this.$axios.delete('roles/' + id).then((res) => {
            if (res.data.meta.status != 200) {
              return this.$message.error({
                message: res.data.meta.msg,
                duration: 1500,
              })
            }
            this.$message.success({
              message: '删除角色成功！',
              duration: 1500,
            })
            this.getRoleList()
          })
        })
    },
    // 根据id删除对应的权限
    removerRightById(role, rightId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .catch((err) => err)
        .then((res) => {
          if (res !== 'confirm') {
            return this.$message.info({
              message: '已取消删除',
              duration: 1500,
            })
          }
          this.$axios
            .delete(`roles/${role.id}/rights/${rightId}`)
            .then((result) => {
              if (result.data.meta.status != 200)
                return this.$message.error({
                  message: result.data.meta.msg,
                  duration: 1500,
                })
              this.$message.success({
                message: '删除成功!',
                duration: 1500,
              })
              role.children = result.data.data
            })
        })
    },
    // 展示分配权限的对话框
    showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限的数据
      this.$axios.get('rights/tree').then((res) => {
        if (res.data.meta.status != 200) {
          return this.$message.error({
            message: res.data.meta.msg,
            duration: 1500,
          })
        }
        // 获取到的权限数据保存到data中
        this.rightsList = res.data.data
      })
      // 递归获取三级结点的ID
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归获取所有角色的三级权限ID
    getLeafKeys(node, arr) {
      if (!node.children) {
        // 如果当前node结点不包含children属性,则为三级结点
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听权限分配对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    allotRight() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      console.log(keys)
      const idStr = keys.join(',')
      this.$axios
        .post(`roles/${this.roleId}/rights`, { rids: idStr })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            console.log(res)
            return this.$message.error({
              message: res.data.meta.msg,
              duration: 1500,
            })
          }
          this.$message.success({
            message: '分配权限成功',
            duration: 1000,
          })
          this.getRoleList()
          this.setRightDialogVisible = false
        })
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdbottom {
  border-bottom: 1px solid #ccc;
}
.bdtop {
  border-top: 1px solid #ccc;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>