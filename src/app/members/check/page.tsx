'use client'

import { useState } from 'react'

export default function CheckMemberStatus() {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<null | { endDate: string, status: string }>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/members/check?email=${email}`)
    const data = await res.json()
    setResult(data)
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Check Membership Status</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Member Email"
          className="w-full p-2 border rounded"
          required
        />
        <button className="bg-blue-600 text-white p-2 rounded">Check Status</button>
      </form>

      {result && (
        <div className="mt-4 p-3 border rounded">
          <p><strong>End Date:</strong> {new Date(result.endDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {result.status === 'active' ? '✅ Active' : '❌ Expired'}</p>
        </div>
      )}
    </div>
  )
}
