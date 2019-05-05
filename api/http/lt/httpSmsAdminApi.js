import axios from 'axios'

let base = '/api/b'

export const httpSmsAdminApi = {
  postOrder(shortId, price, unifiedPayWay) {
    return axios.post(`${base}/${shortId}/sms/order`, {
      price: price,
      unifiedPayWay: unifiedPayWay
    }).then(res => res.data)
  },
  postSms(shortId, type, reason, orderOneId) {
    return axios.post(`${base}/${shortId}/sms/send`, {
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
