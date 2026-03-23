import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import styles from './Login.module.css'

export function Login() {
  const { login, loading, error, clearError } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    clearError()
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    login(form)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.logoMark}>CC</span>
          <span className={styles.logoText}>ClearPay</span>
        </div>

        <h1 className={styles.heading}>Welcome back</h1>
        <p className={styles.sub}>Sign in to your account</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@bank.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Sign In'}
          </button>
        </form>

        <p className={styles.footer}>
          Don't have an account?{' '}
          <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  )
}
