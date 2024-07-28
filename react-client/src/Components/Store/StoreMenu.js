import React, { useContext, useState } from 'react'
import { StoreContext } from '../../Contexts/StoreContext'
import CloseButtonGrey from '../../assets/button-close-grey.svg'
import CloseButtonBlack from '../../assets/button-close-black.svg'
import '../../css/store.css'
import { Link } from 'react-router-dom'

const StoreMenu = () => {
    const { categories } = useContext(StoreContext)
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    return (
        <>
            <div id='store-menu' className="flex flex-col items-center justify-start z-20">
                {menuOpen ?
                    <div className='w-full my-2 flex items-center justify-between px-2' onClick={toggleMenu}>
                        <span className=''>
                            {/* Insert image here */}
                        </span>
                        <img id="store-menu-close" src={CloseButtonGrey} className='h-10 w-10 cursor-pointer'
                            onMouseOver={() => document.getElementById('store-menu-close').src = CloseButtonBlack}
                            onMouseLeave={() => document.getElementById('store-menu-close').src = CloseButtonGrey}
                            onClick={toggleMenu}>
                        </img>
                    </div>
                    :
                    <div className='text-xl text-center font-bold bg-slate-100 rounded-t-none rounded-b-md grid px-2 pb-2 min-w-20 cursor-pointer'
                        onClick={toggleMenu}>
                        <span className='text-3xl'>
                            ☰
                        </span>
                        <span className='text-xs'>
                            Menu
                        </span>
                    </div>
                }
                {menuOpen &&
                    <div id="store-menu-items" className='flex flex-col gap-0 z-20 w-52 text-md font-bold text-center'>
                        {categories.map((category) => {
                            return (
                                <Link to={'_c/' + category.pc_category_name.toLowerCase() + '-C' + category.pc_id}
                                    className='border-t last-of-type:border-b border-gray-800 my-0 py-2 pl-2
                                                hover:no-underline text-gray-700 hover:text-gray-700 hover:bg-slate-200'
                                    onClick={toggleMenu}
                                    key={category.pc_id}
                                >
                                    {category.pc_category_name}
                                </Link>
                            )
                        })}
                    </div>
                }
            </div >
            {/* Background div for menu */}
            <div id='store-menu-background'
                className={`fixed bg-slate-100 h-screen z-10 top-0 transition-all
                            ${menuOpen ? 'w-52' : 'w-0'}`
                }
                onClick={toggleMenu} >
            </div >
        </>
    )
}

export default StoreMenu