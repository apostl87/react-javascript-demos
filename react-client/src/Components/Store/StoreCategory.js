import React, { useContext, useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { StoreContext } from '../../Contexts/StoreContext'
import { MoonLoader } from 'react-spinners';
import ProductCard from './ProductCard'

const StoreCategory = (props) => {
  const { getProductsByCategory, categories, allCategoryVariants, getVariantsByCategory } = useContext(StoreContext);
  const [products, setProducts] = useState(null)
  const [loading, setLoading] = useState(false);

  const category = useMemo(() => categories.find(c => c.pc_id == props.categoryId), [props.categoryId, categories]);
  const variants = useMemo(() => getVariantsByCategory(props.categoryId), [props.categoryId]);
  //   {
  //   try {
  //     return allCategoryVariants.find(cv => cv.pc_id == props.categoryId)['variants']
  //   } catch (error) {
  //     //console.error(error);
  //     return []
  //   }
  // }, [props.categoryId, allCategoryVariants])

  useEffect(() => {
    // Fetch products for the given category ID
    setLoading(true);
    let ignore = false;

    const fetchProducts = async () => {
      let data = await getProductsByCategory(props.categoryId);
      if (!ignore) setProducts(data);
      setLoading(false);
    }
    fetchProducts();

    return () => {
      ignore = true
    }
  }, []);

  return (
    <div id="store-category" className="flex items-center justify-center w-full py-5 bg-white">

      {!products
        ?
        <MoonLoader speedMultiplier={0.3} color='rgb(15 23 42)' />
        :
        (products.length === 0
          ?
          <span>No products to display.</span>
          :
          <div id="store-category-items"
            className='mb-5 grid grid-cols-2 gap-3 px-2
                      md:grid-cols-3  md:mx-0
                      lg:grid-cols-4 lg:gap-5 lg:px-0 lg:items-stretch'>
            {products.map(product => {
              return (
                <ProductCard key={product.mp_id} product={product} variants={variants} />
              )
            })}
          </div>
        )
      }
    </div >
  )
}

export default StoreCategory