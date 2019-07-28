import axios from 'axios'

let base = '/api/news'

export const httpNewsApi = {
  getContent() {
    return axios.get(`${base}/content`).then(res => res.data)
  },
  postContent(model) {
    return axios.post(`${base}/content`, model).then(res => res.data)
  },
  getUploadSign(hashKey) {
    return axios.get(`${base}/upload/sign/${hashKey}`).then(res => res.data)
  }
}