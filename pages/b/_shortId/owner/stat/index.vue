<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item" @click="btnNav('charge')">
          <div class="addition_item_label">收益统计</div>
          <div class="addition_item_link"></div>
        </div>
        <div class="box_divide"></div>
        <div class="addition_item" @click="btnNav('order')">
          <div class="addition_item_label">订单统计</div>
          <div class="addition_item_link"></div>
        </div>
        <div class="box_divide"></div>
        <div class="addition_item" @click="btnNav('food')">
          <div class="addition_item_label">餐食统计</div>
          <div class="addition_item_link"></div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item" @click="btnNav('queue')">
          <div class="addition_item_label">排队统计</div>
          <div class="addition_item_link"></div>
        </div>
        <div class="box_divide"></div>
        <div class="addition_item" @click="btnNav('reserve')">
          <div class="addition_item_label">预订统计</div>
          <div class="addition_item_link"></div>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item" @click="btnNav('user')">
          <div class="addition_item_label">顾客统计</div>
          <div class="addition_item_link"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TitleBar from '../../../../../components/common/TitleBar'

  export default {
    metaInfo: {
      title: '统计'
    },
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          backUri: `/b/${this.$route.params.shortId}/owner`,
          title: '统计',
          theme: 'image',
          imageHeight: 220
        }
      }
    },
    methods: {
      btnNav(type) {
        this.$router.push(`/b/${this.$route.params.shortId}/owner/stat/${type}`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
</style>
