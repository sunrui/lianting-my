import axios from 'axios'

let base = '/api/sms'

export const httpSmsApi = {
  postSend(phone, type) {
    return axios.post(`${base}/send`, {
      phone: phone,
      type: type
    }).then(res => res.data)
  },
  postVerify(phone, code) {
    return axios.post(`${base}/verify`, {
      phone: phone,
      code: code
    }).then(res => res.data)
  }
}
