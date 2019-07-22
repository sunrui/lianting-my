import axios from 'axios'

let base = '/api/b'

export const httpPrinterZhongwuAdminApi = {
  getPrinter(shortId, page, size) {
    return axios.get(`${base}/${shortId}/printer/zhongwu`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  putPrinter(shortId, printer) {
    return axios.put(`${base}/${shortId}/printer/zhongwu`, printer).then(res => res.data)
  },
  getPrinterStatus(shortId, printer) {
    return axios.put(`${base}/${shortId}/printer/zhongwu/status`, printer).then(res => res.data)
  },
  getPrinterOneStatus(shortId, printerId) {
    return axios.put(`${base}/${shortId}/printer/zhongwu/${printerId}/status`).then(res => res.data)
  },
  deletePrinter(shortId, printerId) {
    return axios.delete(`${base}/${shortId}/printer/zhongwu/${printerId}`).then(res => res.data)
  }
}
