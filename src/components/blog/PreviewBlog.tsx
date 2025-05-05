import React from 'react';
import { useLocation } from 'react-router-dom';
import { BlogPost } from './CreateEditBlog';
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
            firstImageRendered = true;
            return (
              <div key={index} className="content-image">
                <img src={field.value} alt={`Blog content ${index}`} />
                <div className="blog-footer">
                  <p>
                    <span>Published on {new Date(blogData.date).toLocaleDateString()}</span>
                    <span style={{ marginLeft: '20px' }}>
                      Author: <strong>{blogData.author || 'Unknown Author'}</strong>
                    </span>
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

          if (field.type === 'video') {
            return (
              <div key={index} className="content-video">
                <video controls width="100%" style={{ marginBottom: '20px', borderRadius: '8px' }}>
                  <source src={field.value} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
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
