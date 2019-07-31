<template>
  <div class="init">
    <div class="init_house"></div>

    <div class="blank_20"></div>

    <div class="task">
      <div class="task_one" v-for="(task, index) in ui.tasks">
        <div class="task_one_number">{{index + 1}}</div>
        <div class="task_one_content">
          <div class="task_one_content_label">{{task.label}}</div>
          <div class="task_one_content_finish" v-if="task.finish"></div>
        </div>
      </div>
    </div>

    <div class="blank_100"></div>
    <div class="button_big" v-if="ui.vButtonOwner" @click="btnShopOwner">进入店铺管理</div>
    <div class="blank_20"></div>
  </div>
</template>

<script>
  import {scrollApi} from "../../../api/local/scrollApi"

  export default {
    metaInfo: {
      title: '店铺初始化'
    },
    middleware: 'auth',
    data() {
      return {
        ui: {
          taskIndex: 0,
          taskInitIndex: 0,
          tasks: [],
          vButtonOwner: false
        }
      }
    },
    mounted() {
      this.updateInitNext()
    },
    methods: {
      updateInitNext() {
        switch (this.ui.taskIndex) {
          case 0: {
            this.ui.tasks.push({
              label: '检查手机绑定状态',
              finish: false
            })
            this.updateInit(0)
            break
          }
          case 1: {
            this.ui.tasks.push({
              label: '确认您的恋厅号',
              finish: false
            })
            this.updateInit(1)
            break
          }
          case 2: {
            this.ui.tasks.push({
              label: '生成店铺初始化数据',
              finish: false
            })
            this.updateInit(2)
            break
          }
          case 3: {
            this.ui.tasks.push({
              label: '店铺创建成功',
              finish: false
            })
            this.updateInit(3)
            break
          }
          case 4: {
            this.ui.vButtonOwner = true
            break
          }
        }

        scrollApi.scrollAnimation(0, document.body.scrollHeight)
        this.ui.taskIndex++
      },
      delayInit() {
        if (this.ui.tasks.length === 0) {
          this.updateInitNext()
          return
        }

        this.ui.tasks[this.ui.taskInitIndex].finish = true
        setTimeout(this.updateInitNext, 200)
      },
      updateInit(index) {
        this.ui.taskInitIndex = index
        setTimeout(this.delayInit, 500)
      },
      btnShopOwner() {
        this.$router.push(`/b/${this.$route.params.shortId}/owner`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/common';
  @import 'init';
</style>
