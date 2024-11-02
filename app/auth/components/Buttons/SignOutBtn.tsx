'use client'

import { signOut, useSession } from 'next-auth/react'

import { AUTH } from '@/enums/paths'

export function SignOutBtn () {
  const { data } = useSession()
  const haveActiveSession = data?.user

  if (!haveActiveSession) {
    return null
  }

  return (
    <button
      className='text-white'
      onClick={() => signOut({ callbackUrl: AUTH.SIGN_IN, redirect: true })}
    >
      Signout
    </button>
  )
}
