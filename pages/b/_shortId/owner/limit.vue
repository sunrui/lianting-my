<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>
    <div class="empty">
      <img class="empty_image" data-src="/img/no/no_shop.png" alt="">
        <div class="empty_label">很抱歉，当前会员受到限制。</div>
        <div class="empty_label_tip">请转至<span class="empty_label_tip_link" @click="btnLicense">续费</span>页升级您的授权。</div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../../../../components/common/TitleBar'

  export default {
    metaInfo: {
      title: '授权限制'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '授权限制',
          theme: 'white',
          backUri: `/b/${this.$route.params.shortId}/owner/license`,
          imageHeight: 0
        },
      }
    },
    methods: {
      btnLicense() {
        this.$router.push(`/b/${this.$route.params.shortId}/owner/license`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
