'use client'

import RegisterForm from '@/components/auth/RegisterForm'
import Link from 'next/link'

export default function RegisterPage() {
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
        
        <RegisterForm />
      </div>
    </div>
  )
}
