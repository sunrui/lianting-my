import axios from 'axios'

let base = '/api/shop/one'

export const httpShopConfigApi = {
  getWechat(shortId) {
    return axios.get(`${base}/${shortId}/config/wechat`).then(res => res.data)
  },
  putWechat(shortId, wechat) {
    return axios.put(`${base}/${shortId}/config/wechat`, wechat).then(res => res.data)
  }
}
