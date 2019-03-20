<template>
  <div>
    <title-bar ref="titleBar" :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <empty image="/img/no/no_coupon.png" content="没有续费记录。"></empty>
  </div>
</template>

<script>
  import TitleBar from '../../../../../../components/common/TitleBar'
  import Empty from '../../../../../../components/common/Empty'

  export default {
    metaInfo: {
      title: '续费记录'
    },
    middleware: 'auth',
    components: { TitleBar, Empty },
    data() {
      return {
        title: {
          canBack: true,
          title: '续费记录',
          backUri: `/b/${this.$route.params.shortId}/owner/license`,
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
