import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileImage } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCheques } from '@/hooks/useCheques'
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_MB } from '@/constants'
import toast from 'react-hot-toast'
import styles from './ChequeUploader.module.css'

export function ChequeUploader({ onSuccess }) {
  const { upload, uploading } = useCheques()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error('Invalid file. Use JPG, PNG, TIFF or PDF under 10MB.')
      return
    }
    const f = accepted[0]
    setFile(f)
    if (f.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(f))
    } else {
      setPreview(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ALLOWED_FILE_TYPES.reduce((acc, t) => ({ ...acc, [t]: [] }), {}),
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    multiple: false,
  })

  const handleClear = () => {
    setFile(null)
    setPreview(null)
  }

  const handleSubmit = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append('cheque', file)
    const result = await upload(formData)
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Cheque uploaded successfully')
      handleClear()
      onSuccess?.()
    } else {
      toast.error(result.payload || 'Upload failed')
    }
  }

  return (
    <div className={styles.wrapper}>
      {!file ? (
        <div
          {...getRootProps()}
          className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
        >
          <input {...getInputProps()} />
          <Upload size={32} className={styles.icon} />
          <p className={styles.title}>
            {isDragActive ? 'Drop the cheque here' : 'Drag & drop cheque image'}
          </p>
          <p className={styles.sub}>JPG, PNG, TIFF or PDF · Max {MAX_FILE_SIZE_MB}MB</p>
          <Button variant="ghost" size="sm" style={{ marginTop: 12 }}>
            Browse files
          </Button>
        </div>
      ) : (
        <div className={styles.preview}>
          {preview ? (
            <img src={preview} alt="Cheque preview" className={styles.img} />
          ) : (
            <div className={styles.pdfPlaceholder}>
              <FileImage size={40} />
              <span>{file.name}</span>
            </div>
          )}
          <div className={styles.previewFooter}>
            <span className={styles.fileName}>{file.name}</span>
            <div className={styles.actions}>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <X size={14} /> Remove
              </Button>
              <Button size="sm" loading={uploading} onClick={handleSubmit}>
                <Upload size={14} /> Submit Cheque
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
