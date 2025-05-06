import React, { useState, useRef, useEffect } from 'react';
import '../../css/blog/Blog.css';
import image1 from '../../assets/banner1.jpeg';
import {useNavigate } from 'react-router-dom';

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  author: string;
  status: 'active' | 'inactive';
  fields: {
    type: 'image' | 'content' | 'video'| 'youtube';
    value: string;
  }[];
}

interface BlogProps {
  blogs: BlogPost[];
  setBlogs: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  onCreateBlog: () => void;
  setEditBlog: (blog: BlogPost) => void;
}

const Blog: React.FC<BlogProps> = ({ onCreateBlog, setEditBlog }) => {
    const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const [previewBlog, setPreviewBlog] =useState<BlogPost | null>(null);
  const [blogToDelete, setBlogToDelete] =useState<BlogPost | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([
    {
      id: 1,
      title: 'How to Start Blogging in 2024',
      date: '2024-04-01',
      author: 'Jane Doe',
      status: 'active',
      fields: [
        { type: 'image', value: image1 },
        { type: 'content', value: 'This blog will walk you through the process...' },
        { type: 'video', value: 'https://www.w3schools.com/html/mov_bbb.mp4' } // example video
      ]
    },
    {
      id: 2,
      title: '10 Tools Every Blogger Needs',
      date: '2024-03-15',
      author: 'John Smith',
      status: 'inactive',
      fields: [
        { type: 'image', value: image1 },
        { type: 'content', value: 'From content planners to SEO analyzers, this article lists ten essential tools that streamline your blogging efforts...' },
        { type: 'video', value: 'https://www.w3schools.com/html/mov_bbb.mp4' }
      ]
    }
  ]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  

  const handleStatusChange = (id: number, newStatus: 'active' | 'inactive') => {
    const updatedBlogs = blogs.map((blog) =>
      blog.id === id ? { ...blog, status: newStatus } : blog
    );
    setBlogs(updatedBlogs);
  };
  
  const handleDelete = (blog: BlogPost) => setBlogToDelete(blog);

  const confirmDelete = () => {
    if (blogToDelete) {
      setBlogs(blogs.filter((b) => b.id !== blogToDelete.id));
      setBlogToDelete(null);
    }
  };

  return (
    <div className="blog-page">
      <header className="blog-header">
        <h1>Blog Management</h1>
        <button
  className="create-blog-button"
  onClick={() => {
    onCreateBlog();    // clears editBlog state
    navigate('/createeditblog'); // navigates to CreateEditBlog page
  }}
>
  <i className="fas fa-plus"></i> 
</button>
      </header>

      <div className="blog-table-container">
        <table className="blog-table">
          <thead>
            <tr>
              <th>Sl. No.</th>
              <th>Title</th>
              <th>Image</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td>{blog.id}</td>
                <td>{blog.title}</td>
                <td>
  {blog.fields
    .filter(field => field.type === 'image')
    .map((imageField, index) => (
      <img
        key={index}
        src={imageField.value}
        alt={`blog-${index}`}
        className="blog-image"
        width="100"
        height="60"
      />
  ))}
</td>
                <td>
  <select
    value={blog.status}
    onChange={(e) =>
      handleStatusChange(blog.id, e.target.value as 'active' | 'inactive')
    }
  >
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </select>
</td>

<td className="action-cell">
  <button
    className="menu-button"
    onClick={() => setOpenMenuId(openMenuId === blog.id ? null : blog.id)}
  >
    ⋮
  </button>

  {openMenuId === blog.id && (
    <div className="action-menu" ref={actionMenuRef}>
      <button onClick={() => { setEditBlog(blog); setOpenMenuId(null); }}>Edit</button>
      <button onClick={() => { handleDelete(blog); setOpenMenuId(null); }}>Delete</button>
      <button onClick={() => { setPreviewBlog(blog); setOpenMenuId(null); }}>Preview</button>
    </div>
  )}
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      {previewBlog && previewBlog.fields.map((field, index) => {
  if (field.type === 'image') {
    return <img key={index} src={field.value} alt={`Blog ${index}`} style={{ width: '100%', marginBottom: '10px' }} />;
  }
  if (field.type === 'content') {
    return <p key={index} dangerouslySetInnerHTML={{ __html: field.value }} />;
  }
  if (field.type === 'video') {
    return (
      <div key={index} style={{ marginBottom: '10px' }}>
        <video width="100%" controls>
          <source src={field.value} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }
  return null;
})}


      {/* Delete Confirmation Modal */}
      {blogToDelete && (
        <div className="modal-overlay">
          <div className="delete-modal-content">
            <h3>Confirm delete blog post?</h3>
            <p><strong>{blogToDelete.title}</strong></p>
            <div className="form-actions">
              <button className="delete-confirm" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button onClick={() => setBlogToDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
