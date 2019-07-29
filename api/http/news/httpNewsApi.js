import axios from 'axios'

let base = '/api/news'

export const httpNewsApi = {
  getContent() {
    return axios.get(`${base}`).then(res => res.data)
  },
  postContent(model) {
    return axios.post(`${base}`, model).then(res => res.data)
  },
  getUploadSign(hashKey) {
    return axios.get(`${base}/upload/sign/${hashKey}`).then(res => res.data)
  }
}