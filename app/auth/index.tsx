'use client'

import { 
  Button, Card, CardBody, Divider, Input, InputProps
} from '@nextui-org/react'
import classNames                                         from 'classnames'
import Link                                               from 'next/link'
import { ChangeEvent, FormEvent, ReactElement, useState } from 'react'

import GoogleBtn from './components/Buttons/GoogleBtn'

interface Props {
  inputs: InputProps[]
  title: string
  subtitle?: string
  btnText: string
  onSubmit: (payload: any) => void
  redirect: {
    ask: string,
    link: string,
    linkText: string
  }
  extraActionComponent?: ReactElement
  withoutGoogleAuth?: boolean
}

function AuthLayout ({
  inputs, title, subtitle, btnText,
  extraActionComponent, redirect,
  withoutGoogleAuth, onSubmit
}: Props) {
  const [payload, setPayload] = useState({})

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPayload({
      ...payload,
      [name]: value
    })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(payload)
  }

  return (
    <div className="flex h-[100vh] w-full items-center justify-center bg-primary">
      <Card className='bg-white text-black rounded-md'>
        <CardBody className="p-8 w-[28rem]">
          <div className="h-full flex flex-col">
            <div className="grow w-full flex flex-col items-center justify-center">
              <div className="max-w-[30rem]">
                <div className={classNames('flex flex-col items-center', {
                  'mb-6': subtitle
                })}>
                  <h2 className="text-4xl mb-4 text-center">{title}</h2>
                  {!!subtitle && <span className="text-sm text-center w-[80%]">{subtitle}</span>}
                </div>
                {
                  !withoutGoogleAuth &&
                  <>
                    <div className='mb-2'>
                      <GoogleBtn />
                    </div>
                    <div className="flex items-center w-full gap-2">
                      <Divider className="w-auto flex grow" />
                      or
                      <Divider className="w-auto flex grow" />
                    </div>
                  </>
                }
                <form
                  className="flex flex-col gap-4 my-4 w-full"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <div className="flex flex-col gap-4">
                      {
                        inputs?.map((input) => (
                          <Input
                            onChange={onChange}
                            key={input.name}
                            isRequired={input.isRequired}
                            type={input.type}
                            name={input.name}
                            label={input.label}
                            size="sm"
                            className="w-full"
                          />
                        ))
                      }
                    </div>
                    <div className="flex w-full items-center justify-between mt-2">
                      {extraActionComponent}
                    </div>
                  </div>
                  <Button className="bg-black text-white" type='submit'>{btnText}</Button>
                  <div className="flex w-full items-center text-xs">
                    {redirect.ask}
                    <Link
                      href={redirect.link}
                      className="text-xs float-end ms-1 font-semibold"
                    >
                      {redirect.linkText}
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default AuthLayout
