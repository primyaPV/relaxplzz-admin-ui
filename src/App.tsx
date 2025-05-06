import React, { lazy, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Menu from './components/Menu';
import Address from './components/credentials/Address';
import Banners from './components/Banners';
import MidBanners from './components/MidBanners';
import ImageVideoManagement from './components/gallery/ImageVideo';
import LinkPage from './components/credentials/Link';
import EnquiryList from './components/enquiry/EnquiryList';
import Blog from './components/blog/Blog';
import CreateEditBlog from './components/blog/CreateEditBlog';
import { BlogPost } from './components/blog/CreateEditBlog';

const PreviewBlog = lazy(() => import('./components/blog/PreviewBlog'));

const App: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [editBlog, setEditBlog] = useState<BlogPost | null>(null);

  const handleCreateBlog = () => {
    setEditBlog(null);
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
    setEditBlog(null);
  };

  return (
    <Router>
      <div className="app">
        <Menu />

        <Routes>
          <Route path="/address" element={<Address />} />
          <Route path="/banners" element={<Banners />} />
          <Route path="/midbanners" element={<MidBanners />} />
          <Route path="/imagevideo" element={<ImageVideoManagement />} />
          <Route path="/link" element={<LinkPage />} />
          <Route path="/enquirylist" element={<EnquiryList />} />

          {/* Preview Page */}
          <Route
            path="/previewblog"
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <PreviewBlog />
              </React.Suspense>
            }
          />

          {/* Create/Edit Blog Page */}
          <Route
            path="/createeditblog"
            element={
              <CreateEditBlog
                onSubmit={handleSubmitBlog}
                onClose={() => setEditBlog(null)}
                initialData={editBlog}
              />
            }
          />

          {/* Blog Listing Page */}
          <Route
            path="/blog"
            element={
              <Blog
                blogs={blogs}
                setBlogs={setBlogs}
                setEditBlog={(blog) => setEditBlog(blog)}
                onCreateBlog={handleCreateBlog}
              />
            }
          />

          {/* Default Route */}
          <Route path="*" element={<Navigate to="/blog" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
