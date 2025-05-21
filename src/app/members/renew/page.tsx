'use client'
import { getServerSession } from 'next-auth'
import { useState } from 'react'
import { redirect } from 'next/navigation'

export default async function MemberRenewPage() {
  const session = await getServerSession()
  if (!session) redirect('/login')
  const [months, setMonths] = useState(1)
  const [error, setError] = useState('')

  async function handleRenew() {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId: 1, months }), // Simulated member ID
      })
      
      if (!res.ok) {
        throw new Error('Failed to create checkout session')
      }

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Renew Membership</h2>
      <label className="block mb-2">
        Duration:
        <select
          className="ml-2 border p-1"
          value={months}
          onChange={(e) => setMonths(parseInt(e.target.value))}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} Month(s)
            </option>
          ))}
        </select>
      </label>
      <button
        onClick={handleRenew}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Pay & Renew
      </button>
      {error && (
        <p className="mt-4 text-red-600">{error}</p>
      )}
    </div>
  )
}