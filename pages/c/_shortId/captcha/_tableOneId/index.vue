<template>
  <div>
    <loading v-if="ui.loading"></loading>
    <div v-else>
      <div v-if="ui.captchaExpired">
        <empty image="/img/no/no_table.png" content="餐桌二维码已失效。"></empty>
      </div>
    </div>
  </div>
</template>

<script>
  import {userApi} from '../../../../../api/local/userApi'
  import {httpTableApi} from '../../../../../api/http/lt/httpTableApi'
  import {httpCaptchaApi} from '../../../../../api/http/lt/httpCaptchaApi'
  import Loading from '../../../../../components/common/Loading'
  import {cartApi} from '../../../../../api/local/cartApi'
  import {httpOrderApi} from '../../../../../api/http/lt/httpOrderApi'
  import Empty from '../../../../../components/common/Empty'

  export default {
    middleware: 'auth',
    components: {Loading, Empty},
    data() {
      return {
        ui: {
          loading: true,
          captchaExpired: false
        }
      }
    },
    mounted() {
      let tableOneId = this.$route.params.tableOneId
      if (!Boolean(tableOneId)) {
        this.invalidTable()
        this.ui.loading = false
        return
      }

      this.httpTable(tableOneId)
    },
    methods: {
      invalidTable() {
        userApi.setCaptchaTableId(null)
        userApi.setTableName(null)
        userApi.setTableNumber(null)

        this.ui.captchaExpired = true
      },
      httpTable(tableOneId) {
        httpTableApi.getTable(this.$route.params.shortId, tableOneId).then(res => {
          if (res.notExists) {
            this.invalidTable()
            this.ui.loading = false
          } else if (res.tableOne) {
            this.httpCaptchaTable(res.tableOne.id)
          } else {
            this.invalidTable()
            this.ui.loading = false
          }
        })
      },
      httpCaptchaTable(tableOneId) {
        httpCaptchaApi.postCaptchaTable(this.$route.params.shortId, tableOneId).then(res => {
          this.ui.loading = false

          if (res.tableOneNotExists) {
            this.invalidTable()
          } else {
            userApi.setCaptchaTableId(res.captchaTableId)
            userApi.setTableName(res.tableName)
            userApi.setTableNumber(res.tableNumber)

            cartApi.setPeople(0)

            httpOrderApi.getAllByTableOneId(this.$route.params.shortId, tableOneId, true, 0, 20).then(res => {
              if (res.elements.length > 1) {
                this.$router.push({
                  path: `/c/${this.$route.params.shortId}/order/receipt`,
                  query: {
                    tableOneId: tableOneId
                  }
                })
              } else if (res.elements.length > 0) {
                this.$router.push(`/c/${this.$route.params.shortId}/order/${res.elements[0].id}`)
              } else {
                this.$router.push(`/c/${this.$route.params.shortId}/food`)
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
    background: white;
    height: 100vh;
    text-align: center;
  }
</style>
