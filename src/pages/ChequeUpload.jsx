import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileCheck2, ShieldCheck, Zap } from 'lucide-react'
import { ChequeUploader } from '@/components/cheque/ChequeUploader'
import styles from './ChequeUpload.module.css'

const TIPS = [
  { icon: FileCheck2,  text: 'JPG, PNG, TIFF or PDF — max 10 MB per file' },
  { icon: ShieldCheck, text: 'All uploads are encrypted and processed securely' },
  { icon: Zap,         text: 'AI fraud detection runs automatically on every upload' },
]

export function ChequeUpload() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h1 className={styles.title}>Upload Cheque</h1>
          <p className={styles.subtitle}>Submit a cheque image for automated clearing and verification</p>
        </div>
      </div>

      <div className={styles.body}>
        {/* Upload area */}
        <div className={styles.uploaderWrap}>
          <ChequeUploader onSuccess={() => navigate('/cheques')} />
        </div>

        {/* Info panel */}
        <div className={styles.infoPanel}>
          <h3 className={styles.infoTitle}>Before you upload</h3>
          <ul className={styles.tips}>
            {TIPS.map(({ icon: Icon, text }) => (
              <li key={text} className={styles.tip}>
                <Icon size={16} className={styles.tipIcon} />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className={styles.divider} />

          <h3 className={styles.infoTitle}>Processing pipeline</h3>
          <ol className={styles.pipeline}>
            {['File received & validated', 'Image quality check (IQV)', 'MICR / field extraction', 'Fraud & duplicate scan', 'Routing for approval'].map((step, i) => (
              <li key={step} className={styles.step}>
                <span className={styles.stepNum}>{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
