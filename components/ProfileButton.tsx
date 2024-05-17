"use client"

import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { useSession } from 'next-auth/react'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { signOut } from 'next-auth/react'

const ProfileButton = () => {
    const { data: session, status } = useSession()
console.log(status, session);

    if (status === "unauthenticated") {
        return (
            <Link href={'/login'}>
                <Button variant='outline'>
                    Login
                </Button>
            </Link>
        )
    }

    const onLogout = () => {
        signOut()
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar >
                    <AvatarImage src={session?.user?.image || "/img/morty.jpg"} />
                    <AvatarFallback>{session?.user?.name}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    onClick={onLogout}
                    className='cursor-pointer'
                >Log Out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ProfileButton