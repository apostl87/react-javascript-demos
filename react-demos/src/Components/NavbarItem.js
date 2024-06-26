import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../static/css/NavigationItem.css';

const NavbarItemCustom = ({ label, to, subMenu }) => {
    const [isHovered, setIsHovered] = useState(false);

    function isActive(to) {
        return (window.location.pathname.split("/").includes(to));
    }

    return (
        <div
            className={(isActive(to) ? "navbar-item-active " : "") + "navbar-item hover:bg-gray-600 pt-2 pb-2 text-white rounded-md"}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {!subMenu ?
                <Link to={to} onClick={window.location.reload}
                    className="navbar-link hover:no-underline text-inherit" >
                    {label}
                </Link>
                :
                <>
                    {label}
                </>}

            {subMenu && isHovered && (
                <div className="dropdown-menu rounded-md">
                    {subMenu.map((subItem, index) => (
                        <Link key={subItem.to} to={to + "/" + subItem.to} onClick={window.location.reload}
                            className={(isActive(subItem.to) ? "dropdown-item-active " : "") + "dropdown-item rounded-md"}>
                            <div className='text-nowrap'>{subItem.label}</div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NavbarItemCustom
