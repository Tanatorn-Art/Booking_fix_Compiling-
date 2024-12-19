'use client'
import { SessionProvider } from "next-auth/react"
import AuthRegister from "../auth/AuthRegister"

export default function Register() {
  return (
    <SessionProvider>
      <AuthRegister
        title="Sign Up"
        subtitle={<>Already have an account? </>}
      />
    </SessionProvider>
  )
}
