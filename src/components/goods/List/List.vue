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
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
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
              @click="showEditDialog(scope.row.goods_id)"
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
          // console.log(res.data.data)
          this.goodsList = res.data.data.goods
          this.total = res.data.data.total
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
    removeById(id){
      const result = this.$confirm(
        '此操作将永久删除该分类信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .catch(err => err)
        .then(res => {
          if (res !== 'confirm') {
            return this.$message.info('已取消删除!')
          }
          this.$axios.delete('goods/'+id).then(result=>{
            if (result.data.meta.status != 200) {
                return this.$message.error('删除商品信息失败!')
              }
              this.$message.success('删除商品信息成功!')
              this.getGoodsList()
          })
        })
    },
    goAddpage(){
      this.$router.push('/goods/add')
    }
  },
}
</script>

<style lang="less" scoped>
</style>