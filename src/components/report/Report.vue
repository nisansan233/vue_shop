<template>
  <div>
    <Breadcrumb></Breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div
        id="main"
        style="width: 800px;height:400px;"
      ></div>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from 'components/report/Breadcrumb/breadcrumb.vue'
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      // 需要合并的对象
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    }
  },
  components: {
    Breadcrumb,
  },
  created() {},
  async mounted() {
    // 基于渲染好的dom,初始化echarts实例,参数dom决定图表的最终呈现位置
    var myChart = echarts.init(document.getElementById('main'))

    // 4.准备数据和配置项
    const { data: res } = await this.$axios.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error({
        message: res.meta.msg,
        duration: 1000,
      })
    }

    const result=_.merge(res.data, this.options)
    // 将配置项设置给echarts实例对象,展示数据
    myChart.setOption(result)
  },
  methods: {},
}
</script>

<style lang="less" scoped>
</style>