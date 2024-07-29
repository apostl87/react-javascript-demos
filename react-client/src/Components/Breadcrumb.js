import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { RightCaret } from './Misc';
import '../css/breadcrumb.css';

const Breadcrumb = ({ paths, style, refprop }) => {
    // if (paths.length == 0) {
    //     return (
    //         <nav className="h-0" ref={refprop} id="breadcrumb" style={style}>
    //             {/* <ul id="breadcrumb-list" className="breadcrumb-list">
    //                 <li className='breadcrumb-item'>123</li>
    //             </ul> */}
    //         </nav>
    //     )
    // }
    // if (paths.length == 0) {
    //     paths.push({ label: 'Home', to: '/home', link: true })
    // }
    // console.log(typeof paths);
    // console.log("13p");
    console.log(paths);

    return (
        <nav className="breadcrumb" ref={refprop} id="breadcrumb" style={style}>
            <ul id="breadcrumb-list" className="breadcrumb-list">
                {paths.map((path, index) => {
                    return (
                        <li key={index} className="breadcrumb-item">
                            {index > 0 && <RightCaret size={5} />}
                            <Link to={path.link ? path.to : '#'}>
                                {path.label}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    );
};

Breadcrumb.propTypes = {
    paths: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            to: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default Breadcrumb;
