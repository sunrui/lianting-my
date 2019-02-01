<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>
    <empty image="/img/no/no_queue.png" content="没有排队记录。"></empty>
  </div>
</template>

<script>
  import TitleBar from '../../../../../components/TitleBar'
  import Empty from '../../../../../components/Empty'

  export default {
    metaInfo: {
      title: '我的排队'
    },
    middleware: 'auth',
    components: {TitleBar, Empty},
    data() {
      return {
        title: {
          canBack: true,
          title: '我的排队',
          backUri: `/m/${this.$route.params.shortId}`,
          theme: 'white',
          imageHeight: 0
        }}
    }

  }
</script>

<style scoped lang="scss">
  @import '~assets/common.scss';
</style>
