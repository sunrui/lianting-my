import axios from 'axios'

let base = '/api/c'

export const httpTakeoutApi = {
  getConfig(shortId) {
    return axios.get(`${base}/${shortId}/takeout/config`).then(res => res.data)
  }
}
