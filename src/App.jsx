import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMe, clearAuth } from '@/store/slices/authSlice'
import { tokenService } from '@/services/tokenService'

import { AppLayout } from '@/components/layout/AppLayout'
import { Login }      from '@/pages/Login'
import { Signup }     from '@/pages/Signup'
import { Dashboard }  from '@/pages/Dashboard'
import { ChequeList }   from '@/pages/ChequeList'
import { ChequeUpload } from '@/pages/ChequeUpload'
import { ChequeDetail } from '@/pages/ChequeDetail'

function ProtectedRoute({ children }) {
  const { user, initialized } = useSelector((s) => s.auth)
  if (!initialized) return null          // wait for token check
  if (!user) return <Navigate to="/login" replace />
  return children
}

function GuestRoute({ children }) {
  const { user, initialized } = useSelector((s) => s.auth)
  if (!initialized) return null
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    if (tokenService.has()) {
      dispatch(fetchMe())
    } else {
      dispatch(clearAuth())
    }
  }, [dispatch])

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: '#1a2235', color: '#f1f5f9', border: '1px solid #1e2d45' } }}
      />
      <Routes>
        {/* Guest only */}
        <Route path="/login"  element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

        {/* Protected */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard"        element={<Dashboard />} />
          <Route path="/cheques"          element={<ChequeList />} />
          <Route path="/cheques/upload"   element={<ChequeUpload />} />
          <Route path="/cheques/:id"      element={<ChequeDetail />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
