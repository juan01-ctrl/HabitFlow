'use client'

import { Checkbox }  from '@nextui-org/react'
import axios         from 'axios'
import { useRouter } from 'next/navigation'

import { AUTH } from '@/enums/paths'

import AuthLayout from '../'


const inputs = [
  {
    isRequired: true,
    type: 'text',
    name: 'username',
    label: 'Username'
  },
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
  },
  {
    isRequired: true,
    type: 'password',
    name: 'confirmPassword',
    label: 'Confirm Password'
  }
]

function SignUp () {
  const router = useRouter()
  const onSubmit = async (payload) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...rest } = payload

    await axios.post('/api/user', rest)
      .then(() => router.push(AUTH.SIGN_IN))
      .catch((error) => { console.log({ SignUpError: error }) })
  }

  return (
    <AuthLayout
      inputs={inputs}
      extraActionComponent={
        <Checkbox size="sm" className="text-xs">
          <span className="text-xs text-black">
            I accept privacy policies
          </span>
        </Checkbox>
      }
      title="Create your account"
      subtitle="Create your account and start the adventure."
      redirect={{
        ask: 'Have account?',
        link: AUTH.SIGN_IN,
        linkText: 'Go to Login'
      }}
      btnText="Sign Up"
      onSubmit={onSubmit}
    />
  )
}

export default SignUp
