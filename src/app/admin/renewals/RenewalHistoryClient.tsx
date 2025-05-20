'use client'

import { useEffect, useState } from 'react'
import AdminNav from '../components/AdminNav'

type Renewal = {
  id: number
  months: number
  newEndDate: string
  renewedAt: string
  member: { name: string, email: string }
}

export default function RenewalHistoryClient() {
  const [renewals, setRenewals] = useState<Renewal[]>([])

  useEffect(() => {
    fetch('/api/admin/renewals')
      .then(res => res.json())
      .then(setRenewals)
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-4">

      <h1 className="text-2xl font-bold mb-6">Renewal History</h1>
      <div className="space-y-4">
        {renewals.map(r => (
          <div key={r.id} className="p-4 border rounded shadow">
            <p><strong>Name:</strong> {r.member.name}</p>
            <p><strong>Email:</strong> {r.member.email}</p>
            <p><strong>Renewed At:</strong> {new Date(r.renewedAt).toLocaleDateString()}</p>
            <p><strong>Months Added:</strong> {r.months}</p>
            <p><strong>New End Date:</strong> {new Date(r.newEndDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 