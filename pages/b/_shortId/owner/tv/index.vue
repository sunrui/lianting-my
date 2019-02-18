<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="tip">
        <li>要启用展屏功能，首先您的餐厅需要拥有一台显示设备。</li>
        <li>推荐展示尺寸为 1920x1080，同样支持 4K 及以上高清电视。</li>
        <li>您可在显示设备浏览器中直接访问以下地址。</li>
        <li><a class="tv_link" :href="getTvUrl()">{{getTvUrl()}}</a></li>
      </div>
    </div>

    <div class="button_box">
      <div class="button_big" @click="btnTv">打开链接</div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../../../../../components/common/TitleBar'

  export default {
    metaInfo: {
      title: '展屏'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '展屏',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'image',
          imageHeight: 300
        }
      }
    },
    methods: {
      getTvUrl() {
        return document.location.protocol + '//' + window.location.host + `/b/${this.$route.params.shortId}/tv`
      },
      btnTv() {
        window.location = this.getTvUrl()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import "index";
</style>
