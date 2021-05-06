<template>
  <div class="com-container">
    <div
      class="com-chart"
      ref="rank_ref"
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allDate: null,
      // 区域缩放起点值
      statValue: 0,
      // 区域缩放终点值
      endValue: 9,
      // 控制定时器
      timeId: null,
    }
  },
  created() {
    // 在组件创建完成之后进行回调函数的注册
    this.$socket.registerCallBack('rankData', this.getData)
  },
  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
        action:'getData',
        socketType:'rankData',
        chartName : 'rank',
        value: ''
      })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timeId)
    this.$socket.unRegisterCallBack("rankData");
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, 'chalk')
      const initOption = {
        title: {
          text: '▎ 地区销售排行',
          left: 20,
          top: 20,
        },
        // 坐标轴距离
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true,
        },
        tooltip: {
          show: true,
        },
        xAxis: {
          type: 'category',
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            type: 'bar',
          },
        ],
      }
      this.chartInstance.setOption(initOption)
      // 监听鼠标移入,停止定时器
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timeId)
      })
      // 监听鼠标移出,启动定时器
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    async getData(ret) {
      // 获取服务器数据，对this.allData进行赋值之后,调用updataadapter进行图表更新
      // const { data: ret } = await this.$http.get('rank')
      this.allDate = ret
      // 对allDate所有元素进行从大到小排序
      this.allDate.sort((a, b) => {
        return b.value - a.value
      })
      this.updataChart()
      this.startInterval()
    },
    updataChart() {
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5'],
      ]
      // 所有省份名所对应的数组
      const provinceArr = this.allDate.map((item) => {
        return item.name
      })
      // 所有省份对应的销售金额
      const valueArr = this.allDate.map((item) => {
        return item.value
      })
      const dataOption = {
        xAxis: {
          data: provinceArr,
        },
        // 区域缩放
        dataZoom: {
          show: false,
          startValue: this.statValue,
          endValue: this.endValue,
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: (arg) => {
                let targetColorArr = null
                if (arg.value > 300) {
                  targetColorArr = colorArr[0]
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[0],
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1],
                  },
                ])
              },
            },
          },
        ],
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0],
            },
          },
        ],
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInterval() {
      if (this.timeId) {
        clearInterval(this.timeId)
      }
      this.timeId = setInterval(() => {
        this.statValue++
        this.endValue++
        if (this.endValue > this.allDate.length - 1) {
          this.statValue = 0
          this.endValue = 9
        }
        this.updataChart()
      }, 2500)
    },
  },
}
</script>

<style lang="less" scoped>
</style>