"use client";

import { Moon, Sun } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';

const ToggleTheme = () => {
    const {theme, setTheme} = useTheme()
    const toggleFunc = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    };

  return (
    <Button
        variant={"outline"}
        size={"icon"}
        className='flex justify-center px-1'
        onClick={() => toggleFunc()}
    >
        <Moon 
        className='h-6 w-6 scale-100 dark:scale-0'
        />
        <Sun
        className='h-6 w-6 scale-0 dark:scale-100' 
        />
    </Button>
  )
}

export default ToggleTheme