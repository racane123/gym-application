'use client'

import { useEffect, useState } from 'react'
import { Session } from 'next-auth'
import AdminNav from '../components/AdminNav'

type Member = {
  id: number
  name: string
  email: string
  endDate: string
}

interface AdminDashboardClientProps {
  user: NonNullable<Session['user']>
}

export default function AdminDashboardClient({ user }: AdminDashboardClientProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [expiring, setExpiring] = useState<Member[]>([])

  useEffect(() => {
    fetch('/api/admin/members')
      .then((res) => res.json())
      .then(setMembers)

    fetch('/api/admin/expiring')
    .then((res)=> res.json())
    .then(setExpiring)
  }, [])

  const getStatus = (endDate: string) => {
    return new Date(endDate) >= new Date() ? '✅ Active' : '❌ Expired'
  }

  return (
    <>
      <AdminNav />
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        {/* Expiring Soon */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Expiring Soon (Next 7 Days)</h2>
          {expiring.length === 0 ? (
            <p>No memberships expiring soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {expiring.map((m) => (
                <div key={m.id} className="border p-4 rounded shadow">
                  <p><strong>Name:</strong> {m.name}</p>
                  <p><strong>Email:</strong> {m.email}</p>
                  <p><strong>End Date:</strong> {new Date(m.endDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* All Members */}
        <section>
          <h2 className="text-xl font-semibold mb-2">All Members</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {members.map((m) => (
              <div key={m.id} className="border p-4 rounded shadow">
                <p><strong>Name:</strong> {m.name}</p>
                <p><strong>Email:</strong> {m.email}</p>
                <p><strong>End Date:</strong> {new Date(m.endDate).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {getStatus(m.endDate)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
} 