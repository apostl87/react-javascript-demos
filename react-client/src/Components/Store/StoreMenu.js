import React, { useContext, useEffect, useState, useRef } from 'react'
import { StoreContext } from '../../Contexts/StoreContext'
import CloseButtonGrey from '../../assets/button-close-grey.svg'
import CloseButtonBlack from '../../assets/button-close-black.svg'
import '../../css/store.css'
import { Link } from 'react-router-dom'

const StoreMenu = () => {
    const { categories } = useContext(StoreContext)
    const [menuOpen, setMenuOpen] = useState(false);
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
                <div id='store-menu' ref={menuRef} className="absolute flex flex-col items-center justify-start z-20 w-52">
                    <div className='w-full my-2 flex items-center justify-between px-2'>
                        <span className=''>
                            {/* Insert image here */}
                        </span>
                        <img id="store-menu-close" src={CloseButtonGrey} className='h-10 w-10 cursor-pointer'
                            onMouseOver={() => document.getElementById('store-menu-close').src = CloseButtonBlack}
                            onMouseLeave={() => document.getElementById('store-menu-close').src = CloseButtonGrey}
                            onClick={toggleMenu}>
                        </img>
                    </div>
                    <div id="store-menu-items" className='flex flex-col gap-0 z-20 w-full text-md font-bold text-center'>
                        {categories.map((category) => {
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
                        })}
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
                className={`fixed bg-slate-100 h-screen z-10 top-0 transition-all
                            ${menuOpen ? 'w-52' : 'w-0'}`}
            >
            </div >
        </>
    )
}

export default StoreMenu