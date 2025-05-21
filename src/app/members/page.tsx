'use client'

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

export default async function MembersPage() {
  const session = await getServerSession()

  if (!session?.user || (session.user as any).role !== 'admin') {
    redirect('/login')
  }

  return <div>This is the Members Page Dashboard</div>
}
