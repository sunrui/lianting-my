<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <empty image="/img/no/no_table.png" content="没有餐桌。"></empty>
  </div>
</template>

<script>
  import TitleBar from '../../../../../components/TitleBar'
  import Empty from '../../../../../components/Empty'

  export default {
    metaInfo: {
      title: '餐桌'
    },
    middleware: 'auth',
    components: {TitleBar, Empty},
    data() {
      return {
        title: {
          canBack: true,
          title: '餐桌',
          backUri: `/b/${this.$route.params.shortId}/cooker`,
          theme: 'white',
          imageHeight: 0
        }}
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common.scss';
</style>
