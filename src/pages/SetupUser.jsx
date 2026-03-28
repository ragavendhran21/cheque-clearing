import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchUsers, createUser, updateUser, deleteUser } from '@/store/slices/usersSlice'
import styles from './SetupUser.module.css'

const ROLES   = ['admin', 'operator', 'auditor']
const STATUSES = ['active', 'inactive']

function roleCls(role) {
  if (role === 'admin')    return styles.roleAdmin
  if (role === 'operator') return styles.roleOperator
  return styles.roleAuditor
}

// ── Add / Edit Modal ──────────────────────────────────────────────────────────
function UserModal({ mode, initial, onClose, saving }) {
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    name:     initial?.name     ?? '',
    email:    initial?.email    ?? '',
    password: '',
    role:     initial?.role     ?? 'operator',
    status:   initial?.status   ?? 'active',
  })

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (mode === 'add') {
      const result = await dispatch(createUser({ name: form.name, email: form.email, password: form.password, role: form.role }))
      if (result.meta.requestStatus === 'fulfilled') { toast.success('User created'); onClose() }
      else toast.error(result.payload || 'Failed to create user')
    } else {
      const body = { role: form.role, status: form.status }
      const result = await dispatch(updateUser({ id: initial.id, ...body }))
      if (result.meta.requestStatus === 'fulfilled') { toast.success('User updated'); onClose() }
      else toast.error(result.payload || 'Failed to update user')
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{mode === 'add' ? 'Add User' : 'Edit User'}</h3>
          <button className={styles.modalClose} onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {mode === 'add' && (
              <>
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>Full Name</label>
                  <input className={styles.fieldInput} value={form.name} onChange={e => set('name', e.target.value)} required />
                </div>
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>Email</label>
                  <input className={styles.fieldInput} type="email" value={form.email} onChange={e => set('email', e.target.value)} required />
                </div>
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>Password</label>
                  <input className={styles.fieldInput} type="password" value={form.password} onChange={e => set('password', e.target.value)} required minLength={8} />
                </div>
              </>
            )}
            {mode === 'edit' && (
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>Email</label>
                <input className={styles.fieldInput} value={initial.email} disabled />
              </div>
            )}
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>Role</label>
              <select className={styles.fieldInput} value={form.role} onChange={e => set('role', e.target.value)}>
                {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
            {mode === 'edit' && (
              <div className={styles.fieldRow}>
                <label className={styles.fieldLabel}>Status</label>
                <select className={styles.fieldInput} value={form.status} onChange={e => set('status', e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
            )}
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
function DeleteConfirm({ user, onConfirm, onClose, saving }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.confirmBox} onClick={e => e.stopPropagation()}>
        <h3>Delete User</h3>
        <p>Remove <strong>{user.name}</strong> ({user.email})? This cannot be undone.</p>
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
export function SetupUser() {
  const dispatch = useDispatch()
  const { list, loading, mutating, error } = useSelector(s => s.users)

  const [modal, setModal]   = useState(null)   // null | { mode: 'add' | 'edit', user? }
  const [delUser, setDelUser] = useState(null)

  useEffect(() => { dispatch(fetchUsers()) }, [dispatch])

  const handleDelete = async () => {
    const result = await dispatch(deleteUser(delUser.id))
    if (result.meta.requestStatus === 'fulfilled') { toast.success('User deleted'); setDelUser(null) }
    else toast.error(result.payload || 'Delete failed')
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h1>Setup User</h1>
          <p>{list.length} user{list.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button className={styles.addBtn} onClick={() => setModal({ mode: 'add' })}>
          <Plus size={15} /> Add User
        </button>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {/* Table */}
      <div className={styles.tableWrap}>
        {loading ? (
          <div className={styles.loading}>Loading users…</div>
        ) : list.length === 0 ? (
          <div className={styles.empty}>No users found</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map(u => (
                <tr key={u.id}>
                  <td><span className={styles.userId}>#{String(u.id).padStart(4, '0')}</span></td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`${styles.roleBadge} ${roleCls(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${u.status === 'active' ? styles.statusActive : styles.statusInactive}`}>
                      <span className={styles.dot} />
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionsCell}>
                      <button className={styles.editBtn} onClick={() => setModal({ mode: 'edit', user: u })} title="Edit">
                        <Pencil size={13} />
                      </button>
                      <button className={styles.delBtn} onClick={() => setDelUser(u)} title="Delete">
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

      {/* Modals */}
      {modal && (
        <UserModal
          mode={modal.mode}
          initial={modal.user}
          onClose={() => setModal(null)}
          saving={mutating}
        />
      )}
      {delUser && (
        <DeleteConfirm
          user={delUser}
          onConfirm={handleDelete}
          onClose={() => setDelUser(null)}
          saving={mutating}
        />
      )}
    </div>
  )
}
