'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')

  async function handleSubmit(e: any) {
    e.preventDefault()
    await signIn('email', { email, callbackUrl: '/members' })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Member Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full p-2 border rounded mb-4"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
        Login
      </button>
    </form>
  )
}
