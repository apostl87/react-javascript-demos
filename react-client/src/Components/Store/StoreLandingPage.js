import React, { Component, useEffect, useContext, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { StoreContext } from '../../Contexts/StoreContext'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel'
import { useNavigate } from 'react-router-dom';


const StoreLandingPage = () => {
  const navigate = useNavigate();

  const { fetchBestsellers } = useContext(StoreContext);

  const [bestsellers, setBestsellers] = useState([])
  const [newProducts, setNewProducts] = useState([])

  // Fetching Bestsellers and New Products
  useEffect(() => {
    let ignore = false;

    const doFetch = async () => {
      let promise1 = Promise.resolve(fetchBestsellers());
      promise1.then((value) => {
        if (!ignore) setBestsellers(value);
      })
      let promise2 = Promise.resolve(fetchBestsellers());
      promise2.then((value) => {
        if (!ignore) setNewProducts(value);
      })
    }
    doFetch();

    return () => {
      ignore = true
    }
  }, []);

  // Rendering Carousel
  let element1, element2;
  useEffect(() => {

  }, []);

  useEffect(() => {
    element1 = createRoot(document.getElementById('store-landing-page-carousel-bestsellers'));
    element2 = createRoot(document.getElementById('store-landing-page-carousel-new'));
    if (element1) {
      element1.render(<LandingPageCarousel items={bestsellers} navigateFunc={navigate} />);
    }
    if (element2) {
      element2.render(<LandingPageCarousel items={newProducts} />);
    }
  }, [bestsellers, newProducts])

  return (
    <div className='flex flex-col items-center text-center text-3xl mb-10'>
      <p className='font-bold my-5'>Latest Bestsellers</p>
      <div id="store-landing-page-carousel-bestsellers"
        className='bg-slate-100 rounded-lg w-4/5 md:w-1/2 self-center'>
      </div>
      <hr />
      <p className='font-bold my-5'>New in Stock</p>
      <div id="store-landing-page-carousel-new"
        className='bg-blue-100 rounded-lg w-4/5 md:w-1/2 self-center'>
      </div>
    </div>
  )
}

export default StoreLandingPage


class LandingPageCarousel extends Component {
  constructor(props) {
    super(props);
    this.items = props.items
    this.navigate = props.navigateFunc;
  }

  render() {
    return (
      <Carousel showThumbs={false}
        showArrows={true}
        showStatus={false}
        infiniteLoop={true}
        autoPlay={true}
        stopOnHover={true}
      >
        {this.items.map((item) => {
          return (
            <div key={item.mp_id} className='mb-10 cursor-pointer'
              onClick={() => this.navigate(`_p/P${item.mp_id}`)}>
              <img src={item.mp_image_url} alt={item.mp_name}
                style={{ height: '300px', width: '200px', marginBottom: '40px', marginTop: '20px' }}
              />
              <div className='flex justify-center gap-5 items-center'>
                <p className='fixed bottom-10 text-sm text-nowrap
                              flex gap-5'>
                  <span>{item.mp_name}</span>
                  <strong>{item.mp_price}</strong>
                </p>
              </div>
              {/* <p className="legend">Legend</p> */}
            </div>
          )
        })}
      </Carousel>
    );
  }
};

// ReactDOM.render(<DemoCarousel />, document.querySelector('#store-landing-page-carousel'));
