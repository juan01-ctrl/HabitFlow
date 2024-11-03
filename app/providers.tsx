'use client'

import {NextUIProvider}                     from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Session }                     from 'next-auth'
import { SessionProvider }                  from 'next-auth/react'
import { ThemeProvider }                    from "next-themes";
import  { PropsWithChildren }               from 'react'

interface Props extends PropsWithChildren{
    session: Session | null
}


const queryClient = new QueryClient()



export function Providers({ session, children }: Props)  {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            {children}
          </ThemeProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}


