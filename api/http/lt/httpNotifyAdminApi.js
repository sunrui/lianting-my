import axios from 'axios'

let base = '/api/b'

export const httpNotifyAdminApi = {
  getOrder(shortId, types, page, size) {
    return axios.get(`${base}/${shortId}/notify/order`, {
      params: {
        types: types,
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  postRadio(shortId, tableFullNumber, content) {
    return axios.post(`${base}/${shortId}/notify/radio`, {
      tableFullNumber: tableFullNumber,
      content: content
    }).then(res => res.data)
  },
  getRadio(shortId, minuteAgo) {
    return axios.get(`${base}/${shortId}/notify/radio`, {
      params: {
        minuteAgo: minuteAgo
      }
    }).then(res => res.data)
  }
}
