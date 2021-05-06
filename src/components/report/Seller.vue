<!-- 商家销量统计横向柱状图  -->
<template>
  <div class="com-container">
    <div
      class="com-chart"
      ref="seller_ref"
    >
    </div>
  </div>
</template>

<script>
// import echarts from '../../../public/static/lib/echarts.min.js'
export default {
  data() {
    return {
      // 图表实例对象
      chartInstance: null,
      // 服务器返回的数据
      allData: null,
      // 当前显示的页数
      currentPage: 1,
      // 一共多少页
      totalPage: 0,
      // 定时器标识
      timerId: null,
    }
  },
  created() {
    // 在组件创建完成之后进行回调函数的注册
    this.$socket.registerCallBack('sellerData', this.getData)
  },
  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
        action:'getData',
        socketType:'sellerData',
        chartName : 'seller',
        value: ''
      })
    window.addEventListener('resize', this.screenAdapter)
    // 在完成时主动调用
    this.screenAdapter()
  },
  methods: {
    // 初始化echartsInstance对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk')
      // 对图表初始化配置的控制
      const initOption = {
        // 标题配置
        title: {
          text: '▎ 商家销售统计',
          textStyle: {
            fontSize: 66,
          },
          left: 20,
          top: 20,
        },
        // 坐标轴位置调整
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true, // 将坐标轴文字控制在大小范围之中
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
        },
        // 提示
        tooltip: {
          // 鼠标移动触发
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              width: 66,
              color: '#2D3443',
            },
          },
        },
        series: [
          {
            type: 'bar',
            // 柱宽
            barWidth: 66,
            // 文字
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white',
              },
            },
            // 控制柱的样式
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0],
              // 设置柱颜色为线性渐  指明渐变方向  指明不同百分比之下的颜色的值
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                // 百分之0状态下的颜色值
                {
                  offset: 0,
                  color: '#5052EE',
                },
                // 百分之百状态下的颜色值
                {
                  offset: 1,
                  color: '#AB6EE5',
                },
              ]),
            },
          },
        ],
      }
      this.chartInstance.setOption(initOption)
      // 对图表对象进行鼠标事件的监听
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    destroyed() {
      clearInterval(this.timerId)
      // 在组件销毁时取消监听器
      window.removeEventListener('resize', this.screenAdapter)
      this.$socket.unRegisterCallBack("sellerData")
    },
    // 获取服务器的数据
    async getData(ret) {
      // http://127.0.0.01:8088/api/seller
      // const { data: ret } = await this.$http.get('seller')
      this.allData = ret
      this.allData.sort((a, b) => {
        return a.value - b.value //从小到大进行排序
      })
      // 每5个元素显示一页
      this.totalPage =
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : this.allData.length / 5 + 1
      this.updataChart()
      // 启动定时器，更新图表页数
      this.startInterval()
    },
    // 更新图表
    updataChart() {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allData.slice(start, end)
      const sellerNames = showData.map((item) => {
        return item.name
      })
      const sellerValues = showData.map((item) => {
        return item.value
      })
      const dataOption = {
        yAxis: {
          data: sellerNames,
        },
        series: [
          {
            data: sellerValues,
          },
        ],
      }
      this.chartInstance.setOption(dataOption)
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage = this.currentPage + 1
        if (this.totalPage < this.currentPage) {
          this.currentPage = 1
        }
        // console.log(this.currentPage)
        this.updataChart()
      }, 3000)
    },
    // 当浏览器大小发生变化时，会调用的方法，来完成屏幕的适配
    screenAdapter() {
      // console.log(this.$refs.seller_ref.offsetWidth);
      const titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6
      console.log(titleFontSize)
      // 和分辨率大小相关的配置项
      const adapterOption = {
        // 标题配置
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        // 提示
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            },
          },
        },
        series: [
          {
            // 柱宽
            barWidth: titleFontSize,
            // 控制柱的样式
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
          },
        ],
      }
      this.chartInstance.setOption(adapterOption)
      // 需要手动调用图表对象的resize才能产生效果
      this.chartInstance.resize()
    },
  },
}
</script>

<style lang="less" scoped>
html,
body,
#app {
  height: 100% !important;
  width: 100% !important;
  margin: 0;
  padding: 0;
  overflow: hidden !important;
}
</style>