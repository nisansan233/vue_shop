<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb></Breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert
        :show-icon="true"
        title="注意:只允许为第三级分类设置相关参数!"
        type="warning"
        :closable="false"
      >
      </el-alert>

      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
            v-model="selectdCateKeys"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab  页签区域 -->
      <el-tabs
        v-model="activeName"
        @tab-click="handleTabClick"
      >
        <!-- 动态参数的面板 -->
        <el-tab-pane
          label="动态参数"
          name="many"
        >
          <!-- 添加参数的按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table
            :data="manyTableData"
            :border='true'
            :stripe='true'
          >
            <!-- 展开行 -->
            <el-table-column
              type="expand"
              label=""
            >
              <template v-slot='scope'>
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  type="success"
                  :key="i"
                  :closable="true"
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加tag按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column
              label="操作"
              prop="attr_name"
            >
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性的面板 -->
        <el-tab-pane
          label="静态属性"
          name="only"
        >
          <!-- 添加属性的按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table
            :data="onlyTableData"
            :border='true'
            :stripe='true'
          >
            <!-- 展开行 -->
            <!-- 展开行 -->
            <el-table-column
              type="expand"
              label=""
            >
              <template v-slot='scope'>
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  type="success"
                  :key="i"
                  :closable="true"
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加tag按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column
              label="操作"
              prop="attr_name"
            >
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加参数的对话框 -->
      <el-form
        ref="addFormRef"
        :rules="addFormRules"
        :model="addForm"
        label-width="100px"
      >
        <el-form-item
          :label="titleText"
          prop="attr_name"
        >
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addParams"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 修改参数的对话框 -->
      <el-form
        ref="editFormRef"
        :rules="editFormRules"
        :model="editForm"
        label-width="100px"
      >
        <el-form-item
          :label="titleText"
          prop="attr_name"
        >
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editParams"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from 'components/goods/Params/Breadcrumb/breadcrumb'
export default {
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 级联选择框的配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 级联选择框双向绑定的数组
      selectdCateKeys: [],
      // 被激活的页签的名称
      activeName: 'many',
      // 动态参数
      manyTableData: [],
      // 静态参数
      onlyTableData: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: '',
      },
      // 添加参数的表单数据的验证规则对象
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur',
          },
        ],
      },
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 修改的表单数据对象
      editForm: {},
      // 修改参数的表单数据对象
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur',
          },
        ],
      },
      // 控制按钮与tag文本框的切换显示
      inputVisible: false,
      // 文本框中输入的内容
      inputValue: '',
    }
  },
  components: {
    Breadcrumb,
  },

  created() {
    this.getCateList()
  },
  methods: {
    getCateList() {
      this.$axios.get('categories').then((res) => {
        if (res.data.meta.status != 200) {
          return this.$message.error({
            message: res.data.meta.msg,
            duration: 1000,
          })
        }
        this.cateList = res.data.data
        // console.log(this.cateList)
      })
    },
    // 级联选择框变化触发
    handleChange() {
      this.getParamsData()
    },
    // Tab页签点击事件的处理函数
    handleTabClick() {
      this.getParamsData()
      // console.log(this.activeName)
    },
    // 获取参数列表的数据
    getParamsData() {
      // 选中的不是三级分类
      if (this.selectdCateKeys.length !== 3) {
        this.selectdCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 选中的是三级分类
      // console.log(this.selectdCateKeys)
      // 高级所选分类的ID和当前所选分类的面板来获取参数
      this.$axios
        .get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: this.activeName,
          },
        })
        .then((res) => {
          if (res.data.meta.status != 200) {
            return this.$message.error({
              message: res.data.meta.msg,
              duration: 1000,
            })
          }
          this.$message.success('获取参数列表成功!')

          res.data.data.forEach((item) => {
            console.log(item.attr_vals)
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
             if (item.attr_vals.length === 1) {
              item.attr_vals = item.attr_vals.join(' ')
              // console.log(typeof item.attr_vals);
              // console.log( item.attr_vals);
              item.attr_vals = item.attr_vals.split(',')
              console.log('动态参数由逗号分隔,已重新分隔为数组')
            }
            // 控制tag文本框的显示与隐藏
            item.inputVisible = false
            // tag文本框的输入值
            item.inputValue = ''
          })
          console.log(res.data.data)
          if (this.activeName == 'many') {
            this.manyTableData = res.data.data
          } else {
            this.onlyTableData = res.data.data
          }
        })
    },
    // 添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 监听添加参数事件
    addParams() {
      this.$refs.addFormRef.validate((validate) => {
        if (!validate) return
        this.$axios
          .post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          })
          .then((res) => {
            if (res.data.meta.status != 201) {
              console.log(res.data)
              return this.$message.error({
                message: res.data.meta.msg,
                duration: 1000,
              })
            }
            this.$message.success('添加参数成功!')
            this.addDialogVisible = false
            this.getParamsData()
          })
      })
    },
    // 点击按钮,展示修改对话框
    showEditDialog(id) {
      // 查询当前参数信息
      this.$axios
        .get(`categories/${this.cateId}/attributes/${id}`, {
          params: {
            attr_sel: this.activeName,
          },
        })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            console.log(res.data)
            return this.$message.error({
              message: res.data.meta.msg,
              duration: 1000,
            })
          }
          console.log(res.data)
          this.editForm = res.data.data
        })
      this.editDialogVisible = true
    },
     
    // 重置修改的表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮,修改参数信息
    editParams() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return
        this.$axios
          .put(
            `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            {
              attr_name: this.editForm.attr_name,
              attr_sel: this.activeName,
            }
          )
          .then((res) => {
            if (res.data.meta.status != 200) {
              console.log(res.data)
              return this.$message.error({
                message: res.data.meta.msg,
                duration: 1000,
              })
            }
            this.$message.success({
              message: '修改参数成功',
              duration: 1000,
            })
            this.getParamsData()
            this.editDialogVisible = false
          })
      })
    },
    // 根据ID删除对应的参数项
    removeParams(id) {
      // 弹框确认是否删除
      const result = this.$confirm(
        '此操作将永久删除该分类信息, 是否继续?',
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
          this.$axios
            .delete(`categories/${this.cateId}/attributes/${id}`)
            .then((result) => {
              if (result.data.meta.status != 200) {
                return this.$message.error({
                  message: res.data.meta.msg,
                  duration: 1000,
                })
              }
              this.$message.success('删除参数信息成功!')
              // 重新获取用户列表
              this.getParamsData()
            })
        })
    },
    saveAttrVals(row) {
      // 发起网络请求保存参数
      this.$axios
        .put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' '),
        })
        .then((res) => {
          if (res.data.meta.status != 200) {
            return this.$message.error({
              message: res.data.meta.msg,
              duration: 1000,
            })
          }
          this.$message.success('修改参数项成功!')
        })
    },
    // tag文本框失去焦点,或按下enter键触发
    handleInputConfirm(row) {
      console.log('ok')
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return,则输入有效内容
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },

    // 点击按钮展示tag文本框
    showInput(row) {
      row.inputVisible = true
      // 让tag文本框自动获得焦点
      // $nextTick当页面上的元素重新渲染之后,才会指定回调代码
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应的参数可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
  },
  computed: {
    // 如果按钮需要被禁用,则返回true,否则返回false
    isBtnDisabled() {
      if (this.selectdCateKeys.length !== 3) return true
      return false
    },
    // 当前选中的三级分类ID
    cateId() {
      if (this.selectdCateKeys.length == 3) {
        return this.selectdCateKeys[2]
      }
      return null
    },
    // 动态计算添加按钮的标题文本
    titleText() {
      if (this.activeName == 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
  },
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px;
}
.el-cascader {
  margin-left: 10px;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 150px !important;
}
</style>