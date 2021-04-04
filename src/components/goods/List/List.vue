<template>
  <div>
    <!-- 面包屑导航区域 -->
    <Breadcrumb></Breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            :clearable="true"
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="goAddpage"
          >添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区 -->
      <el-table
        :data="goodsList"
        :border="true"
        :stripe="true"
      >
        <el-table-column
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          label="商品名称"
          prop="goods_name"
        ></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="add_time"
          width="145px"
        >
          <template v-slot='scope'>
            {{scope.row.add_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="135px"
        >
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editGoods(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :background="true"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑商品对话框 -->
    <el-dialog
      title="编辑商品信息"
      :visible.sync="editGoodsDialogVisible"
      width="40%"
      @close="editDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item
          label="商品名称"
          prop="goods_name"
        >
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item
          label="商品价格"
          prop="goods_price"
        >
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item
          label="库存"
          prop="goods_number"
        >
          <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item
          label="商品重量"
          prop="goods_weight"
        >
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editGoodsInfo"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from 'components/goods/List/Breadcrumb/breadcrumb.vue'
export default {
  components: {
    Breadcrumb,
  },
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 商品列表
      goodsList: [],
      // 总数据条数
      total: 0,
      // 控制编辑商品对话框是否显示
      editGoodsDialogVisible: false,
      // 正在编辑状态下的商品数据
      editForm: {},
      // 编辑对话框的表单验证规则
      editFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入库存', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 的、根据分页获取对应的商品列表
    getGoodsList() {
      this.$axios
        .get('goods', {
          params: this.queryInfo,
        })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            return this.$message.error('获取商品列表失败!')
          }
          this.$message.success('获取商品列表成功!')
          console.log(res.data.data)
          this.goodsList = res.data.data.goods
          this.total = res.data.data.total
          console.log(this.queryInfo.query)
        })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    removeById(id) {
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
          if (res !== 'confirm') {
            return this.$message.info('已取消删除!')
          }
          this.$axios.delete('goods/' + id).then((result) => {
            if (result.data.meta.status != 200) {
              return this.$message.error('删除商品信息失败!')
            }
            this.$message.success('删除商品信息成功!')
            this.getGoodsList()
          })
        })
    },
    goAddpage() {
      this.$router.push('/goods/add')
    },
    // 点击编辑商品按钮
    editGoods(goodsInfo) {
      this.$axios.get('goods/' + goodsInfo.goods_id).then((res) => {
        // 查询数据失败
        if (res.data.meta.status !== 200) {
          return this.$message.error({
            message: res.data.meta.msg,
            duration: 1500,
          })
        }

        this.editForm = res.data.data
        console.log(res.data.data)
        this.editGoodsDialogVisible = true
      })
    },
    // 编辑对话框关闭
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 确定编辑商品信息
    editGoodsInfo() {
      this.$refs.editFormRef.validate((valid, options) => {
        // 表单验证未通过
        if (!valid) {
          let arr = Object.keys(options)
          return this.$message.error({
            message: options[arr[0]][0].message,
            duration: 1500,
          })
        }
        console.log(this.editForm)
        this.$axios
          .put('goods/' + this.editForm.goods_id, this.editForm)
          .then((res) => {
            // 修改失败
            if (res.data.meta.status !== 200) {
              return this.$message.error({
                message: res.data.meta.msg,
                duration: 1500,
              })
            }

            this.$message.success({
              message: '修改成功！',
              duration: 1500,
            })
            this.getGoodsList()
            this.editGoodsDialogVisible = false
          })
      })
    },
  },
}
</script>

<style lang="less" scoped>
</style>