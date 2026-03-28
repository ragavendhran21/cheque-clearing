import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileCheck, Upload, LogOut, Settings2, Users } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import styles from './Sidebar.module.css'

const NAV_MAIN = [
  { to: '/dashboard',      label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cheques',        label: 'Cheques',   icon: FileCheck },
  { to: '/cheques/upload', label: 'Upload',    icon: Upload },
]

const NAV_CONFIG = [
  { to: '/business-rules', label: 'Setup Bank Rules', icon: Settings2, roles: null },
  { to: '/setup-user',     label: 'Setup User',       icon: Users,     roles: ['admin'] },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const role = user?.role

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoMark}>CC</span>
        <span className={styles.logoText}>ClearPay</span>
      </div>

      <nav className={styles.nav}>
        {NAV_MAIN.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}

        <div className={styles.navSection}>Configuration</div>

        {NAV_CONFIG
          .filter(({ roles }) => !roles || roles.includes(role))
          .map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.user}>
          <div className={styles.avatar}>{user?.name?.[0] ?? 'U'}</div>
          <div>
            <div className={styles.userName}>{user?.name}</div>
            <div className={styles.userRole}>{user?.role}</div>
          </div>
        </div>
        <button className={styles.logout} onClick={logout}>
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  )
}
