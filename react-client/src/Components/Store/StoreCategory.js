import React, { useContext, useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { StoreContext } from '../../Contexts/StoreContext'
import StoreGrid from './StoreGrid'

const StoreCategory = (props) => {
  const { fetchProductsByCategory} = useContext(StoreContext);
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false);

  // Currently not needed
  // const { categories } = useContext(StoreContext)
  // const category = useMemo(() => categories && categories.find(c => c.pc_id == props.categoryId), [props.categoryId, categories]);

  // Fetch products for the given category ID
  useEffect(() => {
    let ignore = false;

    const doFetch = async () => {
      setLoading(true);
      let data = await fetchProductsByCategory(props.categoryId);
      if (!ignore) setProducts(data);
      setLoading(false);
    }
    doFetch();

    return () => {
      ignore = true
    }
  }, []);

  return (
      <StoreGrid products={products} loading={loading} />
  )
}

export default StoreCategory