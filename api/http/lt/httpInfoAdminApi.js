import axios from 'axios'

let base = '/api/b'

export const httpInfoAdminApi = {
  put(shortId, info) {
    return axios.put(`${base}/${shortId}/info`, info).then(res => res.data)
  }
}
