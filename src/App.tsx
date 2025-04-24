import React, { useState } from 'react';
import './App.css';
import Menu from './components/Menu';
import Address from './components/credentials/Address';
import Banners from './components/Banners';
import MidBanners from './components/MidBanners';
import ImageVideoManagement from './components/gallery/ImageVideo';
import LinkPage from './components/credentials/Link'; 
import EnquiryList from './components/enquiry/EnquiryList';
import Blog from './components/blog/Blog';
import CreateEditBlog from './components/blog/CreateEditBlog';
import { BlogPost } from './components/blog/CreateEditBlog'; // ensure BlogPost is exported properly

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<string>('');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [editBlog, setEditBlog] = useState<BlogPost | null>(null);

  const handleMenuClick = (page: string) => {
    setActivePage(page);
  };

  const handleCreateBlog = () => {
    setEditBlog(null);
    setActivePage('createblog');
  };

  const handleSubmitBlog = (data: Omit<BlogPost, 'id'>) => {
    if (editBlog) {
      const updatedBlogs = blogs.map((b) =>
        b.id === editBlog.id ? { ...editBlog, ...data } : b
      );
      setBlogs(updatedBlogs);
    } else {
      const newBlog: BlogPost = {
        id: blogs.length + 1,
        ...data,
      };
      setBlogs([...blogs, newBlog]);
    }

    setActivePage('blog');
    setEditBlog(null);
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
      
      {activePage === 'blog' && (
        <Blog
          blogs={blogs}
          setEditBlog={(blog) => {
            setEditBlog(blog);
            setActivePage('createblog');
          }}
          onCreateBlog={handleCreateBlog}
          setBlogs={setBlogs}
        />
      )}

      {activePage === 'createblog' && (
        <CreateEditBlog
          onClose={() => setActivePage('blog')}
          onSubmit={handleSubmitBlog}
          initialData={editBlog}
        />
      )}
    </div>
  );
};

export default App;
