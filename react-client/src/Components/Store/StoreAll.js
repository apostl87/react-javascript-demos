import React, { useContext, useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { StoreContext } from '../../Contexts/StoreContext'
import { MoonLoader } from 'react-spinners';
import StoreGrid from './StoreGrid'
import config from '../../config'

const StoreAll = () => {
  const { fetchProductBatch } = useContext(StoreContext)

  //// States
  // Loading
  const [loading, setLoading] = useState(false);
  // Products
  const [productBatches, setProductBatches] = useState([]);
  const [numberTotalProducts, setNumberTotalProducts] = useState(0);

  //// Display variables
  const numberLoadedProducts = useMemo(() => {
    let res = []
    let temp = 0
    for (let index = 0; index < productBatches.length; index++) {
      temp += productBatches[index].length;
      res.push(temp)
    }
    return res
  }, [productBatches])

  useEffect(() => {
    if (productBatches.length === 0) doFetch();
  }, []);

  // Fetch product batch
  const doFetch = async () => {
    setLoading(true);
    let data = await fetchProductBatch(config.batchSize, config.batchSize * productBatches.length);
    if (data.length > 0) {
      setProductBatches([...productBatches, data]);
      setNumberTotalProducts(Number(data[0].total_count));
    }
    setLoading(false);
  }

  let content
  if (numberTotalProducts === 0) {
    content = <div>No products to display.</div>
  } else {
    content =
      <>{
        productBatches.map((batch, index) => {
          return (
            <div key={index} className='flex flex-col items-center'>
              <StoreGrid products={batch} loading={false} />
              {index < productBatches.length - 1 &&
                <div>Until here: {numberLoadedProducts[index]} of {numberTotalProducts} items</div>
              }
            </div>
          )
        })
      }
        {loading ?
          <MoonLoader speedMultiplier={0.3} color='rgb(15 23 42)' />
          :
          <>
            <div className='pb-4'>
              {numberLoadedProducts.at(-1)} of {numberTotalProducts} items shown
            </div>
            {(numberLoadedProducts.at(-1) !== numberTotalProducts) &&
              <button
                className="rounded-full bg-gray-200 hover:bg-gray-100
                w-40 max-w-52 h-10 py-2 font-semibold text-black
                flex justify-center items-center gap-2" // for potentially added icon
                onClick={doFetch}>
                Load More
              </button>
            }
          </>
        }
      </>
  }


  return (
    <div className='flex flex-col items-center py-5'>
      {content}
    </div>
  )
}

export default StoreAll