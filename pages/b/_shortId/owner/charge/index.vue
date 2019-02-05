<template>
  <section>
    <div v-if="ui.loading">
      <p>正在加载中</p>
    </div>
    <div v-else>
      <div v-bind:key="charge.id" v-for="charge in charges.elements">
        <div class="row">
          <div class="col-md-2">
            <p>{{charge.info ? charge.info : '匿名用户'}}</p>
          </div>
          <div class="col-md-3">
            <p>{{charge.charge}} 元</p>
          </div>
          <div class="col-md-3">
            <p>{{charge.times}} 笔</p>
          </div>
          <div class="col-md-3">
            <p>{{new Date(parseInt(charge.recentAt)).toLocaleString()}}</p>
            <button @click="btnChargeOrder(charge)">></button>
          </div>
        </div>
        <hr>
      </div>
      <div v-if="!charges.elements || charges.elements.length === 0">
        <p>暂无数据</p>
      </div>
    </div>
  </section>
</template>

<script>
  import { httpUserApi } from '../../../../../api/http/user/httpUserApi'
  import { httpChargeAdminApi } from '../../../../../api/http/ltorder/httpChargeAdminApi'

  export default {
    metaInfo: {
      title: '顾客'
    },
    middleware: 'auth',
    components: { },
    data() {
      return {
        charges: {},
        ui: {}
      }
    },
    created() {
      this._loadCharge()
    },
    methods: {
      _loadCharge() {


        httpChargeAdminApi.getAll(this.$route.params.shortId, 0, 50).then(res => {
          console.log(res)
          this.charges = res

          for (let index in this.charges.elements) {
            let charge = this.charges.elements[index]

            httpUserApi.getInfo(charge.userId).then(res => {
              // TODO 这里显示不出来，需要修正
              charge.info = res
            })
          }
        })
      },
      btnChargeOrder(charge) {
        this.$router.push(`/b/${this.$route.params.shortId}/owner/charge/${charge.userId}`)
      }
    }
  }
</script>

<style scoped>

</style>
