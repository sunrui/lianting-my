<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>
    <empty title="没有店铺" image="/img/no/no_role_user.png" content="您尚未成为任何店铺的内部人员。"></empty>
    <div class="tip">您可以联系管理员为您分配店铺权限。</div>
  </div>
</template>

<script>
  import Empty from '../../components/common/Empty'
  import TitleBar from '../../components/common/TitleBar'

  export default {
    metaInfo: {
      title: '没有店铺'
    },
    middleware: 'auth',
    components: {TitleBar, Empty},
    data() {
      return {
        title: {
          canBack: false,
          title: '没有店铺',
          theme: 'white'
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .tip {
    position: fixed;
    bottom: px2rem(30);
    right: px2rem(20);
    color: #666666;
  }

</style>
