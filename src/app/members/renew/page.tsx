'use client'

import { useState } from 'react'

export default function RenewMember() {
  const [email, setEmail] = useState('')
  const [months, setMonths] = useState(1)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/members/renew', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, months }),
    })

    const data = await res.json()
    setMessage(data.message || 'Error processing renewal')
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Renew Membership</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Member Email"
          required
          className="w-full p-2 border rounded"
        />
        <select
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          className="w-full p-2 border rounded"
        >
          <option value={1}>1 Month</option>
          <option value={3}>3 Months</option>
          <option value={6}>6 Months</option>
          <option value={12}>12 Months</option>
        </select>
        <button type="submit" className="bg-green-600 text-white p-2 rounded">
          Renew
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  )
}
