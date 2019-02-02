import Vue from 'vue'
import msgboxVue from '~/components/common/MessageBox.vue'

const messageBox = {}

messageBox.install = function(Vue, options) {
  const messageBoxInstance = Vue.extend(msgboxVue)
  let currentMsg

  const initInstance = () => {
    currentMsg = new messageBoxInstance()
    let msgBoxEl = currentMsg.$mount().$el
    document.body.appendChild(msgBoxEl)
  }

  Vue.prototype.$msgBox = {
    doModal(options) {
      if (!currentMsg) {
        initInstance()
      }
      if (typeof options === 'string') {
        currentMsg.content = options
      } else if (typeof options === 'object') {
        Object.assign(currentMsg, options)
      }
      return currentMsg.doModal()
        .then(val => {
          currentMsg = null
          return Promise.resolve(val)
        })
    }
  }
}

Vue.use(messageBox)
