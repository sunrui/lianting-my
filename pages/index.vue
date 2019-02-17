<template>
  <div>
    <div class="blank_50"></div>
    <ul>
      <li v-if="!authed">
        <router-link to="login">登录</router-link>
      </li>
      <li v-if="authed">
        <router-link to="logout">登出</router-link>
      </li>
    </ul>

    <p>后台</p>
    <ul>
      <li>
        <router-link to="shop/role">工作台</router-link>
      </li>
      <li>
        <router-link to="b">我的店铺</router-link>
      </li>
    </ul>

    <div class="blank_100"></div>

    <div class="box">
      <div class="addition box_radius">
        <div class="addition_item">
          <div class="addition_item_label">姓名</div>
          <div class="addition_item_content">不可修改</div>
        </div>
        <div class="box_divide"></div>
        <div class="addition_item">
          <div class="addition_item_label">详情</div>
          <div class="addition_item_link">查看更多</div>
        </div>
        <div class="box_divide"></div>
        <div class="addition_item">
          <div class="addition_item_label_text_area">姓名</div>
          <div class="addition_item_text_area">
            <label>
              <textarea class="addition_item_text_input"></textarea>
            </label>
          </div>
        </div>
        <div class="box_divide"></div>
        <div class="addition_item">
          <div class="addition_item_label">姓名</div>
          <input class="addition_item_input" placeholder="不可修改">
        </div>
        <div class="box_divide"></div>
        <div class="addition_item">
          <div class="addition_item_label">姓名</div>
          <div class="addition_item_radio">
            <div class="addition_item_radio_icon_select"></div>
            <div class="addition_item_radio_label">男</div>
            <div class="addition_item_radio_icon_unselect"></div>
            <div class="addition_item_radio_label">女</div>
          </div>
        </div>
        <div class="box_divide"></div>
        <div class="addition_item">
          <div class="addition_item_label">姓名</div>
          <div class="addition_item_number">
            <div class="addition_item_number_minus"></div>
            <div class="addition_item_number_label">10</div>
            <div class="addition_item_number_add"></div>
          </div>
        </div>
        <div class="box_divide"></div>
        <div class="addition_item">
          <div class="addition_item_label">
            <input class="addition_item_code_input" placeholder="请输入验证码" maxlength="6"
                   oninput="value=value.replace(/[^\d]/g,'')"
            >
          </div>
          <div class="addition_item_code_send">
            <div class="addition_item_code_send_divide">
              <div class="addition_item_code_send_divide_line"></div>
            </div>
            <div class="addition_item_code_send_button">发送验证码</div>
          </div>
        </div>
        <div class="box_divide"></div>
        <div class="addition_item">
          <div class="addition_item_label">
            <input class="addition_item_code_input" placeholder="请输入验证码" maxlength="6"
                   oninput="value=value.replace(/[^\d]/g,'')"
            >
          </div>
          <div class="addition_item_code_send">
            <div class="addition_item_code_send_divide">
              <div class="addition_item_code_send_divide_line"></div>
            </div>
            <div class="addition_item_code_send_time">重新获取(10s)</div>
          </div>
        </div>
        <div class="box_divide"></div>
        <div class="addition_item">
          <div class="addition_item_label">姓名</div>
          <div class="addition_item_content">不可修改</div>
        </div>
        <div class="box_divide"></div>
        <div class="addition_item">
          <div class="addition_item_label">店铺头像</div>
          <div class="addition_item_avatar_input">
            <div class="addition_item_avatar_img_add"></div>
          </div>
        </div>
        <div class="box_divide"></div>
        <div class="addition_item">
          <div class="addition_item_label">店铺头像</div>
          <div class="addition_item_avatar_input">
            <img class="addition_item_avatar_img">
            <div class="addition_item_avatar_input_link">></div>
          </div>
        </div>
        <div class="box_divide"></div>
        <div class="addition_item">
          <div class="addition_item_label">name</div>
          <div class="addition_item_check">
            <div class="addition_item_check_on"></div>
          </div>
        </div>
        <div class="box_divide"></div>
        <div class="addition_item">
          <div class="addition_item_label">name</div>
          <div class="addition_item_check">
            <div class="addition_item_check_off"></div>
          </div>
        </div>
        <div class="box_divide"></div>
        <div class="addition_item">
          <div class="addition_item_label">样式</div>
          <div class="addition_item_tag">
            <div class="addition_item_tag_one addition_item_tag_label addition_item_tag_color_1">name</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import { stateApi } from '../api/local/stateApi'

  export default {
    metaInfo: {
      title: '测试主页'
    },
    data() {
      return {}
    },
    components: {},
    computed: {
      authed() {
        let userId = stateApi.user.getId()
        return Boolean(userId)
      }
    },
    methods: {}
  }
</script>

<style lang="scss">
  @import '~assets/common';
</style>
