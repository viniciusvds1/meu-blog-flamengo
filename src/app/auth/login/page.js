'use client'

import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col items-center justify-center">
        <Link href="/" className="mb-8">
          <img 
            src="/assets/logooficialrubronews.png" 
            alt="RubroNews" 
            className="h-16 w-auto" 
          />
        </Link>
        
        <LoginForm />
      </div>
    </div>
  )
}
