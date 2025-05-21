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
  const [renewals, setRenewals] = useState<any[]>([])
  const [durations, setDurations] = useState<Record<number, number>>({})


  useEffect(() => {
    fetch('/api/admin/members')
      .then((res) => res.json())
      .then(setMembers)

    fetch('/api/admin/expiring')
      .then((res)=> res.json())
      .then(setExpiring)

    fetch('/api/admin/renewals')
      .then((res)=>{
        res.json()
      .then(setRenewals)
    })
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
                <label className="text-sm block mt-2">
                    Duration (months):
                    <select
                      value={durations[m.id] || 1}
                      onChange={(e) => setDurations({ ...durations, [m.id]: parseInt(e.target.value) })}
                      className="ml-2 p-1 border rounded"
                    >
                      {Array.from({ length: 12 }).map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </label>


                    <button
                      onClick={async () => {
                          const duration = durations[m.id] || 1
                          const res = await fetch(`/api/admin/renew/${m.id}`, {
                            method: 'POST',
                            body: JSON.stringify({ months: duration }),
                          })
                          if (res.ok) {
                            alert('Renewal successful!')
                            window.location.reload()
                          } else {
                            alert('Renewal failed')
                          }
                        }}
                        className="bg-green-600 text-white px-2 py-1 rounded mt-2"
                      >
                        Renew
                    </button>

                <div className="text-sm mt-2">
                  <strong>Renewal History:</strong>
                  <ul className="ml-4 list-disc">
                    {renewals
                      .filter((r) => r.memberId === m.id)
                      .map((r) => (
                        <li key={r.id}>
                          {new Date(r.renewedAt).toLocaleDateString()} — Extended to{' '}
                          {new Date(r.newEndDate).toLocaleDateString()}
                        </li>
                      ))}
                    {renewals.filter((r) => r.memberId === m.id).length === 0 && (
                      <li>No renewals yet.</li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>

        </section>
      </div>
    </>
  )
} 