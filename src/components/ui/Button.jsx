import styles from './Button.module.css'

export function Button({ children, variant = 'primary', size = 'md', loading = false, disabled, ...props }) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${styles[size]}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className={styles.spinner} /> : children}
    </button>
  )
}
