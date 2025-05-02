import React from 'react';
import { useLocation } from 'react-router-dom';
import { BlogPost } from './CreateEditBlog'; // Make sure it has 'fields' in the type
import '../../css/blog/PreviewBlog.css';

const PreviewBlog: React.FC = () => {
  const location = useLocation();
  const blogData = location.state as BlogPost;
  const fields = blogData?.fields ?? [];

  let firstImageRendered = false;

  return (
    <div className="blog-container">
      {/* Title */}
      <div className="blog-header">
        <h1 className="blog-title">{blogData.title}</h1>
      </div>

      {/* Render fields in order */}
      <div className="blog-content">
        {fields.map((field, index) => {
          if (field.type === 'image' && !firstImageRendered) {
            firstImageRendered = true; // Mark that the first image has been rendered
            return (
              <div key={index} className="content-image">
                <img src={field.value} alt={`Blog content ${index}`} />
                {/* Show the published date and author directly below the first image */}
                <div className="blog-footer">
                <p>
    <span>Published on {new Date(blogData.date).toLocaleDateString()}</span>
    <span style={{ marginLeft: '20px' }}>Author: <strong>{blogData.author || 'Unknown Author'}</strong></span>
          </p>
                  
                </div>
              </div>
            );
          }
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
                <br></br>
                <a href={field.value} target="_blank" rel="noopener noreferrer">
                  {field.value}
                </a>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default PreviewBlog;
