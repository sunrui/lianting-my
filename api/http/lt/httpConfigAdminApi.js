import axios from 'axios'

let base = '/api/b'

export const httpConfigAdminApi = {
  getMpConfigWechat(shortId) {
    return axios.get(`${base}/${shortId}/config/mp/wechat`).then(res => res.data)
  },
  putMpConfigWechat(shortId, model) {
    return axios.put(`${base}/${shortId}/config/mp/wechat`, model).then(res => res.data)
  },
  getPayConfigWechat(shortId) {
    return axios.get(`${base}/${shortId}/config/pay/wechat`).then(res => res.data)
  },
  putPayConfigWechat(shortId, model) {
    return axios.put(`${base}/${shortId}/config/pay/wechat`, model).then(res => res.data)
  },
  getPayConfigAlipay(shortId) {
    return axios.get(`${base}/${shortId}/config/pay/alipay`).then(res => res.data)
  },
  putPayConfigAlipay(shortId, model) {
    return axios.put(`${base}/${shortId}/config/pay/alipay`, model).then(res => res.data)
  }
}
