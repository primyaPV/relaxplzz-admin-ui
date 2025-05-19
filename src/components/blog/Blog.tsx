import React, { useState, useRef, useEffect } from 'react';
import '../../css/blog/Blog.css';
import { useNavigate, useLocation } from 'react-router-dom';

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  author: string;
  status: 'active' | 'inactive';
  tempId?: number; 
  scheduledPublishTime: string;// Optional temporary ID for tracking
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

  const [stateProcessed, setStateProcessed] = useState(false);

  useEffect(() => {
    console.log("blogsssssss",blogs);
    if (location.state?.newBlog && !stateProcessed) {
      const newBlog = location.state.newBlog as BlogPost;
      
      // Check if this is an update to an existing blog or a new blog
      const existingBlogIndex = blogs.findIndex(blog => blog.id === newBlog.id);
      
      if (existingBlogIndex !== -1) {
        // This is an update to an existing blog
        setBlogs(prevBlogs => {
          const updatedBlogs = [...prevBlogs];
          updatedBlogs[existingBlogIndex] = {
            ...newBlog,
            status: newBlog.status as 'active' | 'inactive' // Ensure correct type
          };
          return updatedBlogs;
        });
        console.log('Updated existing blog:', newBlog.title);
      } else {
        // This is a new blog - check for duplicates
        const isDuplicate = blogs.some(blog => 
          (newBlog.tempId && blog.tempId === newBlog.tempId) ||
          (blog.title === newBlog.title && blog.author === newBlog.author && 
           blog.date === newBlog.date)
        );
        
        if (!isDuplicate) {
          // Generate a new ID based on the highest existing ID
          const highestId = blogs.reduce((max, blog) => Math.max(max, blog.id), 0);
          const blogToAdd = { 
            ...newBlog, 
            id: newBlog.id || highestId + 1,
            status: newBlog.status as 'active' | 'inactive' // Ensure correct type
          };
          
          setBlogs(prevBlogs => [...prevBlogs, blogToAdd]);
          console.log('Added new blog:', blogToAdd.title);
        } else {
          console.log('Duplicate blog detected, not adding:', newBlog.title);
        }
      }
      
      // Mark as processed and clear navigation state
      setStateProcessed(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, blogs, stateProcessed, setBlogs]);

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
  
  const handleEdit = (blog: BlogPost) => {
    console.log("blog",blog)
    setEditBlog(blog);
    // setOpenMenuId(null);
    navigate('/createeditblog', { state: blog });
  };
  
  const handlePreview = (blog: BlogPost) => {
    setPreviewBlog(blog);
    setOpenMenuId(null);
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
  {(() => {
    const firstImage = blog.fields.find((field) => field.type === 'image' && field.value);
    return firstImage ? (
      <img
        src={firstImage.value}
        alt="blog-thumbnail"
        className="blog-image"
        width="100"
        height="60"
      />
    ) : null;
  })()}
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
                      <button onClick={() => handleEdit(blog)}>Edit</button>
                      <button onClick={() => handleDelete(blog)}>Delete</button>
                      <button onClick={() => handlePreview(blog)}>Preview</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preview inline (for quick look) */}
      {previewBlog && (
        <div className="blog-preview">
          <h2>{previewBlog.title}</h2>
          <p className="blog-meta">By {previewBlog.author} on {previewBlog.date}</p>
          {previewBlog.fields.map((field, index) => {
            if (field.type === 'image') {
              return <img key={index} src={field.value} alt={`Blog ${index}`} style={{ width: '100%', marginBottom: '10px' }} />;
            }
            if (field.type === 'content') {
              return <div key={index} dangerouslySetInnerHTML={{ __html: field.value }} />;
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
            if (field.type === 'youtube') {
              const youtubeIdMatch = field.value.match(
                /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
              );
              const youtubeId = youtubeIdMatch ? youtubeIdMatch[1] : '';
              
              return youtubeId ? (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <iframe
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : null;
            }
            return null;
          })}
          <button onClick={() => setPreviewBlog(null)}>Close Preview</button>
        </div>
      )}

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