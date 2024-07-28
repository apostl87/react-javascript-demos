import React, { useMemo, useContext, useState, useEffect } from 'react'
import { StoreContext } from '../../Contexts/StoreContext'
import "../../css/productpage.css"
import { getRandomInt } from '../../Utils/generic'
import { Carousel } from 'react-responsive-carousel'

const ProductPage = (props) => {

  const { products, addToCart, allCategoryVariants, getVariantsByCategory } = useContext(StoreContext)

  const product = useMemo(() => products.find(product => product.mp_id == props.productId), [props.productId, products]);

  const variants = useMemo(() => {
    try { return getVariantsByCategory(allCategoryVariants, product.mp_pc_id) }
    catch (error) { return []; }
  }, [product, allCategoryVariants]);
  const [variantId, setVariantId] = useState(undefined)

  const randomImageUrls = useMemo(() => {
    let urls = []
    for (let i = 0; i < 3; i++) {
      urls.push(`https://picsum.photos/seed/${getRandomInt(1, 1000)}`)
    }
    return urls
  }, [])

  useEffect(() => {
    setVariantId(variants.length > 0 ? variants[0].pv_id : undefined);
  }, [variants]);

  if (!products) {
    return null;
  } else if (!product) {
    return "Product not found"
  }

  return (
    <div className="productpage">
      <div className="productpage-left">
        <div className="productpage-img-list">
          <img src={product.mp_image_url} alt="img"
            onMouseEnter={() => {
              document.getElementById('productpage-main-img').src = product.mp_image_url;
            }}
          />
          {randomImageUrls.map((url, index) => {
            return <img key={index} src={`${url}/200/300`} alt="img"
              onMouseEnter={() => {
                document.getElementById('productpage-main-img').src = `${url}/400/600`;
              }}
            />
          })}
        </div>
        <div className="productpage-img">
          <img id="productpage-main-img" className="productpage-main-img" src={product.mp_image_url} alt="img" />
        </div>
      </div>
      <div className="productpage-right">
        <h1>{product.mp_name}</h1>
        <p className="productpage-right-field">
          <span>Category</span>{product.pc_category_name}
        </p>
        <p className="productpage-right-field">
          <span>Product Description</span>
          <br />
          (work in progress)
        </p>
        <div className="productpage-right-field">
          <h1>Select Variant</h1>
          <div className="productpage-right-variants">
            {variants.map(variant => {
              return (
                <button key={variant.pv_id}
                  onClick={() => setVariantId(variant.pv_id)}
                  className={`productpage-right-variant ${variant.pv_id == variantId && ' selected'}`}>
                  {variant.pv_variant_name}
                </button>
              )
            })}
          </div>
        </div>
        <div className="productpage-right-price">{product.mp_currency} {product.mp_price}</div>
        <button className='self-end rounded-2xl bg-emerald-200 w-52 py-2 font-semibold'
          onClick={() => addToCart(product.mp_id, variantId)}>
          ADD TO CART
        </button>
      </div>
    </div>
  )
}

export default ProductPage