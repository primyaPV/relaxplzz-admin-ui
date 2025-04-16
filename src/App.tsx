import React, { useState } from 'react';
import './App.css';
import Menu from './components/Menu';
import Address from './components/credentials/Address';
import Banners from './components/Banners';
import MidBanners from './components/MidBanners';
import ImageVideoManagement from './components/gallery/ImageVideo';
import LinkPage from './components/credentials/Link'; 
import EnquiryList from './components/enquiry/EnquiryList';


const App: React.FC = () => {
  const [activePage, setActivePage] = useState<string>(''); 

  const handleMenuClick = (page: string) => {
    setActivePage(page);
  };

  return (
    <div className="app">
      <Menu onMenuClick={handleMenuClick} />

      {activePage === 'address' && <Address />}
      {activePage === 'banners' && <Banners />}
      {activePage === 'midbanners' && <MidBanners />}
      {activePage === 'imagevideo' && <ImageVideoManagement />}
      {activePage === 'link' && <LinkPage />} 
      {activePage === 'enquirylist' && <EnquiryList />} 
    </div>
  );
};

export default App;
