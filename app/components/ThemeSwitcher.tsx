// app/components/ThemeSwitcher.tsx
"use client";

import { MoonIcon, SunIcon }            from "@heroicons/react/24/outline";
import { Switch, SwitchThumbIconProps } from "@nextui-org/react";
import { useTheme }                     from "next-themes";
import { useEffect, useState }          from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) return null

  const handleSwitch = ({ isSelected, className }: SwitchThumbIconProps) => {
    if(isSelected) {
      setTheme('light')
      return  <SunIcon className={`${className} p-0.5`}/>
    } 
    setTheme('dark')
    return <MoonIcon className={`${className} p-0.5`} />
    
  }

  return (
    <Switch
      className="pt-1"
      size="lg"
      defaultSelected={theme === 'light'}
      thumbIcon={handleSwitch}
    />

  )
};