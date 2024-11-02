'use client'

import Link       from 'next/link'
import { signIn } from 'next-auth/react'

import { AUTH, TRACKER } from '@/enums/paths'

import AuthLayout from '../'


function SignIn () {
  const inputs = [
    {
      isRequired: true,
      type: 'email',
      name: 'email',
      label: 'Email'
    },
    {
      isRequired: true,
      type: 'password',
      name: 'password',
      label: 'Password'
    }
  ]

  const onSubmit = async (payload: SubmitEvent) => {
    const credentialsSignIn = await signIn('credentials', {
      ...payload, callbackUrl: TRACKER.ROOT
    })
    console.log({ credentialsSignIn })
  }

  return (
    <AuthLayout
      onSubmit={onSubmit}
      redirect={{
        link: AUTH.SIGN_UP,
        ask: "Don't have account?",
        linkText: 'Sign up for free'
      }}
      inputs={inputs}
      extraActionComponent={<Link href={AUTH.FORGOT_PASSWORD} className="text-xs float-end">Forgot Password?</Link>}
      title="Welcome back!"
      subtitle="Welcome back! Please enter your details."
      btnText="Log In"
    />
  )
}

export default SignIn
