'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'

export default function AdminNav() {
  return (
    <nav className="bg-gray-800 text-white p-4 mb-6">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="space-x-4">
          <Link href="/admin/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link href="/admin/renewals" className="hover:text-gray-300">
            Renewal History
          </Link>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  )
} 