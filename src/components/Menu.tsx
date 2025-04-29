import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import logo from '../../src/assets/site-logo-white-2.webp'; 
import '../css/Menu.css';

const Menu: React.FC = () => {
  return (
    <div className="menu">
      <div className="logo">
        <img src={logo} alt="Logo" className="logo-image" />
      </div>

      <ul>
        <li className="menu-item">
          <label>
            <i className="fas fa-cogs"></i> Dashboards
          </label>
        </li>

        <li className="menu-item">
          <input type="checkbox" id="credentials" className="toggle" />
          <label htmlFor="credentials">
            <i className="fas fa-user"></i> Credentials
          </label>
          <ul className="submenu">
            <li>
              <Link to="/address">• Address</Link> {/* Use Link component */}
            </li>
            <li>
              <Link to="/link">• Link</Link> {/* Use Link component */}
            </li>
          </ul>
        </li>

        <li className="menu-item">
          <input type="checkbox" id="homepage" className="toggle" />
          <label htmlFor="homepage">
            <i className="fas fa-home"></i> HomePage
          </label>
          <ul className="submenu">
            <li>
              <Link to="/banners">• Banners</Link> {/* Use Link component */}
            </li>
            <li>
              <Link to="/midbanners">• Mid Banners</Link> {/* Use Link component */}
            </li>
          </ul>
        </li>

        <li className="menu-item">
          <input type="checkbox" id="gallery" className="toggle" />
          <label htmlFor="gallery">
            <i className="fas fa-image"></i> Gallery
          </label>
          <ul className="submenu">
            <li>
              <Link to="/imagevideo">• Image/Video</Link> {/* Use Link component */}
            </li>
          </ul>
        </li>

        <li className="menu-item">
          <input type="checkbox" id="enquiry-list" className="toggle" />
          <label htmlFor="enquiry-list">
            <i className="fas fa-clipboard-list"></i> Enquiry List
          </label>
          <ul className="submenu">
            <li>
              <Link to="/enquirylist">• Enquiry List</Link> {/* Use Link component */}
            </li>
          </ul>
        </li>

        <li className="menu-item">
          <input type="checkbox" id="blog" className="toggle" />
          <label htmlFor="blog">
            <i className="fas fa-blog"></i> Blog Management
          </label>
          <ul className="submenu">
            <li>
              <Link to="/blog">• Blog</Link> {/* Use Link component */}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
