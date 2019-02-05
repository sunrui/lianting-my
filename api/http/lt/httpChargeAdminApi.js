import axios from 'axios'

let base = '/api/b'

export const httpChargeAdminApi = {
  getAll(shortId, page, size) {
    return axios.get(`${base}/${shortId}/charge`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  }
}
