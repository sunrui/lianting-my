import axios from 'axios'

let base = '/api/c'

export const httpInfoApi = {
  get(shortId) {
    return axios.get(`${base}/${shortId}/info`).then(res => res.data)
  }
}
