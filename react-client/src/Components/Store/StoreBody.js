import React from 'react'
import { useLocation } from 'react-router-dom'
import StoreLandingPage from './StoreLandingPage'
import StoreCategory from './StoreCategory'
import ProductPage from './ProductPage'
import Cart from './Cart'

const StoreBody = () => {

    const location = useLocation()
    const subpath = location.pathname.split("/").slice(2);

    let content;
    if (subpath.length === 0) {
        console.log("lander");
        content = <StoreLandingPage />
    } else if (subpath[0] == "_c") {
        const id = subpath[1].split("-")[1].replace("C", "")
        content = <StoreCategory key={id} categoryId={id}/>
    } else if (subpath[0] == "_p") {
        const id = subpath[1].split("-")[1].replace("P", "")
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