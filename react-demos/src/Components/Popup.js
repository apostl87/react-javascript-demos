import React from 'react';
import '../static/css/Popup.css'; // Import the CSS file for the popup

const Popup = ({ content, handleClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <span className="close-btn" onClick={handleClose}>&times;</span>
                {content}
            </div>
        </div>
    );
};

export default Popup;