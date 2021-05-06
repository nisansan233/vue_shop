<!-- 针对于 /sellerpage 这条路径而显示出来 
    在这个组件中，通过子组件注册的方式显示Seller.vue这个组件
-->
<template>
  <div class="com-page">
    <Seller></Seller>
  </div>
</template>

<script>
import Seller from '@/components/report/Seller'
  export default {
    methods: {
      
    },
    components: {
      Seller
    },
  }
</script>

<style lang="less" scoped>

</style>