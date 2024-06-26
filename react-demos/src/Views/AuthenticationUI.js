import React from "react";
import { NavbarContent, NavbarItem, Link } from "@nextui-org/react";
import { useAuth0 } from "@auth0/auth0-react";

export default function AuthenticationUI() {
    const { loginWithRedirect, logout, user, isLoading } = useAuth0();

    const logoutWithHistory = () => {
        logout({
            returnTo: window.location.pathname,
        })
    }

    if (!isLoading && !user) {
        return (
            <NavbarContent justify="end" className="text-white pt-3 gap-1">
                <Link onClick={() => loginWithRedirect({
                    appState: {
                        returnTo: window.location.pathname
                    }
                })}
                    href="" className="text-black hover:text-gray-300 hover:no-underline">
                    <NavbarItem className="lg:flex bg-white hover:bg-gray-600 pt-0 pb-0 pl-2 pr-2 rounded-md">
                        Login
                    </NavbarItem>
                </Link>
                {/* <Link href="" className="text-black hover:text-gray-300 hover:no-underline">
                    <NavbarItem className="lg:flex bg-gray-400 hover:bg-gray-600 pt-0 pb-0 pl-2 pr-2 rounded-md">
                        Sign Up
                    </NavbarItem>
                </Link> */}
            </NavbarContent>)
    } else if (!isLoading && user) {
        return (
            <NavbarContent justify="end" className="text-white pt-3 gap-1">
                <div className="flex flex-col">
                    <div className="text-wrap">
                        <Link href="/profile" className="">({user.name})</Link>
                    </div>
                    <div align="right">
                        <Link onClick={logoutWithHistory} href="" className="text-black hover:text-gray-300 hover:no-underline float:right">
                            <NavbarItem className="lg:flex bg-white hover:bg-gray-600 pt-0 pb-0 mb-2 pl-2 pr-2 rounded-md">
                                Logout
                            </NavbarItem>
                        </Link>
                    </div>
                </div>
            </NavbarContent>
        )
    } else if (isLoading) {
        return (
            <NavbarContent justify="end" className="text-white pt-3 gap-1">
                <NavbarItem className="lg:flex bg-black pt-0 pb-0 pl-2 pr-2 rounded-md disabled nopointer">
                    Loading ...
                </NavbarItem>
            </NavbarContent>
        )
    }
}