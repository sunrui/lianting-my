<template>
  <div>
    <title-bar class="title_bar_hide" :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>
    <empty image="/img/no/no_role_user.png" content="您尚未成为任何店铺的内部人员。"></empty>
    <div class="no_role_user_tip">您可以联系管理员为您分配店铺权限。</div>
  </div>
</template>

<script>
  import Empty from '../../components/common/Empty'
  import TitleBar from '../../components/common/TitleBar'

  export default {
    metaInfo: {
      title: '没有角色'
    },
    middleware: 'auth',
    components: {TitleBar, Empty},
    data() {
      return {
        title: {
          canBack: false,
          title: '没有角色',
          theme: 'white',
          imageHeight: 0
        },
      }
    }
  }
</script>

<style scoped lang="scss">
  .title_bar_hide {
    visibility: hidden;
  }

  .no_role_user_tip {
    position: fixed;
    bottom: px2rem(30);
    right: px2rem(20);
    color: #666666;
  }

</style>
