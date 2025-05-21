import NextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import EmailProvider from 'next-auth/providers/email'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      sendVerificationRequest: async ({ identifier, url }) => {
        try {
          await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: identifier,
            subject: 'Your Gym Login Link',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #2563eb; margin-bottom: 20px;">Welcome to Your Gym!</h2>
                <p style="color: #333; font-size: 16px; line-height: 1.5;">Click the button below to sign in to your account:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${url}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Sign In</a>
                </div>
                <p style="color: #666; font-size: 14px;">If you didn't request this email, you can safely ignore it.</p>
                <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
              </div>
            `,
          })
        } catch (error) {
          console.error('Error sending email:', error)
          throw new Error('Failed to send verification email')
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user?.email) {
        const userInDb = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (userInDb) {
          (session.user as any).role = userInDb.role;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    }
  },
})

export { handler as GET, handler as POST }
