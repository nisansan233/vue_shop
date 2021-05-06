<template>
  <div
    class="com-container"
    @dblclick="revertMap"
  >
    <div
      class="com-chart"
      ref="map_ref"
    >
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils.js'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      // 获取的省份地图矢量数据的缓冲
      mapData: {},
    }
  },
  created() {
    // 在组件创建完成之后进行回调函数的注册
    this.$socket.registerCallBack('mapData', this.getData)
  },
  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
        action:'getData',
        socketType:'mapData',
        chartName : 'map',
        value: ''
      })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    // this.mapData={}
    this.$socket.unRegisterCallBack("mapData");
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, 'chalk')
      // 获取中国地图的矢量数据,由于地图矢量数据并不位于后台，所以不能使用$http
      const ret = await axios.get('http://localhost:2333/static/map/china.json')
      console.log(ret)
      this.$echarts.registerMap('china', ret.data)
      const initOption = {
        title: {
          text: '▎ 商家分布',
          left: 20,
          top: 20,
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2e72bf',
            borderColor: '#333',
          },
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical',
        },
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click', async (arg) => {
        // arg.name 点击省份的名称
        const provinceInfo = getProvinceMapInfo(arg.name)
        //  获取这个省份的地图矢量数据
        // 判断当前所点击的地图矢量数据在缓冲中是否存在
        if (!this.mapData[provinceInfo.key]) {
          const res = await axios.get(
            'http://localhost:2333' + provinceInfo.path
          )
          this.mapData[provinceInfo.key] = res.data
          this.$echarts.registerMap(provinceInfo.key, res.data)
          console.log(provinceInfo)
        }
        const changeOption = {
          geo: {
            map: provinceInfo.key,
          },
        }
        // 重新渲染矢量图
        this.chartInstance.setOption(changeOption)
      })
    },
    async getData(ret) {
      // get
      // const { data: ret } = await this.$http.get('map')
      this.allData = ret
      console.log(this.allData)
      this.updataChart()
    },
    updataChart() {
      // 图例的数据
      const legendArr = this.allData.map((item) => {
        return item.name
      })
      const seriesArr = this.allData.map((item) => {
        // return 的对象代表一个类别下的多个散点
        // 如果想在地图中呈现散点的数据,所以我们需要给散点的图表增加配置coordinateSystem:geo
        return {
          type: 'effectScatter',
          name: item.name,
          data: item.children,
          // 使散点使用地图坐标系统
          coordinateSystem: 'geo',
          // 散点涟漪效果
          rippleEffect: {
            scale: 5,
            // 空心效果
            brushType: 'stroke',
          },
        }
      })
      const dataOption = {
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
          legend: {
            itemWidth: titleFontSize / 2,
            itemHeight: titleFontSize / 2,
            itemGap: titleFontSize / 2,
            textStyle: {
              fontSize: titleFontSize / 2,
            },
          },
        },
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 双击回到大地图
    revertMap() {
      const revertOption = {
        geo: {
          map: 'china',
        },
      }
      this.chartInstance.setOption(revertOption)
    },
  },
}
</script>

<style lang="less" scoped>
</style>