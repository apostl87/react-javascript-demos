import { React, useState, useRef } from "react";
import { NavbarContent, NavbarItem, Link } from "@nextui-org/react";
import { useAuth0 } from "@auth0/auth0-react";
import iconUser from "../media/icon-user.png"

export default function UserArea() {
    const { loginWithRedirect, logout, user, isLoading } = useAuth0();
    const [userAreaOpen, setUserAreaOpen] = useState(false);
    const userArea = useRef(null)
    const userAreaIcon = useRef(null)

    function toggleuserArea() {
        setUserAreaOpen(!userAreaOpen)
    }

    const closeUserArea = (e)=>{
        if(userAreaOpen && !userArea.current?.contains(e.target) && !userAreaIcon.current?.contains(e.target)){
          setUserAreaOpen(false)
        }
    }
    document.addEventListener('mousedown', closeUserArea)

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
            </NavbarContent>)
    } else if (!isLoading && user) {
        return (
            <NavbarContent justify="end" className="text-white pt-3">
                <div ref={userAreaIcon} className="flex flex-col">
                    <img src={iconUser} alt="icon-user" className="h-10 cursor-pointer" onClick={toggleuserArea}></img>
                </div>
                {userAreaOpen &&
                    <div ref={userArea} className="user-area">
                        <div className="user-area-info">
                            Logged in as <br />{user.name}
                        </div>
                        <button href="/profile" className="user-area-link">
                            <div align="right">
                                Profile
                            </div>
                        </button>
                        <button onClick={logoutWithHistory} className="user-area-link">
                            <div className="text-right">
                                Logout
                            </div>
                        </button>
                    </div>
                }
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