import { useSelector, useDispatch } from 'react-redux'
import {
  uploadCheque,
  fetchCheques,
  fetchChequeById,
  verifyCheque,
  rejectCheque,
  clearSelected,
  clearError,
} from '@/store/slices/chequesSlice'

export function useCheques() {
  const dispatch = useDispatch()
  const { list, total, selected, uploading, loading, error } = useSelector((s) => s.cheques)

  return {
    list,
    total,
    selected,
    uploading,
    loading,
    error,
    upload:       (formData)          => dispatch(uploadCheque(formData)),
    fetchAll:     (params)            => dispatch(fetchCheques(params)),
    fetchById:    (id)                => dispatch(fetchChequeById(id)),
    verify:       (id, payload = {})  => dispatch(verifyCheque({ id, payload })),
    reject:       (id, reason)        => dispatch(rejectCheque({ id, reason })),
    clearSelected: ()                 => dispatch(clearSelected()),
    clearError:    ()                 => dispatch(clearError()),
  }
}
