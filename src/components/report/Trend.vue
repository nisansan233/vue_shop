<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{'▎ '+showTitle}}</span>
      <span class="iconfont title-icon" :style="comStyle" @click="showChoice=!showChoice">&#xe6eb;</span>
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">
          {{item.text}}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        chartInstance: null,
        // 从服务器获取的所有数据
        allData: null,
        // 是否显示可选项
        showChoice: false,
        // 显示的图表数据类型
        choiceType: 'map',
        // 指明标题的字体大小
        titleFontSize: 0,
      }
    },
    created () {
      // 在组件创建完成之后进行回调函数的注册
      this.$socket.registerCallBack("trendData",this.getData);
    },
    mounted() {
      this.initChart()
      // this.getData()
      // 发送数据给服务器，告诉服务器，我现在需要数据
      this.$socket.send({
        action:'getData',
        socketType:'trendData',
        chartName : 'trend',
        value: ''
      })
      // 当屏幕大小发生变化时，调用screenAdapter
      window.addEventListener('resize', this.screenAdapter)
      // 第一次主动调用screenAdapter
      this.screenAdapter()
    },
    destroyed() {
      window.removeEventListener('resize', this.screenAdapter)
      // 在组件进行销毁时进行回调函数的取消
      this.$socket.unRegisterCallBack("trendData");
    },
    computed: {
      selectTypes() {
        if (!this.allData) {
          return []
        } else {
          return this.allData.type.filter((item) => {
            return item.key !== this.choiceType
          })
        }
      },
      showTitle() {
        if (!this.allData) {
          return ''
        } else {
          return this.allData[this.choiceType].title
        }
      },
      // 设置给标题的样式
      comStyle() {
        return {
          fontSize: this.titleFontSize + 'px',
        }
      },
      marginStyle(){
        return {
          marginLeft:this.titleFontSize + 'px'
        }
      }
    },
    methods: {
      // 初始化图表
      initChart() {
        this.chartInstance = this.$echarts.init(this.$refs.trend_ref, 'chalk')
        const initOption = {
          xAxis: {
            type: 'category',
            // 间隙,紧挨边缘
            boundaryGap: false,
          },
          yAxis: {
            type: 'value',
          },
          grid: {
            left: '3%',
            top: '35%',
            right: '4%',
            bottom: '1%',
            // 将坐标轴文字控制在大小范围之中
            containLabel: true,
          },
          tooltip: {
            // 鼠标移动触发工具提示
            trigger: 'axis',
          },
          // 控制图例
          legend: {
            left: 20,
            top: '15%',
            icon: 'circle',
          },
        }
        this.chartInstance.setOption(initOption)
      },
      // 获取数据 ret就是服务端发送给客户端的图表的数据
      async getData(ret) {
        // await this.$http.get()
        // 对allData进行赋值
        // const {
        //   data: ret
        // } = await this.$http.get(`trend`)
        this.allData = ret
        console.log(this.allData)
        this.updataChart()
      },
      updataChart() {
        // 半透明的颜色值
        const colorArr1 = [
          'rgba(11, 168, 44, 0.5)',
          'rgba(44, 110, 255, 0.5)',
          'rgba(22, 242, 217, 0.5)',
          'rgba(254, 33, 30, 0.5)',
          'rgba(250, 105, 0, 0.5)',
        ]
        // 全透明的颜色值
        const colorArr2 = [
          'rgba(11, 168, 44, 0)',
          'rgba(44, 110, 255, 0)',
          'rgba(22, 242, 217, 0)',
          'rgba(254, 33, 30, 0)',
          'rgba(250, 105, 0, 0)',
        ]
        // 处理数据
        // 类目轴的数据
        const timArr = this.allData.common.month
        // y轴的数据 series下的数据
        const valueArr = this.allData[this.choiceType].data
        const seriesArr = valueArr.map((item, index) => {
          return {
            name: item.name,
            type: 'line',
            data: item.data,
            // 以堆叠图呈现，使折线图有序
            stack: this.choiceType,
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                // 百分之0
                {
                  offset: 0,
                  color: colorArr1[index],
                },
                // 百分之百
                {
                  offset: 1,
                  color: colorArr2[index],
                },
              ]),
            },
          }
        })
        // 图例的数据
        const legendArr = valueArr.map((item) => {
          return item.name
        })
        const dataOption = {
          xAxis: {
            data: timArr,
          },
          legend: {
            data: legendArr,
          },
          series: seriesArr,
        }
        this.chartInstance.setOption(dataOption)
      },
      // 分辨率适配
      screenAdapter() {
        this.titleFontSize = (this.$refs.trend_ref.offsetWidth / 100) * 3.6
        const adapterOption = {
          legend: {
            itemWidth: this.titleFontSize,
            itemHight: this.titleFontSize,
            itemGap: this.titleFontSize,
            textStyle:{
              fontSize:this.titleFontSize/2
            }
          },
        }
        this.chartInstance.setOption(adapterOption)
        this.chartInstance.resize()
      },
      handleSelect(currentType) {
        this.choiceType = currentType
        this.updataChart()
        this.showChoice = false
      },
    },
  }
</script>

<style lang="less" scoped>
  .title {
    position: absolute;
    left: 20px;
    top: 20px;
    z-index: 10;
    color: antiquewhite;

    .title-icon {
      margin-top: 10px;
      margin-left: 5px;
      cursor: pointer;
    }
  }
.select-con{
  background-color: #222733;
}
  .select-item {
    cursor: pointer;
  }
</style>