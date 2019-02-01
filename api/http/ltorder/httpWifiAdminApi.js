import axios from 'axios'

let base = '/api/b'

export const httpWifiAdminApi = {
  putWifi(shortId, model) {
    return axios.put(`${base}/${shortId}/wifi`, model).then(res => res.data)
  }
}
