import React, { useState, useRef, useEffect } from 'react';
import '../../css/blog/Blog.css';
import { useNavigate, useLocation } from 'react-router-dom';

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  author: string;
  status: 'active' | 'inactive';
  tempId?: number; // Optional temporary ID for tracking
  fields: {
    type: 'image' | 'content' | 'video' | 'youtube';
    value: string;
  }[];
}

interface BlogProps {
  blogs: BlogPost[];
  setBlogs: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  onCreateBlog: () => void;
  setEditBlog: (blog: BlogPost) => void;
}

const Blog: React.FC<BlogProps> = ({ blogs, setBlogs, onCreateBlog, setEditBlog }) => {
  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const [previewBlog, setPreviewBlog] = useState<BlogPost | null>(null);
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Use a ref to track if we've already processed this state
  const processedStateRef = useRef<boolean>(false);
  
  useEffect(() => {
    // Only process location state once
    if (location.state?.newBlog && !processedStateRef.current) {
      processedStateRef.current = true;
      
      const newBlog = location.state.newBlog as BlogPost;
      
      // Use a unique identifier like tempId or title to check duplicates
      const isDuplicate = blogs.some(blog => 
        (newBlog.tempId && blog.tempId === newBlog.tempId) || 
        (blog.title === newBlog.title && blog.author === newBlog.author)
      );
      
      if (!isDuplicate) {
        // Generate a new ID based on the current highest ID
        const highestId = blogs.reduce((max, blog) => Math.max(max, blog.id), 0);
        const newId = highestId + 1;
        
        // Add the blog with the new ID
        setBlogs(prevBlogs => [
          ...prevBlogs,
          { ...newBlog, id: newId }
        ]);
        
        console.log('Added new blog:', newBlog.title);
      }
      
      // Clear navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state, blogs, setBlogs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusChange = (id: number, newStatus: 'active' | 'inactive') => {
    setBlogs(blogs.map(blog => blog.id === id ? { ...blog, status: newStatus } : blog));
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
            onCreateBlog();
            navigate('/createeditblog');
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
                    .filter((field) => field.type === 'image')
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
                    onChange={(e) => handleStatusChange(blog.id, e.target.value as 'active' | 'inactive')}
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
                      <button onClick={() => { setEditBlog(blog); setOpenMenuId(null); navigate('/createeditblog', { state: blog }); }}>Edit</button>
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

      {/* Preview inline (for quick look) */}
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
              </video>
            </div>
          );
        }
        return null;
      })}

      {/* Delete Modal */}
      {blogToDelete && (
        <div className="modal-overlay">
          <div className="delete-modal-content">
            <h3>Confirm delete blog post?</h3>
            <p><strong>{blogToDelete.title}</strong></p>
            <div className="form-actions">
              <button className="delete-confirm" onClick={confirmDelete}>Yes, Delete</button>
              <button onClick={() => setBlogToDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;