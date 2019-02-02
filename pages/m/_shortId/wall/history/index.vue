<template>
</template>

<script>
  import { httpWallApi } from '../../../../../api/http/ltorder/httpWallApi'
  import { timeApi } from '../../../../../api/local/timeApi'
  import { httpOrderApi } from '../../../../../api/http/ltorder/httpOrderApi'
  import { foodDetailApi } from '../../../../../api/local/foodDetail'
  import TitleBar from '../../../../../components/common/TitleBar'

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
            this.$router.push(`/m/${this.$route.params.shortId}/wall/empty`)
            return
          }

          this.$router.push({
            path: `/m/${this.$route.params.shortId}/wall`,
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
  @import '~assets/m/wall';
</style>
