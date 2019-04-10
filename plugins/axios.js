import axios from 'axios'
import {loadingApi} from '../api/local/loadingApi'
import {logApi} from '../api/local/logApi'
import {storeApi} from '../api/local/storeApi'
import {stateApi} from '../api/local/stateApi'

axios.defaults.withCredentials = true
axios.defaults.timeout = 10 * 1000

axios.interceptors.request.use((config) => {
  loadingApi.show()
  return config
}, (err) => {
  return Promise.reject(err)
})

axios.interceptors.response.use(function (response) {
  logApi.log(response.status + ' ' + response.config.method + ' ' + response.config.url)
  logApi.log(response.data)
  loadingApi.hide()
  return response
}, function (err) {
  loadingApi.hide()

  if (err && err.response) {
    if (err.response.data.error === 'HttpUnauthorized') {
      stateApi.clearAll()
      window.location.href = '/login?r=/&shortId=undefined'
      return
    }

    storeApi.object.set('error', err.response.data)
    window.location.href = '/error'
  } else {
    storeApi.object.set('error', err)
    window.location.href = '/error'
  }

  return Promise.reject(err)
})
