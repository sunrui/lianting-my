<template>
  <div>
    <title-bar :can-back="title.canBack" :title="title.title" :back-uri="title.backUri" :theme="title.theme" :imageHeight="title.imageHeight"></title-bar>

    <transition name="fade">
      <div :class="{ cover_mask_9: ui.v_cover_mask}" @click="btnCoverMask"></div>
    </transition>

    <div class="shop_title_box">
      <div class="shop_title_name">{{http.res.shop.name}}</div>
      <div class="shop_title_detail">{{http.res.info.notice ? http.res.info.notice : '欢迎光临本餐厅!'}}</div>
    </div>

    <div class="content_box">
      <div class="blank_10"></div>

      <div class="menu_box">
        <div class="menu">
          <div class="menu_item" v-for="tableGroup in http.res.tableGroups.elements">
            <a :id="'menu_' + tableGroup.id"
               :class="{menu_item_href:!isSelectMenu(tableGroup.id), menu_item_href_select:isSelectMenu(tableGroup.id)}"
               :href="'#' + tableGroup.id" @click="selectMenu(tableGroup.id, false)">
              <div class="badge_delete menu_item_badge_delete" @click="btnGroupDelete(tableGroup)"></div>
              <div class="menu_item_label">{{tableGroup.name}}</div>
              <div class="menu_item_select" v-if="isSelectMenu(tableGroup.id)">
                <div class="menu_item_select_line"></div>
              </div>
            </a>
          </div>
        </div>

        <div class="leaf_box" @click="btnGroupAdd()">
          <div class="add"></div>
        </div>
      </div>

      <div class="food_group_box" :id="'box_' + tableGroup.id" v-for="tableGroup in http.res.tableGroups.elements">
        <div class="group_box">
          <div class="food_group_anchor" :id="tableGroup.id"></div>
          <div class="group_name" @click="btnGroupEdit(tableGroup)">{{tableGroup.name}}</div>
          <div class="group_private_room" v-if="tableGroup.privateRoom">包间</div>
          <div class="group_count">({{tableGroup.tableOnes.length}})</div>
          <div class="group_remark">{{tableGroup.remark}} ({{tableGroup.minPeople + '-' + tableGroup.maxPeople + ' 人'}})</div>
        </div>

        <div class="food_box box" v-for="table in tableGroup.tableOnes">
          <div class="table box_radius">
            <div class="badge_delete" @click="btnTableDelete(table)"></div>
            <div class="table_captcha"></div>
            <div class="table_number" @click="btnTable(table)">{{table.fullNumber}}</div>
            <div class="table_remark">{{table.remark}}</div>
          </div>

          <div class="blank_20"></div>
        </div>

        <div class="box">
          <div class="blank_20"></div>

          <div class="food_add box_radius" @click="btnTableAdd(tableGroup)">
            <div class="food_add_icon"></div>
            <div class="food_add_label">添加餐桌</div>
          </div>

          <div class="blank_20"></div>
        </div>
      </div>

      <div class="blank_30"></div>
    </div>

    <div class="modal_center" v-if="ui.v_table_add">
      <div class="modal_close_box" @click="btnCoverMask">
        <img class="modal_close" src="/img/common/close.png">
      </div>

      <div class="modal_title">添加餐桌</div>

      <div class="modal_input_box">
        <div class="modal_input_area">
          <input class="modal_input" minlength="1" maxlength="4" placeholder="请输入餐桌号，如 10"
                 oninput="this.value=this.value.replace(/[^0-9]/g,'');"
                 v-model=" http.req.table.number">
        </div>
      </div>

      <div class="modal_input_box">
        <div class="modal_input_area">
          <input class="modal_input" placeholder="请输入备注" maxlength="20" v-model="http.req.table.remark">
        </div>
      </div>

      <div class="modal_button_box">
        <div class="button_big" @click="btnTableAddConfirm">确定</div>
      </div>
    </div>

  </div>
</template>

