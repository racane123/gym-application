import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config'
import { redirect } from 'next/navigation'
import RenewalHistoryClient from './RenewalHistoryClient'

export default async function RenewalHistory() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  return <RenewalHistoryClient />
}
