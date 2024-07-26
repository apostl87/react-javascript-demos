import React from 'react'
import { Link } from 'react-router-dom';
import '../css/banner.css'
import BrandImage from '../assets/brand_circular.png'

const Banner = () => {
    return (
        <div id='banner'>
            <div className='left-5 top-2 pr-2'>
                <Link to='/home'>
                    <img src={BrandImage} width={50} />
                </Link>
            </div>
            <div>
                <div className='text-white font-bold text-large tracking-widest'>
                    DEMO WEBSITE
                </div>
                <div className='text-nowrap'>
                    Built with Node.js, React, Express and Postgres (PERN Stack)
                </div>

            </div>
        </div>
    )
}

export default Banner