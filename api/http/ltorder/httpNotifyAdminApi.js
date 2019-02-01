import axios from 'axios'

let base = '/api/b'

export const httpNotifyAdminApi = {
  getNotifyOrder(shortId, unread, types, page, size) {
    return axios.get(`${base}/${shortId}/notify/order`, {
      params: {
        unread: unread,
        types: types,
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  putNotifyOrderRead(shortId, notifyOrderId) {
    return axios.put(`${base}/${shortId}/notify/order/${notifyOrderId}`, {
      unread: false
    }).then(res => res.data)
  }
}
