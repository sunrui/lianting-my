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
        switch (this.ui.taskIndex++) {
          case 0: {
            this.ui.tasks.push({
              label: '认证您的身份信息',
              finish: false
            })
            this.updateInit(0)
            break
          }
          case 1: {
            this.ui.tasks.push({
              label: '确认您的店铺唯一标识',
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

      },
      delayInit() {
        this.ui.tasks[this.taskInitIndex].finish = true
        setTimeout(this.updateInitNext, 500)
      },
      updateInit(index) {
        let delay = index === 2 ? 1000 : 500
        this.taskInitIndex = index
        setTimeout(this.delayInit, delay)
      },
      btnShopOwner() {
        this.$router.push(`/b/${this.$route.params.shortId}/owner`)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'init';
</style>
