import { useState, useEffect } from 'react'
import React from 'react'
import ScrollToTop from 'react-scroll-to-top'

const MyScrollToTop = () => {

    //// Hide when currently scrolling, only show when not scrolling

    // TODO Probably debug this by changing the component to a class extending React.Component
    // IT IS LIKELY THAT THIS CAN ONLY BE MADE WORKING WHEN USING A CLASS

    // const [isScrolling, setIsScrolling] = useState(false);
    // let timeout = null;

    // useEffect(() => {
    //     window.addEventListener("scroll", onScroll);
    // })

    // const onScroll = () => {
    //     setIsScrolling(true);
    //     clearTimeout(timeout);
    //     timeout = setTimeout(() => {setIsScrolling(false)}, 500);
    // }

    const style = {
        backgroundColor: 'rgb(203 213 225)',
        border: '2px solid rgb(15 23 42)',
        width: '50px',
        height: '35px',
        right: '15px',
        bottom: '10px',
    }

    return (
        <ScrollToTop smooth
            width='34'
            height='20'
            viewBox='0 0 155 175'
            color='rgb(15 23 42)'
            style={style}
            // style={{...style, ['display']: isScrolling ? 'none' : 'block'}}
        />
    )
}

export default MyScrollToTop