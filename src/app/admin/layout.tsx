"use client"

import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  // Login page uses the student-style centered layout
  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <>
      <nav className="admin-topnav">
        <div className="admin-topnav-inner">
          <div className="admin-topnav-brand">
            <span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            Admin Portal
          </div>
          <div className="admin-topnav-actions">
            <button
              className="btn btn-secondary"
              style={{ padding: "7px 18px", fontSize: "0.85rem" }}
              onClick={() => router.push("/admin")}>
              Dashboard
            </button>
            <button
              className="btn btn-ghost"
              style={{ padding: "7px 18px", fontSize: "0.85rem" }}
              onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <div className="admin-page">
        <div className="admin-page-inner">{children}</div>
      </div>
    </>
  )
}
