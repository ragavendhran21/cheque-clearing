import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Pencil, Trash2, RefreshCw, X, Save, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  fetchSchema, fetchRows, insertRow, updateRow, deleteRow, selectTable,
} from '@/store/slices/businessRulesSlice'
import styles from './BusinessRules.module.css'

// ── Table catalogue grouped by category ──────────────────────────────────────
const CATEGORIES = [
  {
    label: '🏦 Accounts',
    tables: [
      { name: 'ALL_ACCOUNT_MASTER', label: 'Account Master' },
      { name: 'POSTING_CODE_REF',   label: 'Posting Codes'  },
    ],
  },
  {
    label: '🔀 Routing',
    tables: [
      { name: 'BANK_MASTER_RT',        label: 'Bank Routing'       },
      { name: 'ENDPOINT_ROUTE_REF',    label: 'Endpoint Routes'    },
      { name: 'COLLECTION_TYPE_MASTER',label: 'Collection Types'   },
    ],
  },
  {
    label: '📋 Collection Codes',
    tables: [
      { name: 'COLLECTION_CODE_MICR',        label: 'MICR Ranges'    },
      { name: 'COLLECTION_CODE_ORIGRT_REF',  label: 'Origin RT Ref'  },
      { name: 'COLLECTION_CODE_UD_REF',      label: 'UD Reference'   },
    ],
  },
  {
    label: '🛡️ Fraud & Risk',
    tables: [
      { name: 'FRAUD_WATCH_REF',  label: 'Fraud Watchlist'   },
      { name: 'STOP_PAY_REF',     label: 'Stop Payments'     },
      { name: 'POSITIVE_PAY_REF', label: 'Positive Pay'      },
    ],
  },
  {
    label: '⚙️ Workflow & Rules',
    tables: [
      { name: 'WORKFLOW_MASTER',      label: 'Workflow Rules'  },
      { name: 'API_AGGREGATOR_CONFIG',label: 'API Config'      },
    ],
  },
  {
    label: '✅ Validation',
    tables: [
      { name: 'MOD_ROUTINE',           label: 'Modulus Routines'  },
      { name: 'WORKFLOW_MASTER_AUDIT', label: 'Workflow Audit'    },
    ],
  },
]

const ALL_TABLES = CATEGORIES.flatMap(c => c.tables)

// ── Helpers ───────────────────────────────────────────────────────────────────
function getPkFields(schema) {
  return schema.filter(col => col.Key === 'PRI').map(col => col.Field)
}

function extractPk(row, pkFields) {
  return Object.fromEntries(pkFields.map(f => [f, row[f]]))
}

function isJsonField(col) {
  return typeof col === 'string' && (col.startsWith('{') || col.startsWith('['))
}

function formatCell(val) {
  if (val === null || val === undefined) return <span style={{ color: 'var(--text-muted)' }}>—</span>
  if (typeof val === 'object') return <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>[JSON]</span>
  const s = String(val)
  return s.length > 40 ? s.slice(0, 40) + '…' : s
}

