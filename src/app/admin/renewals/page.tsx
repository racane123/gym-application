import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import RenewalHistoryClient from './RenewalHistoryClient'

export default async function RenewalHistory() {
  const session = await getServerSession()

    if (!session?.user || (session.user as any).role !== 'admin') {
      redirect('/login')
  }

  return <RenewalHistoryClient />
}
