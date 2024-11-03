// app/components/ThemeSwitcher.tsx
"use client";

import { MoonIcon, SunIcon }   from "@heroicons/react/24/outline";
import { useTheme }            from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) return null

  return (
    <div>
      <div className="rounded-full border-1 shadow-lg border-primary p-1.5 relative">
        <MoonIcon className="opacity-0 pointer-events-none" width={22} />      
          
        <MoonIcon 
          className={
            `absolute transition-opacity top-1.5 ${theme === 'dark' ? ' opacity-0 pointer-events-none' : ''}`
          }
          cursor='pointer'  
          onClick={() => setTheme('dark')} width={22}
        />
        <SunIcon
          className={
            `absolute transition-opacity top-1.5 ${theme === 'light' ? ' opacity-0 pointer-events-none' : ''}`
          } 
          cursor='pointer' 
          onClick={() => setTheme('light')} 
          width={22} />
      </div>
    </div>
  )
};