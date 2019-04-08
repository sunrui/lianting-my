<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="charge">
        <div class="charge_header"></div>
        <div class="charge_body box_radius_footer">
          <div class="charge_body_title"></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import TitleBar from "../../../../../components/common/TitleBar"

  export default {
    metaInfo: {
      title: '收益'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '收益',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'white',
          imageHeight: 0
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import "index";
</style>