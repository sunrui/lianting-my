import axios from 'axios'

let base = '/api/sms'

export const httpSmsApi = {
  postSend(phone, smsType) {
    return axios.post(`${base}/send`, {
      phone: phone,
      smsType: smsType
    }).then(res => res.data)
  },
  postVerify(phone, code) {
    return axios.post(`${base}/verify`, {
      phone: phone,
      code: code
    }).then(res => res.data)
  }
}
