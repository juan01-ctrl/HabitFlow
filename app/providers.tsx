'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Session }                     from 'next-auth'
import { SessionProvider }                  from 'next-auth/react'
import React, { PropsWithChildren }         from 'react'

interface Props extends PropsWithChildren{
    session: Session | null
}

const queryClient = new QueryClient()

export function Providers({ session, children }: Props)  {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  )
}


