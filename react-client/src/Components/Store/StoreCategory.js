import React, { useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { StoreContext } from '../../Contexts/StoreContext'

const StoreCategory = (props) => {
  const { getProductsByCategory } = useContext(StoreContext);
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false);

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
    <div id="store-category"
      className='my-5 mx-auto grid grid-cols-2 gap-3 justify-items-center
        md:grid-cols-3  
        lg:grid-cols-4 lg:gap-5'>
      {products.length === 0
        ?
        (loading
          ? 'Loading ...'
          : 'No products to display.')
        :
        (
          products.map(product => {
            return (
              <div key={product.mp_id} className='p-1 border-2 hover:scale-105'>
                <img src={product.mp_image_url} alt={product.mp_name} />
                <h2>{product.mp_name}</h2>
                <p>Color: <span style={{ backgroundColor: `${product.mp_color}` }}></span></p>
                <p>EUR {product.mp_price}</p>
                <p>Variant: <select></select></p>
                <button>Add To Cart</button>
              </div>
            )
          })
        )
      }
    </div>
  )
}

export default StoreCategory