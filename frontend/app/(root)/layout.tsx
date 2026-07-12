import { Chilanka } from 'next/font/google'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import Image from 'next/image'


const RootLayout = ({ children }: { children: ReactNode}) => {
  return (
    <div className='root-layout'>
      <nav>

        <Link href='/' className='flex items-center gap-2 '/>
        <h2 className='text-primary-100'>InterviewPrep</h2>
      </nav>
      {children}
    </div>
  )
}

export default RootLayout
