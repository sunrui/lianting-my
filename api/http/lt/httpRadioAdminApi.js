import axios from 'axios'

let base = '/api/b'

export const httpRadioAdminApi = {
  getConfig(shortId) {
    return axios.get(`${base}/${shortId}/radio/config`).then(res => res.data)
  },
  putConfig(shortId, model) {
    return axios.put(`${base}/${shortId}/radio/config`, model).then(res => res.data)
  },
  getSpeechUrl(shortId, radioText) {
    return `${base}/${shortId}/radio/speech?radioText=${radioText}`
  }
}
