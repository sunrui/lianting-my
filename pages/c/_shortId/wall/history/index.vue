<template>
  <Loading></Loading>
</template>

<script>
  import { httpWallApi } from '../../../../../api/http/lt/httpWallApi'
  import Loading from '../../../../../components/common/Loading'

  export default {
    metaInfo: {
      title: '我的留言墙'
    },
    middleware: 'auth',
    components: {Loading},
    mounted() {
      this.httpWall()
    },
    methods: {
      httpWall() {
        httpWallApi.getMyAll(this.$route.params.shortId, 0, 1).then(res => {
          if (res.currentPageSize === 0) {
            this.$router.push(`/c/${this.$route.params.shortId}/wall/history/empty`)
            return
          }

          this.$router.push({
            path: `/c/${this.$route.params.shortId}/wall`,
            query: {
              my: true
            }
          })
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '~assets/common';
  @import '~assets/c/wall';
</style>
