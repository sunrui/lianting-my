<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="charge">
        <div class="charge_header"></div>
        <div class="charge_body box_radius_footer">
          <div class="blank_40"></div>

          <div class="charge_body_title">
            <div class="charge_body_title_one">统计日期</div>
            <div class="charge_body_title_one">成交订单</div>
            <div class="charge_body_title_one">就餐人数</div>
            <div class="charge_body_title_one">总计收益</div>
          </div>

          <div class="box_divide"></div>

          <div v-for="statOrder in http.res.statOrder.elements">
            <div class="charge_body_content">
              <div class="charge_body_content_one">{{getDate(statOrder.date)}}</div>
              <div class="charge_body_content_one">{{statOrder.totalOrder}}</div>
              <div class="charge_body_content_one">{{statOrder.totalPeople}}</div>
              <div class="charge_body_content_one charge_body_content_price">{{statOrder.totalRevenue}}</div>
            </div>
            <div class="box_divide" v-if="statOrder !== http.res.statOrder.elements[http.res.statOrder.elements.length - 1]"></div>
          </div>

          <div class="blank_20"></div>
        </div>
      </div>
    </div>

    <div class="blank_30"></div>
  </div>
</template>

<script>
  import TitleBar from "../../../../../components/common/TitleBar"
  import {httpStatAdminApi} from "../../../../../api/http/lt/httpStatAdminApi"
  import {timeApi} from "../../../../../api/local/timeApi"

  export default {
    metaInfo: {
      title: '收益'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '收益',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'white',
          imageHeight: 0
        },
        http: {
          res: {
            statOrder: {
              elements: []
            }
          }
        }
      }
    },
    created() {
      this.httpStatOrder()
    },
    methods: {
      getDate(date) {
        return timeApi.dateFormat(new Date(parseInt(date)), 'yyyy/MM/dd')
      },
      httpStatOrder() {
        httpStatAdminApi.getOrder(this.$route.params.shortId, 0, 30).then(res => {
          this.http.res.statOrder = res
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import "index";
</style>