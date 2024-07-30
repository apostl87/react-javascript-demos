import React from 'react'
import { useLocation } from 'react-router-dom'
import StoreLandingPage from './StoreLandingPage'
import StoreCategory from './StoreCategory'
import StoreAll from './StoreAll'
import ProductPage from './ProductPage'
import Cart from './Cart'

const StoreBody = () => {

    const location = useLocation()

    // Path parser
    const subpath = location.pathname.split("/").slice(2);
    let content;
    if (subpath.length === 0) {
        content = <StoreLandingPage />
    } else if (subpath[0] == "all-categories") {
        content = <StoreAll />
    } else if (subpath[0] == "_c") {
        const id = subpath[1].split("-").at(-1).substring(1)
        content = <StoreCategory key={id} categoryId={id}/>
    } else if (subpath[0] == "_p") {
        const id = subpath[1].split("-").at(-1).substring(1)
        console.log(id);
        content = <ProductPage productId={id}/>
    } else if (subpath[0] == "cart") {
        content = <Cart />
    }

    return (
        <div className='bg-white min-h-full'>
            {content}
        </div>
    )
}

export default StoreBody