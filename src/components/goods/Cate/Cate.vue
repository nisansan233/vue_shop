<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb></Breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-button
            type="primary"
            @click="showAddCateDialog"
          >添加分类</el-button>
          </el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        :border="true"
      >
        <!-- 是否有效 -->
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted===false"
            style="color:lightgreen"
          ></i>
          <i
            class="el-icon-error"
            v-else
            style="color:red"
          ></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag
            size="mini"
            v-if="scope.row.cat_level===0"
          >一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level===1"
          >二级</el-tag>
          <el-tag
            size="mini"
            type="warning"
            v-else
          >三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:opt="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCateDialog(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
             @click="removeCateById(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="this.queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item
          label="分类名称"
          prop="cat_name"
        >
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cateProps"
            @change="parentCateChanged"
            :clearable="true"
            :change-on-select="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addCate"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类的对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisable"
      width="50%"
      @close="editCateDialogClosed"
    >
      <el-form
        :model="editCateForm"
        :rules="addCateFormRules"
        ref="editCateFormRef"
        label-width="70px"
      >
        <el-form-item label="分类名称">
          <el-input
            v-model="editCateForm.cat_name"
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editCateDialogVisable = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editCateInfo"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from 'components/goods/Cate/Breadcrumb/breadcrumb.vue'
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      // 商品分类的数据列表,默认为空
      cateList: [],
      // 查询条件
      queryInfo: { type: 3, pagenum: 1, pagesize: 5 },
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 将当前列定义为模板列
          type: 'template',
          // 当前这一列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 将当前列定义为模板列
          type: 'template',
          // 当前这一列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 将当前列定义为模板列
          type: 'template',
          // 当前这一列使用的模板名称
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      addCateForm: {
        // 分类的名称
        cat_name: '',
        // 分类的父ID
        cat_pid: 0,
        // 分类的层级,，默认为0
        cat_level: 0
      },
      // 添加分类表单验证规则的对象
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类ID数组
      selectedKeys: [],
      // 控制修改分类对话框的显示与隐藏
      editCateDialogVisable: false,
      // 修改查询到的分类信息对象
      editCateForm: {},
      // 修改表单的校验规则对象
      editCateFormRules: {}
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    getCateList() {
      this.$axios.get('categories', { params: this.queryInfo }).then(res => {
        if (res.data.meta.status != 200) {
          return this.$message.error('获取商品分类列表失败!')
        }
        this.cateList = res.data.data.result
        this.total = res.data.data.total
        // console.log(res.data)
        // console.log(this.cateList)
        // console.log(this.total)
      })
    },
    // 监听 pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum的改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    // 点击添加按钮,展添加分类对话框
    showAddCateDialog() {
      this.addCateDialogVisible = true
      this.getParentCateList()
    },
    // 获取父级分类的数据列表
    getParentCateList() {
      this.$axios
        .get('categories', {
          params: { type: 2 }
        })
        .then(res => {
          if (res.data.meta.status != 200) {
            return this.$message.error('获取父级分类数据失败')
          }
          this.parentCateList = res.data.data
        })
    },
    // 选择项发生变化时触发
    parentCateChanged() {
      // console.log(this.selectedKeys)
      // 如果selectedKeys数组中的length大于0，则选中了父级分类
      // 反之,就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的ID
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮,添加新的父级分类
    addCate() {
      // console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(valid => {
        if (!valid) return
        this.$axios.post('categories', this.addCateForm).then(res => {
          if (res.data.meta.status != 201) {
            console.log(res.date)
            return this.$message.error('添加分类失败!')
          }
          this.$message.success('添加分类成功!')
          console.log(this.addCateForm)
          this.getCateList()
          this.addCateDialogVisible = false
        })
      })
    },
    // 监听添加分类对话框的关闭事件
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 展示根据id编辑分类的对话框
    showEditCateDialog(id) {
      console.log(id);
      this.$axios.get('categories/' + id).then(res => {
        if (res.data.meta.status != 200) {
          console.log(res.data);
          return this.$message.error('查询分类信息失败!')
        }
        this.editCateForm= res.data.data
      })
      // console.log(this.editCateForm);
      this.editCateDialogVisable = true

    },
    // 监听修改分类对话框的关闭事件
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
    },
    // 点击按钮，编辑修改分类
    editCateInfo(){
      this.$refs.editCateFormRef.validate(valid=>{
        if(!valid) return
        this.$axios.put('categories/'+this.editCateForm.cat_id,{
          cat_name: this.editCateForm.cat_name
        }).then(res=>{
          if (res.data.meta.status != 200) {
            console.log(res.data);
              return this.$message.error('修改分类信息失败!')
            }
            this.$message.success('修改分类信息成功!')
            this.editCateDialogVisable=false
            this.getCateList()
        })
      })
    },
    // 根据ID删除分类
    removeCateById(id){
       // 弹框确认是否删除
       const result=this.$confirm(
        '此操作将永久删除该分类信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
        .then((res) => {
          // 如果用户确认删除，则返回字符串confirm
          if (res !== 'confirm') {
            return this.$message.info('已取消删除!')
          }
          this.$axios.delete('categories/' + id).then((result) => {
            if (result.data.meta.status != 200) {
              return this.$message.error('删除分类信息失败!')
            }
            this.$message.success('删除分类信息成功!')
            // 重新获取用户列表
            this.getCateList()
          })
        })
    }
    }
  }

</script>

<style lang="less" scoped>
.treeTable {
  margin: 20px;
}
.el-cascader {
  width: 100%;
}
</style>