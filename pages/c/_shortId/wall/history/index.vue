<template>
</template>

<script>
  import { httpWallApi } from '../../../../../api/http/lt/httpWallApi'

  export default {
    metaInfo: {
      title: '我的留言墙'
    },
    middleware: 'auth',
    created() {
      this.httpWall()
    },
    methods: {
      httpWall() {
        httpWallApi.getMyAll(this.$route.params.shortId, 0, 20).then(res => {
          if (res.elements.length === 0) {
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

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/wall';
</style>
