<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item" @click="btnNav('shop/role')">
          <div class="addition_item_label">工作台</div>
          <div class="addition_item_link"></div>
        </div>
        <div class="box_divide"></div>
        <div class="addition_item" @click="btnNav('b')">
          <div class="addition_item_label">我的店铺</div>
          <div class="addition_item_link"></div>
        </div>
      </div>
    </div>

    <div class="wechat">
      <div class="wechat_title">- 微信公共号登录 -</div>
      <div class="wechat_icon"></div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../components/common/TitleBar'

  export default {
    metaInfo: {
      title: '恋厅移动入口'
    },
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: false,
          title: '恋厅移动入口',
          theme: 'image',
          imageHeight: 220
        }
      }
    },
    methods: {
      btnNav(url) {
        this.$router.push(url)
      }
    }
  }
</script>

<style lang="scss">
  @import '~assets/common';
  @import "index";
</style>