// ── Row Modal (Add / Edit) ────────────────────────────────────────────────────
function RowModal({ mode, schema, initialData, onSave, onClose, saving }) {
  const [form, setForm] = useState(() => {
    const base = {}
    schema.forEach(col => { base[col.Field] = initialData?.[col.Field] ?? '' })
    return base
  })

  const handleChange = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const cleaned = Object.fromEntries(
      Object.entries(form).filter(([, v]) => v !== '' && v !== null && v !== undefined)
    )
    onSave(cleaned)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{mode === 'add' ? 'Add Row' : 'Edit Row'}</h3>
          <button className={styles.modalClose} onClick={onClose}><X size={16} /></button>
        </div>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <div className={styles.fieldGrid}>
            {schema.map(col => {
              const isJson = isJsonField(String(form[col.Field] ?? '')) || col.Type === 'json'
              const isEnum = col.Type.startsWith('enum')
              const enumVals = isEnum
                ? col.Type.replace(/^enum\(/, '').replace(/\)$/, '').split(',').map(v => v.replace(/'/g, ''))
                : []

              return (
                <div key={col.Field} className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>
                    {col.Field}
                    {col.Key === 'PRI' && <span className={styles.pkBadge}>PK</span>}
                    <span className={styles.fieldType}>{col.Type}</span>
                  </label>
                  {isJson ? (
                    <textarea
                      className={styles.jsonArea}
                      value={typeof form[col.Field] === 'object'
                        ? JSON.stringify(form[col.Field], null, 2)
                        : (form[col.Field] ?? '')}
                      onChange={e => handleChange(col.Field, e.target.value)}
                      rows={4}
                    />
                  ) : isEnum ? (
                    <select
                      className={styles.fieldInput}
                      value={form[col.Field] ?? ''}
                      onChange={e => handleChange(col.Field, e.target.value)}
                    >
                      <option value="">— select —</option>
                      {enumVals.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  ) : (
                    <input
                      className={styles.fieldInput}
                      value={form[col.Field] ?? ''}
                      onChange={e => handleChange(col.Field, e.target.value)}
                      disabled={mode === 'edit' && col.Key === 'PRI' && col.Extra === 'auto_increment'}
                    />
                  )}
                </div>
              )
            })}
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              <Save size={14} /> {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Delete Confirm ────────────────────────────────────────────────────────────
function DeleteConfirm({ onConfirm, onClose, saving }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.confirmBox} onClick={e => e.stopPropagation()}>
        <h3>Delete Row</h3>
        <p>This action cannot be undone. Are you sure?</p>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.deleteBtn} onClick={onConfirm} disabled={saving}>
            <Trash2 size={14} /> {saving ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function BusinessRules() {
  const dispatch = useDispatch()
  const { selectedTable, schema, rows, loadingSchema, loadingRows, mutating, error } = useSelector(s => s.businessRules)

  const [modal, setModal]     = useState(null)   // null | { mode: 'add'|'edit', row?: {} }
  const [delRow, setDelRow]   = useState(null)   // row to delete

  const tableLabel = ALL_TABLES.find(t => t.name === selectedTable)?.label ?? selectedTable

  const load = useCallback((table) => {
    dispatch(fetchSchema(table))
    dispatch(fetchRows(table))
  }, [dispatch])

  useEffect(() => {
    if (selectedTable) load(selectedTable)
  }, [selectedTable, load])

  const handleSelectTable = (name) => {
    dispatch(selectTable(name))
  }

  const handleAdd = () => setModal({ mode: 'add' })
  const handleEdit = (row) => setModal({ mode: 'edit', row })
  const handleDeleteClick = (row) => setDelRow(row)

  const handleSave = async (formData) => {
    const pkFields = getPkFields(schema)

    if (modal.mode === 'add') {
      const result = await dispatch(insertRow({ table: selectedTable, row: formData }))
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Row added')
        setModal(null)
        load(selectedTable)
      } else {
        toast.error(result.payload || 'Insert failed')
      }
    } else {
      const pkValues = extractPk(modal.row, pkFields)
      const updates  = Object.fromEntries(
        Object.entries(formData).filter(([k]) => !pkFields.includes(k))
      )
      const result = await dispatch(updateRow({ table: selectedTable, updates, pkValues }))
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Row updated')
        setModal(null)
        load(selectedTable)
      } else {
        toast.error(result.payload || 'Update failed')
      }
    }
  }

  const handleDelete = async () => {
    const pkFields = getPkFields(schema)
    const pkValues = extractPk(delRow, pkFields)
    const result = await dispatch(deleteRow({ table: selectedTable, pkValues }))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Row deleted')
      setDelRow(null)
      load(selectedTable)
    } else {
      toast.error(result.payload || 'Delete failed')
    }
  }

  return (
    <div className={styles.page}>

      {/* ── Left panel ── */}
      <aside className={styles.left}>
        <div className={styles.leftHeader}>
          <h2 className={styles.leftTitle}>Tables</h2>
          <p className={styles.leftSub}>Click a table to view data</p>
        </div>
        <div className={styles.categories}>
          {CATEGORIES.map(cat => (
            <div key={cat.label} className={styles.category}>
              <div className={styles.catLabel}>{cat.label}</div>
              {cat.tables.map(t => (
                <button
                  key={t.name}
                  className={`${styles.tableBtn} ${selectedTable === t.name ? styles.activeTable : ''}`}
                  onClick={() => handleSelectTable(t.name)}
                >
                  <span>{t.label}</span>
                  <ChevronRight size={14} className={styles.chevron} />
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* ── Right panel ── */}
      <main className={styles.right}>
        {!selectedTable ? (
          <div className={styles.empty}>
            <p>Select a table from the left to view and edit data</p>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className={styles.rightHeader}>
              <div>
                <h2 className={styles.rightTitle}>{tableLabel}</h2>
                <p className={styles.rightSub}>
                  {loadingRows ? 'Loading…' : `${rows.length} rows`} · <code className={styles.code}>{selectedTable}</code>
                </p>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.refreshBtn}
                  onClick={() => load(selectedTable)}
                  disabled={loadingRows}
                >
                  <RefreshCw size={14} className={loadingRows ? styles.spin : ''} />
                </button>
                <button className={styles.addBtn} onClick={handleAdd}>
                  <Plus size={15} /> Add Row
                </button>
              </div>
            </div>

            {error && <div className={styles.errorBanner}>{error}</div>}

            {/* Data grid */}
            <div className={styles.tableWrap}>
              {loadingRows || loadingSchema ? (
                <div className={styles.loading}>Loading data…</div>
              ) : rows.length === 0 ? (
                <div className={styles.loading}>No rows found</div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {schema.map(col => (
                        <th key={col.Field}>
                          {col.Field}
                          {col.Key === 'PRI' && <span className={styles.pkTag}>PK</span>}
                        </th>
                      ))}
                      <th className={styles.actionsCol}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i}>
                        {schema.map(col => (
                          <td key={col.Field}>{formatCell(row[col.Field])}</td>
                        ))}
                        <td>
                          <div className={styles.rowActions}>
                            <button className={styles.editBtn} onClick={() => handleEdit(row)} title="Edit">
                              <Pencil size={13} />
                            </button>
                            <button className={styles.delBtn} onClick={() => handleDeleteClick(row)} title="Delete">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>

      {/* ── Modals ── */}
      {modal && (
        <RowModal
          mode={modal.mode}
          schema={schema}
          initialData={modal.row}
          onSave={handleSave}
          onClose={() => setModal(null)}
          saving={mutating}
        />
      )}
      {delRow && (
        <DeleteConfirm
          onConfirm={handleDelete}
          onClose={() => setDelRow(null)}
          saving={mutating}
        />
      )}
    </div>
  )
}
