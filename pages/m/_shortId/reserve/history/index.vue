<template>
  <section>
    <nav-bar></nav-bar>

    <div v-if="ui.loading">
      <p>loading 的小圈圈</p>
    </div>
    <div v-else>
      <div v-bind:key="reserve.id" v-for="reserve in reserves.elements">
        <p>{{new Date(parseInt(reserve.date)).toLocaleString()}}</p>
        <p>预约 {{reserve.tableGroupName}}，
          {{
          reserve.status === 'Wait' ? '待回复' :
          reserve.status === 'Accept' ? '已同意' :
          reserve.status === 'AcceptRead' ? '已同意' :
          reserve.status === 'Refuse' ? '已拒绝' :
          reserve.status === 'RefuseRead' ? '已拒绝' :
          reserve.status === 'Cancel' ? '已取消' :
          reserve.status === 'Arrived' ? '已到店' :
          reserve.status
          }}
        </p>
        <button @click="btnReserveOne(reserve)">查看详细</button>
        <hr>
      </div>
      <div v-if="!reserves.elements || reserves.elements.length === 0">
        <p>暂无更多预订</p>
      </div>

    </div>

  </section>
</template>

<script>
  import NavBar from '../../../../../components/NavBar'
  import { httpReserveApi } from '../../../../../api/http/ltorder/httpReserveApi'

  export default {
    metaInfo: {
      title: '我的预订'
    },
    middleware: 'auth',
    components: { NavBar },
    data() {
      return {
        reserves: {},
        ui: {}
      }
    },
    created() {
      this.loadReserves()
    },
    methods: {
      loadReserves() {
        httpReserveApi.getAll(this.$route.params.shortId, null, null, 0, 999).then(res => {
          this.reserves = res
        })
      },
      btnReserveOne(reserve) {
        this.$router.push(`/m/${this.$route.params.shortId}/reserve/${reserve.id}`)
      }
    }
  }
</script>

<style scoped>

</style>