<script>
  import TitleBar from '../../../../../components/TitleBar'
  import {httpShopApi} from '../../../../../api/http/shop/httpShopApi'
  import {httpInfoApi} from '../../../../../api/http/ltorder/httpInfoApi'
  import {httpTableApi} from '../../../../../api/http/ltorder/httpTableApi'
  import {httpTableAdminApi} from '../../../../../api/http/ltorder/httpTableAdminApi'

  export default {
    metaInfo: {
      title: '餐桌'
    },
    middleware: 'auth',
    components: {TitleBar},
    data() {
      return {
        title: {
          canBack: true,
          title: '餐桌',
          backUri: `/b/${this.$route.params.shortId}/owner`,
          theme: 'image',
          imageHeight: 300
        },
        ui: {
          v_cover_mask: false,
          v_table_add: false,
          selectMenuId: null
        },
        http: {
          req: {
            table: {
              tableGroupId: '',
              number: '',
              remkar: ''
            }
          },
          res: {
            shop: {},
            info: {},
            tableGroups: {}
          }
        }
      }
    },
    created() {
      this.httpShop()
      this.httpInfo()
      this.httpTableGroup()
    },
    mounted() {
      window.addEventListener('scroll', this.onScroll)
    },
    methods: {
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
      btnCoverMask() {
        this.ui.v_cover_mask = false
        this.ui.v_table_add = false
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
      httpTableGroup() {
        httpTableApi.getGroupAll(this.$route.params.shortId, 0, 999).then(res => {
          this.http.res.tableGroups = res

          if (this.http.res.tableGroups.elements.length > 0) {
            this.ui.selectMenuId = this.http.res.tableGroups.elements[0].id
          }

          for (let index in this.http.res.tableGroups.elements) {
            let tableGroup = this.http.res.tableGroups.elements[index]
            tableGroup.tableOnes.sort(function(a, b) {
              return a.number - b.number
            })
          }

          setTimeout(this.navToHash, 100)
        })
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

        this.selectMenu(selectId)
      },
      isSelectMenu(tableGroupId) {
        return this.ui.selectMenuId === tableGroupId
      },
      selectMenu(tableGroupId, closeLeaf) {
        if (closeLeaf) {
          this.btnCoverMask()

          setTimeout(function() {
            let node = document.getElementById(tableGroupId)
            if (node != null) {
              let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
              let posY = node.getBoundingClientRect().top + scrollTop
              window.scroll(0, posY)
            }
          }, 100)
        }

        this.ui.selectMenuId = tableGroupId
        let menu = document.querySelector('.menu')
        let menuItem = document.getElementById('menu_' + tableGroupId)
        let left = menuItem.getBoundingClientRect().left - menuItem.getBoundingClientRect().width

        if (left < 0) {
          menu.scrollLeft = 0
        } else if (menu.scrollLeft < left) {
          menu.scrollLeft = left
        }
      },
      btnOrder(tableGroup) {
        this.$router.push(`/b/${this.$route.params.shortId}/owner/table/group/${tableGroup.id}/order`)
      },
      btnGroupAdd() {
        this.$router.push(`/b/${this.$route.params.shortId}/owner/table/group/create`)
      },
      btnGroupEdit(tableGroup) {
        this.$router.push(`/b/${this.$route.params.shortId}/owner/table/group/${tableGroup.id}`)
      },
      btnGroupDelete(tableGroup) {
        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '删除餐桌组',
          content: `当前组下所有的餐桌将会被删除，确定要删除 '${tableGroup.name}' 吗？`
        }).then(async (val) => {
          if (val === 'Yes') {
            httpTableAdminApi.deleteGroup(this.$route.params.shortId, tableGroup.id).then(res => {
              if (res.tableGroupIdNotExists) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '删除餐桌组',
                  content: '餐桌组不存在。'
                })
              } else if (res.success) {
                this.httpTableGroup()
              }
            })
          }
        })
      },
      btnTable(table) {
        this.$router.push(`/b/${this.$route.params.shortId}/owner/table/${table.id}`)
      },
      btnTableDelete(table) {
        this.$msgBox.doModal({
          type: 'yesOrNo',
          title: '删除餐桌',
          content: `确定要删除 '${table.fullNumber}' 吗？`
        }).then(async (val) => {
          if (val === 'Yes') {
            httpTableAdminApi.deleteTable(this.$route.params.shortId, table.id).then(res => {
              if (res.tableOneIdNotExists) {
                this.$msgBox.doModal({
                  type: 'yes',
                  title: '删除餐桌',
                  content: '餐桌不存在。'
                })
              } else if (res.success) {
                this.httpTableGroup()
              }
            })
          }
        })
      },
      btnTableAdd(tableGroup) {
        this.ui.v_cover_mask = true
        this.ui.v_table_add = true
        this.http.req.table = {}
        this.http.req.table.tableGroupId = tableGroup.id
      },
      btnTableAddConfirm() {
        this.ui.v_cover_mask = false
        this.ui.v_table_add = false

        httpTableAdminApi.postTable(this.$route.params.shortId, this.http.req.table).then(res => {
          if (res.maxLimit) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加餐桌',
              content: '已超过当前授权最大数目限制，如需升级授权请转至续费页或联系我们。。'
            })
          } else if (res.tableGroupIdNotExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加餐桌',
              content: '餐桌组不存在。'
            })
          } else if (res.numberExists) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加餐桌',
              content: '餐桌已存在。'
            })
          } else if (res.tableOneId) {
            this.$msgBox.doModal({
              type: 'yes',
              title: '添加餐桌',
              content: '添加成功。'
            }).then(async (val) => {
              this.httpTableGroup()
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/scss/common.scss';
  @import '~assets/scss/food.scss';
  @import '~assets/scss/b_table.scss';
  @import 'index';
</style>
