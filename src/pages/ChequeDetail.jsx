import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, FileCheck2, User, Building2, Calendar,
  Hash, ShieldCheck, Clock, CheckCircle2, XCircle,
  AlertTriangle, Download, RotateCcw,
} from 'lucide-react'
import styles from './ChequeDetail.module.css'

// Mock — replace with useSelector((s) => s.cheques.selected) when API ready
const MOCK_CHEQUE = {
  id: 'CHQ-003',
  account: 'ICICI Bank •• 9910',
  bankName: 'ICICI Bank Ltd',
  ifsc: 'ICIC0009910',
  payee: 'Sundar Pichai',
  amount: '₹2,50,000.00',
  amountWords: 'Two Lakh Fifty Thousand Rupees Only',
  chequeDate: '25 Mar 2026',
  submittedAt: '28 Mar 2026, 08:47 AM',
  status: 'pending',
  micr: '400229002',
  drawerName: 'Tata Consultancy Services',
  fraudScore: 2,
  iqvScore: 97,
  duplicateFlag: false,
  auditLog: [
    { time: '08:47 AM', event: 'Cheque uploaded', actor: 'Operator' },
    { time: '08:47 AM', event: 'IQV passed (97%)', actor: 'System' },
    { time: '08:48 AM', event: 'MICR extraction complete', actor: 'System' },
    { time: '08:48 AM', event: 'Fraud scan passed (score: 2)', actor: 'System' },
    { time: '08:49 AM', event: 'Awaiting manual approval', actor: 'System' },
  ],
}

const STATUS_META = {
  pending:    { label: 'Pending',    color: 'var(--warning)', bg: 'rgba(245,158,11,0.12)', Icon: Clock },
  processing: { label: 'Processing', color: 'var(--accent)',  bg: 'rgba(201,168,76,0.12)', Icon: RotateCcw },
  verified:   { label: 'Verified',   color: 'var(--success)', bg: 'rgba(34,197,94,0.12)',  Icon: CheckCircle2 },
  rejected:   { label: 'Rejected',   color: 'var(--danger)',  bg: 'rgba(239,68,68,0.12)',  Icon: XCircle },
  flagged:    { label: 'Flagged',    color: '#f97316',        bg: 'rgba(249,115,22,0.12)', Icon: AlertTriangle },
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.pending
  return (
    <span className={styles.statusBadge} style={{ color: m.color, background: m.bg }}>
      <m.Icon size={13} />
      {m.label}
    </span>
  )
}

function ScoreBar({ value, max = 100, good = 'high' }) {
  const pct = Math.round((value / max) * 100)
  const isGood = good === 'high' ? value >= 80 : value <= 20
  const color = isGood ? 'var(--success)' : value >= 50 ? 'var(--warning)' : 'var(--danger)'
  return (
    <div className={styles.scoreWrap}>
      <div className={styles.scoreBar}>
        <div className={styles.scoreFill} style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className={styles.scoreVal} style={{ color }}>{value}{max === 100 ? '%' : ''}</span>
    </div>
  )
}

export function ChequeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cheque = MOCK_CHEQUE // replace: useSelector((s) => s.cheques.map[id])

  const meta = STATUS_META[cheque.status] ?? STATUS_META.pending

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate(-1)}>
          <ArrowLeft size={15} /> Back to Cheques
        </button>
        <div className={styles.headerMain}>
          <div>
            <div className={styles.chequeId}>{cheque.id}</div>
            <h1 className={styles.title}>Cheque Detail</h1>
          </div>
          <div className={styles.headerActions}>
            <StatusBadge status={cheque.status} />
            <button className={styles.actionBtn}>
              <Download size={15} /> Export
            </button>
            {cheque.status === 'pending' && (
              <>
                <button className={styles.approveBtn}>
                  <CheckCircle2 size={15} /> Approve
                </button>
                <button className={styles.rejectBtn}>
                  <XCircle size={15} /> Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.body}>

        {/* ── Left column ── */}
        <div className={styles.left}>

          {/* Cheque image placeholder */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>Cheque Image</div>
            <div className={styles.chequeImg}>
              <FileCheck2 size={40} color="var(--accent)" />
              <span className={styles.chequeImgLabel}>{cheque.id}.jpg</span>
              <button className={styles.viewImgBtn}>View Full Image</button>
            </div>
          </div>

          {/* Fields */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>Extracted Fields</div>
            <div className={styles.fields}>
              <Field icon={User}      label="Payee"        value={cheque.payee} />
              <Field icon={User}      label="Drawer"       value={cheque.drawerName} />
              <Field icon={Building2} label="Bank"         value={cheque.bankName} />
              <Field icon={Hash}      label="Account"      value={cheque.account} />
              <Field icon={Hash}      label="IFSC"         value={cheque.ifsc} mono />
              <Field icon={Hash}      label="MICR"         value={cheque.micr} mono />
              <Field icon={Calendar}  label="Cheque Date"  value={cheque.chequeDate} />
              <Field icon={Clock}     label="Submitted"    value={cheque.submittedAt} />
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className={styles.right}>

          {/* Amount */}
          <div className={`${styles.card} ${styles.amountCard}`}>
            <div className={styles.cardTitle}>Amount</div>
            <div className={styles.amountValue}>{cheque.amount}</div>
            <div className={styles.amountWords}>{cheque.amountWords}</div>
          </div>

          {/* AI Scores */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>AI Verification</div>
            <div className={styles.scores}>
              <div className={styles.scoreRow}>
                <div className={styles.scoreLabel}>
                  <ShieldCheck size={14} color="var(--success)" />
                  Image Quality (IQV)
                </div>
                <ScoreBar value={cheque.iqvScore} good="high" />
              </div>
              <div className={styles.scoreRow}>
                <div className={styles.scoreLabel}>
                  <AlertTriangle size={14} color={cheque.fraudScore <= 20 ? 'var(--success)' : 'var(--danger)'} />
                  Fraud Risk Score
                </div>
                <ScoreBar value={cheque.fraudScore} good="low" />
              </div>
              <div className={styles.scoreRow}>
                <div className={styles.scoreLabel}>
                  <Hash size={14} color="var(--accent)" />
                  Duplicate Flag
                </div>
                <span className={styles.flagBadge} style={{
                  background: cheque.duplicateFlag ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.10)',
                  color: cheque.duplicateFlag ? 'var(--danger)' : 'var(--success)',
                }}>
                  {cheque.duplicateFlag ? 'Duplicate Detected' : 'No Duplicate'}
                </span>
              </div>
            </div>
          </div>

          {/* Audit Log */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>Audit Trail</div>
            <div className={styles.auditLog}>
              {cheque.auditLog.map((entry, i) => (
                <div key={i} className={styles.auditEntry}>
                  <div className={styles.auditDot} />
                  <div className={styles.auditContent}>
                    <span className={styles.auditEvent}>{entry.event}</span>
                    <span className={styles.auditMeta}>{entry.time} · {entry.actor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, value, mono }) {
  return (
    <div className={styles.field}>
      <div className={styles.fieldLabel}>
        <Icon size={13} />
        {label}
      </div>
      <div className={`${styles.fieldValue} ${mono ? styles.mono : ''}`}>{value}</div>
    </div>
  )
}
