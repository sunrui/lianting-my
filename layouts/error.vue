<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="empty">
      <img class="empty_image" src="/img/no/no_crash.png">
      <div class="empty_label" v-if="error.statusCode === 404">404 - 呃〜好像走丢了！~</div>
      <div class="empty_label" v-else>{{error}}</div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../components/TitleBar'

  export default {
    metaInfo: {
      title: '访问出错'
    },
    props: ['error'],
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '访问出错',
          backUri: null,
          theme: 'white',
          imageHeight: 0
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/scss/empty.scss';
</style>
