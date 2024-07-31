import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import StoreLandingPage from './StoreLandingPage'
import StoreCategory from './StoreCategory'
import StoreAll from './StoreAll'
import { StoreContext } from '../../Contexts/StoreContext'
import ProductPage from './ProductPage'
import Cart from './Cart'
import { NoDatabaseConnection } from '../Misc'

const StoreBody = () => {

    const location = useLocation()

    const { dbConnection } = useContext(StoreContext)

    // Path parser
    const subpath = location.pathname.split("/").slice(2);
    let content;
    if (!dbConnection) {
        content = <NoDatabaseConnection />
    } else if (subpath.length === 0) {
        content = <StoreLandingPage />
    } else if (subpath[0] == "all-categories") {
        content = <StoreAll />
    } else if (subpath[0] == "_c") {
        const id = subpath[1].split("-").at(-1).substring(1)
        content = <StoreCategory key={id} categoryId={id}/>
    } else if (subpath[0] == "_p") {
        const id = subpath[1].split("-").at(-1).substring(1)
        content = <ProductPage productId={id}/>
    } else if (subpath[0] == "cart") {
        content = <Cart />
    }

    return (
        <div className='bg-white min-h-screen'>
            {content}
        </div>
    )
}

export default StoreBody