<template>
  <div>
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
    components: {Empty}
  }
</script>

<style scoped lang="scss">
  .no_role_user_tip {
    position: fixed;
    bottom: px2rem(30);
    right: px2rem(20);
    color: #666666;
  }

</style>
