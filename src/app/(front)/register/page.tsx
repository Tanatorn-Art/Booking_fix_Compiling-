'use client'
import { SessionProvider } from "next-auth/react"
import { Metadata } from 'next'
import Form from './Form'

export default function RegisterPage() {
  return (
    <SessionProvider>
      <Form />
    </SessionProvider>
  )
}
