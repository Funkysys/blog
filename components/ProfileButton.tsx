import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

const ProfileButton = () => {
  return (
    <Link href={'/login'}>
        <Button variant='outline'>
            Login
        </Button>
    </Link>    
)
}

export default ProfileButton