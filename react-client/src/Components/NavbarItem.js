import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DownCaret, UpCaret } from './Misc.js';

const NavbarItemCustom = ({ label, to, subMenu }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    function isActive(to) {
        return (window.location.pathname.split("/").includes(to));
    }

    return (
        <div className={(isActive(to) ? "navbar-item-active " : "") + "navbar-item hover:bg-gray-600 text-white rounded-md z-50"}
            onMouseEnter={() => {setIsOpen(true); setIsHovered(true);}}
            onMouseLeave={() => {setIsOpen(false); setIsHovered(false);}}>
            {!subMenu &&
                <Link to={to} onClick={window.location.reload}
                    className="navbar-link hover:no-underline text-inherit" >
                    {label}
                </Link>
            }

            {subMenu &&
                <div className='flex flex-rows flex-nowrap' onClick={() => setIsOpen(!isOpen)}>
                    <span>
                        {label}
                    </span>
                    {isOpen ? <UpCaret size='6' color={isHovered ? 'white' : (isActive(to) ? 'black' : 'white')} className="mt-2 ml-2" />
                        : <DownCaret size='6' color={isHovered ? 'white' : (isActive(to) ? 'black' : 'white')} className="mt-2 ml-2" />
                    }
                </div>
            }

            {subMenu && isOpen && (
                <div className="dropdown-menu absolute rounded-md p-1">
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
