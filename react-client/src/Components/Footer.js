import React from 'react';
import { Link } from 'react-router-dom';
import '../css/footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className='footer-container'>
                <div className="footer-content">
                    <div className="footer-section about">
                        <h2 className="footer-title">About</h2>
                        <p className="footer-text">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa.
                        </p>
                    </div>
                    <div className="footer-section links">
                        <h2 className="footer-title">Shortcuts</h2>
                        <ul className="footer-list">
                            <li><Link to={"/home"} className="footer-link">Home</Link></li>
                            <li><Link to={"/profile"} className="footer-link">Profile</Link></li>
                            <li><Link to={'/contact'} className="footer-link">Contact</Link></li>
                            <li><Link to={'/store'} className="footer-link">Store</Link></li>
                            <li><Link to={'/calculator'} className="footer-link">Calculator</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section links">
                        <h2 className="footer-title">Follow Us</h2>
                        <div className="footer-list">
                            <Link to={"https://www.facebook.com"} className="footer-link">Facebook</Link>
                            <Link to={"https://www.twitter.com"} className="footer-link">Twitter</Link>
                            <Link to={"https://www.instagram.com"} className="footer-link">Instagram</Link>
                            <Link to={"https://www.linkedin.com"} className="footer-link">LinkedIn</Link>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="footer-end">
                    <Link to ={'/privacy-policy'}>Privacy Policy</Link>
                    <Link to ={'javascript:Cookiebot.show()'}>Manage Cookies</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
