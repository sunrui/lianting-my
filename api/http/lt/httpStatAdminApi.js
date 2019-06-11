import axios from 'axios'

let base = '/api/b'

export const httpStatAdminApi = {
  getOrder(shortId, page, size) {
    return axios.get(`${base}/${shortId}/stat/order`,{
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  getUser(shortId, page, size) {
    return axios.get(`${base}/${shortId}/stat/user`,{
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  getFood(shortId, page, size) {
    return axios.get(`${base}/${shortId}/stat/food`,{
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  }
}
