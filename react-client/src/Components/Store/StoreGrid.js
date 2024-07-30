import React, { useContext } from 'react'
import { StoreContext } from '../../Contexts/StoreContext'
import { MoonLoader } from 'react-spinners';
import ProductCard from './ProductCard'

const StoreGrid = ({ products, loading }) => {
    const { getVariantsByCategory, allVariants } = useContext(StoreContext);

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
                                />
                            )
                        })}
                    </div>
                )
            }
        </div >
    )
}

export default StoreGrid