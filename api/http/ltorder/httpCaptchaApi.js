import axios from 'axios'

let base = '/api/c'

export const httpCaptchaApi = {
  postCaptchaTable(shortId, tableOneId) {
    return axios.post(`${base}/${shortId}/captcha/table`, {
      tableOneId: tableOneId
    }).then(res => res.data)
  }
}
