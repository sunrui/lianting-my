<template>
  <b-notify roleType="waiter"></b-notify>
</template>

<script>
  import BNotify from '../../../../../components/b/BNotify'

  export default {
    metaInfo: {
      title: '最新消息'
    },
    middleware: 'auth',
    components: { BNotify }
  }
</script>

<style scoped lang="scss">

</style>
