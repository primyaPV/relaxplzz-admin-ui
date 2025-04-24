import React from 'react';
import logo from '../../src/assets/site-logo-white-2.webp'; 
import '../css/Menu.css';

interface MenuProps {
  onMenuClick: (page: string) => void;
}

const Menu: React.FC<MenuProps> = ({ onMenuClick }) => {
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
            <li onClick={() => onMenuClick('address')}>• Address</li>
            <li onClick={() => onMenuClick('link')}>• Link</li>
          </ul>
        </li>

        <li className="menu-item">
          <input type="checkbox" id="homepage" className="toggle" />
          <label htmlFor="homepage">
            <i className="fas fa-home"></i> HomePage
          </label>
          <ul className="submenu">
            <li onClick={() => onMenuClick('banners')}>• Banners</li>
            <li onClick={() => onMenuClick('midbanners')}>• Mid Banners</li>
          </ul>
        </li>

        <li className="menu-item">
  <input type="checkbox" id="gallery" className="toggle" />
  <label htmlFor="gallery">
    <i className="fas fa-image"></i> Gallery
  </label>
  <ul className="submenu">
    <li onClick={() => onMenuClick('imagevideo')}>• Image/Video</li>
    
  </ul>
</li>

        <li className="menu-item">
          <input type="checkbox" id="enquiry-list" className="toggle" />
          <label htmlFor="enquiry-list">
            <i className="fas fa-clipboard-list"></i> Enquiry List
          </label>
          <ul className="submenu">
            <li onClick={() => onMenuClick('enquirylist')}>• Enquiry List</li>
          </ul>
        </li>
        <li className="menu-item">
          <input type="checkbox" id="blog" className="toggle" />
          <label htmlFor="blog">
            <i className="fas fa-blog"></i> Blog Management
          </label>
          <ul className="submenu">
            <li onClick={() => onMenuClick('blog')}>• Blog</li>
          </ul>
        </li>
        
      </ul>
    </div>
  );
};

export default Menu;
