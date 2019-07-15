import axios from 'axios'

let base = '/api/b'

export const httpPrinterPoscomAdminApi = {
  getPrinter(shortId, page, size) {
    return axios.get(`${base}/${shortId}/printer/poscom`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  putPrinter(shortId, printer) {
    return axios.put(`${base}/${shortId}/printer/poscom`, printer).then(res => res.data)
  },
  getPrinterStatus(shortId, printer) {
    return axios.put(`${base}/${shortId}/printer/poscom/status`, printer).then(res => res.data)
  },
  getPrinterOneStatus(shortId, printerId) {
    return axios.put(`${base}/${shortId}/printer/poscom/${printerId}/status`).then(res => res.data)
  },
  deletePrinter(shortId, printerId) {
    return axios.delete(`${base}/${shortId}/printer/poscom/${printerId}`).then(res => res.data)
  }
}
