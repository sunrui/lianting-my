import axios from 'axios'

let base = '/api/b'

export const httpTakeoutAdminApi = {
  getConfig(shortId) {
    return axios.get(`${base}/${shortId}/takeout/config`).then(res => res.data)
  },
  putConfig(shortId, takeoutConfig) {
    return axios.put(`${base}/${shortId}/takeout/config`, takeoutConfig).then(res => res.data)
  },
  postSms(shortId, type, reason, orderOneId) {
    return axios.post(`${base}/${shortId}/takeout/sms`, {
      type: type,
      reason: reason,
      orderOneId: orderOneId
    }).then(res => res.data)
  }
}
