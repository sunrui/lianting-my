<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <empty image="/img/no/no_reserve.png" content="没有预订记录。"></empty>
  </div>
</template>

<script>
  import TitleBar from '../../../../../components/common/TitleBar'
  import Empty from '../../../../../components/common/Empty'

  export default {
    metaInfo: {
      title: '预订'
    },
    middleware: 'auth',
    components: {TitleBar, Empty},
    data() {
      return {
        title: {
          canBack: true,
          title: '预订',
          backUri: `/b/${this.$route.params.shortId}/waiter`,
          theme: 'white',
          imageHeight: 0
        }}
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common.scss';
</style>
