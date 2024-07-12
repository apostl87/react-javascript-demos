import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import UserArea from './UserArea';
import NavigationBarItem from "./NavigationBarItem";
import NavigationMenuItem from "./NavigationMenuItem";
import Breadcrumb from './Breadcrumb';
import findPathLabels from '../Utils/findPathLabels';
import '../css/navigation.css';

// The following array defines the entries of the navigation bar and the menu
let siteMap = [
    { label: "Home", path: "home", link: true },
    { label: "Retailer product portfolio", path: "merchant-product-portfolio", link: true },
    { label: "Store", path: "store", link: true },
    {
        label: "Other Demos", path: "demos", link: false,
        children: [
            { label: "Public product portfolio (no login required)", path: "product-portfolio", link: true },
            { label: "Space game", path: "space-game", link: true },
        ]
    },

    { label: "Contact", path: "contact", link: true },
];
// Pages for development and testing purposes
if (process.env.NODE_ENV === 'development') {
    siteMap.push(
        {
            label: "Developer area", path: "devarea", link: false,
            children: [
                { label: "Token service and request service", path: "01", link: true },
                { label: "Other", path: "02", link: true }
            ]
        },
    )
}

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigationRef = useRef(null);
    const menuRef = useRef(null);
    const menuToggleRef = useRef(null);
    const [height, setHeight] = useState(0);
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(segment => segment !== "");

    // Open/close menu functions
    const toggleMenu = () => { setIsOpen(!isOpen) };

    // Resize observers
    useEffect(() => {
        const resizeObserver = new ResizeObserver(onResize);
        if (navigationRef.current) {
            resizeObserver.observe(navigationRef.current);
        }
    })
    function onResize(entries) {
        const entry = entries[0];
        if (entry.contentRect.height + 2 * paddingTB != height) {
            setHeight(entry.contentRect.height + 2 * paddingTB);
        }
    }

    // Styles that need to go here instead of the css files due to the resize observer
    const paddingTB = 6
    const navigationStyles = {
        paddingTop: `${paddingTB}px`,
        paddingBottom: `${paddingTB}px`,
    }
    const breadcrumbStyle = {
        position: 'fixed',
        top: `${height}px`,
        width: '100%',
        zIndex: 900,
    }

    // Listener and callback function for closing the menu if clicked outside
    const closeIfClickedOutside = (e) => {
        if (!menuRef.current?.contains(e.target) &&
            !menuToggleRef.current?.contains(e.target)) {
            setIsOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", closeIfClickedOutside);
    })

    return (
        <>
            <nav ref={navigationRef} className='navigation' style={navigationStyles}>
                <div ref={menuToggleRef} className={`navigation-menu-toggle ${(isOpen ? 'open' : '')}`}
                    onClick={toggleMenu}>
                    {isOpen ? '✕' : '☰'}
                </div>

                {/* Left hand section of Navigation Bar */}
                <div className='navigation-bar-left'>
                    {siteMap.map((item, index) => {
                        return (
                            <NavigationBarItem key={index}
                                label={item.label}
                                path={item.path}
                                link={item.link}
                                children={item.children} />
                        );
                    })}
                </div>

                {/* Right hand section of Navigation Bar */}
                <div className='navigation-bar-right'>
                    <UserArea />
                </div>

            </nav >

            {/* Divisor to block height used by the navigation bar */}
            < div style={{ marginTop: `${height}px` }}>
            </div>

            {/* Navigation menu */}
            {isOpen &&
                <nav>
                    <div id='navigation-menu-overlay' />
                    <div ref={menuRef} className='navigation-menu'>
                        {siteMap.map((item, index) => {
                            return (
                                <NavigationMenuItem key={index}
                                    label={item.label}
                                    path={item.path}
                                    link={item.link}
                                    children={item.children} />
                            );
                        })}
                    </div>
                </nav>
            }

            {/* Breadcrumb */}
            {findPathLabels(siteMap, pathSegments).length > 0 &&
                <>
                    <div style={breadcrumbStyle}>
                        <Breadcrumb paths={findPathLabels(siteMap, pathSegments)} />
                    </div>
                    {/* Divisor to block height used by the breadcrumb */}
                    < div style={{ marginTop: `${40}px` }}>
                    </div>
                </>
            }

            {/* <div className='bg-green-500'>TESTCONTENT</div> */}
        </>
    )
}

export default Navigation