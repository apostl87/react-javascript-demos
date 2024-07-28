import React from 'react'
import { useLocation } from 'react-router-dom'
import StoreLandingPage from './StoreLandingPage'
import StoreCategory from './StoreCategory'
import StoreProduct from './StoreProduct'
import Cart from './Cart'

const StoreBody = () => {

    const location = useLocation()
    const subpath = location.pathname.split("/").slice(2);

    if (!subpath) {
        return <StoreLandingPage />
    }

    if (subpath[0] == "_c") {
        const id = subpath[1].split("-")[1].replace("C", "")
        return <StoreCategory key={id} categoryId={id}/>
    }

    if (subpath[0] == "_p") {
        const id = subpath[1].split("-")[1].replace("P", "")
        return <StoreProduct productId={id}/>
    }

    if (subpath[0] == "cart") {
        return <Cart />
    }
}

export default StoreBody