import React from 'react'

const ProgressBar = (props) => {
    const value = Math.round(props.value * 100) + '%';

    return (
        <div className="progress-bar flex flex-row">
            <span className='z-20'>{props.text} {value}</span>
            <div style={{width: `${value}`}} ></div>
        </div>
    )
}

export default ProgressBar