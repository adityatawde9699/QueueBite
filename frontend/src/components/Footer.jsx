import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" role="contentinfo" aria-label="Website footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo"><img src="/logo_4.svg" alt="logo" /></span>
          <p className="footer-copyright">&copy; {new Date().getFullYear()} QueueBite. All rights reserved.</p>
        </div>
        <div className="footer-links">
          <h3 className="footer-heading">Legal</h3>
          <ul>
            <li><a href="/privacy-policy" className="footer-link">Privacy Policy</a></li>
            <li><a href="/terms-of-service" className="footer-link">Terms of Service</a></li>
          </ul>
        </div>
        <div className="footer-links">
          <h3 className="footer-heading">Company</h3>
          <ul>
            <li><a href="/about" className="footer-link">About Us</a></li>
            <li><a href="/contact" className="footer-link">Contact</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
