import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DownCaret, UpCaret } from './Misc.js';

const NavigationBarItem = ({ label, path, link, children }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setIsActive(window.location.pathname.split("/").includes(path));
    },[location.pathname, path])

    const childIsActive = (childPath) => {
        return location.pathname.split("/").includes(childPath);
    }

    const contentWithChildren =
        <div className='flex flex-row flex-nowrap'>
            <span>
                {label}
            </span>
            {
                isOpen ? <UpCaret size='6' color={isHovered ? 'white' : (isActive ? 'black' : 'white')} className="mt-2 ml-2" />
                    : <DownCaret size='6' color={isHovered ? 'white' : (isActive ? 'black' : 'white')} className="mt-2 ml-2" />
            }
        </div>

    return (
        <>
            {children ?
                <div className={`navigation-bar-left-item ${isActive && " active"}`}
                    onMouseEnter={() => { setIsOpen(true); setIsHovered(true); }}
                    onMouseLeave={() => { setIsOpen(false); setIsHovered(false); }}>

                    {link ?
                        <Link to={path} onClick={() => setIsOpen(!isOpen)}>
                            {contentWithChildren}
                        </Link>
                        :
                        <div onClick={() => setIsOpen(!isOpen)}>
                            {contentWithChildren}
                        </div>
                    }

                    {isOpen &&
                        <div className="navigation-bar-left-item open">
                            {children.map((subItem, index) => (
                                <Link key={subItem.path} to={path + "/" + subItem.path}
                                    className={`navigation-bar-left-child ${childIsActive(subItem.path) ? "active " : ""}`}>
                                    <div className=''>{subItem.label}</div>
                                </Link>
                            ))}
                        </div>
                    }

                </div>
                :
                <Link to={path}
                    className={`navigation-bar-left-item ${isActive && " active"}`} >
                    {label}
                </Link>
            }
        </ >
    );
};

export default NavigationBarItem
