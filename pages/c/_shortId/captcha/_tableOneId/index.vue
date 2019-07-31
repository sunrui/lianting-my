<template>
  <loading></loading>
</template>

<script>
  import {userApi} from '../../../../../api/local/userApi'
  import {httpTableApi} from '../../../../../api/http/lt/httpTableApi'
  import {httpCaptchaApi} from '../../../../../api/http/lt/httpCaptchaApi'
  import Loading from '../../../../../components/common/Loading'
  import {cartApi} from '../../../../../api/local/cartApi'
  import {httpOrderApi} from '../../../../../api/http/lt/httpOrderApi'

  export default {
    middleware: 'auth',
    components: {Loading},
    data() {
      return {}
    },
    mounted() {
      let tableOneId = this.$route.params.tableOneId
      if (!Boolean(tableOneId)) {
        this.invalidTable()
        return
      }

      this.httpTable(tableOneId)
    },
    methods: {
      invalidTable() {
        this.$msgBox.doModal({
          type: 'yes',
          title: '无效餐桌',
          content: '餐桌二维码已过期，请重新扫码或联系服务员。'
        })

        userApi.setCaptchaTableId(null)
        userApi.setTableName(null)
        userApi.setTableNumber(null)
      },
      httpTable(tableOneId) {
        httpTableApi.getTable(this.$route.params.shortId, tableOneId).then(res => {
          if (res.notExists) {
            this.invalidTable()
          } else if (res.tableOne) {
            this.httpCaptchaTable(res.tableOne.id)
          } else {
            this.invalidTable()
          }
        })
      },
      httpCaptchaTable(tableOneId) {
        httpCaptchaApi.postCaptchaTable(this.$route.params.shortId, tableOneId).then(res => {
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

<style lang="scss">
  .container {
    background: white;
    height: 100vh;
    text-align: center;
  }
</style>
