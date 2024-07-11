import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../css/Breadcrumb.css';

const Breadcrumb = ({ paths }) => {
    return (
        <nav className="breadcrumb">
            <ul className="breadcrumb-list">
                {paths.map((path, index) => (
                    <li key={index} className="breadcrumb-item">
                        {index < paths.length - 1 ? (
                            <Link to={path.to} className="breadcrumb-link">
                                {path.label}
                            </Link>
                        ) : (
                            <span className="breadcrumb-current">{path.label}</span>
                        )}
                    </li>
                ))}
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
