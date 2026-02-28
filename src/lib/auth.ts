import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { getUserByEmail } from './database'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, _req) {
        if (!credentials || typeof credentials !== 'object') {
          return null
        }

        const creds = credentials as any

        if (!creds.email || !creds.password) {
          return null
        }

        try {
          const user = await getUserByEmail(creds.email)
          
          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            creds.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || ''
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
})
