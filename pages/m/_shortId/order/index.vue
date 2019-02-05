<template>
</template>

<script>
  import { cartApi } from '../../../../api/local/cartApi'
  import { httpOrderApi } from '../../../../api/http/lt/httpOrderApi'

  export default {
    created() {
      let cart = cartApi.getCart()
      if (cart.select === 0) {
        this.$router.push(`/m/${this.$route.params.shortId}/food`)
        return
      }

      httpOrderApi.getAll(this.$route.params.shortId, 1, 0, 20).then(res => {
        if (res.currentPageSize > 0) {
          let notPaidCount = 0
          let notPaidOrder = null

          for (let index in res.elements) {
            let order = res.elements[index]
            if (order.status === 'NotPaid') {
              notPaidCount += 1

              if (notPaidOrder == null) {
                notPaidOrder = order
              }
            }
          }

          if (notPaidCount === 1) {
            this.$router.push(`/m/${this.$route.params.shortId}/order/${notPaidOrder.id}/add`)
            return
          }

          this.$router.push({
            path: `/m/${this.$route.params.shortId}/order/history`,
            query: {
              live: 1
            }
          })
          return
        }

        this.$router.push(`/m/${this.$route.params.shortId}/order/new`)
      })
    }
  }
</script>

<style scoped lang="scss">
</style>
