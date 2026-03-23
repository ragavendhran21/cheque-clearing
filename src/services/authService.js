import api from './api'
import { ENDPOINTS } from '@/constants'

export const authService = {
  login(credentials) {
    return api.post(ENDPOINTS.LOGIN, credentials)
  },

  signup(payload) {
    return api.post(ENDPOINTS.SIGNUP, payload)
  },

  logout() {
    return api.post(ENDPOINTS.LOGOUT)
  },

  getMe() {
    return api.get(ENDPOINTS.ME)
  },
}
