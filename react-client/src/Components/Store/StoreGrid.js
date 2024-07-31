import React, { useContext, useState } from 'react'
import { StoreContext } from '../../Contexts/StoreContext'
import { MoonLoader } from 'react-spinners';
import ProductCard from './ProductCard';
import NotificationContainer from '../NotificationContainer';


const StoreGrid = ({ products, loading }) => {
    const { getVariantsByCategory, allVariants } = useContext(StoreContext);

    // Notifications
    const [notifications, setNotifications] = useState([])

    // Notification functions
    function addNotification(notification) {
        setNotifications([...notifications, [(notifications.length > 0) ? notifications[notifications.length - 1][0] + 1 : 0, notification]]);
    }

    function deleteNotification(index) {
        setNotifications([...notifications.filter((n) => n[0] !== index)])
    }


    return (
        <div id="store-grid" className="flex justify-center w-full min-h-screen pt-5 pb-2">

            {loading
                ?
                <MoonLoader speedMultiplier={0.3} color='rgb(15 23 42)' />
                :
                (products.length === 0
                    ?
                    <span>No products to display.</span>
                    :
                    <div id="store-grid-items"
                        className='mb-5 grid grid-cols-2 gap-3 px-2
                    md:grid-cols-3  md:mx-0
                    lg:grid-cols-4 lg:gap-5 lg:px-0 lg:items-stretch'>
                        {products.map(product => {
                            return (
                                <ProductCard
                                    key={product.mp_id}
                                    product={product}
                                    variants={allVariants ? getVariantsByCategory(allVariants, product.mp_pc_id) : []}
                                    addNotification={addNotification}
                                />
                            )
                        })}
                    </div>
                )
            }

            <NotificationContainer
                notifications={notifications} deleteNotification={deleteNotification}
                className='fixed flex flex-col-reverse gap-1 bottom-5 left-5 z-20 w-full' />
        </div >
    )
}

export default StoreGrid