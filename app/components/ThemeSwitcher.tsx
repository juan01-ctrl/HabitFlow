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

  const handleThemeToggle = () => {
    console.log('theme', theme)
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSwitch = ({ isSelected, className }: SwitchThumbIconProps) => {
    return isSelected
      ? <SunIcon className={`${className} p-0.5`}/>
      : <MoonIcon className={`${className} p-0.5`} />
    
  }

  return (
    <Switch
      className="pt-1"
      size="lg"
      onChange={handleThemeToggle}
      defaultSelected={theme === 'light'}
      thumbIcon={handleSwitch}
    />

  )
};