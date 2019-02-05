<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <empty image="/img/no/no_order.png" content="没有最新消息。"></empty>
  </div>
</template>

<script>
  import TitleBar from '../../../../../components/common/TitleBar'
  import Empty from '../../../../../components/common/Empty'

  export default {
    metaInfo: {
      title: '最新消息'
    },
    middleware: 'auth',
    components: { TitleBar, Empty },
    data() {
      return {
        title: {
          canBack: true,
          title: '最新消息',
          backUri: `/b/${this.$route.params.shortId}/cooker`,
          theme: 'white',
          imageHeight: 0
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
