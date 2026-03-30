export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

export const ENDPOINTS = {
  // Cheque
  UPLOAD_CHEQUE:    '/cheques/upload',
  GET_CHEQUES:      '/cheques',
  GET_CHEQUE:       (id) => `/cheques/${id}`,
  VERIFY_CHEQUE:    (id) => `/cheques/${id}/verify`,
  REJECT_CHEQUE:    (id) => `/cheques/${id}/reject`,

  // Auth
  LOGIN:            '/auth/login',
  SIGNUP:           '/auth/signup',
  LOGOUT:           '/auth/logout',
  ME:               '/auth/me',

  // Dashboard
  STATS:            '/dashboard/stats',

  // Business Rules
  BR_SCHEMA: (table) => `/business-rules/${table}/schema`,
  BR_ROWS:   (table) => `/business-rules/${table}`,

  // Users
  USERS:        '/users',
  USER:         (id) => `/users/${id}`,
}

export const CHEQUE_STATUS = {
  PENDING:    'pending',
  PROCESSING: 'processing',
  VERIFIED:   'verified',
  REJECTED:   'rejected',
  FLAGGED:    'flagged',
}

export const STATUS_LABELS = {
  [CHEQUE_STATUS.PENDING]:    'Pending',
  [CHEQUE_STATUS.PROCESSING]: 'Processing',
  [CHEQUE_STATUS.VERIFIED]:   'Verified',
  [CHEQUE_STATUS.REJECTED]:   'Rejected',
  [CHEQUE_STATUS.FLAGGED]:    'Flagged',
}

export const STATUS_COLORS = {
  [CHEQUE_STATUS.PENDING]:    'var(--warning)',
  [CHEQUE_STATUS.PROCESSING]: 'var(--accent)',
  [CHEQUE_STATUS.VERIFIED]:   'var(--success)',
  [CHEQUE_STATUS.REJECTED]:   'var(--danger)',
  [CHEQUE_STATUS.FLAGGED]:    'var(--warning)',
}

export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/tiff', 'application/pdf']
export const MAX_FILE_SIZE_MB = 10
