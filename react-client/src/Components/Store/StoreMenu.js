import React, { useContext, useEffect, useState, useRef } from 'react'
import { StoreContext } from '../../Contexts/StoreContext'
import CloseButtonGrey from '../../assets/button-close-grey.svg'
import CloseButtonBlack from '../../assets/button-close-black.svg'
import { MoonLoader } from 'react-spinners';
import '../../css/store.css'
import { Link } from 'react-router-dom'

const initMenuState = () => {
    if (window.location.pathname.split('/').slice(-1)[0] === 'store') {
        return true;
    } else {
        return false;
    }
}

const StoreMenu = () => {
    const { categories } = useContext(StoreContext)
    const [menuOpen, setMenuOpen] = useState(initMenuState);
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    const closeIfClickedOutside = (event) => {
        if (!menuRef.current?.contains(event.target)) {
            toggleMenu();
        }
    }

    useEffect(() => {
        if (menuOpen) {
            document.addEventListener('mousedown', closeIfClickedOutside)
        }
        return () => {
            document.removeEventListener('mousedown', closeIfClickedOutside)
        }
    }, [menuOpen])

    return (
        <>
            {menuOpen ?
                <div id='store-menu' ref={menuRef} className="absolute flex flex-col items-center justify-start z-20 w-52 text-md font-bold">
                    <div className='w-full flex items-center justify-between'>
                        <Link to="all-categories"
                            className='border border-gray-800 my-0 p-1 rounded-md m-4 bg-slate-700 text-white
                                        w-full hover:no-underline hover:text-gray-700 hover:bg-slate-200 text-center'
                            onClick={toggleMenu}>
                            All Categories
                        </Link>
                        <img id="store-menu-close" src={CloseButtonGrey} className='h-10 w-10 cursor-pointer pr-2'
                            onMouseOver={() => document.getElementById('store-menu-close').src = CloseButtonBlack}
                            onMouseLeave={() => document.getElementById('store-menu-close').src = CloseButtonGrey}
                            onClick={toggleMenu}>
                        </img>
                    </div>
                    <div id="store-menu-items" className='w-full flex flex-col gap-0 text-center'>
                        {categories
                            ?
                            categories.map((category) => {
                                return (
                                    <Link to={'_c/' + category.pc_category_name.toLowerCase() + '-C' + category.pc_id}
                                        className='border-t last-of-type:border-b border-gray-800 my-0 py-2 pl-2 mr-2
                                                hover:no-underline text-gray-700 hover:text-gray-700 hover:bg-slate-200'
                                        onClick={toggleMenu}
                                        key={category.pc_id}
                                    >
                                        {category.pc_category_name}
                                    </Link>
                                )
                            })
                            :
                            <MoonLoader speedMultiplier={0.3} color='rgb(15 23 42)' />

                        }
                    </div>
                </div>
                :
                <div className='text-center text-3xl font-bold rounded-t-none rounded-b-md
                bg-white flex items-baseline
                px-2 pb-1 min-w-12 cursor-pointer
                text-gray-500 hover:text-black'
                    onClick={toggleMenu}>
                    ☰
                </div>
            }

            {/* Background div for menu */}
            <div id='store-menu-background'
                className={`fixed bg-slate-300 h-screen z-10 top-0 transition-all
                            ${menuOpen ? 'w-52' : 'w-0'}`}
            >
            </div >
        </>
    )
}

export default StoreMenu