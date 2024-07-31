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
  const numberLoadedProducts = []
  let temp = 0
  for (let index = 0; index < productBatches.length; index++) {
    temp += productBatches[index].length
    numberLoadedProducts.push(temp)
  }

  useEffect(() => {
    if (productBatches.length === 0) doFetch();
  }, []);

  // Fetch product batch
  const doFetch = async () => {
    setLoading(true);
    let data = await fetchProductBatch(config.batchSize, config.batchSize * productBatches.length);
    if (data.length > 0) {
      setProductBatches([...productBatches, data]);
      setNumberTotalProducts(data[0].total_count);
    }
    setLoading(false);
  }

  return (
    <div className='flex flex-col items-center pb-5'>
      {productBatches.length}
      {
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
          <button
            className="rounded-full bg-gray-200 hover:bg-gray-100
                  w-40 max-w-52 h-10 py-2 font-semibold text-black
                  flex justify-center items-center gap-2" // for potentially added icon
            onClick={doFetch}>
            {/* <img src={TODO} /> */}
            Load More
          </button>
        </>
      }
    </div>
  )
}

export default StoreAll