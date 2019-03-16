<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="empty">
      <img class="empty_image" src="/img/no/no_crash.png" :alt="ui.content">
      <div class="empty_label" v-if="error.statusCode === 404">{{ui.content}}</div>
      <div class="empty_label" v-else>{{error.message}}</div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../components/common/TitleBar'

  export default {
    metaInfo: {
      title: '内部错误'
    },
    props: ['error'],
    components: { TitleBar },
    data() {
      return {
        title: {
          canBack: false,
          title: '内部错误',
          backUri: null,
          theme: 'white',
          imageHeight: 0
        },
        ui: {
          content: '404 - 呃〜好像走丢了！~'
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common/empty';
</style>
