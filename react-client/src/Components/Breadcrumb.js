import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { RightCaret } from './Misc';
import '../css/breadcrumb.css';

const Breadcrumb = ({ paths }) => {
    if (paths.length < 1) {
        return <></>
    }
    return (
        <nav className="breadcrumb">
            <ul className="breadcrumb-list">
                {paths.map((path, index) => {
                    return (
                        <>
                            {index > 0 && <RightCaret size={5} />}
                            <li key={index} className="breadcrumb-item">
                                {index < paths.length - 1 ? (
                                    <Link to={path.link ? path : '#'} className="breadcrumb-link">
                                        {path.label}
                                    </Link>
                                ) : (
                                    <span className="breadcrumb-current"><strong>{path.label}</strong></span>
                                )}
                            </li>
                        </>
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
