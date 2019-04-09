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
  }
}
