<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>
    <empty image="/img/no/no_food.png" content="没有餐食，如您是管理员请先添加。"></empty>
  </div>
</template>

<script>
  import Empty from '../../../../components/common/Empty'
  import TitleBar from '../../../../components/common/TitleBar'

  export default {
    metaInfo: {
      title: '没有餐食'
    },
    middleware: 'auth',
    components: { TitleBar, Empty },
    data() {
      return {
        title: {
          canBack: true,
          title: '没有餐食',
          backUri: `/c/${this.$route.params.shortId}`,
          theme: 'white',
          imageHeight: 0
        }
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
