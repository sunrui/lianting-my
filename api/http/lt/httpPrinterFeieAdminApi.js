import axios from 'axios'

let base = '/api/b'

export const httpPrinterFeieAdminApi = {
  getPrinter(shortId, page, size) {
    return axios.get(`${base}/${shortId}/printer/feie`, {
      params: {
        page: page,
        size: size
      }
    }).then(res => res.data)
  },
  putPrinter(shortId, printer) {
    return axios.put(`${base}/${shortId}/printer/feie`, printer).then(res => res.data)
  },
  getPrinterStatus(shortId, printer) {
    return axios.put(`${base}/${shortId}/printer/feie/status`, printer).then(res => res.data)
  },
  getPrinterOneStatus(shortId, printerId) {
    return axios.put(`${base}/${shortId}/printer/feie/${printerId}/status`).then(res => res.data)
  },
  deletePrinter(shortId, printerId) {
    return axios.delete(`${base}/${shortId}/printer/feie/${printerId}`).then(res => res.data)
  },
  putPrinterEnable(shortId, printerId, enable) {
    return axios.put(`${base}/${shortId}/printer/feie/${printerId}/enable`, {
      enable: enable
    }).then(res => res.data)
  }
}
