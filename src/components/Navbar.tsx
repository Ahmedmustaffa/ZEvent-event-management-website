"use client";

import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarToggle,
} from "flowbite-react";

import { DarkThemeToggle } from "flowbite-react";
import { Logo } from "@/src/components/Logo";
import { useAuth } from "../context/AuthContext";
import { LoadingPage } from "./LoadingPage";
import { useRouter } from "next/navigation";

export function NavbarComponent() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const handleRouting = (route: string) => {
    router.push(`/my/${route}`);
  };
  if (loading) return <LoadingPage></LoadingPage>;
  return (
    <Navbar
      fluid
      className="sticky top-0 z-40 shadow-[0_4px_6px_2px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_6px_2px_rgba(0,0,0,0.3)]"
    >
      <NavbarBrand href="/">
        <Logo />
      </NavbarBrand>
      <div className="flex gap-2 md:order-2">
        <DarkThemeToggle className="cursor-pointer" />
        {user ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img={user.avatar}
                rounded
                className="cursor-pointer"
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">{user.fullName}</span>
              <span className="block truncate text-sm font-medium">
                {user.email}
              </span>
            </DropdownHeader>
            <DropdownItem onClick={() => handleRouting("tickets")}>
              My tickets
            </DropdownItem>
            <DropdownItem onClick={() => handleRouting("profile")}>
              My profile
            </DropdownItem>
            <DropdownItem onClick={() => handleRouting("events")}>
              My events
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem onClick={logout}>Sign out</DropdownItem>
          </Dropdown>
        ) : (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img="/usericon.svg"
                rounded
                className="cursor-pointer"
              />
            }
          >
            <DropdownItem href="/login">Sign in</DropdownItem>
          </Dropdown>
        )}

        <NavbarToggle className="cursor-pointer" />
      </div>
    </Navbar>
  );
}
