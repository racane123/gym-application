import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const { username, password } = credentials ?? {}

        // Replace with your admin credentials
        const adminUser = {
          id: 'admin-1',
          name: 'Admin',
          username: 'admin',
          password: 'gym1234',
        }

        if (username === adminUser.username && password === adminUser.password) {
          return { id: adminUser.id, name: adminUser.name }
        }

        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
} 