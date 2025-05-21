import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboard() {
  const session = await getServerSession()

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/login')
  }

  return <AdminDashboardClient user={session.user} />
}

