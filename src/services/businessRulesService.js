import api from './api'
import { ENDPOINTS } from '@/constants'

export const businessRulesService = {
  getSchema: (table)              => api.get(ENDPOINTS.BR_SCHEMA(table)),
  getRows:   (table)              => api.get(ENDPOINTS.BR_ROWS(table)),
  insert:    (table, row)         => api.post(ENDPOINTS.BR_ROWS(table), row),
  update:    (table, updates, pkValues) =>
    api.put(ENDPOINTS.BR_ROWS(table), { updates, pkValues }),
  remove:    (table, pkValues)    =>
    api.delete(ENDPOINTS.BR_ROWS(table), { data: pkValues }),
}
