import axios from 'axios'

let base = '/api/b'

export const httpNotifyAdminApi = {
  getNotifyOrder(shortId, types, page, size) {
    return axios.get(`${base}/${shortId}/notify/order`, {
      params: {
        types: types,
        page: page,
        size: size
      }
    }).then(res => res.data)
  }
}
