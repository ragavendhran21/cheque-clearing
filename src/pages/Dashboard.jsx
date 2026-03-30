import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  FileCheck2, Clock, CheckCircle2, XCircle,
  AlertTriangle, Upload, TrendingUp, Activity,
} from 'lucide-react'
import styles from './Dashboard.module.css'

// ── Mock data (swap with real API data from dashboardSlice when backend is ready) ──
const MOCK_STATS = {
  totalCheques:  142,
  pending:        38,
  processing:     21,
  verified:       74,
  rejected:        6,
  flagged:         3,
}

const MOCK_RECENT = [
  { id: 'CHQ-001', account: 'HDFC •• 4821', amount: '₹1,24,500.00', status: 'verified',   submittedAt: '09:14 AM' },
  { id: 'CHQ-002', account: 'SBI  •• 3302', amount: '₹88,000.00',   status: 'processing', submittedAt: '09:02 AM' },
  { id: 'CHQ-003', account: 'ICICI•• 9910', amount: '₹2,50,000.00', status: 'pending',    submittedAt: '08:47 AM' },
  { id: 'CHQ-004', account: 'AXIS •• 7741', amount: '₹34,200.00',   status: 'flagged',    submittedAt: '08:31 AM' },
  { id: 'CHQ-005', account: 'PNB  •• 1123', amount: '₹6,75,000.00', status: 'rejected',   submittedAt: '08:10 AM' },
  { id: 'CHQ-006', account: 'BOI  •• 5588', amount: '₹12,000.00',   status: 'verified',   submittedAt: '07:55 AM' },
]

const MOCK_WORK_TYPES = [
  { label: 'Inbound',  count: 84, amount: '₹12,45,200', exceptions: 4,  stp: 91 },
  { label: 'Outbound', count: 58, amount: '₹8,30,500',  exceptions: 2,  stp: 96 },
]

const STATUS_META = {
  pending:    { label: 'Pending',    color: 'var(--warning)', bg: 'rgba(245,158,11,0.12)' },
  processing: { label: 'Processing', color: 'var(--accent)',  bg: 'rgba(201,168,76,0.12)' },
  verified:   { label: 'Verified',   color: 'var(--success)', bg: 'rgba(16,185,129,0.12)' },
  rejected:   { label: 'Rejected',   color: 'var(--danger)',  bg: 'rgba(239,68,68,0.12)'  },
  flagged:    { label: 'Flagged',    color: '#f97316',        bg: 'rgba(249,115,22,0.12)' },
}

const STAT_CARDS = [
  { key: 'totalCheques', label: 'Total Cheques',  icon: FileCheck2,    color: 'var(--accent)'   },
  { key: 'pending',      label: 'Pending',         icon: Clock,         color: 'var(--warning)'  },
  { key: 'processing',   label: 'Processing',      icon: Activity,      color: 'var(--accent)'   },,
  { key: 'verified',     label: 'Verified',        icon: CheckCircle2,  color: 'var(--success)'  },
  { key: 'rejected',     label: 'Rejected',        icon: XCircle,       color: 'var(--danger)'   },
  { key: 'flagged',      label: 'Flagged',         icon: AlertTriangle, color: '#f97316'         },
]

function StatusPill({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.pending
  return (
    <span className={styles.pill} style={{ color: m.color, background: m.bg }}>
      {m.label}
    </span>
  )
}

export function Dashboard() {
  const { user }  = useSelector((s) => s.auth)
  const stats     = MOCK_STATS   // replace with useSelector((s) => s.dashboard.stats) when API is ready
  const recent    = MOCK_RECENT
  const workTypes = MOCK_WORK_TYPES

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className={styles.page}>

      {/* ── Header ───────────────────────────────────── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>{today} &nbsp;·&nbsp; Business operations overview</p>
        </div>
        <Link to="/cheques/upload" className={styles.uploadBtn}>
          <Upload size={16} />
          Upload Cheque
        </Link>
      </div>

      {/* ── System Status Bar ────────────────────────── */}
      <div className={styles.statusBar}>
        <span className={styles.statusPill} data-ok="true">
          <span className={styles.dot} style={{ background: 'var(--success)' }} />
          IQV: Running
        </span>
        <span className={styles.statusPill} data-ok="true">
          <span className={styles.dot} style={{ background: 'var(--success)' }} />
          Fraud Detection: Active
        </span>
        <span className={styles.statusPill} data-ok="warn">
          <span className={styles.dot} style={{ background: 'var(--warning)' }} />
          Duplicate Check: Processing
        </span>
        <span className={styles.statusPill}>
          <TrendingUp size={13} />
          AI Auto (STP): 89%
        </span>
        <span className={styles.statusPill}>
          <Activity size={13} />
          Latency: 112 ms
        </span>
      </div>

      {/* ── Stat Cards ───────────────────────────────── */}
      <div className={styles.statsGrid}>
        {STAT_CARDS.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: `${color}18`, color }}>
              <Icon size={20} />
            </div>
            <div className={styles.statBody}>
              <div className={styles.statValue}>{stats[key]}</div>
              <div className={styles.statLabel}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Work Type Summary ────────────────────────── */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Work Type Summary</h2>
        <div className={styles.workGrid}>
          {workTypes.map((w) => (
            <div key={w.label} className={styles.workCard}>
              <div className={styles.workHeader}>
                <span className={styles.workLabel}>{w.label}</span>
                {w.exceptions > 0 && (
                  <span className={styles.exceptionBadge}>{w.exceptions} exceptions</span>
                )}
              </div>
              <div className={styles.workCount}>{w.count}</div>
              <div className={styles.workAmount}>{w.amount}</div>
              <div className={styles.workStp}>
                <span>AI Auto (STP)</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>{w.stp}%</span>
              </div>
              <div className={styles.stpBar}>
                <div className={styles.stpFill} style={{ width: `${w.stp}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Cheques ───────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.tableHeader}>
          <h2 className={styles.sectionTitle}>Recent Cheques</h2>
          <Link to="/cheques" className={styles.viewAll}>View all →</Link>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cheque ID</th>
                <th>Account</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((row) => (
                <tr key={row.id}>
                  <td className={styles.mono}>{row.id}</td>
                  <td>{row.account}</td>
                  <td className={styles.amount}>{row.amount}</td>
                  <td><StatusPill status={row.status} /></td>
                  <td className={styles.muted}>{row.submittedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
