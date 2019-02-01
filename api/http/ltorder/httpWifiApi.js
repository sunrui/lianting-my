import axios from 'axios'

let base = '/api/c'

export const httpWifiApi = {
  getWifi(shortId) {
    return axios.get(`${base}/${shortId}/wifi`).then(res => res.data)
  }
}
