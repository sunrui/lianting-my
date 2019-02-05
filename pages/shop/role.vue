<template>
  <section>
    <div v-if="ui.loading">
      <p>loading....的小圈圈</p>
    </div>
    <div v-else v-bind:key="shopRole.id" v-for="shopRole in shopRoles" style="background-color: coral">
      <div class="row">
        <div class="col-md-6">
          <button @click="btnEnterShop(shopRole.shop)">二维码</button>
        </div>
        <div class="col-md-6">
          <h3>{{shopRole.shop.name}}</h3>
          <p>店铺标识: {{shopRole.shop.shortId}}</p>
        </div>
      </div>

      <div v-bind:key="type" v-for="type in shopRole.types">
        <button class="btn btn-primary" @click="btnEnterRole(shopRole.shop.shortId, 'Admin')" v-if="type === 'Admin'">管理员</button>
        <button class="btn btn-primary" @click="btnEnterRole(shopRole.shop.shortId, 'Waiter')" v-if="type === 'Waiter'">服务员</button>
        <button class="btn btn-primary" @click="btnEnterRole(shopRole.shop.shortId, 'Cook')" v-if="type === 'Cook'">厨师</button>
        <button class="btn btn-primary" @click="btnEnterRole(shopRole.shop.shortId, 'Cashier')" v-if="type === 'Cashier'">收银</button>
        <hr>
      </div>
    </div>
  </section>
</template>

<script>
  import { httpRoleApi } from '../../api/http/ltorder/httpRoleApi'

  export default {
    metaInfo: {
      title: '工作台'
    },
    middleware: 'auth',
    components: { },
    data() {
      return {
        shopRoles: {},
        ui: {}
      }
    },
    created() {
      this.$store.commit('navbar/update', {
        canBack: false,
        title: '工作台',
        home: '/'
      })

      httpRoleApi.getAll(0, 999).then(res => {
        console.log(res)
        this.ui.loading = false
        this.shopRoles = res

        if (this.shopRoles.length === 0) {
          this.$router.push('/shop/empty')
        }
      })
    },
    methods: {
      btnEnterShop(shop) {
        this.$router.push(`/m/${shop.shortId}`)
      },
      btnEnterRole(shortId, type) {
        if (type === 'Admin') {
          this.$router.push(`/b/${shortId}/admin`)
          return
        }

        if (type === 'Waiter') {
          this.$router.push(`/b/${shortId}/waiter`)
          return
        }

        if (type === 'Cook') {
          this.$router.push(`/b/${shortId}/cook`)
          return
        }

        if (type === 'Cashier') {
          this.$router.push(`/b/${shortId}/cashier`)
        }
      }
    }
  }
</script>

<style scoped>

</style>
