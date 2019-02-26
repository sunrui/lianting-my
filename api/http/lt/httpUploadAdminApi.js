import axios from 'axios'

let base = '/api/b'

export const httpUploadApi = {
  getSignImage(shortId) {
    return axios.get(`${base}/${shortId}/upload/sign/image`).then(res => res.data)
  },
  getSignFile(shortId) {
    return axios.get(`${base}/${shortId}/upload/sign/file`).then(res => res.data)
  }
}
