import React, { useMemo, useContext, useState, useEffect } from 'react'
import { StoreContext } from '../../Contexts/StoreContext'
import "../../css/productpage.css"
import { getRandomInt } from '../../Utils/generic'
import { MoonLoader } from 'react-spinners';
import { pathToProduct } from '../../Utils/generic';
import { useNavigate } from 'react-router-dom';

const ProductPage = (props) => {
  const navigate = useNavigate();

  const { fetchProduct, addToCart, allVariants, getVariantsByCategory } = useContext(StoreContext)

  // States
  const [product, setProduct] = useState(undefined);
  const [variantId, setVariantId] = useState(undefined);
  const [loading, setLoading] = useState(false);

  // Memos
  const variants = useMemo(() => allVariants && product && getVariantsByCategory(allVariants, product.mp_pc_id), [product, allVariants])
  // Multiple images for demonstration purposes
  const randomImageUrls = useMemo(() => {
    let urls = []
    for (let i = 0; i < 3; i++) {
      urls.push(`https://picsum.photos/seed/${getRandomInt(1, 1000)}`)
    }
    return urls
  }, [])

  // Fetch product
  useEffect(() => {
    let ignore = false;

    const doFetch = async () => {
      setLoading(true);
      let data = await fetchProduct(props.productId);
      if (!ignore && data.length === 1) setProduct(data[0]);
      setLoading(false);
    }
    doFetch();

    return () => {
      ignore = true
    }
  }, []);

  // Navigate to the correct path
  useEffect(() => {
    if (product) {
      const intendedPathSegment = pathToProduct(product)
      let actualPathSegments = window.location.pathname.split('/')
      if (actualPathSegments.at(-1) !== intendedPathSegment) {
        let newPath = [...actualPathSegments.slice(0, -1), intendedPathSegment].join("/")
        navigate(newPath)
      }
    }
  }, [product])

  // By default, select first variant
  useEffect(() => {
    setVariantId((variants && variants.length > 0) ? variants[0].pv_id : undefined);
  }, [variants]);

  return (
    <div className="productpage">
      {loading
        ?
        <MoonLoader speedMultiplier={0.3} color='rgb(15 23 42)' />
        :
        (!product
          ?
          <span>Product not found.</span>
          :
          <>
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
              {variants &&
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
              }
              <div className="productpage-right-price">{product.mp_currency} {product.mp_price}</div>
              <button className='self-end rounded-2xl bg-emerald-200 hover:bg-emerald-300 w-52 py-2 font-semibold'
                onClick={() => addToCart(product.mp_id, variantId)}
                on>
                ADD TO CART
              </button>
            </div>
          </>
        )}
    </div>
  )
}

export default ProductPage