import React, { useContext, useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { StoreContext } from '../../Contexts/StoreContext'
import StoreGrid from './StoreGrid'
import config from '../../config'

const StoreAll = () => {
  const { fetchProductBatch } = useContext(StoreContext)

  const [productBatches, setProductBatches] = useState([])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productBatches.length === 0) doFetch();
  }, []);

  // Fetch productBatches batch
  const doFetch = async () => {
    setLoading(true);
    let data = await fetchProductBatch(config.batchSize, config.batchSize * productBatches.length);
    if (data.length > 0) {
      setProductBatches([...productBatches, data]);
    }
    setLoading(false);
  }

  return (
    <div className='flex flex-col items-center pb-5'>
      {
        productBatches.map((batch, index) => {
          const countProducts = 40 // TODO
          return (
            <div key={index} className='flex flex-col items-center'>
              <StoreGrid products={batch} loading={false} />
              {index < productBatches.length - 1 &&
                <div>Until here: {countProducts} of 240 items</div>
              }
            </div>
          )
        })
      }
      <div className='pb-4'>
        120 of 240 items shown
      </div>
      <button
        className="rounded-full bg-gray-200 hover:bg-gray-100
                  w-40 max-w-52 h-10 py-2 font-semibold text-black
                  flex justify-center items-center gap-2" // for potentially added icon
        onClick={doFetch}>
        {/* <img src={TODO} /> */}
        Load More
      </button>
    </div>
  )
}

export default StoreAll