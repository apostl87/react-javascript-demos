import React, { useState, useContext, useEffect } from 'react'
import { StoreContext } from '../../Contexts/StoreContext'
import { Link } from 'react-router-dom'

const ProductCard = (props) => {
    const { addToCart } = useContext(StoreContext)

    let product = props.product
    let variants = props.variants

    const [variantId, setVariantId] = useState(undefined)

    useEffect(() => {
        setVariantId(variants.length > 0 ? variants[0].pv_id : undefined);
    }, [variants]);

    return (
        <div key={product.mp_id}
            className='p-3 border-2 hover:scale-105 hover:border-black transition w-full overflow-auto'>

            <Link to={'_p/' + product.mp_name.toLowerCase() + '-P' + product.mp_id}
                className='text-gray-800 hover:no-underline'>
                <img src={product.mp_image_url} alt={product.mp_name}
                    className='object-contain w-full max-h-52' />
                <p className='my-2 text-center text-lg font-bold'>
                    {product.mp_name}
                </p>
            </Link>
            <p className='flex gap-2 items-center'>
                <span className='w-14'>Color</span>
                <button className="w-6 border border-black cursor-default" style={{ backgroundColor: `${product.mp_color}` }}>&nbsp;</button>
            </p>
            {variants.length > 0 &&
                <p className='flex gap-2 items-center flex-wrap'>
                    <span className='w-14'>Variant</span>
                    <select className='h-9 flex-shrink' value={variantId} onChange={(e) => setVariantId(Number(e.target.value))}>
                        {variants.map(variant => {
                            return (<option key={variant.pv_id} value={variant.pv_id}>{variant.pv_variant_name}</option>)
                        })}
                    </select>
                </p>
            }
            <p className='text-right font-bold py-2'>
                {product.mp_currency} {product.mp_price}
            </p>

            <button className='self-center rounded-2xl bg-emerald-200 hover:bg-emerald-300 w-full py-2 font-semibold'
                onClick={() => addToCart(product.mp_id, variantId)}>
                Add to cart
            </button>
        </div >
    )
}

export default ProductCard