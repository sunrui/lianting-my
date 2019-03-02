<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item" v-if="!authed" @click="btnNav('login')">
          <div class="addition_item_label">登录</div>
          <div class="addition_item_link"></div>
        </div>
        <div class="addition_item" v-else @click="btnNav('logout')">
          <div class="addition_item_label">登出</div>
          <div class="addition_item_link"></div>
        </div>
        <div class="box_divide"></div>
        <div class="addition_item" @click="btnNav('shop/role')">
          <div class="addition_item_label">工作台</div>
          <div class="addition_item_link"></div>
        </div>
        <div class="box_divide"></div>
        <div class="addition_item" @click="btnNav('b')">
          <div class="addition_item_label">我的店铺</div>
          <div class="addition_item_link"></div>
        </div>
        <div class="box_divide"></div>
        <div class="addition_item" @click="btnNav('shop/group/create')">
          <div class="addition_item_label">创建品牌</div>
          <div class="addition_item_link"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {stateApi} from '../api/local/stateApi'
  import TitleBar from '../components/common/TitleBar'

  export default {
    metaInfo: {
      title: '主页'
    },
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: false,
          title: '测试主页',
          theme: 'image',
          imageHeight: 220
        }
      }
    },
    computed: {
      authed() {
        let userId = stateApi.user.getId()
        return Boolean(userId)
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
</style>
