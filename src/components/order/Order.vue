<template>
  <div>
    <Breadcrumb></Breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            :clearable="true"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>

      </el-row>

      <!-- 订单列表 -->
      <el-table
        :data="orderList"
        :border="true"
        :stripe="true"
      >
        <el-table-column
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          label="订单编号"
          prop="order_number"
        ></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
        ></el-table-column>
        <el-table-column
          label="是否付款"
          prop="pay_status"
        ><template v-slot='scope'>
            <el-tag
              type="success"
              v-if="scope.row.pay_status==='1'"
            >已付款</el-tag>
            <el-tag
              type="danger"
              v-else
            >未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
        ></el-table-column>
        <el-table-column
          label="下单时间"
          prop="create_time"
        >
          <template v-slot='scope'>{{scope.row.create_time | dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot='scope'>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->

    <el-dialog
      title="提示"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item
          label="省市区/县"
          prop="address1"
        >
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="详细地址"
          prop="address2"
        >
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addressVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%"
    >
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from 'components/order/Breadcrumb/breadcrumb'
import cityData from './citydata.js'
import progressInfo from './progressInfo.json'
export default {
  components: {
    Breadcrumb,
  },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      orderList: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: '',
      },
      addressFormRules: {
        address1: [
          {
            required: true,
            message: '请选择省市区/县',
            trigger: 'blur',
          },
        ],
        address2: [
          {
            required: true,
            message: '请填写详细地址',
            trigger: 'blur',
          },
        ],
      },
      cityData,
      progressVisible: false,
      // 物流信息
      progressInfo: progressInfo.data,
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      this.$axios
        .get('orders', {
          params: this.queryInfo,
        })
        .then((res) => {
          if (res.data.meta.status !== 200) {
            console.log(res.data.data)
            return this.$message.error('获取订单列表失败!')
          }
          console.log(res.data.data)
          this.orderList = res.data.data.goods
          this.total = res.data.data.total
          console.log(this.queryInfo.query)
        })
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 展示修改地址的对话框
    showBox() {
      this.addressVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    showProgressBox() {
      // this.$axios.get('/kuaidi/804909574412544580').then((res) => {
      //   if (res.data.meta.status != 200) {
      //     console.log(res.data)
      //     return this.$message.error('获取信息失败!')
      //   }
      //   this.progressInfo = res.data.data
      //   console.log(this.progressInfo)
      // })
      // console.log(this.orderList);
      this.progressVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>