import axios from 'axios'

let base = '/api/b'

export const httpConfigAdminApi = {
  getConfigWechat(shortId) {
    return axios.get(`${base}/${shortId}/config/wechat`).then(res => res.data)
  },
  putConfigWechat(shortId, model) {
    return axios.put(`${base}/${shortId}/config/wechat`, model).then(res => res.data)
  },
  getConfigAlipay(shortId) {
    return axios.get(`${base}/${shortId}/config/alipay`).then(res => res.data)
  },
  putConfigAlipay(shortId, model) {
    return axios.put(`${base}/${shortId}/config/alipay`, model).then(res => res.data)
  }
}
