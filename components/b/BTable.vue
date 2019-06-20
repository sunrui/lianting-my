<template>
  <div v-show="!ui.loading">
    <title-bar ref="titleBar_BTable" :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <transition name="fade">
      <div :class="{ cover_mask_9: ui.vCoverMask}" @click="btnCoverMask"></div>
    </transition>

    <div class="shop_title_box">
      <div class="shop_title_name">{{http.res.shop.name}}</div>
      <div class="shop_title_detail">{{http.res.info.notice ? http.res.info.notice : '欢迎光临本餐厅!'}}</div>
    </div>

    <div class="blank_50"></div>
    <div class="blank_40"></div>

    <div class="content_box">
      <div class="blank_10"></div>

      <div class="menu_box">
        <div class="menu">
          <div class="menu_item" v-for="(tableGroup, index) in http.res.tableGroups.elements">
            <div :id="'menu_' + tableGroup.id"
                 :class="{menu_item_href:!isSelectMenu(tableGroup.id), menu_item_href_select:isSelectMenu(tableGroup.id)}"
                 @click="selectMenu(index, tableGroup.id, false)">
              <div class="menu_item_label">{{tableGroup.name}}</div>
              <div class="menu_item_select" v-if="isSelectMenu(tableGroup.id)">
                <div class="menu_item_select_line"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="leaf_box" @click="btnLeaf(true)">
          <div class="leaf"></div>
        </div>
      </div>

      <div class="menu_box_extend" v-if="ui.vMenuExtend">
        <div class="menu_extend">
          <div class="menu_item menu_item_extend" v-for="(tableGroup, index) in http.res.tableGroups.elements">
            <div :class="{menu_item_href:!isSelectMenu(tableGroup.id), menu_item_href_select:isSelectMenu(tableGroup.id)}"
                 @click="selectMenu(index, tableGroup.id, true)">
              <div class="menu_item_label">{{tableGroup.name}}</div>
              <div class="menu_item_select" v-if="isSelectMenu(tableGroup.id)">
                <div class="menu_item_select_line"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="leaf_box_extend" @click="btnLeaf(false)">
          <div class="leaf_extend"></div>
        </div>
      </div>

      <div class="food_group_box" :id="'box_' + tableGroup.id" v-for="tableGroup in http.res.tableGroups.elements">
        <div class="food_group">
          <div class="food_group_anchor" :id="tableGroup.id"></div>
          <div class="food_group_name">{{tableGroup.name}}</div>
          <div class="food_group_private_room" v-if="tableGroup.privateRoom">包间</div>
          <div class="food_group_count">({{tableGroup.tableOnes ? tableGroup.tableOnes.length : 0}})</div>
          <div class="food_group_right"><span class="food_group_right_remark">{{tableGroup.remark}}</span> <span class="food_group_right_people">({{tableGroup.minPeople + '-' + tableGroup.maxPeople + '人'}})</span></div>
        </div>

        <div class="box" v-for="(table, index) in tableGroup.tableOnes">
          <div class="blank_10" v-if="index !== 0"></div>

          <div class="table box_radius">
            <div class="table_captcha" @click="btnCaptcha(tableGroup, table)"></div>

            <div @click="btnTable(table)">
              <div class="table_number">{{table.fullNumber}}</div>
              <div class="table_idle" v-if="getTableOrder(table) && getTableOrder(table).length === 0"></div>
              <div class="table_busy" v-else>
                <div class="table_time">
                  <div class="table_one">
                    <img class="table_one_icon" src="/img/b/table/b_table_time.png" alt="">
                    <div class="table_one_label">{{getElapsedTime(getTableOrder(table))}}</div>
                  </div>
                </div>
                <div class="table_extra">
                  <div class="table_one">
                    <img class="table_one_icon" src="/img/b/table/b_table_people.png" alt="">
                    <div class="table_one_label">{{getTableOrder(table)[0].people}}</div>
                  </div>
                  <div class="table_one">
                    <img class="table_one_icon" src="/img/b/table/b_table_order.png" alt="">
                    <div class="table_one_label">{{getTableOrder(table).length}}</div>
                  </div>
                  <div class="table_one">
                    <img class="table_one_icon" src="/img/b/table/b_table_food.png" alt="">
                    <div class="table_one_label">{{countFood(getTableOrder(table))}}</div>
                  </div>
                  <div class="table_one">
                    <img class="table_one_icon" src="/img/b/table/b_table_wait.png" alt="">
                    <div class="table_one_label">{{countWaitFood(getTableOrder(table))}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="blank_10" v-if="index !== tableGroup.tableOnes ? tableGroup.tableOnes.length - 1 : 0"></div>
        </div>
      </div>

      <div class="blank_30"></div>
    </div>

    <captcha v-if="ui.vCaptcha" @closeCaptcha="closeCaptcha()" :title="ui.captcha.title" :text="ui.captcha.text"></captcha>

    <transition name="toggle">
      <div class="modal_bottom" v-if="ui.vMenuTable">
        <div class="modal_close_box" @click="btnCoverMask">
          <img class="modal_close" src="/img/common/close.png" alt="">
        </div>

        <div class="modal_title">{{ui.selectTable.tableGroup_name}} - {{ui.selectTable.fullNumber}}</div>

        <div class="modal_menu modal_menu_select" v-if="getTableOrder(ui.selectTable).length > 0" @click="btnTableOrder(ui.selectTable)">查看订单</div>
        <div class="box_divide" v-if="getTableOrder(ui.selectTable).length > 0"></div>

        <div class="modal_menu" @click="btnTableFood(ui.selectTable)">{{getTableOrder(ui.selectTable).length > 0 ? '加餐' : '点餐'}}</div>
        <div class="modal_menu" v-if="getTableOrder(ui.selectTable).length > 0" @click="btnTableChange(ui.selectTable)">换桌</div>

        <div class="blank_30"></div>
      </div>
    </transition>

    <div class="modal_center" v-if="ui.vTableChange">
      <div class="modal_close_box" @click="btnCoverMask">
        <img class="modal_close" src="/img/common/close.png" alt="">
      </div>

      <div class="modal_title">{{ui.selectTable.tableGroup_name}} - {{ui.selectTable.fullNumber}}</div>

      <div class="modal_group">
        <div v-for="tableGroup in http.res.tableGroups.elements">
          <div class="modal_group_name">
            <div class="modal_group_name_label">{{tableGroup.name}}</div>
            <div class="modal_group_name_people">({{tableGroup.minPeople}}-{{tableGroup.maxPeople}})</div>
          </div>
          <div class="modal_group_box" v-for="table in tableGroup.tableOnes">
            <div class="modal_group_one">
              <div class="modal_group_one_name_select" v-if="getTableOrder(table).length > 0">{{table.fullNumber}}</div>
              <div class="modal_group_one_name_choose" v-else-if="table.id === ui.changeTable.id">{{table.fullNumber}}</div>
              <div class="modal_group_one_name" v-else @click="btnChooseTable(table)">{{table.fullNumber}}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal_button_box">
        <div class="button_big" v-if="ui.changeTable.id" @click="btnTableChangeConfirm">确认换桌</div>
        <div class="button_big button_gray" v-else>确认换桌</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {httpShopApi} from '../../api/http/shop/httpShopApi'
  import {httpInfoApi} from '../../api/http/lt/httpInfoApi'
  import {httpTableApi} from '../../api/http/lt/httpTableApi'
  import {scrollApi} from '../../api/local/scrollApi'
  import TitleBar from '../common/TitleBar'
  import Captcha from '../common/Captcha'
  import {httpOrderAdminApi} from '../../api/http/lt/httpOrderAdminApi'
  import {foodDetailApi} from '../../api/local/foodDetail'
  import {timeApi} from '../../api/local/timeApi'
  import {userApi} from '../../api/local/userApi'
  import {httpCaptchaApi} from '../../api/http/lt/httpCaptchaApi'
  import {roleApi} from '../../api/local/roleApi'

  export default {
    metaInfo: {
      title: '餐桌'
    },
    middleware: 'auth',
    components: {TitleBar, Captcha},
    props: {
      roleType: {
        type: String,
        default: 'waiter'
      }
    },
    data() {
      return {
        title: {
          canBack: true,
          title: '餐桌',
          backUri: `/b/${this.$route.params.shortId}/waiter`,
          theme: 'image',
          imageHeight: 300
        },
        ui: {
          loading: true,
          vMenuExtend: false,
          vCoverMask: false,
          vCaptcha: false,
          vMenuTable: false,
          vTableChange: false,
          selectMenuId: null,
          captcha: {
            title: '',
            text: ''
          },
          selectTable: {},
          changeTable: {},
          interval: null
        },
        http: {
          res: {
            shop: {},
            info: {},
            tableGroups: {},
            orders: {}
          }
        }
      }
    },
    created() {
      this.httpShop()
      this.httpInfo()
      this.httpTableGroup()

      this.autoRefresh()
      this.ui.interval = setInterval(this.autoRefresh, 10 * 1000)
    },
    mounted() {
      this.title.backUri = `/b/${this.$route.params.shortId}/${this.roleType}`
      this.$refs.titleBar_BTable.setBackUri(this.title.backUri)
      this.title.title = '餐桌 - ' + roleApi.getRoleTypeName(this.roleType)

      window.addEventListener('scroll', this.onScroll)
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.onScroll)
      if (this.ui.interval) {
        clearInterval(this.ui.interval)
        this.ui.interval = null
      }
    },
    methods: {
      autoRefresh() {
        this.httpOrder()
      },
      httpShop() {
        httpShopApi.getOne(this.$route.params.shortId).then(res => {
          this.http.res.shop = res
        })
      },
      httpInfo() {
        httpInfoApi.get(this.$route.params.shortId).then(res => {
          this.http.res.info = res
        })
      },
      httpTableGroup() {
        httpTableApi.getGroupAll(this.$route.params.shortId, 0, 99).then(res => {
          if (res.elements && res.elements.length > 0) {
            this.ui.selectMenuId = res.elements[0].id
          } else {
            this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/table/empty`)
            return
          }

          for (let index in res.elements) {
            let tableGroup = res.elements[index]
            if (tableGroup.tableOnes && tableGroup.tableOnes.length > 0)
              tableGroup.tableOnes.sort(function (a, b) {
                return a.number - b.number
              })
          }

          this.http.res.tableGroups = res
          this.ui.loading = false
          setTimeout(this.navToHash, 100)
        })
      },
      httpOrder() {
        httpOrderAdminApi.getAll(this.$route.params.shortId, 1, 0, 99).then(res => {
          this.http.res.orders = res
        })
      },
      getElapsedTime(orders) {
        let time = 0

        for (let index in orders) {
          let order = orders[index]

          if (time < new Date().getTime() - order.createdAt) {
            time = new Date().getTime() - order.createdAt
          }
        }

        return timeApi.elapsedTimeDetail(time)
      },
      getTableOrder(table) {
        let orders = []

        for (let index in this.http.res.orders.elements) {
          let order = this.http.res.orders.elements[index]

          if (order.orderTable && order.orderTable.tableOneId === table.id) {
            orders.push(order)
          }
        }

        return orders
      },
      countFood(orders) {
        let count = 0

        for (let index in orders) {
          let order = orders[index]

          count += foodDetailApi.countFood(order)
        }

        return count
      },
      countWaitFood(orders) {
        let count = 0

        for (let index in orders) {
          let order = orders[index]

          count += foodDetailApi.countWaitFood(order)
        }

        return count
      },
      btnCoverMask() {
        this.ui.vMenuExtend = false
        this.ui.vCaptcha = false
        this.ui.vMenuTable = false
        this.ui.vTableChange = false
        this.ui.vCoverMask = false

        scrollApi.enable(true)
      },
      navToHash() {
        let hash = window.location.hash

        if (Boolean(hash)) {
          let id = window.location.hash.substring(1)
          let node = document.getElementById(id)
          if (node != null) {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            let posY = node.getBoundingClientRect().top + scrollTop
            window.scroll(0, posY)
          }
        }
      },
      onScroll() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop

        let groupBoxes = document.querySelectorAll('.food_group_box')
        if (!Boolean(groupBoxes) || groupBoxes.length === 0) {
          return
        }

        let selectId = groupBoxes[0].id.substring('box_'.length)

        for (let index = 0; index < groupBoxes.length; index++) {
          let groupBox = groupBoxes[index]

          if (!Boolean(groupBox.id)) {
            continue
          }

          let tableGroupTop = groupBox.getBoundingClientRect().top + scrollTop

          if (tableGroupTop < scrollTop) {
            let nextIndex = index + 1
            if (nextIndex === groupBoxes.length) {
              nextIndex = groupBoxes.length - 1
            }

            selectId = groupBoxes[nextIndex].id.substring('box_'.length)
          }
        }

        this.scrollMenu(selectId)
      },
      isSelectMenu(tableGroupId) {
        return this.ui.selectMenuId === tableGroupId
      },
      scrollMenu(selectId) {
        this.ui.selectMenuId = selectId
        let menu = document.querySelector('.menu')
        let menuItem = document.getElementById('menu_' + selectId)
        let left = menuItem.getBoundingClientRect().left - menuItem.getBoundingClientRect().width

        if (left < 0) {
          menu.scrollLeft = 0
        } else if (menu.scrollLeft < left) {
          menu.scrollLeft = left
        }
      },
      selectMenu(index, selectId, closeLeaf) {
        if (closeLeaf) {
          this.btnLeaf(false)
        }

        if (index === 0) {
          scrollApi.scrollAnimation(scrollApi.getCurrentY(), 0)
          return
        }

        setTimeout(function () {
          let node = document.getElementById(selectId)
          if (node != null) {
            let posY = node.getBoundingClientRect().top + scrollApi.getCurrentY()
            scrollApi.scrollAnimation(scrollApi.getCurrentY(), posY)
          }
        }, 100)
      },
      btnLeaf(extend) {
        this.ui.vMenuExtend = extend
        this.ui.vCoverMask = extend

        if (extend) {
          window.scroll(0, 0)
        }

        scrollApi.enable(!extend)
      },
      btnCaptcha(tableGroup, table) {
        this.ui.captcha.title = tableGroup.name + ' - ' + table.fullNumber
        this.ui.captcha.text = document.location.protocol + '//' + window.location.host + `/c/${this.$route.params.shortId}/captcha/${table.id}`
        this.ui.vCaptcha = true
        scrollApi.enable(false)
      },
      closeCaptcha() {
        this.ui.vCaptcha = false
        scrollApi.enable(true)
      },
      btnTable(table) {
        if (this.roleType !== 'waiter') {
          if (this.getTableOrder(table) && this.getTableOrder(table).length > 0) {
            this.btnTableOrder(table)
          } else {
            this.$msgBox.doModal({
              type: 'yes',
              title: '餐桌 ' + table.fullNumber,
              content: '当前餐桌没有订单。'
            })
          }

          return
        }

        scrollApi.enable(false)

        this.ui.vCoverMask = true
        this.ui.vMenuTable = true
        this.ui.selectTable = table
      },
      btnTableFood(table) {
        scrollApi.enable(true)

        httpCaptchaApi.postCaptchaTable(this.$route.params.shortId, table.id).then(res => {
          if (res.tableOneNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '无效餐桌',
              content: '餐桌二维码已过期，请重新扫码或联系服务员。'
            })

            userApi.setCaptchaTableId(null)
            userApi.setTableName(null)
            userApi.setTableNumber(null)
          } else {
            userApi.setCaptchaTableId(res.captchaTableId)
            userApi.setTableName(res.tableName)
            userApi.setTableNumber(res.tableNumber)

            this.$router.push({
              path: `/b/${this.$route.params.shortId}/${this.roleType}/food`,
              query: {
                tableId: table.id
              }
            })
          }
        })
      },
      btnTableOrder(table) {
        scrollApi.enable(true)

        let live = (this.roleType !== 'admin')

        httpOrderAdminApi.getAllByTableOneId(this.$route.params.shortId, table.id, live, 0, 2).then(res => {
          if (res.currentPageSize === 0) {
            this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/order/empty`)
            return
          }

          if (res.elements && res.elements.length === 1) {
            this.$router.push(`/b/${this.$route.params.shortId}/${this.roleType}/order/${res.elements[0].id}`)
            return
          }

          this.$router.push({
            path: `/b/${this.$route.params.shortId}/${this.roleType}/order`,
            query: {
              tableOneId: table.id
            }
          })
        })
      },
      btnTableChange(table) {
        this.ui.vCoverMask = true
        this.ui.vTableChange = true
        this.ui.vMenuTable = false
        this.ui.selectTable = table
        this.ui.changeTable = {}
      },
      btnTableChangeConfirm() {
        for (let index in this.http.res.orders.elements) {
          let order = this.http.res.orders.elements[index]
          if (order.orderTable && order.orderTable.tableOneId === this.ui.selectTable.id) {
            httpOrderAdminApi.putTable(this.$route.params.shortId, order.id, this.ui.changeTable.id).then(res => {
              this.ui.vTableChange = false
              this.ui.vCoverMask = false

              if (res.tableOneIdNotExists) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '换桌',
                  content: '新餐桌号不存在。'
                })

              } else if (res.closed) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '换桌',
                  content: '订单已关闭。'
                })
              } else if (res.success) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '换桌',
                  content: '换餐成功。'
                }).then(async (val) => {
                  this.httpOrder()
                })
              }
            })
          }
        }
      },
      btnChooseTable(table) {
        this.ui.changeTable = table
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import '~assets/c/food';
  @import '~assets/c/shop';
  @import '~assets/b/b_table';
</style>
