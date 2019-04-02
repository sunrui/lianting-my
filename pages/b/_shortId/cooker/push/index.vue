<template>
  <b-role-push roleType="Cooker"></b-role-push>
</template>

<script>
  import BRolePush from "../../../../../components/b/BRolePush"

  export default {
    metaInfo: {
      title: '微信推送'
    },
    middleware: 'auth',
    components: {BRolePush},
  }
</script>

<style scoped>

</style>