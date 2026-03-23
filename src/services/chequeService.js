import api from './api'
import { ENDPOINTS } from '@/constants'

export const chequeService = {
  upload(formData) {
    return api.post(ENDPOINTS.UPLOAD_CHEQUE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  getAll(params = {}) {
    return api.get(ENDPOINTS.GET_CHEQUES, { params })
  },

  getById(id) {
    return api.get(ENDPOINTS.GET_CHEQUE(id))
  },

  verify(id, payload = {}) {
    return api.post(ENDPOINTS.VERIFY_CHEQUE(id), payload)
  },

  reject(id, reason) {
    return api.post(ENDPOINTS.REJECT_CHEQUE(id), { reason })
  },
}
