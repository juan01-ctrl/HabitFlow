import { Button } from '@nextui-org/react'
import Image      from 'next/image'
import { signIn } from 'next-auth/react'
import toast      from 'react-hot-toast'

import { TRACKER } from '@/enums/paths'

function GoogleBtn () {
  const onSubmit = () => {
    signIn('google', { redirect: true, callbackUrl: TRACKER.ROOT })
      .then((res) => {
        if (res?.error) {
          toast.error(res.error)
        }
      })
  }
  return (
    <Button
      className='flex items-center w-full bg-white border-1 rounded-md p-1.5 shadow-sm'
      type='button'
      onClick={onSubmit}
    >
      <Image
        alt='google'
        className='me-50'
        height='22'
        src='/imgs/google.svg'
        width='22'
      />
      <span>Continue with google</span>
    </Button>
  )
}

export default GoogleBtn
