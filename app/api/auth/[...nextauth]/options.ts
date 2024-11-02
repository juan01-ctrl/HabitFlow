/* eslint-disable no-unused-vars */
import { compare }                                              from 'bcrypt'
import NextAuth, { getServerSession, NextAuthOptions, Profile } from 'next-auth'
import CredentialsProvider                                      from 'next-auth/providers/credentials'
import GoogleProvider                                           from 'next-auth/providers/google'

import User      from '@/app/models/User'
import dbConnect from '@/lib/dbConnect'

import AuthService from '../service'

const authService = new AuthService()

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 8 // 8 hour
  },
  pages: {
    signIn: '/auth/sign-in'
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          access_type: 'offline',
          prompt: 'consent',
          response_type: 'code'
        }
      },
      profile: async (profile: Profile) => {
        const account = await authService.signInWithGoogle(profile!)
        return ({
          id: account._id,
          username: account.username,
          email: account.email
        })
      }
    }),
    CredentialsProvider({
      async authorize (credentials?: Record<'email' | 'password', string>) {
        try {
          await dbConnect()

          const { email, password } = credentials || {}
          if (!email || !password) { return null }
          
          const existingUser = await User.findOne({
            where: { email: credentials?.email }
          })

          if (!existingUser) {
            return null
          }

          const passwordMatch = await compare(password, existingUser.password)

          if (!passwordMatch) { return null }

          return {
            id: existingUser._id + '',
            username: existingUser.username,
            email: existingUser.email
          }
        } catch (error) {
          console.log(error)
          return null
        }
      },
      credentials: {
        email: { label: 'Email', placeholder: 'hello@wortise.com', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      name: 'Credentials'
    })
  ],
  callbacks: {
    // async signIn ({ account, profile }) {
    //   // if (account.provider === 'google') {
    //   //   return profile.email_verified && profile.email.endsWith('@example.com')
    //   // }
    //   return true // Do different verification for other providers that don't have `email_verified`
    // },
    async jwt ({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          username: user?.username || user.name,
          email: user.email
        }
      }
      return token
    },
    async session ({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username
        }
      }
    }
  }
}

export const getSession = () => getServerSession(authOptions)

export default NextAuth(authOptions)
