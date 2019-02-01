<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>
    <empty image="/img/no/no_reserve.png" content="无法在线预订，如您有需求请电话联系。"></empty>
  </div>
</template>

<script>
  import Empty from '../../../../components/Empty'
  import TitleBar from '../../../../components/TitleBar'

  export default {
    metaInfo: {
      title: '无法预订'
    },
    middleware: 'auth',
    components: {TitleBar, Empty},
    data() {
      return {
        title: {
          canBack: true,
          title: '无法预订',
          backUri: `/m/${this.$route.params.shortId}`,
          theme: 'white',
          imageHeight: 0
        }
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
