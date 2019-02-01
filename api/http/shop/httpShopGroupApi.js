import axios from 'axios'

let base = '/api/shop/group'

export const httpShopGroupApi = {
  get(groupId) {
    return axios.get(`${base}/${groupId}`).then(res => res.data)
  },
  put(groupId, shopGroup) {
    return axios.put(`${base}/${groupId}`, shopGroup).then(res => res.data)
  },
  getAll(page, size) {
    return axios.get(`${base}`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  delete(groupId) {
    return axios.delete(`${base}/${groupId}`).then(res => res.data)
  },
  post(shopGroup) {
    return axios.post(`${base}`, shopGroup).then(res => res.data)
  }
}
