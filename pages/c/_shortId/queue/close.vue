<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>
    <empty image="/img/no/no_queue.png" content="无需排队，您可直接到迎宾台就餐。"></empty>
  </div>
</template>

<script>
  import Empty from '../../../../components/common/Empty'
  import TitleBar from '../../../../components/common/TitleBar'

  export default {
    metaInfo: {
      title: '无需排队'
    },
    middleware: 'auth',
    components: { TitleBar, Empty },
    data() {
      return {
        title: {
          canBack: true,
          title: '无需排队',
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
