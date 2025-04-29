import React, { useState, useRef, useEffect } from 'react';
import '../../css/blog/Blog.css';
import image1 from '../../assets/banner1.jpeg';
import { Link, useNavigate } from 'react-router-dom';

export interface BlogPost {
  id: number;
  title: string;
  images: string[];
  links: string[];
  date: string;
  description: string;
  content: string;
  status: 'active' | 'inactive';
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
      images: [image1],
      links: ['https://example.com/start-blogging'],
      date: '2024-04-01',
      description: 'Learn the basics of how to start a blog from scratch.',
      content: 'This blog will walk you through the process of choosing a niche, selecting a platform, and growing your audience...',
      status: 'active',
    },
    {
      id: 2,
      title: '10 Tools Every Blogger Needs',
      images: [image1],
      links: ['https://example.com/blogging-tools'],
      date: '2024-03-15',
      description: 'Must-have tools to enhance your blogging workflow.',
      content: 'From content planners to SEO analyzers, this article lists ten essential tools that streamline your blogging efforts...',
      status: 'inactive',
    },
    {
      id: 3,
      title: 'Maximize Traffic With SEO in 2024',
      images: [image1],
      links: ['https://example.com/seo-guide'],
      date: '2024-02-10',
      description: 'Boost your blog traffic with updated SEO strategies.',
      content: '2024 SEO trends are shifting. Here’s how to stay ahead of the game using keyword clustering, AI tools, and schema markup...',
      status: 'active',
    },
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
    navigate('/createblog'); // navigates to CreateEditBlog page
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
                  {blog.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt="blog"
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
      {previewBlog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-button" onClick={() => setPreviewBlog(null)}>
              ×
            </button>
            <h2>{previewBlog.title}</h2>
            {previewBlog.images.map((image, index) => (
              <img key={index} src={image} alt="" style={{ width: '100%' }} />
            ))}
            <p>{previewBlog.description}</p>
            <p>{previewBlog.content}</p>
            {previewBlog.links.map((link, index) => (
              <div key={index}>
                <a href={link} target="_blank" rel="noreferrer">
                  {link}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

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
