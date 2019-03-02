import axios from 'axios'

let base = '/api/report'

export const httpReportApi = {
  post(model) {
    return axios.post(`${base}`, model).then(res => res.data)
  }
}