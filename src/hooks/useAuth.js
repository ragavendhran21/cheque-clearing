import { useSelector, useDispatch } from 'react-redux'
import { login, signup, logout, clearError } from '@/store/slices/authSlice'

export function useAuth() {
  const dispatch = useDispatch()
  const { user, loading, error, initialized } = useSelector((s) => s.auth)

  return {
    user,
    loading,
    error,
    initialized,
    isAuthenticated: !!user,
    login:      (credentials) => dispatch(login(credentials)),
    signup:     (payload)     => dispatch(signup(payload)),
    logout:     ()            => dispatch(logout()),
    clearError: ()            => dispatch(clearError()),
  }
}
