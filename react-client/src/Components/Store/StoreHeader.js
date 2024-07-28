import React, { useContext } from 'react'
import StoreMenu from './StoreMenu'
import cart_icon from '../../assets/cart_icon.png'
import { StoreContext } from '../../Contexts/StoreContext'
import { Link } from 'react-router-dom'

const StoreHeader = () => {
    const { cartItems, getAmountCartItems } = useContext(StoreContext);

    return (
        <div className='w-full bg-white h-11 z-15 flex border-b-2 justify-between px-1'>
            <div>
                <StoreMenu />
            </div>
            {/* {JSON.stringify(cartItems)} */}
            <div className='py-1 pr-5'>
                <Link to="/store/cart"><img src={cart_icon} className="h-8 w-8" alt="cart" /></Link>
                <div className="store-cart-count">{getAmountCartItems()}</div>
            </div>
        </div>
    )
}

export default StoreHeader