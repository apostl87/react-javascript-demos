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
    { label: "Product Portfolio Admin Panel", path: "product-portfolio-admin-panel", link: true },
    { label: "Store", path: "store", link: true },
    {
        label: "Other Demos", path: "demos", link: false,
        children: [
            // { label: "Public product portfolio (no login required)", path: "product-portfolio", link: true },
            { label: "Space game", path: "space-game", link: true },
            { label: "Calculator", path: "calculator", link: true },
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
    const breadcrumbRef = useRef(null);
    const navigationRef = useRef(null);
    const menuRef = useRef(null);
    const menuToggleRef = useRef(null);
    const [navigationHeight, setNavigationHeight] = useState(0);
    const [breadcrumbHeight, setBreadcrumbHeight] = useState(0);
    const location = useLocation();

    // Extracting path segments and handling "/"
    const pathSegments = location.pathname.split('/').filter(segment => segment !== "" && segment[0] !== '_');
    if (pathSegments.length === 0) {pathSegments.push("home")}

    // Open/close menu functions
    const toggleMenu = () => { setIsOpen(!isOpen) };

    // Resize observers
    useEffect(() => {
        const resizeObserver = new ResizeObserver(onResize);
        if (navigationRef.current) {
            resizeObserver.observe(navigationRef.current);
        }
        if (breadcrumbRef.current) {
            resizeObserver.observe(breadcrumbRef.current);
        }
        return () => resizeObserver.disconnect();
    }, [navigationRef, breadcrumbRef])

    function onResize(entries) {
        // Navigation bar
        let entry = entries[0];
        try {
            if (entry.contentRect.height + 2 * navigationPaddingTB != navigationHeight) {
                setNavigationHeight(entry.contentRect.height + 2 * navigationPaddingTB);
            }
        } catch (error) {
        }

        // Breadcrumb
        entry = entries[1];
        try {
            if (entry.contentRect.height + 2 * breadcrumbPaddingTB != breadcrumbHeight) {
                setBreadcrumbHeight(entry.contentRect.height + 2 * breadcrumbPaddingTB);
            }
        } catch (error) {
        }
    }


    // Styles that need to go here instead of the css files due to the resize observer
    const navigationPaddingTB = 6
    const navigationStyle = {
        paddingTop: `${navigationPaddingTB}px`,
        paddingBottom: `${navigationPaddingTB}px`,
    }
    const breadcrumbPaddingTB = 10
    const breadcrumbStyle = {
        paddingTop: `${breadcrumbPaddingTB}px`,
        paddingBottom: `${breadcrumbPaddingTB}px`,
        top: `${navigationHeight + 60}px`,
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
    }, [])

    return (
        <>
            <nav ref={navigationRef} className='navigation' style={navigationStyle}>
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

            {/* Divisor to block height used by the navigation bar plus banner */}
            < div style={{ marginTop: `${navigationHeight + 60}px` }}>
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
                                    children={item.children}
                                    toggleMenu={toggleMenu} />
                            );
                        })}
                    </div>
                </nav>
            }

            {/* Breadcrumb */}
            {/* {pathSegments.length > 0 && */}
                <>
                    <Breadcrumb refprop={breadcrumbRef} paths={findPathLabels(siteMap, pathSegments)} style={breadcrumbStyle} />
                    {/* Divisor to block height used by the breadcrumb */}
                    < div style={{ marginTop: `${breadcrumbHeight}px`, marginBottom: '0px' }}>
                    </div>
                </>
            {/* } */}

            {/* <div className='bg-green-500'>TESTCONTENT</div> */}
        </>
    )
}

export default Navigation