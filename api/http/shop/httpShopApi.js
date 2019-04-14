import axios from 'axios'

let base = '/api/shop'

export const httpShopApi = {
  post(shop) {
    return axios.post(`${base}`, shop).then(res => res.data)
  },
  getOne(shortId) {
    return axios.get(`${base}/${shortId}`).then(res => res.data)
  },
  getCount() {
    return axios.get(`${base}`, {
      params: {
        queryCount: true
      }
    }).then(res => res.data)
  },
  getAll(page, size) {
    return axios.get(`${base}`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  putName(shopId, name) {
    return axios.put(`${base}/${shopId}/name`, {
      name: name
    }).then(res => res.data)
  },
  putOpen(shopId, open) {
    return axios.put(`${base}/${shopId}/open`, {
      open: open
    }).then(res => res.data)
  }
}
