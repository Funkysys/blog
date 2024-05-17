import React from 'react'
import FirstTitle from './FirstTitle'
import { HeaderNavigation } from './HeaderNavigation'

const Footer = () => {
    return (
        <footer className='p-4 border-t'>
            <div className='flex items-center justify-between'>
                <FirstTitle />
                <div className='flex items-center justify-center m-5 p-5 w-full'>
                    <HeaderNavigation />
                </div>
            </div>
        </footer>
    )
}

export default Footer