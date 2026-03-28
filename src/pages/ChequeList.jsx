import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, Search } from 'lucide-react'
import styles from './ChequeList.module.css'

// Mock data — replace with useSelector((s) => s.cheques) when API is ready
const MOCK_CHEQUES = [
  { id: 'CHQ-001', account: 'HDFC Bank •• 4821', payee: 'Rajesh Kumar',    amount: '₹1,24,500.00', status: 'verified',   submittedAt: '28 Mar, 09:14 AM' },
  { id: 'CHQ-002', account: 'SBI  •• 3302',      payee: 'Meena Traders',   amount: '₹88,000.00',   status: 'processing', submittedAt: '28 Mar, 09:02 AM' },
  { id: 'CHQ-003', account: 'ICICI •• 9910',     payee: 'Sundar Pichai',   amount: '₹2,50,000.00', status: 'pending',    submittedAt: '28 Mar, 08:47 AM' },
  { id: 'CHQ-004', account: 'AXIS •• 7741',      payee: 'Global Exports',  amount: '₹34,200.00',   status: 'flagged',    submittedAt: '28 Mar, 08:31 AM' },
  { id: 'CHQ-005', account: 'PNB  •• 1123',      payee: 'Laxmi Stores',    amount: '₹6,75,000.00', status: 'rejected',   submittedAt: '28 Mar, 08:10 AM' },
  { id: 'CHQ-006', account: 'BOI  •• 5588',      payee: 'AV Enterprises',  amount: '₹12,000.00',   status: 'verified',   submittedAt: '28 Mar, 07:55 AM' },
  { id: 'CHQ-007', account: 'HDFC Bank •• 2211', payee: 'Infosys Ltd',     amount: '₹5,00,000.00', status: 'verified',   submittedAt: '27 Mar, 04:30 PM' },
  { id: 'CHQ-008', account: 'KOTAK •• 6631',     payee: 'Priya Nair',      amount: '₹18,750.00',   status: 'pending',    submittedAt: '27 Mar, 03:15 PM' },
]

const STATUS_FILTERS = ['all', 'pending', 'processing', 'verified', 'rejected', 'flagged']

const STATUS_META = {
  pending:    { label: 'Pending',    color: 'var(--warning)', bg: 'rgba(245,158,11,0.12)' },
  processing: { label: 'Processing', color: 'var(--accent)',  bg: 'rgba(59,130,246,0.12)' },
  verified:   { label: 'Verified',   color: 'var(--success)', bg: 'rgba(16,185,129,0.12)' },
  rejected:   { label: 'Rejected',   color: 'var(--danger)',  bg: 'rgba(239,68,68,0.12)'  },
  flagged:    { label: 'Flagged',    color: '#f97316',        bg: 'rgba(249,115,22,0.12)' },
}

function StatusPill({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.pending
  return (
    <span className={styles.pill} style={{ color: m.color, background: m.bg }}>
      {m.label}
    </span>
  )
}

export function ChequeList() {
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')

  const cheques = MOCK_CHEQUES   // swap: useSelector((s) => s.cheques.list)

  const visible = cheques.filter((c) => {
    const matchStatus = filter === 'all' || c.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q || c.id.toLowerCase().includes(q) || c.payee.toLowerCase().includes(q) || c.account.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Cheques</h1>
          <p className={styles.subtitle}>{cheques.length} total submissions</p>
        </div>
        <Link to="/cheques/upload" className={styles.uploadBtn}>
          <Upload size={15} /> Upload Cheque
        </Link>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input
            className={styles.search}
            placeholder="Search by ID, payee or account…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : STATUS_META[f].label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cheque ID</th>
              <th>Account</th>
              <th>Payee</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>No cheques found</td>
              </tr>
            ) : visible.map((row) => (
              <tr key={row.id} className={styles.row}>
                <td className={styles.mono}>{row.id}</td>
                <td className={styles.muted}>{row.account}</td>
                <td>{row.payee}</td>
                <td className={styles.amount}>{row.amount}</td>
                <td><StatusPill status={row.status} /></td>
                <td className={styles.muted}>{row.submittedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
