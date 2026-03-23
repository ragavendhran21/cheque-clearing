import { STATUS_LABELS, STATUS_COLORS } from '@/constants'
import styles from './StatusBadge.module.css'

export function StatusBadge({ status }) {
  return (
    <span
      className={styles.badge}
      style={{ color: STATUS_COLORS[status], borderColor: STATUS_COLORS[status] }}
    >
      {STATUS_LABELS[status] || status}
    </span>
  )
}
