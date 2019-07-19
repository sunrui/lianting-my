<template>
  <Loading></Loading>
</template>

<script>
  import {cartApi} from '../../../../api/local/cartApi'
  import {httpOrderApi} from '../../../../api/http/lt/httpOrderApi'
  import Loading from '../../../../components/common/Loading'

  export default {
    middleware: 'auth',
    components: {Loading},
    mounted() {
      let cart = cartApi.getCart()
      if (cart.select === 0) {
        this.$router.push(`/c/${this.$route.params.shortId}/food`)
        return
      }

      httpOrderApi.getAll(this.$route.params.shortId, 'ForHere', true, 0, 99).then(res => {
        if (res.currentPageSize > 0) {
          this.$router.push(`/c/${this.$route.params.shortId}/order/add`)
        } else {
          this.$router.push({
            path: `/c/${this.$route.params.shortId}/order/history`,
            query: {
              live: 1
            }
          })
        }
      })
    }
  }
</script>

<style scoped lang="scss">
</style>
