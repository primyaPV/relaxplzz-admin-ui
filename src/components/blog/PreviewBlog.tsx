import React from 'react';
import { useLocation } from 'react-router-dom';
import { BlogPost } from './CreateEditBlog'; // Adjust if needed
import '../../css/blog/PreviewBlog.css';

const PreviewBlog: React.FC = () => {
  const location = useLocation();
  const blogData = location.state as BlogPost;

  return (
    <div className="blog-container">
      {/* Featured Image */}
      

      {/* Title and Meta */}
      <div className="blog-header">
        <h1 className="blog-title">{blogData.title}</h1>
        <p className="blog-meta">
          Published on {new Date(blogData.date).toLocaleDateString()}
        </p>
      </div>
      {blogData.images && blogData.images.length > 0 && (
        <div className="featured-image">
          <img src={blogData.images[0]} alt="Featured" />
        </div>
      )}
      {/* Blog Content */}
      <div className="blog-content">
        {/* Full content (from CKEditor) */}
        <div
          dangerouslySetInnerHTML={{ __html: blogData.content }}
        />

        {/* Inline other images if available */}
        {blogData.images && blogData.images.slice(1).map((imgUrl, idx) => (
          <div key={idx} className="content-image">
            <img src={imgUrl} alt={`Blog Content ${idx + 2}`} />
          </div>
        ))}
      </div>

      {/* Related Links */}
      {blogData.links && blogData.links.length > 0 && (
        <div className="related-links">
          <h3>Related Links</h3>
          <ul>
            {blogData.links.map((link, idx) => (
              <li key={idx}>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PreviewBlog;
