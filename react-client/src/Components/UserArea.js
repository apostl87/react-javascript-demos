import { React, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import iconUser from "../media/icon-user.png";

export default function UserArea() {
    const { loginWithRedirect, logout, user, isLoading } = useAuth0();
    const navigate = useNavigate();
    const [userAreaOpen, setUserAreaOpen] = useState(false);
    const userArea = useRef(null);
    const userAreaIcon = useRef(null);

    function toggleUserArea() {
        setUserAreaOpen(!userAreaOpen);
    }

    // Listener and callback functions for when user clicks outside of the user area
    const closeIfClickedOutside = (e) => {
        if (userAreaOpen &&
            !userArea.current?.contains(e.target) &&
            !userAreaIcon.current?.contains(e.target)) {
            setUserAreaOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", closeIfClickedOutside);
    })

    if (!isLoading && !user) {
        return (
            <div
                className="navigation-bar-right-item"
                onClick={() => loginWithRedirect({
                    appState: {
                        returnTo: window.location.pathname,
                    },
                })}
            >
                Login
            </div>
        );
    } else if (!isLoading && user) {
        return (
            <div>
                <div className='w-12 h-12 cursor-pointer'
                    ref={userAreaIcon}
                    onClick={toggleUserArea}
                >
                    <img src={iconUser} alt="icon-user" />
                </div>
                {userAreaOpen && (
                    <div ref={userArea} className="user-area">
                        <div className="user-area-info">
                            Logged in as <br />{user.name}
                        </div>
                        <div align="right">–––––––––––––––––––––––</div>
                        <button
                            className="user-area-link"
                            onClick={() => navigate("/profile")}
                        >
                            <div className="text-right">Profile</div>
                        </button>
                        <button
                            className="user-area-link"
                            onClick={() =>
                                logout({
                                    logoutParams: { returnTo: window.location.origin },
                                })
                            }
                        >
                            <div className="text-right">Logout</div>
                        </button>
                    </div>
                )}
            </div>
        );
    } else if (isLoading) {
        return (
            <div className="navigation-bar-right-item">
                <div className="user-area-loading">Loading ...</div>
            </div>
        );
    }
}