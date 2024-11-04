'use client'

import {
  Navbar as NextNavbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle
} from "@nextui-org/react";
import { usePathname }         from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { AUTH, TRACKER, HABITS, PROGRESS } from "@/enums/paths";

import { ThemeSwitcher } from "./ThemeSwitcher";

export default function Navbar() {
  const { status } = useSession()
  const pathname = usePathname()

  const isAuthenticated = status === 'authenticated'
  
  const navLinks = [
    {
      name: 'Tracker',
      href: TRACKER.ROOT 
    },
    {
      name: 'Habits',
      href: HABITS.ROOT
    },
    {
      name:'Progress',
      href: PROGRESS.ROOT
    } 
  ]


  console.log(isAuthenticated)

  return (
    <NextNavbar className="bg-white text-black shadow-lg">
      <NavbarBrand className="text-black">
        <p className="font-bold text-inherit">HabitFlow</p>
      </NavbarBrand>
      {
        isAuthenticated 
            && (
              <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {
                  navLinks.map(({ name, href }) => (
                    <NavbarItem key={name}  isActive={href === pathname}>
                      <Link color="primary" href={href}>
                        {name}
                      </Link>
                    </NavbarItem>
                  ) )
                }
              </NavbarContent>
            )
      }
      <NavbarContent justify="end">
        {
          isAuthenticated 
            ? 
            <div className="flex items-center gap-4">
              <NavbarItem>
                <ThemeSwitcher />
              </NavbarItem>
              <NavbarItem className="hidden lg:flex">
                <Button  color='primary' onClick={() => signOut()} >
                  Log Out
                </Button>
              </NavbarItem>
            </div>
            :
            <>
              <NavbarItem className="lg:flex">
                <Button as={Link} color="primary" href={AUTH.SIGN_IN} variant="bordered">
                  Log In
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Button as={Link} color="primary" href={AUTH.SIGN_UP}>
                    Sign Up
                </Button>
              </NavbarItem>
            </>
        }
      </NavbarContent>
      {
        isAuthenticated &&
          <>
            <NavbarMenuToggle
              className="sm:hidden"
            />
            <NavbarMenu>
              {
                navLinks.map((item, index) => (
                  <NavbarMenuItem key={`${item}-${index}`}>
                    <Link
                      color={
                        item?.href === pathname ? "primary" :  "foreground"
                      }
                      className="w-full cursor-pointer"
                      href={item?.href}
                      size="lg"
                    >
                      {item.name}
                    </Link>
                  </NavbarMenuItem>
                ))}
            </NavbarMenu>
          </>
      }
    </NextNavbar>
  );
}