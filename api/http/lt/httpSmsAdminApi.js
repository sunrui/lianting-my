import axios from 'axios'

let base = '/api/b'

export const httpSmsAdminApi = {
  postPay(shortId, price, unifiedPayWay) {
    return axios.post(`${base}/${shortId}/sms/pay`, {
      price: price,
      unifiedPayWay: unifiedPayWay
    }).then(res => res.data)
  },
  postSendTakeout(shortId, type, reason, orderOneId) {
    return axios.post(`${base}/${shortId}/sms/send/takeout`, {
      type: type,
      reason: reason,
      orderOneId: orderOneId
    }).then(res => res.data)
  },
  getSms(shortId) {
    return axios.get(`${base}/${shortId}/sms`).then(res => res.data)
  },
  getHistoryPay(shortId) {
    return axios.get(`${base}/${shortId}/sms/history/pay`).then(res => res.data)
  }
}
