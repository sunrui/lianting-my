<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <div class="box">
      <div class="charge">
        <div class="charge_header"></div>
        <div class="charge_body box_radius_footer">
          <div class="blank_40"></div>

          <div class="charge_body_title">
            <div class="charge_body_title_one">交易日期</div>
            <div class="charge_body_title_one">餐食名称</div>
            <div class="charge_body_title_one">售卖份数</div>
          </div>

          <div class="box_divide"></div>

          <div v-if="http.res.statFood.elements.length > 0">
            <div v-for="statFood in http.res.statFood.elements">
              <div class="charge_body_content">
                <div class="charge_body_content_one">{{getDate(statFood.date)}}</div>
                <div class="charge_body_content_one">{{statFood.foodCategoryName}}</div>
                <div class="charge_body_content_one">{{statFood.totalFoodCategory}}</div>
              </div>
              <div class="box_divide" v-if="statFood !== http.res.statFood.elements[http.res.statFood.elements.length - 1]"></div>
            </div>
            <div class="charge_footer"></div>
          </div>
          <div class="charge_empty" v-else>暂时没有售卖餐食。</div>
        </div>
      </div>
    </div>

    <div class="blank_30"></div>
  </div>
</template>

<script>
  import TitleBar from '../../../../../../components/common/TitleBar'
  import {httpStatAdminApi} from '../../../../../../api/http/lt/httpStatAdminApi'
  import {timeApi} from '../../../../../../api/local/timeApi'
  import {httpShopApi} from '../../../../../../api/http/shop/httpShopApi'

  export default {
    metaInfo: {
      title: '餐食统计'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '餐食统计',
          backUri: `/b/${this.$route.params.shortId}/owner/stat`,
          theme: 'image',
          imageHeight: 300
        },
        http: {
          res: {
            statFood: {
              elements: []
            }
          }
        }
      }
    },
    created() {
      this.httpShop()
      this.httpStatFood()
    },
    methods: {
      getDate(date) {
        return timeApi.dateFormat(new Date(parseInt(date)), 'yyyy/MM/dd')
      },
      httpShop() {
        httpShopApi.getOne(this.$route.params.shortId).then(res => {
          this.ui.limit.licenseType = (res.licenseType !== 'Lite' && res.licenseType !== 'Normal' && res.licenseType !== 'Senior')
        })
      },
      httpStatFood() {
        httpStatAdminApi.getFood(this.$route.params.shortId, 0, 200).then(res => {
          this.http.res.statFood = res
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import "index";
</style>
