import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import styles from './Signup.module.css'

export function Signup() {
  const { signup, loading, error, clearError } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [localError, setLocalError] = useState('')

  const handleChange = (e) => {
    clearError()
    setLocalError('')
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match')
      return
    }
    const { confirmPassword, ...payload } = form
    signup(payload)
  }

  const displayError = localError || error

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.logoMark}>CC</span>
          <span className={styles.logoText}>ClearPay</span>
        </div>

        <h1 className={styles.heading}>Create account</h1>
        <p className={styles.sub}>Get started with ClearPay</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Smith"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {displayError && <p className={styles.error}>{displayError}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Create Account'}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
