<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <empty image="/img/no/no_order.png" content="没有外卖订单。"></empty>
  </div>
</template>

<script>
  import TitleBar from '../../../../components/common/TitleBar'
  import Empty from '../../../../components/common/Empty'

  export default {
    metaInfo: {
      title: '外卖订单'
    },
    middleware: 'auth',
    components: { TitleBar, Empty },
    data() {
      return {
        title: {
          canBack: false,
          title: '外卖订单',
          backUri: `/b/${this.$route.params.shortId}/takeout`,
          theme: 'white',
          imageHeight: 0
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '~assets/common';
</style>
