import React from 'react';
import { useLocation } from 'react-router-dom';
import { BlogPost } from './CreateEditBlog'; // Make sure it has 'fields' in the type
import '../../css/blog/PreviewBlog.css';

const PreviewBlog: React.FC = () => {
  const location = useLocation();
  const blogData = location.state as BlogPost;
  const fields = blogData?.fields ?? [];
  return (
    <div className="blog-container">
      {/* Title */}
      <div className="blog-header">
        <h1 className="blog-title">{blogData.title}</h1>
      </div>

      {/* Render fields in order */}
      <div className="blog-content">
        {fields.map((field, index) => {
          if (field.type === 'image') {
            return (
              <div key={index} className="content-image">
                <img src={field.value} alt={`Blog content ${index}`} />
              </div>
            );
          }
          if (field.type === 'content') {
            return (
              <div key={index} className="content-text">
                <div dangerouslySetInnerHTML={{ __html: field.value }} />
              </div>
            );
          }
          if (field.type === 'link') {
            return (
              <div key={index} className="content-link">
                <a href={field.value} target="_blank" rel="noopener noreferrer">
                  {field.value}
                </a>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Footer */}
      
      <div className="blog-footer">
        <p>Published on {new Date(blogData.date).toLocaleDateString()}</p>
        <p>By <strong>{blogData.author || 'Unknown Author'}</strong></p>
      </div>
    </div>
  );
};

export default PreviewBlog;
